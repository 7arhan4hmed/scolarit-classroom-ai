import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const RUBRIC_DESCRIPTIONS: Record<string, string> = {
  "00000000-0000-0000-0000-000000000001":
    "Essay Grading: Thesis & Argument (25%), Evidence & Support (25%), Organization (20%), Grammar & Style (20%), Citations (10%)",
  "00000000-0000-0000-0000-000000000002":
    "Research Paper: Research Quality (30%), Analysis (25%), Structure (20%), Writing Quality (15%), References (10%)",
  "00000000-0000-0000-0000-000000000003":
    "Creative Writing: Creativity (30%), Voice & Tone (25%), Plot/Structure (20%), Character Development (15%), Technical Skill (10%)",
  "00000000-0000-0000-0000-000000000004":
    "Technical Report: Technical Accuracy (30%), Clarity (25%), Completeness (20%), Format (15%), Visuals (10%)",
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
    const { assignmentText, assignmentTitle, rubricId } = await req.json();

    const content = (assignmentText || "").trim();
    if (content.length < 10) {
      return json(
        { error: "Assignment content is required (extracted text was empty)." },
        400,
      );
    }

    if (!LOVABLE_API_KEY) {
      return json({ error: "AI service is not configured" }, 500);
    }

    const rubricContext = rubricId && RUBRIC_DESCRIPTIONS[rubricId]
      ? RUBRIC_DESCRIPTIONS[rubricId]
      : "Standard academic grading criteria";

    const systemPrompt =
      `You are an expert educational grader. Grade the student assignment using the rubric below and respond ONLY by calling the submit_grading function. Be honest, specific and constructive.\n\nRubric: ${rubricContext}`;

    const userPrompt =
      `Title: ${assignmentTitle || "Untitled Assignment"}\n\nAssignment content:\n${content.substring(0, 15000)}`;

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
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "submit_grading",
                description:
                  "Submit the structured grading result for the student's assignment.",
                parameters: {
                  type: "object",
                  properties: {
                    grade: {
                      type: "string",
                      enum: [
                        "A+", "A", "A-", "B+", "B", "B-",
                        "C+", "C", "C-", "D+", "D", "D-", "F",
                      ],
                    },
                    score: {
                      type: "number",
                      description: "Overall score 0-100",
                    },
                    summary: {
                      type: "string",
                      description: "1-2 sentence overall feedback summary",
                    },
                    criteria: {
                      type: "object",
                      properties: {
                        structure: { type: "number" },
                        clarity: { type: "number" },
                        grammar: { type: "number" },
                        evidence: { type: "number" },
                      },
                      required: ["structure", "clarity", "grammar", "evidence"],
                      additionalProperties: false,
                    },
                    strengths: {
                      type: "array",
                      items: { type: "string" },
                      minItems: 2,
                      maxItems: 5,
                    },
                    improvements: {
                      type: "array",
                      items: { type: "string" },
                      minItems: 2,
                      maxItems: 5,
                    },
                    suggestions: {
                      type: "array",
                      items: { type: "string" },
                      minItems: 2,
                      maxItems: 5,
                    },
                  },
                  required: [
                    "grade",
                    "score",
                    "summary",
                    "criteria",
                    "strengths",
                    "improvements",
                    "suggestions",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "submit_grading" },
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      if (response.status === 429) {
        return json(
          { error: "Rate limit exceeded. Please try again shortly." },
          429,
        );
      }
      if (response.status === 402) {
        return json(
          { error: "AI credits exhausted. Please add credits to continue." },
          402,
        );
      }
      return json({ error: "Failed to generate feedback" }, 500);
    }

    const data = await response.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in AI response:", JSON.stringify(data));
      return json({ error: "AI returned an invalid response" }, 502);
    }

    let parsed: any;
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch (e) {
      console.error("Failed to parse tool args:", toolCall.function.arguments);
      return json({ error: "AI returned malformed JSON" }, 502);
    }

    // Normalize / clamp
    const clamp = (n: any) => {
      const v = Number(n);
      if (!Number.isFinite(v)) return 0;
      return Math.max(0, Math.min(100, Math.round(v)));
    };

    const result = {
      grade: String(parsed.grade || "B"),
      score: clamp(parsed.score),
      summary: String(parsed.summary || ""),
      criteria: {
        structure: clamp(parsed.criteria?.structure),
        clarity: clamp(parsed.criteria?.clarity),
        grammar: clamp(parsed.criteria?.grammar),
        evidence: clamp(parsed.criteria?.evidence),
      },
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 5) : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 5) : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 5) : [],
    };

    console.log(`Graded "${assignmentTitle}": ${result.grade} (${result.score})`);
    return json(result);
  } catch (error) {
    console.error("Error in generate-ai-feedback function:", error);
    return json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500,
    );
  }
});
