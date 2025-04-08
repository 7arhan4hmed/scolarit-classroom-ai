
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase environment variables are not set");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
    const openai = new OpenAIApi(configuration);

    const { submissionId, contentType, content } = await req.json();
    
    if (!submissionId || !contentType || !content) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    let prompt = "";
    if (contentType === "text") {
      prompt = `Please assess the following student assignment submission and provide constructive feedback. 
      Also assign a grade (A+, A, B+, B, C+, C, D, or F) based on the quality of the work:
      
      ${content}
      
      Assessment Guidelines:
      1. Evaluate the clarity and structure of the submission
      2. Assess the understanding of core concepts
      3. Check for any factual errors
      4. Suggest specific areas for improvement
      5. Highlight the strengths of the submission
      
      Provide your assessment in the following format:
      Grade: [Letter Grade]
      Feedback: [Detailed feedback with specific points covering strengths and areas for improvement]`;
    } else {
      // For file submissions, we'd need the file content extracted elsewhere
      // This is a simplified version that assumes text has been extracted
      prompt = `Please assess the uploaded student assignment and provide constructive feedback.
      This is a file submission. Assess the content based on the same guidelines as a text submission.`;
    }
    
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 800,
      temperature: 0.7,
    });
    
    const aiResponse = response.data.choices[0].text?.trim() || "";
    
    // Extract grade and feedback
    let grade = "B";  // Default grade
    let feedback = aiResponse;
    
    // Try to extract grade from AI response
    const gradeMatch = aiResponse.match(/Grade:\s*([A-F][+]?)/i);
    if (gradeMatch) {
      grade = gradeMatch[1];
      // Remove the grade line from feedback if found
      feedback = aiResponse.replace(/Grade:\s*([A-F][+]?)/i, "").trim();
    }
    
    // Store AI feedback in database
    const { data: feedbackData, error: feedbackError } = await supabase
      .from("feedback")
      .insert([{
        submission_id: submissionId,
        score: convertGradeToScore(grade),
        feedback_text: feedback,
        is_ai_generated: true
      }])
      .select();
    
    if (feedbackError) {
      throw new Error(`Error storing feedback: ${feedbackError.message}`);
    }
    
    return new Response(
      JSON.stringify({
        grade,
        feedback,
        feedbackId: feedbackData?.[0]?.id
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// Helper function to convert letter grade to numeric score
function convertGradeToScore(grade: string): number {
  const gradeMap: { [key: string]: number } = {
    "A+": 100,
    "A": 95,
    "B+": 89,
    "B": 85,
    "C+": 79,
    "C": 75,
    "D+": 69,
    "D": 65,
    "F": 55
  };
  
  return gradeMap[grade.toUpperCase()] || 75; // Default to C if grade not found
}
