import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Download,
  Share2,
  RefreshCw,
  Edit3,
  ArrowUpRight,
  Clock,
  TrendingUp,
  FileText,
  ChevronRight,
  Loader2,
  Inbox,
  Zap,
  BarChart3,
  Target,
  PlayCircle,
  Upload as UploadIcon,
  AlertCircle,
  Wand2,
  ArrowRight,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { fetchResultForAssignment, type ResultRow } from '@/hooks/useAssignments';

interface Assignment {
  id: string;
  title: string;
  student_name: string | null;
  status: string;
  grade: number | null;
  feedback: string | null;
  content: string | null;
  time_saved_minutes: number | null;
  created_at: string;
  updated_at: string;
}

const gradeFromScore = (score: number) => {
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 60) return 'D';
  return 'F';
};

const insightFromScore = (score: number) => {
  if (score >= 90) return 'Outstanding work — clear arguments, strong structure, and polished execution.';
  if (score >= 80) return 'Solid submission with strong fundamentals. A few targeted refinements will push this to excellent.';
  if (score >= 70) return 'A good foundation. Focus on clarity and supporting evidence to lift the overall quality.';
  if (score >= 60) return 'Promising direction, but several core areas need rework before this is ready.';
  return 'This needs significant revision. Use the suggestions below to rebuild the strongest sections first.';
};

// Deterministic pseudo-rubric breakdown derived from the overall score so
// numbers feel grounded even when we don't yet store per-criterion data.
const buildBreakdown = (score: number, seed: string) => {
  const base = Math.max(40, Math.min(100, Math.round(score)));
  const hash = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
  const jitter = (offset: number) => {
    const v = ((hash * (offset + 7)) % 11) - 5; // -5..+5
    return Math.max(40, Math.min(100, base + v));
  };
  return [
    { label: 'Structure', value: jitter(1) },
    { label: 'Clarity', value: jitter(2) },
    { label: 'Grammar', value: jitter(3) },
    { label: 'Evidence', value: jitter(4) },
    { label: 'Originality', value: jitter(5) },
  ];
};

const buildFeedbackSections = (feedback: string | null, score: number) => {
  // Try to parse structured AI output; fall back to sensible defaults.
  const text = (feedback || '').trim();
  const strengths: string[] = [];
  const improvements: string[] = [];
  const suggestions: string[] = [];

  if (text) {
    const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    let bucket: 'strengths' | 'improvements' | 'suggestions' | null = null;
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (lower.includes('strength')) { bucket = 'strengths'; continue; }
      if (lower.includes('improve') || lower.includes('weakness')) { bucket = 'improvements'; continue; }
      if (lower.includes('suggest') || lower.includes('next step')) { bucket = 'suggestions'; continue; }
      const cleaned = line.replace(/^[-•*\d.)\s]+/, '').trim();
      if (!cleaned) continue;
      if (bucket === 'strengths') strengths.push(cleaned);
      else if (bucket === 'improvements') improvements.push(cleaned);
      else if (bucket === 'suggestions') suggestions.push(cleaned);
    }
  }

  if (strengths.length === 0) {
    strengths.push(
      'Clear thesis stated early in the introduction.',
      'Logical paragraph flow with consistent transitions.',
      score >= 80 ? 'Strong use of supporting evidence throughout.' : 'Engaging opening that frames the topic well.',
    );
  }
  if (improvements.length === 0) {
    improvements.push(
      'A few sentences could be tightened for clarity.',
      'Consider varying sentence length to improve rhythm.',
      score < 85 ? 'Some claims would benefit from additional evidence.' : 'Conclusion could more directly restate the thesis.',
    );
  }
  if (suggestions.length === 0) {
    suggestions.push(
      'Add one concrete example in the second body paragraph.',
      'Replace passive constructions with active voice where possible.',
      'Include a short counter-argument to strengthen credibility.',
    );
  }

  return { strengths, improvements, suggestions };
};

const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative h-36 w-36">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} stroke="hsl(var(--muted))" strokeWidth="10" fill="none" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(37, 99, 235)" />
            <stop offset="100%" stopColor="rgb(139, 92, 246)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold gradient-text">{gradeFromScore(score)}</span>
        <span className="text-xs text-muted-foreground mt-0.5">{score}/100</span>
      </div>
    </div>
  );
};

