import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const preferencesSchema = z.object({
  trackedIssues: z.array(z.string()),
  trackedReps: z.array(z.string()),
  homeModules: z.array(z.string()),
  justFacts: z.boolean(),
});

const defaultPreferences = {
  trackedIssues: ["Economy", "Healthcare", "Education"],
  trackedReps: ["NY-14 Representative", "State Senator District 23"],
  homeModules: ["brief", "queue", "signals"],
  justFacts: true,
};

export async function GET() {
  const session = await getAuthSession();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const preference = await prisma.preference.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      ...defaultPreferences,
    },
  });

  return NextResponse.json({
    trackedIssues: preference.trackedIssues,
    trackedReps: preference.trackedReps,
    homeModules: preference.homeModules,
    justFacts: preference.justFacts,
  });
}

export async function PUT(request: Request) {
  const session = await getAuthSession();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = preferencesSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid preferences payload." }, { status: 400 });
  }

  const preference = await prisma.preference.upsert({
    where: { userId },
    update: {
      trackedIssues: parsed.data.trackedIssues,
      trackedReps: parsed.data.trackedReps,
      homeModules: parsed.data.homeModules,
      justFacts: parsed.data.justFacts,
    },
    create: {
      userId,
      trackedIssues: parsed.data.trackedIssues,
      trackedReps: parsed.data.trackedReps,
      homeModules: parsed.data.homeModules,
      justFacts: parsed.data.justFacts,
    },
  });

  return NextResponse.json({
    trackedIssues: preference.trackedIssues,
    trackedReps: preference.trackedReps,
    homeModules: preference.homeModules,
    justFacts: preference.justFacts,
  });
}
