import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const voteSchema = z.object({
  optionId: z.string().min(1),
});

export async function POST(request: Request, context: { params: Promise<{ pollId: string }> }) {
  const session = await getAuthSession();
  const anonId = request.headers.get("x-anon-id")?.trim();
  const userId = session?.user?.id ?? null;
  const voterKey = userId ? `user:${userId}` : anonId ? `anon:${anonId}` : null;
  if (!voterKey) {
    return NextResponse.json({ error: "Unable to identify voter session." }, { status: 401 });
  }

  const { pollId } = await context.params;
  const body = await request.json();
  const parsed = voteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid vote payload." }, { status: 400 });
  }

  const option = await prisma.pollOption.findFirst({
    where: {
      id: parsed.data.optionId,
      pollId,
    },
  });

  if (!option) {
    return NextResponse.json({ error: "Poll option not found." }, { status: 404 });
  }

  const existingVote = await prisma.pollVote.findUnique({
    where: {
      pollId_voterKey: {
        pollId,
        voterKey,
      },
    },
  });

  await prisma.$transaction(async (tx) => {
    if (!existingVote) {
      await tx.pollVote.create({
        data: {
          pollId,
          optionId: option.id,
          userId,
          voterKey,
        },
      });

      await tx.pollOption.update({
        where: { id: option.id },
        data: { votes: { increment: 1 } },
      });
      return;
    }

    if (existingVote.optionId === option.id) {
      return;
    }

    await tx.pollVote.update({
      where: { id: existingVote.id },
      data: { optionId: option.id },
    });

    await tx.pollOption.update({
      where: { id: existingVote.optionId },
      data: { votes: { decrement: 1 } },
    });

    await tx.pollOption.update({
      where: { id: option.id },
      data: { votes: { increment: 1 } },
    });
  });

  return NextResponse.json({ success: true });
}
