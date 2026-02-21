"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Building2,
  CircleGauge,
  FileSpreadsheet,
  Landmark,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const seatDistribution = [
  { state: "AZ", incumbent: 51, challenger: 47 },
  { state: "MI", incumbent: 49, challenger: 48 },
  { state: "GA", incumbent: 50, challenger: 49 },
  { state: "PA", incumbent: 52, challenger: 46 },
  { state: "WI", incumbent: 50, challenger: 47 },
];

const trustTrend = [
  { month: "Jan", score: 57 },
  { month: "Feb", score: 59 },
  { month: "Mar", score: 61 },
  { month: "Apr", score: 64 },
  { month: "May", score: 63 },
  { month: "Jun", score: 67 },
];

const newsBias = [
  { name: "Center", value: 48, fill: "#1a3a6b" },
  { name: "Lean Left", value: 24, fill: "#6f90c2" },
  { name: "Lean Right", value: 28, fill: "#c0392b" },
];

const modules = [
  {
    title: "Government Intelligence Hub",
    detail: "Find every office, officeholder, and challenger with plain-English role explainers.",
    icon: Landmark,
  },
  {
    title: "Ethics & Public Sentiment",
    detail: "Transparent integrity scores with trend history, source citations, and accountability timelines.",
    icon: ShieldCheck,
  },
  {
    title: "Fact-Verified News",
    detail: "Cross-checked headlines from nonpartisan outlets with confidence and bias context labels.",
    icon: BadgeCheck,
  },
  {
    title: "Community Civic Forum",
    detail: "Constructive policy discussions, verified fact posts, and expert AMA sessions.",
    icon: Users,
  },
  {
    title: "Action & Resources Hub",
    detail: "Contact reps, track bills, find polling locations, and discover vetted issue organizations.",
    icon: Building2,
  },
  {
    title: "Ask America First",
    detail: "Civic assistant answers government questions with concise summaries and primary source links.",
    icon: Sparkles,
  },
];

