"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Scale, ShieldAlert } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { useAppState } from "@/components/providers/app-provider";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Story = {
  id: string;
  title: string;
  url: string;
  imageUrl?: string | null;
  source: string;
  topic: string;
  publishedAt: string;
  summary: string;
  justFacts: string;
  leftPerspective: string;
  rightPerspective: string;
  historyAnalysis: string;
  historicalComparisons: string[];
  factualPoints: string[];
  confidence: number;
  biasLabel: string;
};

const fallbackStories: Story[] = [
  {
    id: "demo-1",
    title: "Daily ingest not run yet: automated stories will appear here",
    url: "#",
    imageUrl: null,
    source: "System",
    topic: "Platform",
    publishedAt: new Date().toISOString(),
    summary: "Your feed is ready for automation. Trigger the ingest job to begin daily updates.",
    justFacts: "No stories have been ingested yet. Run /api/jobs/daily-ingest with your cron secret.",
    leftPerspective: "No left framing available until stories are processed.",
    rightPerspective: "No right framing available until stories are processed.",
    historyAnalysis:
      "Historical insight will appear automatically once the LLM starts processing live stories and mapping parallels.",
    historicalComparisons: [
      "Pipeline supports precedent extraction",
      "Comparative context is generated per story",
    ],
    factualPoints: ["Ingest pipeline is configured", "LLM provider selection is supported", "Stories auto-publish"],
    confidence: 70,
    biasLabel: "Center",
  },
];

export default function NewsPage() {
  const { preferences } = useAppState();
  const [stories, setStories] = useState<Story[]>(fallbackStories);

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/news?limit=12", { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as Story[];
      if (data.length > 0) {
        setStories(data);
      }
    })();
  }, []);

  const avgConfidence = useMemo(() => {
    const total = stories.reduce((sum, story) => sum + story.confidence, 0);
    return Math.round(total / Math.max(1, stories.length));
  }, [stories]);

  const sourceCount = useMemo(() => new Set(stories.map((story) => story.source)).size, [stories]);

  return (
    <div className="space-y-4">
      <PageIntro
        eyebrow="FACT-VERIFIED FEED"
        title="News With Source-Level Clarity"
        subtitle="Every item includes confidence scoring, source citations, and neutral bias context so facts stay separate from opinion."
      />

      <section className="soft-card rounded-2xl p-4 text-sm text-[#11294a]">
        Personalized for your focus on <span className="font-semibold">{preferences.trackedIssues.join(", ")}</span>.
        Reading mode: <span className="font-semibold">{preferences.justFacts ? "Just the Facts" : "Context Included"}</span>.
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="soft-card rounded-2xl p-4">
          <p className="text-sm text-[#5f6f84]">Daily verification rate</p>
          <p className="font-heading text-4xl text-[#11294a]">{avgConfidence}%</p>
          <p className="mt-1 text-xs text-[#5f6f84]">From automated LLM processing</p>
        </article>
        <article className="soft-card rounded-2xl p-4">
          <p className="text-sm text-[#5f6f84]">Active source set</p>
          <p className="font-heading text-4xl text-[#11294a]">{sourceCount}</p>
          <p className="mt-1 text-xs text-[#5f6f84]">Unique sources in recent ingest window</p>
        </article>
        <article className="soft-card rounded-2xl p-4">
          <p className="text-sm text-[#5f6f84]">Stories in feed</p>
          <p className="font-heading text-4xl text-[#11294a]">{stories.length}</p>
          <p className="mt-1 text-xs text-[#5f6f84]">Auto-published by pipeline</p>
        </article>
      </section>

      <section className="space-y-3">
        {stories.map((story, idx) => (
          <motion.article
            key={story.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, delay: idx * 0.05 }}
            className="glass-card rounded-2xl border border-[#ccd9ea] bg-[linear-gradient(170deg,#ffffff_0%,#f5f9ff_100%)] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.08em] text-[#5f6f84]">{story.source}</p>
                <h2 className="font-heading mt-1 text-2xl leading-tight text-[#11294a]">{story.title}</h2>
                <p className="mt-1 text-xs text-[#5f6f84]">{new Date(story.publishedAt).toLocaleString()}</p>
              </div>
              <span className="rounded-full bg-[#eef3fa] px-3 py-1 text-xs font-semibold text-[#1a3a6b]">
                {preferences.justFacts ? "Just the Facts" : story.topic}
              </span>
            </div>
            {story.imageUrl && (
              <div className="mt-3 overflow-hidden rounded-xl border border-[#d5e1f0] bg-[linear-gradient(180deg,#e8f0fb_0%,#f4f8fe_100%)] p-2">
                <div className="relative h-56 w-full">
                  <Image
                    src={story.imageUrl}
                    alt={story.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
                    className="object-contain object-center"
                  />
                </div>
              </div>
            )}
            <p className="mt-3 text-sm leading-relaxed text-[#263e62]">{preferences.justFacts ? story.justFacts : story.summary}</p>
            <div className="glass-inset mt-3 flex flex-wrap gap-2 p-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e7f3ec] px-3 py-1 font-semibold text-[#1d6f42]">
                <BadgeCheck className="h-3.5 w-3.5" />
                {story.confidence}% verified
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#edf2f7] px-3 py-1 font-semibold text-[#334d71]">
                <Scale className="h-3.5 w-3.5" />
                Bias: {story.biasLabel}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#fff2ee] px-3 py-1 font-semibold text-[#9b352b]">
                <ShieldAlert className="h-3.5 w-3.5" />
                Left/Right/Facts parsed
              </span>
            </div>

            <div className="glass-inset mt-4 p-3">
              <p className="text-xs font-semibold tracking-[0.08em] text-[#1a3a6b]">
                WHAT OUR HISTORY TELLS US
              </p>
              <p className="mt-1 text-sm text-[#173355]">{story.historyAnalysis}</p>
              {story.historicalComparisons.length > 0 && (
                <ul className="mt-2 space-y-1 text-xs text-[#355173]">
                  {story.historicalComparisons.map((comparison) => (
                    <li key={comparison} className="rounded-md bg-[#eef4fb] px-2 py-1">
                      {comparison}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <a
              href={story.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-sm font-semibold text-[#1a3a6b] underline underline-offset-4"
            >
              Read source article
            </a>
          </motion.article>
        ))}
      </section>
    </div>
  );
}
