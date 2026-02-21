import { getAuthSession } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { EventBriefInput } from "@/types/perspectives";
import { NextResponse } from "next/server";
import { z } from "zod";

const eventBriefSchema = z.object({
  slug: z.string().min(3),
  event: z.string().min(4),
  leftSaying: z.array(z.string().min(3)).min(1),
  rightSaying: z.array(z.string().min(3)).min(1),
  factsSoFar: z.array(z.string().min(3)).min(1),
  whyLeft: z.string().min(8),
  whyRight: z.string().min(8),
  historicalContext: z.array(z.string().min(3)).min(1),
  published: z.boolean(),
});

function ensureAdmin(email?: string | null) {
  return Boolean(email && isAdminEmail(email));
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!ensureAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = (await request.json()) as EventBriefInput;
  const parsed = eventBriefSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid event brief payload." }, { status: 400 });
  }

  const { id } = await context.params;

  const updated = await prisma.eventBrief.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({
    id: updated.id,
    slug: updated.slug,
    event: updated.event,
    leftSaying: Array.isArray(updated.leftSaying) ? updated.leftSaying : [],
    rightSaying: Array.isArray(updated.rightSaying) ? updated.rightSaying : [],
    factsSoFar: Array.isArray(updated.factsSoFar) ? updated.factsSoFar : [],
    whyLeft: updated.whyLeft,
    whyRight: updated.whyRight,
    historicalContext: Array.isArray(updated.historicalContext) ? updated.historicalContext : [],
    published: updated.published,
    updatedAt: updated.updatedAt.toISOString(),
  });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!ensureAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await context.params;
  await prisma.eventBrief.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
