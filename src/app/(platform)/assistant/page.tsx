"use client";

import { motion } from "framer-motion";
import { Bot, SendHorizontal, Sparkles } from "lucide-react";
import { PageIntro } from "@/components/page-intro";

const prompts = [
  "Explain what the Speaker of the House can actually do.",
  "Summarize Bill H.R. 2412 in plain English with sources.",
  "Who represents ZIP 10019 at federal and state levels?",
];

export default function AssistantPage() {
  return (
    <div className="space-y-4">
      <PageIntro
        eyebrow="ASK AMERICA FIRST"
        title="AI Civic Assistant With Cited Answers"
        subtitle="Get clear, factual responses about process, policy, and officeholder responsibilities, always with source references."
      />

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <article className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-[#1a3a6b]" />
            <h2 className="font-heading text-2xl text-[#11294a]">Conversation</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-[#edf2f7] p-3 text-[#11294a]">
              What powers does a U.S. governor have during an emergency declaration?
            </div>
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-[#1a3a6b] p-3 text-white">
              Governors can activate state emergency statutes, reallocate certain funds, mobilize National Guard units,
              and issue temporary executive directives as defined by state law. Source refs: state emergency code,
              National Governors Association, and state constitution sections.
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#cad6e6] bg-white px-3">
            <input className="h-11 w-full bg-transparent text-sm text-[#11294a] outline-none" placeholder="Ask a civic question..." />
            <button type="button" className="rounded-lg bg-[#c0392b] p-2 text-white">
              <SendHorizontal className="h-4 w-4" />
            </button>
          </div>
        </article>

        <article className="soft-card rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#946d0f]" />
            <h2 className="font-heading text-2xl text-[#11294a]">Try These</h2>
          </div>
          <div className="mt-3 space-y-2">
            {prompts.map((prompt, idx) => (
              <motion.button
                type="button"
                key={prompt}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="w-full rounded-xl bg-white p-3 text-left text-sm text-[#11294a]"
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
