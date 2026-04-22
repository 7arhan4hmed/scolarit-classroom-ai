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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { originalText, suggestions } = await req.json();
    const text = (originalText || "").trim();

    if (text.length < 10) {
      return json({ error: "Original text is required." }, 400);
    }
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      return json({ error: "At least one suggestion is required." }, 400);
    }
    if (!LOVABLE_API_KEY) {
      return json({ error: "AI service is not configured" }, 500);
    }

    const sugList = suggestions
      .filter((s: unknown) => typeof s === "string" && s.trim())
      .map((s: string, i: number) => `${i + 1}. ${s.trim()}`)
      .join("\n");

    const prompt = `You are an expert writing editor. Rewrite the text below by applying every suggestion. Preserve the author's voice and the overall meaning. Return ONLY the improved text — no preamble, no explanations, no markdown fences.

Suggestions:
${sugList}

Original text:
${text.substring(0, 20000)}`;

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
      return json({ error: "Failed to apply suggestions" }, 500);
    }

    const data = await response.json();
    const improved: string = (data?.choices?.[0]?.message?.content ?? "").trim();

    if (!improved) {
      return json({ error: "AI returned an empty response" }, 502);
    }

    // Strip accidental markdown fences if present
    const cleaned = improved
      .replace(/^```[a-zA-Z]*\n?/g, "")
      .replace(/```\s*$/g, "")
      .trim();

    return json({ improvedText: cleaned });
  } catch (error) {
    console.error("Error in apply-suggestions function:", error);
    return json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
});