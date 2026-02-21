"use client";

import { motion } from "framer-motion";
import { Scale, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageIntro } from "@/components/page-intro";
import { fallbackPerspectives } from "@/lib/perspectives-data";
import { EventBriefDTO } from "@/types/perspectives";

export default function PerspectivesPage() {
  const [briefs, setBriefs] = useState<EventBriefDTO[]>(fallbackPerspectives);
  const [selectedId, setSelectedId] = useState(fallbackPerspectives[0].id);

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/perspectives", { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as EventBriefDTO[];
      if (data.length > 0) {
        setBriefs(data);
        setSelectedId((current) => (data.some((item) => item.id === current) ? current : data[0].id));
      }
    })();
  }, []);

  const activeBrief = useMemo(
    () => briefs.find((brief) => brief.id === selectedId) ?? briefs[0] ?? fallbackPerspectives[0],
    [briefs, selectedId],
  );

  return (
    <div className="space-y-4">
      <PageIntro
        eyebrow="PERSPECTIVES"
        title="Left, Right, and Facts So Far"
        subtitle="A simplified event brief showing both perspectives and a neutral fact-only status section."
      />

      <section className="soft-card rounded-2xl border border-[#ccd9ea] p-4">
        <p className="mb-2 text-xs font-semibold tracking-[0.1em] text-[#5f6f84]">SELECT EVENT</p>
        <div className="flex flex-wrap gap-2">
          {briefs.map((brief) => (
            <button
              key={brief.id}
              type="button"
              onClick={() => setSelectedId(brief.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedId === brief.id ? "bg-[#1a3a6b] text-white" : "bg-white text-[#11294a] hover:bg-[#f2f6fc]"
              }`}
            >
              {brief.event}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card rounded-2xl border border-[#c9d7eb] bg-[linear-gradient(160deg,#ffffff_0%,#f1f6fd_100%)] p-5"
        >
          <p className="text-xs font-semibold tracking-[0.1em] text-[#1a3a6b]">WHAT IS THE LEFT SAYING?</p>
          <ul className="mt-3 space-y-2 text-sm text-[#11294a]">
            {activeBrief.leftSaying.map((point) => (
              <li key={point} className="rounded-lg border border-[#d6e2f1] bg-white p-3">
                {point}
              </li>
            ))}
          </ul>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.04 }}
          className="glass-card rounded-2xl border border-[#e5c6c1] bg-[linear-gradient(160deg,#fff8f6_0%,#fff0ed_100%)] p-5"
        >
          <p className="text-xs font-semibold tracking-[0.1em] text-[#9b352b]">WHAT IS THE RIGHT SAYING?</p>
          <ul className="mt-3 space-y-2 text-sm text-[#11294a]">
            {activeBrief.rightSaying.map((point) => (
              <li key={point} className="rounded-lg border border-[#efd4cf] bg-white p-3">
                {point}
              </li>
            ))}
          </ul>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="rounded-2xl border border-[#c9d8ea] bg-[#0a1628] p-5 text-white"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold tracking-[0.1em] text-[#d7e1ee]">WHAT DO WE KNOW SO FAR?</p>
            <Scale className="h-4 w-4 text-[#d4a017]" />
          </div>
          <ul className="mt-3 space-y-2 text-sm text-[#e7edf6]">
            {activeBrief.factsSoFar.map((point) => (
              <li key={point} className="rounded-lg bg-white/10 p-3">
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-xl border border-white/20 bg-white/5 p-3 text-xs text-[#d7e1ee]">
            <p className="inline-flex items-center gap-1 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-[#d4a017]" />
              Fact-only panel
            </p>
            <p className="mt-1">This section excludes opinion framing and summarizes only confirmed status updates.</p>
            <p className="mt-1">Updated {new Date(activeBrief.updatedAt).toLocaleString()}</p>
          </div>
        </motion.article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="soft-card rounded-2xl p-5">
          <h2 className="font-heading text-2xl text-[#11294a]">Why These Perspectives Exist</h2>
          <div className="mt-3 space-y-3 text-sm text-[#11294a]">
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs font-semibold tracking-[0.08em] text-[#5f6f84]">LEFT CONTEXT</p>
              <p className="mt-1">{activeBrief.whyLeft}</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs font-semibold tracking-[0.08em] text-[#5f6f84]">RIGHT CONTEXT</p>
              <p className="mt-1">{activeBrief.whyRight}</p>
            </div>
          </div>
        </article>

        <article className="soft-card rounded-2xl p-5">
          <h2 className="font-heading text-2xl text-[#11294a]">Historical Insight</h2>
          <ul className="mt-3 space-y-2 text-sm text-[#11294a]">
            {activeBrief.historicalContext.map((point) => (
              <li key={point} className="rounded-xl bg-white p-4">
                {point}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
