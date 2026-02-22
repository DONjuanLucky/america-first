"use client";

import { motion } from "framer-motion";
import { Bot, SendHorizontal, Sparkles } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { FormEvent, useState } from "react";

const prompts = [
  "Explain what the Speaker of the House can actually do.",
  "Summarize Bill H.R. 2412 in plain English with sources.",
  "Who represents ZIP 10019 at federal and state levels?",
];

export default function AssistantPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    Array<{
      role: "user" | "assistant";
      text: string;
      citations?: Array<{ title: string; url: string }>;
    }>
  >([
    {
      role: "user",
      text: "What powers does a U.S. governor have during an emergency declaration?",
    },
    {
      role: "assistant",
      text:
        "Governors can activate state emergency statutes, reallocate certain funds, mobilize National Guard units, and issue temporary directives where state law permits.",
      citations: [
        { title: "National Governors Association", url: "https://www.nga.org" },
        { title: "USA.gov State Government", url: "https://www.usa.gov/state-governments" },
      ],
    },
  ]);

  const askAssistant = async (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    setLoading(true);
    setMessages((current) => [...current, { role: "user", text: trimmed }]);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });

      const data = (await response.json()) as {
        answer?: string;
        citations?: Array<{ title: string; url: string }>;
        error?: string;
      };

      if (!response.ok || !data.answer) {
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            text: data.error ?? "I could not answer that right now. Please try again.",
          },
        ]);
      } else {
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            text: data.answer ?? "I could not generate an answer right now.",
            citations: data.citations ?? [],
          },
        ]);
      }
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "Network issue while contacting the assistant. Please retry.",
        },
      ]);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await askAssistant(question);
  };

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
          <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1 text-sm">
            {messages.map((message, idx) => (
              <div key={`${message.role}-${idx}`}>
                <div
                  className={`max-w-[88%] rounded-2xl p-3 ${
                    message.role === "user"
                      ? "rounded-bl-sm bg-[#edf2f7] text-[#11294a]"
                      : "ml-auto rounded-br-sm bg-[#1a3a6b] text-white"
                  }`}
                >
                  {message.text}
                </div>
                {message.role === "assistant" && message.citations && message.citations.length > 0 && (
                  <div className="ml-auto mt-1 max-w-[88%] rounded-lg bg-white p-2 text-xs text-[#24456f]">
                    <p className="mb-1 font-semibold">Sources</p>
                    <ul className="space-y-1">
                      {message.citations.map((citation) => (
                        <li key={`${citation.title}-${citation.url}`}>
                          <a href={citation.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                            {citation.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <form className="mt-4 flex items-center gap-2 rounded-xl border border-[#cad6e6] bg-white px-3" onSubmit={handleSubmit}>
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="h-11 w-full bg-transparent text-sm text-[#11294a] outline-none"
              placeholder="Ask a civic question..."
            />
            <button type="submit" disabled={loading} className="rounded-lg bg-[#c0392b] p-2 text-white disabled:opacity-60">
              <SendHorizontal className="h-4 w-4" />
            </button>
          </form>
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
                onClick={() => void askAssistant(prompt)}
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
