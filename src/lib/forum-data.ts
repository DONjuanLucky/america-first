export type ForumThread = {
  slug: string;
  title: string;
  tag: string;
  replies: number;
  quality: string;
  summary: string;
  keyPoints: string[];
};

export const forumThreads: ForumThread[] = [
  {
    slug: "election-security-proposal",
    title: "What does the new election security proposal actually change?",
    tag: "Policy Deep Dive",
    replies: 42,
    quality: "High quality discussion",
    summary:
      "Members compare the proposal text against existing federal election security grants and state implementation timelines.",
    keyPoints: [
      "How grant eligibility would change under the proposal",
      "Impact on county-level election offices",
      "Where bipartisan overlap currently exists",
    ],
  },
  {
    slug: "municipal-budget-clarity",
    title: "Should municipal budgets publish plain-language quarterly updates?",
    tag: "Local Issues",
    replies: 28,
    quality: "Constructive and sourced",
    summary:
      "Community members debate practical transparency standards for city budgets and reporting cadence.",
    keyPoints: [
      "Examples from cities already using plain-language summaries",
      "Cost and staffing impact for local governments",
      "Best formats for public readability",
    ],
  },
  {
    slug: "ama-election-director",
    title: "AMA: Former state election director on ballot process myths",
    tag: "Ask an Expert",
    replies: 66,
    quality: "Live session ongoing",
    summary:
      "A former election director answers process questions with operational context and legal references.",
    keyPoints: [
      "Ballot handling chain-of-custody basics",
      "Common misinformation patterns and corrections",
      "What local election officials control vs. state agencies",
    ],
  },
];