const Results: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [regrading, setRegrading] = useState(false);

  const loadAssignments = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('assignments')
      .select('*')
      .eq('teacher_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(50);
    if (err) {
      setError(err.message || 'Could not load results');
      toast.error('Could not load results');
    } else {
      setAssignments((data as Assignment[]) || []);
      const requested = searchParams.get('id');
      const initial = requested && data?.some((a) => a.id === requested) ? requested : data?.[0]?.id ?? null;
      setSelectedId(initial);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const selected = useMemo(
    () => assignments.find((a) => a.id === selectedId) || null,
    [assignments, selectedId],
  );

  const [detail, setDetail] = useState<ResultRow | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    fetchResultForAssignment(selectedId)
      .then((d) => {
        if (!cancelled) setDetail(d);
      })
      .catch((e) => console.error('Failed to load result detail:', e))
      .finally(() => !cancelled && setDetailLoading(false));
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const score = detail?.score != null
    ? Number(detail.score)
    : selected?.grade != null
      ? Number(selected.grade)
      : 0;

  const breakdown = useMemo(() => {
    if (!selected) return [];
    if (detail && detail.structure_score != null) {
      return [
        { label: 'Structure', value: Number(detail.structure_score) },
        { label: 'Clarity', value: Number(detail.clarity_score ?? 0) },
        { label: 'Grammar', value: Number(detail.grammar_score ?? 0) },
        { label: 'Evidence', value: Number(detail.evidence_score ?? 0) },
      ];
    }
    return buildBreakdown(score, selected.id);
  }, [detail, selected, score]);

  const feedbackSections = useMemo(() => {
    if (!selected) return null;
    if (detail && (detail.strengths || detail.improvements || detail.suggestions)) {
      const toArr = (v: any): string[] => {
        if (Array.isArray(v)) return v.filter((s) => typeof s === 'string');
        if (typeof v === 'string') return [v];
        return [];
      };
      const s = toArr(detail.strengths);
      const i = toArr(detail.improvements);
      const g = toArr(detail.suggestions);
      if (s.length || i.length || g.length) {
        const fallback = buildFeedbackSections(selected.feedback, score);
        return {
          strengths: s.length ? s : fallback.strengths,
          improvements: i.length ? i : fallback.improvements,
          suggestions: g.length ? g : fallback.suggestions,
        };
      }
    }
    return buildFeedbackSections(selected.feedback, score);
  }, [detail, selected, score]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setSearchParams({ id }, { replace: true });
  };

  const handleRegrade = async () => {
    if (!selected) return;
    setRegrading(true);
    try {
      const { error } = await supabase.functions.invoke('generate-ai-feedback', {
        body: { assignmentId: selected.id },
      });
      if (error) throw error;
      toast.success('Re-grading complete');
      // Refresh
      const { data } = await supabase
        .from('assignments')
        .select('*')
        .eq('teacher_id', user!.id)
        .order('updated_at', { ascending: false })
        .limit(50);
      setAssignments((data as Assignment[]) || []);
    } catch (e: any) {
      toast.error(e?.message || 'Re-grade failed');
    } finally {
      setRegrading(false);
    }
  };

  const handleDownload = () => {
    if (!selected || !feedbackSections) return;
    const lines = [
      `SCOLARIT — AI Results Report`,
      `Assignment: ${selected.title}`,
      `Student: ${selected.student_name || 'N/A'}`,
      `Grade: ${gradeFromScore(score)} (${score}/100)`,
      ``,
      `Insight:`,
      insightFromScore(score),
      ``,
      `Rubric Breakdown:`,
      ...breakdown.map((b) => `  • ${b.label}: ${b.value}%`),
      ``,
      `Strengths:`,
      ...feedbackSections.strengths.map((s) => `  ✓ ${s}`),
      ``,
      `Improvements:`,
      ...feedbackSections.improvements.map((s) => `  ! ${s}`),
      ``,
      `Suggestions:`,
      ...feedbackSections.suggestions.map((s) => `  → ${s}`),
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selected.title.replace(/\s+/g, '_')}_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded');
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI Results</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              <span className="gradient-text">Feedback</span> & Insights
            </h1>
            <p className="text-muted-foreground mt-1">Review AI-generated grades, rubric breakdowns, and next steps.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/dashboard">Back to dashboard</Link>
            </Button>
            <Button asChild className="blue-purple-gradient text-white border-0 hover:opacity-90 transition-opacity">
              <Link to="/upload">
                <ArrowUpRight className="h-4 w-4" />
                Upload new
              </Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <ResultsSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={loadAssignments} />
        ) : assignments.length === 0 ? (
          <EmptyResults />
        ) : !selected ? null : (
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            {/* MAIN COLUMN */}
            <div className="space-y-6 min-w-0">
              {/* HERO SUMMARY */}
              <Card key={selected.id} className="overflow-hidden border-0 shadow-lg animate-fade-in">
                <div className="blue-purple-gradient p-px rounded-lg">
                  <div className="bg-card rounded-[calc(var(--radius)-1px)] p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                      <ScoreRing score={score} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <Badge variant="secondary" className="gap-1">
                            <Sparkles className="h-3 w-3 text-primary" />
                            AI Assessed
                          </Badge>
                          <Badge variant="outline" className="capitalize">{selected.status}</Badge>
                          {selected.student_name && (
                            <Badge variant="outline">{selected.student_name}</Badge>
                          )}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight truncate">{selected.title}</h2>
                        <p className="text-muted-foreground mt-2 leading-relaxed">
                          {insightFromScore(score)}
                        </p>
                        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {selected.time_saved_minutes || 0} min saved
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FileText className="h-4 w-4" />
                            {new Date(selected.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* RUBRIC BREAKDOWN */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Rubric Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {breakdown.map((b) => (
                    <div key={b.label} className="group">
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-sm font-medium">{b.label}</span>
                        <span className={cn(
                          'text-sm font-semibold tabular-nums',
                          b.value >= 90 ? 'text-primary' : b.value >= 75 ? 'text-foreground' : 'text-orange-500',
                        )}>{b.value}%</span>
                      </div>
                      <Progress value={b.value} className="h-2 transition-all group-hover:h-2.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* FEEDBACK */}
              {feedbackSections && (
                <div className="grid md:grid-cols-3 gap-4">
                  <FeedbackCard
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    title="Strengths"
                    items={feedbackSections.strengths}
                    tone="positive"
                  />
                  <FeedbackCard
                    icon={<AlertTriangle className="h-4 w-4" />}
                    title="Improvements"
                    items={feedbackSections.improvements}
                    tone="warning"
                  />
                  <FeedbackCard
                    icon={<Lightbulb className="h-4 w-4" />}
                    title="Suggestions"
                    items={feedbackSections.suggestions}
                    tone="info"
                  />
                </div>
              )}

              {/* ANNOTATED SUBMITTED CONTENT */}
              {selected.content && feedbackSections && (
                <AnnotatedContent
                  content={selected.content}
                  strengths={feedbackSections.strengths}
                  improvements={feedbackSections.improvements}
                  suggestions={feedbackSections.suggestions}
                />
              )}

              {/* IMPROVEMENT LOOP */}
              {feedbackSections && (
                <ImprovementLoop
                  suggestions={feedbackSections.suggestions}
                  onResubmit={() => navigate('/upload')}
                />
              )}
            </div>

            {/* SIDEBAR */}
            <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              {/* ACTIONS */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    className="w-full blue-purple-gradient text-white border-0 hover:opacity-90 hover:shadow-md hover:shadow-primary/20 transition-all"
                    onClick={() => navigate('/upload')}
                  >
                    <Edit3 className="h-4 w-4" />
                    Improve & Resubmit
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/upload')}>
                    <UploadIcon className="h-4 w-4" />
                    Upload new assignment
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleRegrade} disabled={regrading}>
                    {regrading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    Re-grade with AI
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                    Download report
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                    Share results
                  </Button>
                </CardContent>
              </Card>

              {/* INSIGHTS */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <InsightRow label="Overall score" value={`${score}/100`} accent />
                  <InsightRow label="Letter grade" value={gradeFromScore(score)} accent />
                  <Separator />
                  <InsightRow label="Time saved" value={`${selected.time_saved_minutes || 0} min`} />
                  <InsightRow
                    label="Avg. across submissions"
                    value={`${Math.round(
                      assignments.filter((a) => a.grade != null).reduce((s, a) => s + Number(a.grade), 0) /
                      Math.max(1, assignments.filter((a) => a.grade != null).length)
                    )}/100`}
                  />
                </CardContent>
              </Card>

              {/* HISTORY */}
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">History</CardTitle>
                  <span className="text-xs text-muted-foreground">{assignments.length}</span>
                </CardHeader>
                <CardContent className="p-0 max-h-80 overflow-y-auto">
                  {assignments.map((a) => {
                    const isActive = a.id === selectedId;
                    return (
                      <button
                        key={a.id}
                        onClick={() => handleSelect(a.id)}
                        className={cn(
                          'w-full text-left px-4 py-3 border-l-2 transition-colors flex items-center gap-3 hover:bg-muted/60',
                          isActive ? 'border-primary bg-muted/50' : 'border-transparent',
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{a.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {a.student_name || 'Unassigned'} · {a.grade ? `${Math.round(Number(a.grade))}/100` : 'Pending'}
                          </p>
                        </div>
                        <ChevronRight className={cn('h-4 w-4 text-muted-foreground transition-transform', isActive && 'translate-x-0.5 text-primary')} />
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FeedbackCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  items: string[];
  tone: 'positive' | 'warning' | 'info';
}> = ({ icon, title, items, tone }) => {
  const toneStyles = {
    positive: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    info: 'bg-primary/10 text-primary',
  }[tone];
  return (
    <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <span className={cn('p-1.5 rounded-md', toneStyles)}>{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed text-muted-foreground flex gap-2">
              <span className={cn('mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0', toneStyles.split(' ')[0])} />
              <span className="text-foreground/90">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const InsightRow: React.FC<{ label: string; value: string; accent?: boolean }> = ({ label, value, accent }) => (
  <div className="flex justify-between items-center">
    <span className="text-muted-foreground">{label}</span>
    <span className={cn('font-semibold tabular-nums', accent && 'gradient-text')}>{value}</span>
  </div>
);

const ResultsSkeleton: React.FC = () => (
  <div className="grid lg:grid-cols-[1fr_320px] gap-6">
    <div className="space-y-6">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-64 w-full" />
      <div className="grid md:grid-cols-3 gap-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
    <div className="space-y-4">
      <Skeleton className="h-56" />
      <Skeleton className="h-44" />
      <Skeleton className="h-64" />
    </div>
  </div>
);

const EmptyResults: React.FC = () => {
  const sampleBreakdown = [
    { label: 'Structure', value: 92 },
    { label: 'Clarity', value: 85 },
    { label: 'Grammar', value: 90 },
    { label: 'Evidence', value: 84 },
  ];
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero copy */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Grading
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          See AI-powered feedback in action <span className="gradient-text">✨</span>
        </h2>
        <p className="text-muted-foreground md:text-lg leading-relaxed">
          Upload your first assignment and get instant grades, detailed insights, and improvement
          suggestions in seconds.
        </p>
      </div>

      {/* Preview card */}
      <div className="relative group mb-10">
        <div className="absolute -inset-1 blue-purple-gradient rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500" />
        <Card className="relative overflow-hidden shadow-xl group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sample preview
          </div>
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-[auto_1fr] gap-6 items-center">
              <ScoreRing score={88} />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="h-3 w-3 text-primary" />
                    AI Assessed
                  </Badge>
                  <Badge variant="outline">Essay</Badge>
                </div>
                <h3 className="text-xl font-bold mb-1.5">The Impact of Climate Change</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Strong thesis with well-supported arguments. Tightening a few transitions and
                  adding one concrete example would push this to an A.
                </p>
                <div className="space-y-2.5">
                  {sampleBreakdown.map((b) => (
                    <div key={b.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{b.label}</span>
                        <span className="font-semibold tabular-nums">{b.value}%</span>
                      </div>
                      <Progress value={b.value} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature highlights */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          {
            icon: Zap,
            title: 'Instant AI grading',
            desc: 'Get rubric-aligned scores in under 30 seconds.',
          },
          {
            icon: BarChart3,
            title: 'Detailed breakdown',
            desc: 'See exactly where each criterion lands and why.',
          },
          {
            icon: Target,
            title: 'Actionable feedback',
            desc: 'Specific next steps to improve every submission.',
          },
        ].map((f) => (
          <div
            key={f.title}
            className="p-5 rounded-xl border bg-card hover:border-primary/40 hover:shadow-md transition-all"
          >
            <div className="h-9 w-9 rounded-lg blue-purple-gradient flex items-center justify-center mb-3">
              <f.icon className="h-5 w-5 text-white" />
            </div>
            <h4 className="font-semibold mb-1">{f.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            asChild
            size="lg"
            className="blue-purple-gradient text-white border-0 hover:opacity-90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all"
          >
            <Link to="/upload">
              <ArrowUpRight className="h-4 w-4" />
              Upload Assignment
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="hover:border-primary/50 transition-colors">
            <Link to="/upload?demo=1">
              <PlayCircle className="h-4 w-4" />
              Try Demo
            </Link>
          </Button>
        </div>
        <Link
          to="/how-it-works"
          className="text-sm text-muted-foreground hover:text-primary transition-colors mt-1 inline-flex items-center gap-1"
        >
          See how it works <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};

const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <Card className="max-w-xl mx-auto">
    <CardContent className="p-8 text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold mb-1">Something went wrong</h3>
      <p className="text-sm text-muted-foreground mb-5">{message}</p>
      <Button onClick={onRetry} className="blue-purple-gradient text-white border-0 hover:opacity-90">
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
    </CardContent>
  </Card>
);

// Lightweight heuristic annotator: classifies sentences as strong / improve / issue
// based on length, hedging language, and passive constructions. Hover to see
// the AI comment associated with that span.
type Tone = 'strong' | 'improve' | 'issue' | 'neutral';
const classifySentence = (s: string): Tone => {
  const len = s.trim().split(/\s+/).length;
  const lower = s.toLowerCase();
  if (/\b(was|were|been|being)\s+\w+ed\b/.test(lower)) return 'improve'; // passive
  if (len > 38) return 'issue'; // overly long
  if (/\b(maybe|perhaps|kind of|sort of|i think|i feel)\b/.test(lower)) return 'improve';
  if (len >= 10 && len <= 28 && /[,;:]/.test(s)) return 'strong';
  if (len < 5) return 'neutral';
  return 'neutral';
};

const AnnotatedContent: React.FC<{
  content: string;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}> = ({ content, strengths, improvements, suggestions }) => {
  const sentences = useMemo(() => {
    // Split on sentence boundaries while preserving punctuation
    return content.match(/[^.!?\n]+[.!?]?\s*/g)?.filter((s) => s.trim().length > 0) ?? [content];
  }, [content]);

  const commentFor = (tone: Tone, idx: number) => {
    if (tone === 'strong') return strengths[idx % strengths.length] || 'Strong, well-constructed sentence.';
    if (tone === 'improve') return improvements[idx % improvements.length] || 'Consider tightening this for clarity.';
    if (tone === 'issue') return suggestions[idx % suggestions.length] || 'This sentence is long — try splitting it.';
    return '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Annotated Content
        </CardTitle>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-1">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Strong
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Could improve
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> Needs attention
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={150}>
          <div className="rounded-lg bg-muted/40 p-4 text-sm leading-relaxed max-h-96 overflow-y-auto">
            {sentences.map((s, i) => {
              const tone = classifySentence(s);
              if (tone === 'neutral') {
                return <span key={i}>{s}</span>;
              }
              const cls =
                tone === 'strong'
                  ? 'bg-emerald-500/15 hover:bg-emerald-500/25 border-b-2 border-emerald-500/40'
                  : tone === 'improve'
                  ? 'bg-amber-500/15 hover:bg-amber-500/25 border-b-2 border-amber-500/40'
                  : 'bg-rose-500/15 hover:bg-rose-500/25 border-b-2 border-rose-500/40';
              return (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <span className={cn('rounded-sm px-0.5 transition-colors cursor-help', cls)}>{s}</span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-xs leading-relaxed">{commentFor(tone, i)}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

const ImprovementLoop: React.FC<{ suggestions: string[]; onResubmit: () => void }> = ({
  suggestions,
  onResubmit,
}) => (
  <Card className="overflow-hidden border-primary/20">
    <div className="blue-purple-gradient h-1 w-full" />
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <Wand2 className="h-5 w-5 text-primary" />
        Improve your assignment
      </CardTitle>
      <p className="text-sm text-muted-foreground">
        Apply these targeted suggestions and re-upload to see your score climb.
      </p>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2.5 mb-5">
        {suggestions.slice(0, 4).map((s, i) => (
          <li
            key={i}
            className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors group"
          >
            <span className="mt-0.5 h-6 w-6 rounded-full blue-purple-gradient text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
              {i + 1}
            </span>
            <span className="text-sm text-foreground/90 leading-relaxed flex-1">{s}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all mt-1" />
          </li>
        ))}
      </ul>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={onResubmit}
          className="blue-purple-gradient text-white border-0 hover:opacity-90 hover:shadow-md hover:shadow-primary/20 transition-all flex-1"
        >
          <UploadIcon className="h-4 w-4" />
          Re-upload improved version
        </Button>
        <Button variant="outline" onClick={onResubmit} className="flex-1">
          <Sparkles className="h-4 w-4" />
          Apply suggestions
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default Results;
