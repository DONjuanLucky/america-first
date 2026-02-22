import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  question: z.string().min(4),
});

type AssistantResult = {
  answer: string;
  citations: Array<{ title: string; url: string }>;
};

const presidentRegex = /(who\s+is\s+the\s+(current\s+)?president|current\s+president|president\s+of\s+the\s+united\s+states)/i;
const vicePresidentRegex = /(who\s+is\s+the\s+(current\s+)?vice\s+president|current\s+vice\s+president|vice\s+president\s+of\s+the\s+united\s+states)/i;
const repsByZipRegex = /(who\s+represents\s+zip\s*\d{5}|representatives?\s+for\s+zip\s*\d{5}|who\s+represents\s+me\s+in\s+zip\s*\d{5})/i;

function withAsOf(result: AssistantResult) {
  const stamp = new Date().toISOString();
  return {
    ...result,
    answer: `As of ${stamp}: ${result.answer}`,
  };
}

function extractJson(raw: string) {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object returned by model.");
  }
  return raw.slice(start, end + 1);
}

function fallbackAnswer(question: string): AssistantResult {
  return {
    answer:
      `I could not reach the live model right now, but your question was received: "${question}". ` +
      "Please retry in a few seconds. While waiting, you can verify facts through Congress.gov, GovTrack, and official .gov sources.",
    citations: [
      { title: "Congress.gov", url: "https://www.congress.gov" },
      { title: "GovTrack", url: "https://www.govtrack.us" },
      { title: "USA.gov", url: "https://www.usa.gov" },
    ],
  };
}

async function lookupWhiteHouseLeadership(target: "president" | "vice-president"): Promise<AssistantResult | null> {
  const response = await fetch("https://www.whitehouse.gov/administration/", { cache: "no-store" });
  if (!response.ok) {
    return null;
  }

  const html = await response.text();
  const presidentMatch = html.match(/President\s+([A-Z][A-Za-z.'-]+(?:\s+[A-Z][A-Za-z.'-]+){0,4})/);
  const vpMatch = html.match(/Vice\s+President\s+([A-Z][A-Za-z.'-]+(?:\s+[A-Z][A-Za-z.'-]+){0,4})/);

  if (target === "president" && presidentMatch?.[1]) {
    return {
      answer: `According to the White House administration page, the current U.S. President is ${presidentMatch[1]}.`,
      citations: [{ title: "The White House Administration", url: "https://www.whitehouse.gov/administration/" }],
    };
  }

  if (target === "vice-president" && vpMatch?.[1]) {
    return {
      answer: `According to the White House administration page, the current U.S. Vice President is ${vpMatch[1]}.`,
      citations: [{ title: "The White House Administration", url: "https://www.whitehouse.gov/administration/" }],
    };
  }

  return null;
}

async function lookupRepresentativesForZip(requestUrl: string, question: string): Promise<AssistantResult | null> {
  const zip = question.match(/\b\d{5}\b/)?.[0];
  if (!zip) {
    return null;
  }

  const endpoint = new URL("/api/representatives", requestUrl);
  endpoint.searchParams.set("zip", zip);
  const response = await fetch(endpoint, { cache: "no-store" });
  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    region?: string;
    officials?: Array<{ name?: string; role?: string; party?: string }>;
  };

  const picks = (data.officials ?? []).slice(0, 5);
  if (picks.length === 0) {
    return null;
  }

  const list = picks.map((entry) => `${entry.role}: ${entry.name}${entry.party ? ` (${entry.party})` : ""}`).join("; ");
  return {
    answer: `For ZIP ${zip}${data.region ? ` (${data.region})` : ""}, here are current officials: ${list}.`,
    citations: [
      { title: "Representatives API", url: endpoint.toString() },
      { title: "GovTrack", url: "https://www.govtrack.us" },
    ],
  };
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid assistant question." }, { status: 400 });
  }

  const question = parsed.data.question.trim();
  const provider = (process.env.LLM_PROVIDER ?? "gemini").toLowerCase();

  if (presidentRegex.test(question)) {
    const president = await lookupWhiteHouseLeadership("president");
    if (president) {
      return NextResponse.json(withAsOf(president));
    }
  }

  if (vicePresidentRegex.test(question)) {
    const vicePresident = await lookupWhiteHouseLeadership("vice-president");
    if (vicePresident) {
      return NextResponse.json(withAsOf(vicePresident));
    }
  }

  if (repsByZipRegex.test(question)) {
    const reps = await lookupRepresentativesForZip(request.url, question);
    if (reps) {
      return NextResponse.json(withAsOf(reps));
    }
  }

  try {
    if (provider === "deepseek") {
      const apiKey = process.env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        return NextResponse.json(withAsOf(fallbackAnswer(question)));
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
                "You are a nonpartisan civic assistant. Return strict JSON: { answer: string, citations: [{title:string,url:string}] }. Include 2-4 trustworthy citations. Never state a current officeholder unless the provided context explicitly confirms it.",
            },
            {
              role: "user",
              content: `Question: ${question}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        return NextResponse.json(withAsOf(fallbackAnswer(question)));
      }

      const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const text = data.choices?.[0]?.message?.content;
      if (!text) {
        return NextResponse.json(withAsOf(fallbackAnswer(question)));
      }

      const modelResult = JSON.parse(extractJson(text)) as AssistantResult;
      return NextResponse.json(withAsOf(modelResult));
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(withAsOf(fallbackAnswer(question)));
    }

    const prompt =
      "You are a nonpartisan civic assistant. Return strict JSON with this shape: " +
      '{"answer":"...","citations":[{"title":"...","url":"https://..."}]} ' +
      `Current server timestamp: ${new Date().toISOString()}. ` +
      "Include 2-4 citations from credible civic sources (.gov, Congress.gov, GovTrack, CBO, Reuters, AP). Never claim current officeholders unless directly verified in the answer with live source context. If a fact is not verified, explicitly say it is unverified." +
      `\nQuestion: ${question}`;

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
      return NextResponse.json(withAsOf(fallbackAnswer(question)));
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return NextResponse.json(withAsOf(fallbackAnswer(question)));
    }

    const modelResult = JSON.parse(extractJson(text)) as AssistantResult;
    return NextResponse.json(withAsOf(modelResult));
  } catch {
    return NextResponse.json(withAsOf(fallbackAnswer(question)));
  }
}
