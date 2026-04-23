import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface TeacherSubmission {
  assignment_id: string;
  result_id: string | null;
  title: string;
  student_name: string;
  student_id: string | null;
  score: number | null;
  grade: string | null;
  created_at: string;
  summary: string | null;
}

export interface TeacherStats {
  totalSubmissions: number;
  averageScore: number;
  totalStudents: number;
  recentCount: number;
}

export interface GradeDistribution {
  grade: string;
  count: number;
}

export interface ScoreTrendPoint {
  date: string;
  score: number;
}

export function useTeacherData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<TeacherSubmission[]>([]);
  const [stats, setStats] = useState<TeacherStats>({
    totalSubmissions: 0,
    averageScore: 0,
    totalStudents: 0,
    recentCount: 0,
  });
  const [gradeDistribution, setGradeDistribution] = useState<GradeDistribution[]>([]);
  const [scoreTrend, setScoreTrend] = useState<ScoreTrendPoint[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch assignments owned by this teacher
      const { data: assignments, error: aErr } = await supabase
        .from('assignments')
        .select('id, title, student_name, user_id, created_at, grade, status')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      if (aErr) throw aErr;

      const assignmentIds = (assignments ?? []).map((a) => a.id);

      // Fetch results for those assignments
      let results: any[] = [];
      if (assignmentIds.length > 0) {
        const { data: resData, error: rErr } = await supabase
          .from('results')
          .select('id, assignment_id, score, grade, summary, created_at')
          .in('assignment_id', assignmentIds);
        if (rErr) throw rErr;
        results = resData ?? [];
      }

      // Fetch profiles for any linked student user_ids
      const studentIds = Array.from(
        new Set((assignments ?? []).map((a) => a.user_id).filter(Boolean) as string[])
      );
      let profilesMap: Record<string, string> = {};
      if (studentIds.length > 0) {
        const { data: profs } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', studentIds);
        (profs ?? []).forEach((p) => {
          profilesMap[p.id] = p.full_name;
        });
      }

      const resultByAssignment = new Map<string, any>();
      results.forEach((r) => resultByAssignment.set(r.assignment_id, r));

      const subs: TeacherSubmission[] = (assignments ?? []).map((a) => {
        const r = resultByAssignment.get(a.id);
        const studentName =
          a.student_name ||
          (a.user_id ? profilesMap[a.user_id] : null) ||
          'Unknown student';
        return {
          assignment_id: a.id,
          result_id: r?.id ?? null,
          title: a.title,
          student_name: studentName,
          student_id: a.user_id,
          score: r?.score ?? (a.grade != null ? Number(a.grade) : null),
          grade: r?.grade ?? null,
          created_at: a.created_at,
          summary: r?.summary ?? null,
        };
      });

      // Stats
      const scored = subs.filter((s) => typeof s.score === 'number' && !Number.isNaN(s.score));
      const avg =
        scored.length > 0
          ? scored.reduce((sum, s) => sum + (s.score as number), 0) / scored.length
          : 0;
      const studentSet = new Set(
        subs.map((s) => s.student_id || s.student_name).filter(Boolean)
      );
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const recentCount = subs.filter(
        (s) => new Date(s.created_at).getTime() >= sevenDaysAgo
      ).length;

      setStats({
        totalSubmissions: subs.length,
        averageScore: Math.round(avg),
        totalStudents: studentSet.size,
        recentCount,
      });

      // Grade distribution
      const dist = new Map<string, number>();
      subs.forEach((s) => {
        const g = (s.grade || inferGrade(s.score)) ?? 'N/A';
        dist.set(g, (dist.get(g) ?? 0) + 1);
      });
      setGradeDistribution(
        Array.from(dist.entries())
          .map(([grade, count]) => ({ grade, count }))
          .sort((a, b) => a.grade.localeCompare(b.grade))
      );

      // Score trend (chronological)
      const trend = [...subs]
        .filter((s) => typeof s.score === 'number')
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map((s) => ({
          date: new Date(s.created_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          }),
          score: s.score as number,
        }));
      setScoreTrend(trend);

      setSubmissions(subs);
    } catch (e: any) {
      console.error('useTeacherData error:', e);
      setError(e.message ?? 'Failed to load teacher data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    loading,
    error,
    submissions,
    stats,
    gradeDistribution,
    scoreTrend,
    refresh: load,
  };
}

function inferGrade(score: number | null | undefined): string | null {
  if (score == null || Number.isNaN(score)) return null;
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}