const rankCards = [
  { label: "Integrity Score", value: 82, delta: "+4.6% past 90 days" },
  { label: "Public Trust Index", value: 67, delta: "+2.1% past 90 days" },
  { label: "Participation Record", value: 91, delta: "+1.2% past 90 days" },
];

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-[#d2dde9] bg-[#0a1628] p-8 text-white md:p-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(212,160,23,0.24),transparent_36%),radial-gradient(circle_at_80%_90%,rgba(26,58,107,0.75),transparent_45%)]" />
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="absolute -right-8 -top-8 h-44 w-44 rounded-full border border-[#d4a017]/35 bg-[#d4a017]/10"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
          className="absolute -bottom-10 left-[38%] h-36 w-36 rounded-full border border-[#c0392b]/40 bg-[#c0392b]/10"
        />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-semibold tracking-wide">
              <CircleGauge className="h-4 w-4 text-[#d4a017]" />
              Civic Intelligence Platform
            </div>
            <h1 className="font-display text-5xl leading-[0.96] tracking-tight md:text-7xl">
              AMERICA FIRST
            </h1>
            <p className="font-heading mt-3 text-2xl text-[#e8eef7] md:text-3xl">
              Informed citizens. Stronger democracy.
            </p>
            <p className="mt-6 max-w-2xl text-[1.06rem] leading-relaxed text-[#d8e1ee]">
              A modern, nonpartisan civic platform that explains government clearly,
              verifies public information, and turns civic awareness into meaningful action.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-[#c0392b] px-5 py-3 text-sm font-bold tracking-wide text-white transition hover:translate-y-[-1px] hover:bg-[#d24a3d]"
            >
              Explore Platform <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/assistant"
              className="inline-flex items-center gap-2 rounded-full border border-white/50 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Watch Product Tour
            </Link>
            </div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="glass-card grid gap-4 rounded-2xl p-5 text-[#11294a]"
          >
            <h2 className="font-heading text-2xl">Live Signals</h2>
            <div className="space-y-3">
              {rankCards.map((item, idx) => (
                <div key={item.label} className="rounded-xl bg-white/80 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-mono text-sm">{item.value}/100</p>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[#dfe8f3]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 0.55, delay: 0.1 + idx * 0.06 }}
                      className="h-2 rounded-full bg-[#1a3a6b]"
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#5f6f84]">{item.delta}</p>
                </div>
              ))}
            </div>
            <div className="soft-card rounded-xl p-3 text-sm">
              <div className="mb-1 flex items-center gap-2 font-semibold text-[#11294a]">
                <Bell className="h-4 w-4 text-[#c0392b]" />
                Town Hall Alerts Enabled
              </div>
              <p className="text-[#5f6f84]">3 local hearings and 2 bill updates this week.</p>
            </div>
          </motion.aside>
        </div>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((module, idx) => {
          const Icon = module.icon;
          return (
            <motion.article
              key={module.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.42, delay: idx * 0.05 }}
              className="soft-card rounded-2xl p-5"
            >
              <div className="mb-3 inline-flex rounded-lg bg-[#1a3a6b]/10 p-2">
                <Icon className="h-5 w-5 text-[#1a3a6b]" />
              </div>
              <h3 className="font-heading text-2xl leading-tight text-[#11294a]">{module.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5f6f84]">{module.detail}</p>
            </motion.article>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
          className="glass-card rounded-2xl p-5 lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-heading text-2xl text-[#11294a]">Election Seat Distribution</h3>
            <span className="text-mono rounded-full bg-[#edf2f7] px-3 py-1 text-xs text-[#1a3a6b]">
              Source: FEC + State Boards
            </span>
          </div>
          <div className="h-72">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={seatDistribution}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#d4dce8" />
                  <XAxis dataKey="state" stroke="#5f6f84" />
                  <YAxis stroke="#5f6f84" />
                  <Tooltip />
                  <Bar dataKey="incumbent" fill="#1a3a6b" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="challenger" fill="#c0392b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full animate-pulse rounded-xl bg-[#e2eaf4]" />
            )}
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.42, delay: 0.06 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="font-heading text-2xl text-[#11294a]">News Bias Mix</h3>
          <p className="mt-1 text-sm text-[#5f6f84]">Balanced source blend in today&apos;s feed.</p>
          <div className="h-56">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={newsBias} dataKey="value" innerRadius={48} outerRadius={72} paddingAngle={2} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full animate-pulse rounded-xl bg-[#e2eaf4]" />
            )}
          </div>
          <ul className="space-y-1 text-sm text-[#11294a]">
            {newsBias.map((entry) => (
              <li key={entry.name} className="flex items-center justify-between">
                <span>{entry.name}</span>
                <span className="text-mono">{entry.value}%</span>
              </li>
            ))}
          </ul>
        </motion.article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.4 }}
          className="soft-card rounded-2xl p-5"
        >
          <h3 className="font-heading text-2xl text-[#11294a]">Public Trust Trend</h3>
          <p className="mb-3 mt-1 text-sm text-[#5f6f84]">Sentiment index over the past six months.</p>
          <div className="h-64">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trustTrend}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#cfdae8" />
                  <XAxis dataKey="month" stroke="#5f6f84" />
                  <YAxis stroke="#5f6f84" domain={[45, 75]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#c0392b" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full animate-pulse rounded-xl bg-[#e2eaf4]" />
            )}
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="soft-card rounded-2xl p-5"
        >
          <h3 className="font-heading text-2xl text-[#11294a]">Who Represents Me?</h3>
          <p className="mt-1 text-sm text-[#5f6f84]">Enter ZIP code to instantly load federal, state, and local representatives.</p>
          <form className="mt-5 flex flex-wrap gap-3">
            <label className="sr-only" htmlFor="zip">
              ZIP code
            </label>
            <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-[#cad6e6] bg-white px-3">
              <Search className="h-4 w-4 text-[#5f6f84]" />
              <input
                id="zip"
                name="zip"
                placeholder="Enter ZIP code"
                className="h-11 w-full bg-transparent text-sm text-[#11294a] outline-none placeholder:text-[#8a98ac]"
              />
            </div>
            <button
              type="button"
              className="rounded-xl bg-[#1a3a6b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#234a85]"
            >
              Find Representatives
            </button>
          </form>
          <div className="mt-5 grid gap-2 text-sm">
            <div className="rounded-lg bg-white p-3 text-[#11294a]">U.S. Senate: 2 representatives loaded</div>
            <div className="rounded-lg bg-white p-3 text-[#11294a]">U.S. House District: NY-14</div>
            <div className="rounded-lg bg-white p-3 text-[#11294a]">Local council + school board available</div>
          </div>
        </motion.article>
      </section>

      <section className="rounded-2xl border border-[#cfd9e8] bg-white p-6">
        <h3 className="font-heading text-3xl text-[#11294a]">Launch-Ready Additions</h3>
        <p className="mt-1 text-sm text-[#5f6f84]">Extra features included beyond the PRD baseline for stronger product differentiation.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="soft-card rounded-xl p-4">
            <div className="mb-2 inline-flex rounded-md bg-[#1a3a6b]/10 p-2">
              <FileSpreadsheet className="h-4 w-4 text-[#1a3a6b]" />
            </div>
            <h4 className="font-semibold">Election Brief Export</h4>
            <p className="mt-1 text-sm text-[#5f6f84]">Download district-level briefings as clean PDF packs for classrooms and civic groups.</p>
          </div>
          <div className="soft-card rounded-xl p-4">
            <div className="mb-2 inline-flex rounded-md bg-[#c0392b]/10 p-2">
              <Bell className="h-4 w-4 text-[#c0392b]" />
            </div>
            <h4 className="font-semibold">Contextual Alert Nudges</h4>
            <p className="mt-1 text-sm text-[#5f6f84]">Smart reminders trigger before deadlines, hearings, and registration windows in your area.</p>
          </div>
          <div className="soft-card rounded-xl p-4">
            <div className="mb-2 inline-flex rounded-md bg-[#d4a017]/15 p-2">
              <ShieldCheck className="h-4 w-4 text-[#946d0f]" />
            </div>
            <h4 className="font-semibold">Source Reliability Lens</h4>
            <p className="mt-1 text-sm text-[#5f6f84]">Every chart and claim shows freshness, source count, and verification confidence at a glance.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
