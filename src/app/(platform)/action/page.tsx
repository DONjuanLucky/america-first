"use client";

import { motion } from "framer-motion";
import { ExternalLink, Handshake, Mail, PhoneCall } from "lucide-react";
import { PageIntro } from "@/components/page-intro";

const organizations = [
  { issue: "Voting Rights", org: "League of Women Voters", rating: "A+" },
  { issue: "Veterans Affairs", org: "IAVA", rating: "A" },
  { issue: "Education Reform", org: "Education Trust", rating: "A" },
  { issue: "Environment", org: "Clean Air Task Force", rating: "A+" },
];

export default function ActionPage() {
  return (
    <div className="space-y-4">
      <PageIntro
        eyebrow="CIVIC ACTION HUB"
        title="From Information to Action"
        subtitle="Connect with vetted organizations, contact your representatives, and follow policy milestones that affect your community."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <Handshake className="h-5 w-5 text-[#1a3a6b]" />
            <h2 className="font-heading text-2xl text-[#11294a]">Issue Organizations</h2>
          </div>
          <div className="mt-3 space-y-2">
            {organizations.map((entry, idx) => (
              <motion.div
                key={entry.org}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="flex items-center justify-between rounded-xl border border-[#d3ddeb] bg-white p-3"
              >
                <div>
                  <p className="text-xs font-semibold tracking-wide text-[#5f6f84]">{entry.issue}</p>
                  <p className="font-semibold text-[#11294a]">{entry.org}</p>
                </div>
                <span className="text-mono rounded-full bg-[#edf2f7] px-3 py-1 text-xs text-[#1a3a6b]">{entry.rating}</span>
              </motion.div>
            ))}
          </div>
        </article>

        <article className="glass-card rounded-2xl p-5">
          <h2 className="font-heading text-2xl text-[#11294a]">Contact Your Representative</h2>
          <p className="mt-2 text-sm text-[#5f6f84]">Draft and send respectful constituent messages with location-aware routing.</p>
          <div className="mt-4 grid gap-2 text-sm">
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a3a6b] px-4 py-3 font-semibold text-white">
              <Mail className="h-4 w-4" />
              Write Email
            </button>
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#c7d3e4] bg-white px-4 py-3 font-semibold text-[#11294a]">
              <PhoneCall className="h-4 w-4" />
              Call Office
            </button>
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#c7d3e4] bg-white px-4 py-3 font-semibold text-[#11294a]">
              <ExternalLink className="h-4 w-4" />
              Open Voter Registration
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}
