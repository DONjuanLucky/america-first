"use client";

import { motion } from "framer-motion";
import { Filter, Search, Users } from "lucide-react";
import { PageIntro } from "@/components/page-intro";

const positions = [
  { role: "U.S. Senator", branch: "Legislative", term: "6 years", method: "Elected", salary: "$174,000" },
  { role: "Governor", branch: "Executive", term: "4 years", method: "Elected", salary: "$200,000*" },
  { role: "Supreme Court Justice", branch: "Judicial", term: "Lifetime", method: "Appointed", salary: "$298,500" },
  { role: "Mayor", branch: "Local Executive", term: "4 years", method: "Elected", salary: "Varies by city" },
];

const compare = [
  { label: "Voting consistency", a: 86, b: 74 },
  { label: "Constituent engagement", a: 81, b: 70 },
  { label: "Attendance", a: 92, b: 89 },
  { label: "Transparency", a: 77, b: 72 },
];

export default function ExplorerPage() {
  return (
    <div className="space-y-4">
      <PageIntro
        eyebrow="POSITION EXPLORER"
        title="Government Roles, Clearly Explained"
        subtitle="Search federal, state, and local offices with plain-English authority summaries, officeholder context, and challenger history."
      />

      <section className="soft-card rounded-2xl p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-xl border border-[#cad6e6] bg-white px-3">
            <Search className="h-4 w-4 text-[#5f6f84]" />
            <input
              placeholder="Search position, officeholder, district"
              className="h-11 w-full bg-transparent text-sm text-[#11294a] outline-none"
            />
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-[#1a3a6b] px-4 py-2 text-sm font-semibold text-white">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <article className="glass-card rounded-2xl p-5">
          <h2 className="font-heading text-2xl text-[#11294a]">Role Directory</h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-[#d4ddea]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#eef3fa] text-[#37547c]">
                <tr>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Branch</th>
                  <th className="px-3 py-2">Term</th>
                  <th className="px-3 py-2">Method</th>
                </tr>
              </thead>
              <tbody className="bg-white text-[#11294a]">
                {positions.map((position) => (
                  <tr key={position.role} className="border-t border-[#e2eaf5]">
                    <td className="px-3 py-2 font-semibold">{position.role}</td>
                    <td className="px-3 py-2">{position.branch}</td>
                    <td className="px-3 py-2">{position.term}</td>
                    <td className="px-3 py-2">{position.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-[#5f6f84]">* Governor compensation varies by state.</p>
        </article>

        <article className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#1a3a6b]" />
            <h2 className="font-heading text-2xl text-[#11294a]">Compare Officeholders</h2>
          </div>
          <div className="mt-4 space-y-3">
            {compare.map((row, idx) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="rounded-xl bg-white p-3"
              >
                <div className="mb-1 flex items-center justify-between text-sm text-[#11294a]">
                  <span>{row.label}</span>
                  <span className="text-mono">A {row.a} / B {row.b}</span>
                </div>
                <div className="h-2 rounded-full bg-[#e2ebf6]">
                  <div className="h-2 rounded-full bg-[#1a3a6b]" style={{ width: `${row.a}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
