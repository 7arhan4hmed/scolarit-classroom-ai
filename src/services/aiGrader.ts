import { supabase } from '@/integrations/supabase/client';

export interface AIGradingResult {
  grade: string;
  score: number;
  summary: string;
  criteria: {
    structure: number;
    clarity: number;
    grammar: number;
    evidence: number;
  };
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}

/**
 * Call the generate-ai-feedback edge function with extracted text and a rubric.
 * Always returns a strict structured object.
 */
export async function gradeAssignment(params: {
  assignmentTitle: string;
  assignmentText: string;
  rubricId: string | null;
}): Promise<AIGradingResult> {
  if (!params.assignmentText || params.assignmentText.trim().length < 10) {
    throw new Error('Assignment content is empty. Please add text or upload a readable file.');
  }

  const { data, error } = await supabase.functions.invoke('generate-ai-feedback', {
    body: {
      assignmentTitle: params.assignmentTitle,
      assignmentText: params.assignmentText,
      rubricId: params.rubricId,
    },
  });

  if (error) throw new Error(error.message || 'AI grading failed');
  if (!data || !data.grade || typeof data.score !== 'number') {
    throw new Error('AI returned an invalid response. Please try again.');
  }

  return data as AIGradingResult;
}