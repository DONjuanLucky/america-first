import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const limitRaw = Number(params.get("limit") ?? "20");
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(50, limitRaw)) : 20;

  const stories = await prisma.story.findMany({
    orderBy: { publishedAt: "desc" },
    take: limit,
  });

  return NextResponse.json(
    stories.map((story) => ({
      id: story.id,
      title: story.title,
      url: story.url,
      imageUrl: story.imageUrl,
      source: story.source,
      topic: story.topic,
      publishedAt: story.publishedAt.toISOString(),
      summary: story.summary,
      justFacts: story.justFacts,
      leftPerspective: story.leftPerspective,
      rightPerspective: story.rightPerspective,
      historyAnalysis: story.historyAnalysis ?? "",
      historicalComparisons: Array.isArray(story.historicalComparisons) ? story.historicalComparisons : [],
      factualPoints: Array.isArray(story.factualPoints) ? story.factualPoints : [],
      confidence: story.confidence,
      biasLabel: story.biasLabel,
    })),
  );
}
