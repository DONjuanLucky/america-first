type StoryAnalysis = {
  summary: string;
  justFacts: string;
  leftPerspective: string;
  rightPerspective: string;
  historyAnalysis: string;
  historicalComparisons: string[];
  factualPoints: string[];
  confidence: number;
};

const analysisSchema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    justFacts: { type: "string" },
    leftPerspective: { type: "string" },
    rightPerspective: { type: "string" },
    historyAnalysis: { type: "string" },
    historicalComparisons: { type: "array", items: { type: "string" } },
    factualPoints: { type: "array", items: { type: "string" } },
    confidence: { type: "number" },
  },
  required: [
    "summary",
    "justFacts",
    "leftPerspective",
    "rightPerspective",
    "historyAnalysis",
    "historicalComparisons",
    "factualPoints",
    "confidence",
  ],
};

function extractJson(raw: string) {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in LLM response.");
  }
  return raw.slice(start, end + 1);
}

function normalizeAnalysis(data: Partial<StoryAnalysis>): StoryAnalysis {
  return {
    summary: data.summary?.trim() || "No summary generated.",
    justFacts: data.justFacts?.trim() || "No fact-only summary generated.",
    leftPerspective: data.leftPerspective?.trim() || "Left-leaning framing was not detected clearly.",
    rightPerspective: data.rightPerspective?.trim() || "Right-leaning framing was not detected clearly.",
    historyAnalysis:
      data.historyAnalysis?.trim() ||
      "Historical comparison is currently unavailable for this story.",
    historicalComparisons: Array.isArray(data.historicalComparisons)
      ? data.historicalComparisons.filter(Boolean).slice(0, 4)
      : [],
    factualPoints: Array.isArray(data.factualPoints) ? data.factualPoints.filter(Boolean).slice(0, 5) : [],
    confidence: Math.max(55, Math.min(99, Math.round(data.confidence ?? 72))),
  };
}

export async function analyzeStoryWithLLM(input: {
  title: string;
  source: string;
  description: string;
  url: string;
}) {
  const provider = (process.env.LLM_PROVIDER ?? "gemini").toLowerCase();

  if (provider === "deepseek") {
    return analyzeWithDeepSeek(input);
  }

  return analyzeWithGemini(input);
}

async function analyzeWithGemini(input: {
  title: string;
  source: string;
  description: string;
  url: string;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  const prompt = `You are a nonpartisan civic editor. Return strict JSON with this schema: ${JSON.stringify(analysisSchema)}.\n\nToday: ${new Date().toISOString()}\nArticle title: ${input.title}\nSource: ${input.source}\nDescription: ${input.description}\nURL: ${input.url}\n\nRequirements:\n- summary: balanced paragraph\n- justFacts: factual only, no opinion language\n- leftPerspective: explain left-leaning arguments fairly\n- rightPerspective: explain right-leaning arguments fairly\n- historyAnalysis: \"What our history tells us\" comparison between the current event and similar past events\n- historicalComparisons: 2-4 concise historical parallels or precedents\n- factualPoints: 3-5 bullet-like statements of verifiable current status\n- confidence: 0-100 confidence score for factual clarity\n\nCritical rules:\n- Do NOT assert who currently holds an office unless this article explicitly states it.
- Prefer date-qualified language (e.g., \"as of this report\", \"according to this article\").`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini API failed with ${response.status}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini response did not include text output.");
  }

  const parsed = JSON.parse(extractJson(text)) as Partial<StoryAnalysis>;
  return normalizeAnalysis(parsed);
}

async function analyzeWithDeepSeek(input: {
  title: string;
  source: string;
  description: string;
  url: string;
}) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is missing.");
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a nonpartisan civic editor. Always return strict JSON with fields summary, justFacts, leftPerspective, rightPerspective, historyAnalysis, historicalComparisons, factualPoints, confidence. Avoid stating current officeholders unless explicitly provided in the article.",
        },
        {
          role: "user",
          content: `Analyze this article.\nTitle: ${input.title}\nSource: ${input.source}\nDescription: ${input.description}\nURL: ${input.url}\n\nReturn JSON only.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API failed with ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("DeepSeek response did not include text output.");
  }

  const parsed = JSON.parse(extractJson(text)) as Partial<StoryAnalysis>;
  return normalizeAnalysis(parsed);
}
