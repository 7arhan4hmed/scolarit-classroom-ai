import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const FALLBACK = {
  grade: "C",
  score: 60,
  summary: "Fallback",
  criteria: { structure: 60, clarity: 60, grammar: 60, evidence: 60 },
  strengths: [] as string[],
  improvements: [] as string[],
  suggestions: [] as string[],
};

const clamp = (n: unknown, fallback = 60) => {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return fallback;
  return Math.max(1, Math.min(100, Math.round(v)));
};

const letterFromScore = (s: number): string => {
  if (s >= 93) return "A";
  if (s >= 90) return "A-";
  if (s >= 87) return "B+";
  if (s >= 83) return "B";
  if (s >= 80) return "B-";
  if (s >= 77) return "C+";
  if (s >= 73) return "C";
  if (s >= 70) return "C-";
  if (s >= 67) return "D+";
  if (s >= 60) return "D";
  return "F";
};

/** Strip ``` fences, language tags, and trim outside the outer { ... } */
const cleanJson = (raw: string): string => {
  let t = (raw || "").trim();
  // Remove markdown fences ```json ... ``` or ``` ... ```
  t = t.replace(/```(?:json)?/gi, "```");
  t = t.replace(/```/g, "");
  // Trim to outermost {...}
  const first = t.indexOf("{");
  const last = t.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    t = t.slice(first, last + 1);
  }
  return t.trim();
};

const safeArr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim()).slice(0, 5) : [];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assignmentText, assignmentTitle } = await req.json();

    const text = (assignmentText || "").trim();
    if (text.length < 10) {
      return json(
        { error: "Assignment content is required (extracted text was empty)." },
        400,
      );
    }

    if (!LOVABLE_API_KEY) {
      return json({ error: "AI service is not configured" }, 500);
    }

    const prompt = `Return ONLY valid JSON. No text.

{
"grade": "A",
"score": number,
"summary": string,
"criteria": {
"structure": number,
"clarity": number,
"grammar": number,
"evidence": number
},
"strengths": string[],
"improvements": string[],
"suggestions": string[]
}

Title: ${assignmentTitle || "Untitled Assignment"}

Text:
${text.substring(0, 15000)}`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "user", content: prompt }],
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      if (response.status === 429) {
        return json({ error: "Rate limit exceeded. Please try again shortly." }, 429);
      }
      if (response.status === 402) {
        return json({ error: "AI credits exhausted. Please add credits to continue." }, 402);
      }
      return json({ error: "Failed to generate feedback" }, 500);
    }

    const data = await response.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? "";
    const cleaned = cleanJson(raw);

    let parsed: any = null;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("JSON parse failed. Raw:", raw);
      return json(FALLBACK);
    }

    const criteria = {
      structure: clamp(parsed?.criteria?.structure),
      clarity: clamp(parsed?.criteria?.clarity),
      grammar: clamp(parsed?.criteria?.grammar),
      evidence: clamp(parsed?.criteria?.evidence),
    };

    // score = avg(criteria) — always derived so it stays consistent
    const score = Math.round(
      (criteria.structure + criteria.clarity + criteria.grammar + criteria.evidence) / 4,
    );

    const grade = typeof parsed?.grade === "string" && parsed.grade.trim()
      ? parsed.grade.trim()
      : letterFromScore(score);

    const result = {
      grade,
      score,
      summary: typeof parsed?.summary === "string" && parsed.summary.trim()
        ? parsed.summary.trim()
        : "Graded by AI.",
      criteria,
      strengths: safeArr(parsed?.strengths),
      improvements: safeArr(parsed?.improvements),
      suggestions: safeArr(parsed?.suggestions),
    };

    console.log(`Graded "${assignmentTitle}": ${result.grade} (${result.score})`);
    return json(result);
  } catch (error) {
    console.error("Error in generate-ai-feedback function:", error);
    return json(FALLBACK);
  }
});