import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

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
    const { assignmentText, assignmentTitle, rubricId, fileData, fileType } = await req.json();

    let contentToAssess = assignmentText || '';

    // If file data is provided, extract text from it
    if (fileData && fileType) {
      console.log(`Processing file type: ${fileType} for assignment: ${assignmentTitle}`);
      
      try {
        // Convert base64 to text for supported text-based files
        const base64Data = fileData.split(',')[1] || fileData;
        
        if (fileType === 'text/plain' || fileType.includes('text')) {
          // Decode base64 text
          contentToAssess = atob(base64Data);
          console.log(`Extracted ${contentToAssess.length} characters from text file`);
        } else if (fileType === 'application/pdf' || fileType.includes('pdf')) {
          // For PDF files, we'll ask the AI to note this limitation
          contentToAssess = assignmentText || '[PDF file uploaded - content extraction pending]';
          console.log('PDF file detected - using text input if available');
        } else if (fileType.includes('word') || fileType.includes('document')) {
          // For Word docs, we'll ask the AI to note this limitation  
          contentToAssess = assignmentText || '[Word document uploaded - content extraction pending]';
          console.log('Word document detected - using text input if available');
        }
      } catch (extractError) {
        console.error('Error processing file:', extractError);
        // Continue with any text input provided
        contentToAssess = assignmentText || '';
      }
    }

    if (!contentToAssess || contentToAssess.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Assignment content is required (text or file)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build rubric context for the prompt
    let rubricContext = '';
    if (rubricId) {
      const rubricDescriptions: { [key: string]: string } = {
        '00000000-0000-0000-0000-000000000001': 'Essay Grading: Focus on Thesis & Argument (25%), Evidence & Support (25%), Organization (20%), Grammar & Style (20%), Citations (10%)',
        '00000000-0000-0000-0000-000000000002': 'Research Paper: Focus on Research Quality (30%), Analysis (25%), Structure (20%), Writing Quality (15%), References (10%)',
        '00000000-0000-0000-0000-000000000003': 'Creative Writing: Focus on Creativity (30%), Voice & Tone (25%), Plot/Structure (20%), Character Development (15%), Technical Skill (10%)',
        '00000000-0000-0000-0000-000000000004': 'Technical Report: Focus on Technical Accuracy (30%), Clarity (25%), Completeness (20%), Format (15%), Visuals (10%)',
      };
      rubricContext = rubricDescriptions[rubricId] || '';
    }

    console.log(`Processing assignment: ${assignmentTitle} with rubric: ${rubricId || 'default'}`);
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an educational assistant that provides constructive feedback on student assignments. 
${rubricContext ? `Use this grading rubric: ${rubricContext}` : 'Use standard academic grading criteria.'}

Provide your response in the following format:
1. Start with the letter grade (A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, or F)
2. Then provide detailed feedback with:
   - At least 3 specific positive points about the work
   - 2-3 constructive suggestions for improvement
   - An overall assessment summary

Be encouraging but honest. Focus on helping the student improve.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Please grade and provide feedback on this assignment:

Title: ${assignmentTitle || 'Untitled Assignment'}

Content:
${contentToAssess.substring(0, 15000)}` // Limit content length
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to generate feedback' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      console.error('Unexpected API response:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to generate feedback' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const feedbackText = data.choices[0].message.content;
    
    // Extract grade using regex - looking for A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, or F
    const gradeMatch = feedbackText.match(/\b([A-D][\+\-]?|F)\b/);
    const grade = gradeMatch ? gradeMatch[0] : 'B';

    console.log(`Generated feedback for ${assignmentTitle}, grade: ${grade}`);

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
