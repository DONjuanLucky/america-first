export type RssSource = {
  id: string;
  name: string;
  feedUrl: string;
  topic: string;
  biasLabel: "Center" | "Lean Left" | "Lean Right";
};

export const rssSources: RssSource[] = [
  {
    id: "reuters-world-news",
    name: "Reuters World News",
    feedUrl: "https://feeds.reuters.com/Reuters/worldNews",
    topic: "World Affairs",
    biasLabel: "Center",
  },
  {
    id: "reuters-politics",
    name: "Reuters Politics",
    feedUrl: "https://feeds.reuters.com/Reuters/PoliticsNews",
    topic: "Federal Government",
    biasLabel: "Center",
  },
  {
    id: "ap-politics",
    name: "Associated Press Politics",
    feedUrl: "https://apnews.com/hub/politics/rss",
    topic: "Federal Government",
    biasLabel: "Center",
  },
  {
    id: "npr-politics",
    name: "NPR Politics",
    feedUrl: "https://feeds.npr.org/1014/rss.xml",
    topic: "Federal Government",
    biasLabel: "Lean Left",
  },
  {
    id: "pbs-politics",
    name: "PBS NewsHour",
    feedUrl: "https://www.pbs.org/newshour/feeds/rss/politics",
    topic: "Policy",
    biasLabel: "Center",
  },
  {
    id: "wsj-politics",
    name: "Wall Street Journal Politics",
    feedUrl: "https://feeds.a.dj.com/rss/RSSPolitics.xml",
    topic: "Federal Government",
    biasLabel: "Lean Right",
  },
  {
    id: "fox-politics",
    name: "Fox News Politics",
    feedUrl: "https://moxie.foxnews.com/google-publisher/politics.xml",
    topic: "Federal Government",
    biasLabel: "Lean Right",
  },
  {
    id: "washington-times-politics",
    name: "Washington Times Politics",
    feedUrl: "https://www.washingtontimes.com/rss/headlines/news/politics/",
    topic: "Federal Government",
    biasLabel: "Lean Right",
  },
  {
    id: "cspan-congress",
    name: "C-SPAN Congress",
    feedUrl: "https://www.c-span.org/rss/?feed=congress",
    topic: "Congress",
    biasLabel: "Center",
  },
];
