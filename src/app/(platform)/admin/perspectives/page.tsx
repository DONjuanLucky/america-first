"use client";

import { PageIntro } from "@/components/page-intro";
import { useAppState } from "@/components/providers/app-provider";
import { EventBriefDTO, EventBriefInput } from "@/types/perspectives";
import { AlertCircle, Save, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

const initialFormState: EventBriefInput = {
  slug: "",
  event: "",
  leftSaying: [""],
  rightSaying: [""],
  factsSoFar: [""],
  whyLeft: "",
  whyRight: "",
  historicalContext: [""],
  published: false,
};

const parseLines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const linesToText = (value: string[]) => value.join("\n");

export default function AdminPerspectivesPage() {
  const { user } = useAppState();
  const [briefs, setBriefs] = useState<EventBriefDTO[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<EventBriefInput>(initialFormState);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/perspectives?includeDrafts=1", { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as EventBriefDTO[];
      setBriefs(data);
    })();
  }, []);

  const selected = useMemo(() => briefs.find((brief) => brief.id === selectedId) ?? null, [briefs, selectedId]);

  useEffect(() => {
    if (!selected) {
      return;
    }
    setForm({
      slug: selected.slug,
      event: selected.event,
      leftSaying: selected.leftSaying,
      rightSaying: selected.rightSaying,
      factsSoFar: selected.factsSoFar,
      whyLeft: selected.whyLeft,
      whyRight: selected.whyRight,
      historicalContext: selected.historicalContext,
      published: selected.published,
    });
  }, [selected]);

  const refreshBriefs = async () => {
    const response = await fetch("/api/perspectives?includeDrafts=1", { cache: "no-store" });
    if (!response.ok) {
      return;
    }
    const data = (await response.json()) as EventBriefDTO[];
    setBriefs(data);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const payload: EventBriefInput = {
      slug: form.slug,
      event: form.event,
      leftSaying: parseLines(linesToText(form.leftSaying)),
      rightSaying: parseLines(linesToText(form.rightSaying)),
      factsSoFar: parseLines(linesToText(form.factsSoFar)),
      historicalContext: parseLines(linesToText(form.historicalContext)),
      whyLeft: form.whyLeft,
      whyRight: form.whyRight,
      published: form.published,
    };

    const endpoint = selectedId ? `/api/perspectives/${selectedId}` : "/api/perspectives";
    const method = selectedId ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setMessage(data.error ?? "Unable to save event brief.");
      return;
    }

    await refreshBriefs();
    setMessage(selectedId ? "Event updated." : "Event created.");
    if (!selectedId) {
      setForm(initialFormState);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) {
      return;
    }

    const response = await fetch(`/api/perspectives/${selectedId}`, { method: "DELETE" });
    if (!response.ok) {
      setMessage("Unable to delete this event.");
      return;
    }

    setSelectedId(null);
    setForm(initialFormState);
    setMessage("Event deleted.");
    await refreshBriefs();
  };

  if (!user?.isAdmin) {
    return (
      <div className="soft-card rounded-2xl p-6 text-[#11294a]">
        <p className="inline-flex items-center gap-2 rounded-full bg-[#fff2ee] px-3 py-1 text-xs font-semibold text-[#9b352b]">
          <AlertCircle className="h-4 w-4" />
          Admin only
        </p>
        <p className="mt-3 text-sm">Your account does not have editorial permissions for Perspectives CMS.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageIntro
        eyebrow="ADMIN"
        title="Perspectives CMS"
        subtitle="Create, edit, publish, and remove perspective briefs without changing code."
      />

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.2fr]">
        <article className="glass-card rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-2xl text-[#11294a]">Event Briefs</h2>
            <button
              type="button"
              onClick={() => {
                setSelectedId(null);
                setForm(initialFormState);
              }}
              className="rounded-lg bg-[#1a3a6b] px-3 py-2 text-xs font-semibold text-white"
            >
              New
            </button>
          </div>
          <div className="space-y-2">
            {briefs.map((brief) => (
              <button
                key={brief.id}
                type="button"
                onClick={() => setSelectedId(brief.id)}
                className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                  selectedId === brief.id ? "border-[#1a3a6b] bg-[#eaf1fb]" : "border-[#d7e2ee] bg-white"
                }`}
              >
                <p className="text-sm font-semibold text-[#11294a]">{brief.event}</p>
                <p className="mt-1 text-xs text-[#5f6f84]">/{brief.slug}</p>
                <p className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${brief.published ? "bg-[#e7f3ec] text-[#1d6f42]" : "bg-[#fff2ee] text-[#9b352b]"}`}>
                  {brief.published ? "Published" : "Draft"}
                </p>
              </button>
            ))}
          </div>
        </article>

        <form onSubmit={handleSave} className="soft-card rounded-2xl p-5">
          <h2 className="font-heading text-2xl text-[#11294a]">{selectedId ? "Edit Brief" : "Create Brief"}</h2>
          <div className="mt-3 grid gap-3">
            <label className="text-sm font-semibold text-[#11294a]">
              Event title
              <input
                required
                value={form.event}
                onChange={(event) => setForm((current) => ({ ...current, event: event.target.value }))}
                className="mt-1 h-11 w-full rounded-xl border border-[#cad6e6] bg-white px-3 text-sm outline-none"
              />
            </label>
            <label className="text-sm font-semibold text-[#11294a]">
              Slug
              <input
                required
                value={form.slug}
                onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value.toLowerCase() }))}
                className="mt-1 h-11 w-full rounded-xl border border-[#cad6e6] bg-white px-3 text-sm outline-none"
                placeholder="federal-budget-negotiations"
              />
            </label>
            <label className="text-sm font-semibold text-[#11294a]">
              What is the left saying? (one line each)
              <textarea
                required
                rows={4}
                value={linesToText(form.leftSaying)}
                onChange={(event) => setForm((current) => ({ ...current, leftSaying: parseLines(event.target.value) }))}
                className="mt-1 w-full rounded-xl border border-[#cad6e6] bg-white px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="text-sm font-semibold text-[#11294a]">
              What is the right saying? (one line each)
              <textarea
                required
                rows={4}
                value={linesToText(form.rightSaying)}
                onChange={(event) => setForm((current) => ({ ...current, rightSaying: parseLines(event.target.value) }))}
                className="mt-1 w-full rounded-xl border border-[#cad6e6] bg-white px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="text-sm font-semibold text-[#11294a]">
              What do we know so far? (fact-only, one line each)
              <textarea
                required
                rows={4}
                value={linesToText(form.factsSoFar)}
                onChange={(event) => setForm((current) => ({ ...current, factsSoFar: parseLines(event.target.value) }))}
                className="mt-1 w-full rounded-xl border border-[#cad6e6] bg-white px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="text-sm font-semibold text-[#11294a]">
              Why the left perspective
              <textarea
                required
                rows={3}
                value={form.whyLeft}
                onChange={(event) => setForm((current) => ({ ...current, whyLeft: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-[#cad6e6] bg-white px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="text-sm font-semibold text-[#11294a]">
              Why the right perspective
              <textarea
                required
                rows={3}
                value={form.whyRight}
                onChange={(event) => setForm((current) => ({ ...current, whyRight: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-[#cad6e6] bg-white px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="text-sm font-semibold text-[#11294a]">
              Historical insights (one line each)
              <textarea
                required
                rows={3}
                value={linesToText(form.historicalContext)}
                onChange={(event) => setForm((current) => ({ ...current, historicalContext: parseLines(event.target.value) }))}
                className="mt-1 w-full rounded-xl border border-[#cad6e6] bg-white px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-[#11294a]">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(event) => setForm((current) => ({ ...current, published: event.target.checked }))}
              />
              Publish this brief
            </label>
          </div>

          {message && <p className="mt-3 rounded-lg bg-white px-3 py-2 text-sm text-[#11294a]">{message}</p>}

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-[#1a3a6b] px-4 py-2 text-sm font-semibold text-white">
              <Save className="h-4 w-4" />
              Save Brief
            </button>
            {selectedId && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-xl bg-[#c0392b] px-4 py-2 text-sm font-semibold text-white"
              >
                <Trash2 className="h-4 w-4" />
                Delete Brief
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
