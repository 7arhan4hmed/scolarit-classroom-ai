import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface AssignmentRow {
  id: string;
  title: string;
  status: string;
  grade: number | null;
  feedback: string | null;
  content: string | null;
  student_name: string | null;
  time_saved_minutes: number | null;
  created_at: string;
  updated_at: string;
}

export interface ResultRow {
  id: string;
  assignment_id: string | null;
  user_id: string | null;
  grade: string | null;
  score: number | null;
  structure_score: number | null;
  clarity_score: number | null;
  grammar_score: number | null;
  evidence_score: number | null;
  summary: string | null;
  strengths: any;
  improvements: any;
  suggestions: any;
  created_at: string | null;
}

export function useAssignments(limit = 50) {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('assignments')
      .select('*')
      .eq('teacher_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(limit);
    if (err) setError(err.message);
    else setAssignments((data as AssignmentRow[]) || []);
    setLoading(false);
  }, [user, limit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { assignments, loading, error, refresh };
}

export async function fetchResultForAssignment(assignmentId: string): Promise<ResultRow | null> {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('assignment_id', assignmentId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as ResultRow | null;
}