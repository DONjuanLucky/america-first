"use client";

import { motion } from "framer-motion";
import { CalendarClock, CircleGauge, MapPinned, ShieldCheck } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { useAppState } from "@/components/providers/app-provider";

const stats = [
  { label: "Representatives tracked", value: "18", icon: MapPinned, detail: "Federal + state + local" },
  { label: "Integrity average", value: "79/100", icon: ShieldCheck, detail: "Top quartile nationally" },
  { label: "Sentiment pulse", value: "+3.2%", icon: CircleGauge, detail: "Compared to last month" },
  { label: "Upcoming civic events", value: "7", icon: CalendarClock, detail: "Next 14 days" },
];

export default function DashboardPage() {
  const { user, preferences, toggleIssue, toggleJustFacts, toggleModule } = useAppState();
  const issueOptions = ["Economy", "Healthcare", "Education", "Immigration", "Environment", "Civil Rights"];
  const moduleOptions = [
    { key: "brief", label: "Trusted Brief" },
    { key: "queue", label: "Action Queue" },
    { key: "signals", label: "Live Signals" },
  ];

  const personalizedStats = [
    {
      ...stats[0],
      value: String(preferences.trackedReps.length),
      detail: `Saved for ${user?.zip || "your area"}`,
    },
    {
      ...stats[1],
      value: `${75 + preferences.trackedIssues.length}/100`,
      detail: "Based on your selected focus topics",
    },
    stats[2],
    {
      ...stats[3],
      value: String(4 + preferences.trackedIssues.length),
      detail: "Alerts personalized to your profile",
    },
  ];

  return (
    <div className="space-y-4">
      <PageIntro
        eyebrow="DASHBOARD"
        title="Your Civic Command Center"
        subtitle="Stay informed with clear metrics, factual context, and localized civic activity without partisan noise."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {personalizedStats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.article
              key={item.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              className="soft-card rounded-2xl p-4"
            >
              <div className="inline-flex rounded-lg bg-[#1a3a6b]/10 p-2">
                <Icon className="h-4 w-4 text-[#1a3a6b]" />
              </div>
              <p className="mt-3 text-sm text-[#5f6f84]">{item.label}</p>
              <p className="font-heading text-3xl leading-tight text-[#11294a]">{item.value}</p>
              <p className="text-xs text-[#5f6f84]">{item.detail}</p>
            </motion.article>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {preferences.homeModules.includes("brief") && (
          <article className="glass-card rounded-2xl p-5">
            <h2 className="font-heading text-2xl text-[#11294a]">Today&apos;s Trusted Brief</h2>
            <p className="mt-2 text-sm text-[#5f6f84]">
              Congress advances FY budget amendments, two Supreme Court oral arguments begin, and three state legislatures
              move election-admin bills to committee vote.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[#11294a]">
              <li className="rounded-lg bg-white p-3">7/9 claims verified across AP, Reuters, CBO, and .gov releases.</li>
              <li className="rounded-lg bg-white p-3">2 disputed narratives flagged for missing source evidence.</li>
              <li className="rounded-lg bg-white p-3">Bias context balanced: 46% center, 27% lean left, 27% lean right.</li>
            </ul>
          </article>
        )}

        {preferences.homeModules.includes("queue") && (
          <article className="glass-card rounded-2xl p-5">
            <h2 className="font-heading text-2xl text-[#11294a]">Civic Action Queue</h2>
            <div className="mt-3 space-y-2 text-sm text-[#11294a]">
              <div className="rounded-lg border border-[#d3ddeb] bg-white p-3">Contact state rep about Senate Bill 214 before Tue 5:00 PM.</div>
              <div className="rounded-lg border border-[#d3ddeb] bg-white p-3">Town hall in Brooklyn District 11 this Thursday at 7:30 PM.</div>
              <div className="rounded-lg border border-[#d3ddeb] bg-white p-3">Voter registration deadline in your county: Oct 12.</div>
            </div>
          </article>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <article className="soft-card rounded-2xl p-5">
          <h2 className="font-heading text-2xl text-[#11294a]">Personalization Controls</h2>
          <p className="mt-1 text-sm text-[#5f6f84]">Adjust the issues and modules shown on your home dashboard.</p>

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold tracking-[0.08em] text-[#5f6f84]">TRACKED ISSUES</p>
            <div className="flex flex-wrap gap-2">
              {issueOptions.map((issue) => {
                const selected = preferences.trackedIssues.includes(issue);
                return (
                  <button
                    key={issue}
                    type="button"
                    onClick={() => toggleIssue(issue)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      selected ? "bg-[#1a3a6b] text-white" : "bg-white text-[#11294a]"
                    }`}
                  >
                    {issue}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold tracking-[0.08em] text-[#5f6f84]">DASHBOARD MODULES</p>
            <div className="flex flex-wrap gap-2">
              {moduleOptions.map((module) => {
                const selected = preferences.homeModules.includes(module.key);
                return (
                  <button
                    key={module.key}
                    type="button"
                    onClick={() => toggleModule(module.key)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      selected ? "bg-[#c0392b] text-white" : "bg-white text-[#11294a]"
                    }`}
                  >
                    {module.label}
                  </button>
                );
              })}
            </div>
          </div>
        </article>

        <article className="soft-card rounded-2xl p-5">
          <h2 className="font-heading text-2xl text-[#11294a]">Reading Mode</h2>
          <p className="mt-1 text-sm text-[#5f6f84]">Switch between stripped-down facts and contextual analysis.</p>
          <button
            type="button"
            onClick={toggleJustFacts}
            className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold ${
              preferences.justFacts ? "bg-[#1a3a6b] text-white" : "bg-white text-[#11294a]"
            }`}
          >
            {preferences.justFacts ? "Just the Facts: ON" : "Just the Facts: OFF"}
          </button>

          <div className="mt-4 rounded-xl bg-white p-3 text-sm text-[#11294a]">
            Hello {user?.name.split(" ")[0] || "there"}, your dashboard is now tuned for {preferences.trackedIssues.length} active topics.
          </div>
        </article>
      </section>
    </div>
  );
}
