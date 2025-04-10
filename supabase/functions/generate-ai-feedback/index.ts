
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assignmentText, assignmentTitle } = await req.json();

    if (!assignmentText || assignmentText.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Assignment text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing assignment: ${assignmentTitle}`);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an educational assistant that provides constructive feedback on student assignments. Provide a letter grade (A, B+, B, C+, C, D, F) and detailed feedback with at least three specific positive points and two suggestions for improvement.' 
          },
          { 
            role: 'user', 
            content: `Assignment title: ${assignmentTitle || 'Untitled Assignment'}\n\nAssignment text: ${assignmentText}` 
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      console.error('Unexpected API response:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to generate feedback', details: data }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const feedbackText = data.choices[0].message.content;
    
    // Extract grade using regex - looking for A, B+, B, C+, C, D, or F patterns
    const gradeMatch = feedbackText.match(/\b([A-D](\+|-)?|F)\b/);
    const grade = gradeMatch ? gradeMatch[0] : 'N/A';

    return new Response(
      JSON.stringify({ 
        feedback: feedbackText,
        grade: grade
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-ai-feedback function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
