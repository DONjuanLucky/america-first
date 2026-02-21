"use client";

import { motion } from "framer-motion";
import { CircleHelp, MessageSquareText, ShieldCheck } from "lucide-react";
import { PageIntro } from "@/components/page-intro";

const threads = [
  {
    title: "What does the new election security proposal actually change?",
    tag: "Policy Deep Dive",
    replies: 42,
    quality: "High quality discussion",
  },
  {
    title: "Should municipal budgets publish plain-language quarterly updates?",
    tag: "Local Issues",
    replies: 28,
    quality: "Constructive and sourced",
  },
  {
    title: "AMA: Former state election director on ballot process myths",
    tag: "Ask an Expert",
    replies: 66,
    quality: "Live session ongoing",
  },
];

export default function ForumPage() {
  return (
    <div className="space-y-4">
      <PageIntro
        eyebrow="COMMUNITY FORUM"
        title="Structured, Constructive Civic Dialogue"
        subtitle="Discuss policy with evidence-first moderation, verified claims, and discovery by bill, officeholder, and issue area."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="soft-card rounded-2xl p-4">
          <p className="text-sm text-[#5f6f84]">Moderation removal rate</p>
          <p className="font-heading text-4xl text-[#11294a]">1.8%</p>
          <p className="mt-1 text-xs text-[#5f6f84]">Below healthy-community target</p>
        </article>
        <article className="soft-card rounded-2xl p-4">
          <p className="text-sm text-[#5f6f84]">Fact-verified posts</p>
          <p className="font-heading text-4xl text-[#11294a]">8,420</p>
          <p className="mt-1 text-xs text-[#5f6f84]">Last 30 days</p>
        </article>
        <article className="soft-card rounded-2xl p-4">
          <p className="text-sm text-[#5f6f84]">Expert AMA attendance</p>
          <p className="font-heading text-4xl text-[#11294a]">2.9k</p>
          <p className="mt-1 text-xs text-[#5f6f84]">Average per session</p>
        </article>
      </section>

      <section className="space-y-3">
        {threads.map((thread, idx) => (
          <motion.article
            key={thread.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, delay: idx * 0.05 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-[#eef3fa] px-3 py-1 text-xs font-semibold text-[#1a3a6b]">{thread.tag}</span>
              <span className="text-xs text-[#5f6f84]">{thread.replies} replies</span>
            </div>
            <h2 className="font-heading mt-2 text-2xl leading-tight text-[#11294a]">{thread.title}</h2>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e7f3ec] px-3 py-1 text-[#1d6f42]">
                <ShieldCheck className="h-3.5 w-3.5" />
                {thread.quality}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#edf2f7] px-3 py-1 text-[#334d71]">
                <MessageSquareText className="h-3.5 w-3.5" />
                Substance-weighted ranking
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#fff2ee] px-3 py-1 text-[#9b352b]">
                <CircleHelp className="h-3.5 w-3.5" />
                Appeal window: 48h
              </span>
            </div>
          </motion.article>
        ))}
      </section>
    </div>
  );
}
