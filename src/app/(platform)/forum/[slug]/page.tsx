import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { forumThreads } from "@/lib/forum-data";

export default async function ForumThreadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const thread = forumThreads.find((item) => item.slug === slug);

  if (!thread) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <PageIntro
        eyebrow={thread.tag.toUpperCase()}
        title={thread.title}
        subtitle={thread.summary}
      />

      <section className="glass-card rounded-2xl p-5">
        <h2 className="font-heading text-2xl text-[#11294a]">Key Discussion Points</h2>
        <ul className="mt-3 space-y-2 text-sm text-[#11294a]">
          {thread.keyPoints.map((point) => (
            <li key={point} className="rounded-xl border border-[#d4e0ef] bg-white p-3">
              {point}
            </li>
          ))}
        </ul>
      </section>

      <section className="soft-card rounded-2xl p-5 text-sm text-[#11294a]">
        Replies: {thread.replies} · Quality signal: {thread.quality}
      </section>
    </div>
  );
}
