import { prisma } from "@/lib/prisma";
import { defaultPolls } from "@/lib/poll-seed";
import { NextResponse } from "next/server";

async function ensurePollsSeeded() {
  const count = await prisma.poll.count();
  if (count > 0) {
    return;
  }

  for (const [pollIndex, poll] of defaultPolls.entries()) {
    await prisma.poll.create({
      data: {
        slug: poll.slug,
        question: poll.question,
        options: {
          create: poll.options.map((option, optionIndex) => ({
            label: option.label,
            order: pollIndex * 10 + optionIndex,
          })),
        },
      },
    });
  }
}

export async function GET() {
  await ensurePollsSeeded();

  const polls = await prisma.poll.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    include: {
      options: {
        orderBy: { order: "asc" },
      },
    },
  });

  return NextResponse.json(
    polls.map((poll) => ({
      id: poll.id,
      slug: poll.slug,
      question: poll.question,
      totalVotes: poll.options.reduce((sum, option) => sum + option.votes, 0),
      options: poll.options.map((option) => ({
        id: option.id,
        label: option.label,
        votes: option.votes,
      })),
    })),
  );
}
