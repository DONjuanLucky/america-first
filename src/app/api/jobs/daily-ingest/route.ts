import { getAuthSession } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { analyzeStoryWithLLM } from "@/lib/llm";
import { prisma } from "@/lib/prisma";
import { fetchRssItems } from "@/lib/rss";
import { NextResponse } from "next/server";

function selectBalancedItems<T extends { biasLabel: "Center" | "Lean Left" | "Lean Right" }>(
  items: T[],
  maxItems: number,
) {
  const left = items.filter((item) => item.biasLabel === "Lean Left");
  const right = items.filter((item) => item.biasLabel === "Lean Right");
  const center = items.filter((item) => item.biasLabel === "Center");

  const sideQuota = Math.min(Math.floor(maxItems / 3), Math.min(left.length, right.length));
  const selected = [
    ...left.slice(0, sideQuota),
    ...right.slice(0, sideQuota),
    ...center.slice(0, maxItems - sideQuota * 2),
  ];

  if (selected.length < maxItems) {
    const overflow = [...left.slice(sideQuota), ...right.slice(sideQuota), ...center.slice(maxItems - sideQuota * 2)];
    selected.push(...overflow.slice(0, maxItems - selected.length));
  }

  return selected;
}

function authorizedCron(request: Request) {
  if (request.headers.get("x-vercel-cron") === "1") {
    return true;
  }

  const secret = process.env.INGEST_CRON_SECRET;
  if (!secret) {
    return false;
  }
  const token = request.headers.get("x-cron-secret") || new URL(request.url).searchParams.get("secret");
  return token === secret;
}

export async function POST(request: Request) {
  const session = await getAuthSession();
  const admin = isAdminEmail(session?.user?.email);
  const cronAllowed = authorizedCron(request);

  if (!admin && !cronAllowed) {
    return NextResponse.json({ error: "Unauthorized job trigger." }, { status: 401 });
  }

  const provider = (process.env.LLM_PROVIDER ?? "gemini").toLowerCase();
  const run = await prisma.ingestRun.create({
    data: {
      status: "running",
      provider,
      triggeredBy: cronAllowed ? "cron" : "manual",
      actorId: session?.user?.id,
    },
  });

  let processed = 0;
  let created = 0;
  let skipped = 0;

  try {
    const feedItems = await fetchRssItems(6);
    const freshnessHours = Number(process.env.INGEST_MAX_AGE_HOURS ?? "72");
    const freshnessCutoff = Date.now() - Math.max(12, freshnessHours) * 60 * 60 * 1000;
    const freshItems = feedItems.filter((item) => item.publishedAt.getTime() >= freshnessCutoff);

    const ingestionPool = selectBalancedItems(freshItems, 18);

    for (const item of ingestionPool) {
      processed += 1;

      const existing = await prisma.story.findUnique({ where: { url: item.url } });
      if (existing) {
        skipped += 1;
        continue;
      }

      const analysis = await analyzeStoryWithLLM({
        title: item.title,
        source: item.source,
        description: item.description,
        url: item.url,
      });

      await prisma.story.create({
        data: {
          title: item.title,
          url: item.url,
          imageUrl: item.imageUrl,
          source: item.source,
          publishedAt: item.publishedAt,
          topic: item.topic,
          summary: analysis.summary,
          justFacts: analysis.justFacts,
          leftPerspective: analysis.leftPerspective,
          rightPerspective: analysis.rightPerspective,
          historyAnalysis: analysis.historyAnalysis,
          historicalComparisons: analysis.historicalComparisons,
          factualPoints: analysis.factualPoints,
          confidence: analysis.confidence,
          biasLabel: item.biasLabel,
          rawDescription: item.description,
        },
      });

      created += 1;
    }

    const retentionDays = Number(process.env.STORY_RETENTION_DAYS ?? "14");
    const retentionCutoff = new Date(Date.now() - Math.max(7, retentionDays) * 24 * 60 * 60 * 1000);
    await prisma.story.deleteMany({
      where: {
        publishedAt: {
          lt: retentionCutoff,
        },
      },
    });

    await prisma.ingestRun.update({
      where: { id: run.id },
      data: {
        status: "success",
        finishedAt: new Date(),
        processed,
        created,
        skipped,
      },
    });

    return NextResponse.json({
      ok: true,
      runId: run.id,
      provider,
      processed,
      created,
      skipped,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown ingest error";

    await prisma.ingestRun.update({
      where: { id: run.id },
      data: {
        status: "failed",
        finishedAt: new Date(),
        processed,
        created,
        skipped,
        errorMessage: message,
      },
    });

    return NextResponse.json({ error: message, runId: run.id }, { status: 500 });
  }
}
