"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Scale, ShieldAlert } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { useAppState } from "@/components/providers/app-provider";

const stories = [
  {
    title: "House committee advances election infrastructure bill",
    source: "Reuters",
    confidence: "97% verified",
    bias: "Center",
    mode: "Just the Facts",
  },
  {
    title: "State court hears challenge on districting process timeline",
    source: "AP News",
    confidence: "95% verified",
    bias: "Center",
    mode: "Context Included",
  },
  {
    title: "Healthcare subcommittee publishes pricing oversight report",
    source: "PBS NewsHour",
    confidence: "96% verified",
    bias: "Lean Left",
    mode: "Just the Facts",
  },
  {
    title: "Defense authorization amendment receives bipartisan support",
    source: "C-SPAN",
    confidence: "98% verified",
    bias: "Center",
    mode: "Context Included",
  },
];

export default function NewsPage() {
  const { preferences } = useAppState();

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
          <p className="font-heading text-4xl text-[#11294a]">97.2%</p>
          <p className="mt-1 text-xs text-[#5f6f84]">Audited against editor review</p>
        </article>
        <article className="soft-card rounded-2xl p-4">
          <p className="text-sm text-[#5f6f84]">Active source set</p>
          <p className="font-heading text-4xl text-[#11294a]">43</p>
          <p className="mt-1 text-xs text-[#5f6f84]">AP, Reuters, NPR, CBO, .gov, more</p>
        </article>
        <article className="soft-card rounded-2xl p-4">
          <p className="text-sm text-[#5f6f84]">Disputed claims flagged</p>
          <p className="font-heading text-4xl text-[#11294a]">11</p>
          <p className="mt-1 text-xs text-[#5f6f84]">Held for human moderation review</p>
        </article>
      </section>

      <section className="space-y-3">
        {stories.map((story, idx) => (
          <motion.article
            key={story.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, delay: idx * 0.05 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.08em] text-[#5f6f84]">{story.source}</p>
                <h2 className="font-heading mt-1 text-2xl leading-tight text-[#11294a]">{story.title}</h2>
              </div>
              <span className="rounded-full bg-[#eef3fa] px-3 py-1 text-xs font-semibold text-[#1a3a6b]">
                {preferences.justFacts ? "Just the Facts" : story.mode}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e7f3ec] px-3 py-1 font-semibold text-[#1d6f42]">
                <BadgeCheck className="h-3.5 w-3.5" />
                {story.confidence}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#edf2f7] px-3 py-1 font-semibold text-[#334d71]">
                <Scale className="h-3.5 w-3.5" />
                Bias: {story.bias}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#fff2ee] px-3 py-1 font-semibold text-[#9b352b]">
                <ShieldAlert className="h-3.5 w-3.5" />
                3+ cross-verified sources
              </span>
            </div>
          </motion.article>
        ))}
      </section>
    </div>
  );
}
