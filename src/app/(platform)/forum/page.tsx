"use client";

import { motion } from "framer-motion";
import { CircleHelp, MessageSquareText, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { forumThreads } from "@/lib/forum-data";
import { useEffect, useState } from "react";

type Poll = {
  id: string;
  slug: string;
  question: string;
  totalVotes: number;
  options: Array<{ id: string; label: string; votes: number }>;
};

export default function ForumPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [pollError, setPollError] = useState("");

  const loadPolls = async () => {
    const response = await fetch("/api/polls", { cache: "no-store" });
    if (!response.ok) {
      setPollError("Unable to load community polls.");
      return;
    }
    const data = (await response.json()) as Poll[];
    setPolls(data);
  };

  useEffect(() => {
    void loadPolls();
  }, []);

  const submitVote = async (pollId: string, optionId: string) => {
    setPollError("");

    let anonId = "";
    try {
      const key = "af-anon-voter";
      const existing = localStorage.getItem(key);
      if (existing) {
        anonId = existing;
      } else {
        anonId = crypto.randomUUID();
        localStorage.setItem(key, anonId);
      }
    } catch {
      anonId = "fallback-voter";
    }

    const response = await fetch(`/api/polls/${pollId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-anon-id": anonId },
      body: JSON.stringify({ optionId }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setPollError(data.error ?? "Unable to submit vote.");
      return;
    }

    await loadPolls();
  };

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
        {forumThreads.map((thread, idx) => (
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
            <Link href={`/forum/${thread.slug}`} className="group block">
              <h2 className="font-heading mt-2 text-2xl leading-tight text-[#11294a] transition group-hover:text-[#1a3a6b]">
                {thread.title}
              </h2>
              <p className="mt-1 text-sm text-[#5f6f84]">{thread.summary}</p>
            </Link>
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

      <section className="space-y-3">
        <h2 className="font-heading text-3xl text-[#11294a]">Community Polls</h2>
        {pollError && <p className="rounded-lg bg-[#fff2ee] p-3 text-sm text-[#9b352b]">{pollError}</p>}
        {polls.map((poll) => (
          <article key={poll.id} className="glass-card rounded-2xl p-5">
            <p className="text-xs font-semibold tracking-[0.1em] text-[#5f6f84]">POLL · {poll.totalVotes} votes</p>
            <h3 className="font-heading mt-1 text-2xl text-[#11294a]">{poll.question}</h3>
            <div className="mt-3 grid gap-2">
              {poll.options.map((option) => {
                const pct = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => submitVote(poll.id, option.id)}
                    className="rounded-xl border border-[#d4dfef] bg-white px-3 py-2 text-left"
                  >
                    <div className="flex items-center justify-between gap-2 text-sm text-[#11294a]">
                      <span>{option.label}</span>
                      <span className="text-xs text-[#5f6f84]">{option.votes} ({pct}%)</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-[#e8eff8]">
                      <div className="h-1.5 rounded-full bg-[#1a3a6b]" style={{ width: `${pct}%` }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
