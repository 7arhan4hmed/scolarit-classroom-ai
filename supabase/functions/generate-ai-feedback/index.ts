
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @deno-types="npm:@types/pdf-parse"
import pdf from "npm:pdf-parse@1.1.1";
import mammoth from "npm:mammoth@1.6.0";

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
    const { assignmentText, assignmentTitle, fileData, fileType } = await req.json();

    let contentToAssess = assignmentText || '';

    // If file data is provided, extract text from it
    if (fileData && fileType) {
      console.log(`Extracting text from ${fileType} file for: ${assignmentTitle}`);
      
      try {
        // Convert base64 to buffer
        const base64Data = fileData.split(',')[1] || fileData;
        const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        if (fileType === 'application/pdf') {
          // Extract text from PDF
          const pdfData = await pdf(buffer);
          contentToAssess = pdfData.text;
          console.log(`Extracted ${pdfData.text.length} characters from PDF`);
        } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          // Extract text from DOCX
          const result = await mammoth.extractRawText({ buffer });
          contentToAssess = result.value;
          console.log(`Extracted ${result.value.length} characters from DOCX`);
        } else {
          return new Response(
            JSON.stringify({ error: 'Unsupported file type. Please upload PDF or DOCX files.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (extractError) {
        console.error('Error extracting text from file:', extractError);
        return new Response(
          JSON.stringify({ error: 'Failed to extract text from file', details: extractError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (!contentToAssess || contentToAssess.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Assignment content is required (text or file)' }),
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
            content: `Assignment title: ${assignmentTitle || 'Untitled Assignment'}\n\nAssignment text: ${contentToAssess}` 
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
