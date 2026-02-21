import { getAuthSession } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { fallbackPerspectives } from "@/lib/perspectives-data";
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

function serializeBrief(brief: {
  id: string;
  slug: string;
  event: string;
  leftSaying: unknown;
  rightSaying: unknown;
  factsSoFar: unknown;
  whyLeft: string;
  whyRight: string;
  historicalContext: unknown;
  published: boolean;
  updatedAt: Date;
}) {
  return {
    id: brief.id,
    slug: brief.slug,
    event: brief.event,
    leftSaying: Array.isArray(brief.leftSaying) ? brief.leftSaying : [],
    rightSaying: Array.isArray(brief.rightSaying) ? brief.rightSaying : [],
    factsSoFar: Array.isArray(brief.factsSoFar) ? brief.factsSoFar : [],
    whyLeft: brief.whyLeft,
    whyRight: brief.whyRight,
    historicalContext: Array.isArray(brief.historicalContext) ? brief.historicalContext : [],
    published: brief.published,
    updatedAt: brief.updatedAt.toISOString(),
  };
}

export async function GET(request: Request) {
  const session = await getAuthSession();
  const email = session?.user?.email;
  const admin = isAdminEmail(email);
  const includeDrafts = new URL(request.url).searchParams.get("includeDrafts") === "1";

  const briefs = await prisma.eventBrief.findMany({
    where: includeDrafts && admin ? undefined : { published: true },
    orderBy: { updatedAt: "desc" },
  });

  if (briefs.length === 0) {
    return NextResponse.json(fallbackPerspectives);
  }

  return NextResponse.json(briefs.map(serializeBrief));
}

export async function POST(request: Request) {
  const session = await getAuthSession();
  const email = session?.user?.email;
  const userId = session?.user?.id;

  if (!email || !userId || !isAdminEmail(email)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = (await request.json()) as EventBriefInput;
  const parsed = eventBriefSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid event brief payload." }, { status: 400 });
  }

  const created = await prisma.eventBrief.create({
    data: {
      ...parsed.data,
      authorId: userId,
    },
  });

  return NextResponse.json(serializeBrief(created), { status: 201 });
}
