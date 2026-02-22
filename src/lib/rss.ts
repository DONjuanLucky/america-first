import { XMLParser } from "fast-xml-parser";
import { rssSources, RssSource } from "@/lib/news-sources";

export type FeedItem = {
  source: string;
  biasLabel: RssSource["biasLabel"];
  topic: string;
  title: string;
  url: string;
  imageUrl?: string;
  publishedAt: Date;
  description: string;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: true,
});

export async function fetchRssItems(limitPerSource = 5): Promise<FeedItem[]> {
  const allItems: FeedItem[] = [];

  for (const source of rssSources) {
    try {
      const response = await fetch(source.feedUrl, { cache: "no-store" });
      if (!response.ok) {
        continue;
      }
      const xml = await response.text();
      const parsed = parser.parse(xml) as {
        rss?: { channel?: { item?: Array<Record<string, unknown>> | Record<string, unknown> } };
      };

      const rawItems = parsed.rss?.channel?.item;
      const normalized = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

      for (const raw of normalized.slice(0, limitPerSource)) {
        const title = String(raw.title ?? "").trim();
        const url = String(raw.link ?? "").trim();
        const description = String(raw.description ?? raw["content:encoded"] ?? "").replace(/<[^>]+>/g, " ").trim();
        const publishedRaw = String(raw.pubDate ?? raw.published ?? "").trim();
        const publishedAt = new Date(publishedRaw || Date.now());
        const mediaContent = raw["media:content"] as { [key: string]: unknown } | Array<{ [key: string]: unknown }> | undefined;
        const mediaThumbnail = raw["media:thumbnail"] as { [key: string]: unknown } | undefined;
        const enclosure = raw.enclosure as { [key: string]: unknown } | undefined;

        const mediaUrl =
          (Array.isArray(mediaContent)
            ? String(mediaContent[0]?.["@_url"] ?? "")
            : String(mediaContent?.["@_url"] ?? "")) ||
          String(mediaThumbnail?.["@_url"] ?? "") ||
          String(enclosure?.["@_url"] ?? "");

        if (!title || !url) {
          continue;
        }

        allItems.push({
          source: source.name,
          biasLabel: source.biasLabel,
          topic: source.topic,
          title,
          url,
          imageUrl: mediaUrl.startsWith("http") ? mediaUrl : undefined,
          publishedAt,
          description,
        });
      }
    } catch {
      continue;
    }
  }

  return allItems.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}
