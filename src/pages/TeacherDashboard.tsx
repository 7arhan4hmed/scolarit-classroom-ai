import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useTeacherData, type TeacherSubmission } from '@/hooks/useTeacherData';
import { SubmissionTable } from '@/components/SubmissionTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { FileText, GraduationCap, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const TeacherDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [roleChecked, setRoleChecked] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);

  const { loading, submissions, stats, gradeDistribution, scoreTrend } = useTeacherData();

  // Filters
  const [studentFilter, setStudentFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'date_desc' | 'score_desc' | 'score_asc'>(
    'date_desc'
  );

  // Role gating
  useEffect(() => {
    const check = async () => {
      if (authLoading) return;
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();
      if (data?.user_type === 'teacher') {
        setIsTeacher(true);
      } else {
        navigate('/dashboard', { replace: true });
      }
      setRoleChecked(true);
    };
    check();
  }, [user, authLoading, navigate]);

  const studentOptions = useMemo(() => {
    const set = new Set(submissions.map((s) => s.student_name));
    return Array.from(set).sort();
  }, [submissions]);

  const filtered = useMemo(() => {
    let list = [...submissions];
    if (studentFilter !== 'all') list = list.filter((s) => s.student_name === studentFilter);
    if (dateFilter) {
      list = list.filter(
        (s) => new Date(s.created_at).toISOString().slice(0, 10) === dateFilter
      );
    }
    list.sort((a, b) => {
      if (sortOrder === 'score_desc') return (b.score ?? -1) - (a.score ?? -1);
      if (sortOrder === 'score_asc') return (a.score ?? Infinity) - (b.score ?? Infinity);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return list;
  }, [submissions, studentFilter, dateFilter, sortOrder]);

  const handleView = (s: TeacherSubmission) => {
    navigate(`/results?assignment=${s.assignment_id}`);
  };

  if (!roleChecked || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }
  if (!isTeacher) return null;

  const statCards = [
    {
      label: 'Total Submissions',
      value: stats.totalSubmissions,
      icon: FileText,
      gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Average Score',
      value: `${stats.averageScore}%`,
      icon: TrendingUp,
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      gradient: 'from-violet-500/10 via-violet-500/5 to-transparent',
      iconBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    },
    {
      label: 'Latest Activity (7d)',
      value: stats.recentCount,
      icon: GraduationCap,
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl space-y-8">
          <div className="animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Teacher Dashboard
            </h1>
            <p className="text-muted-foreground mt-2 text-base">
              Track student performance and insights.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
            {statCards.map((c, i) => (
              <Card
                key={c.label}
                className={cn(
                  'relative overflow-hidden border bg-gradient-to-br shadow-sm',
                  'transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5',
                  c.gradient
                )}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
                      {loading ? (
                        <Skeleton className="h-8 w-20 mt-2" />
                      ) : (
                        <p className="text-3xl font-bold mt-1 tabular-nums tracking-tight text-foreground">
                          {c.value}
                        </p>
                      )}
                    </div>
                    <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0', c.iconBg)}>
                      <c.icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Average Score Trend</CardTitle>
                <p className="text-xs text-muted-foreground">Daily averages across submissions</p>
              </CardHeader>
              <CardContent className="pt-4">
                {scoreTrend.length === 0 ? (
                  <div className="py-14 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground">No scored submissions yet.</p>
                  </div>
                ) : (
                  <ChartContainer
                    config={{ score: { label: 'Score', color: 'hsl(var(--primary))' } }}
                    className="h-[240px] w-full"
                  >
                    <LineChart data={scoreTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="var(--color-score)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        animationDuration={800}
                      />
                    </LineChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Grade Distribution</CardTitle>
                <p className="text-xs text-muted-foreground">How grades are spread across your class</p>
              </CardHeader>
              <CardContent className="pt-4">
                {gradeDistribution.length === 0 ? (
                  <div className="py-14 text-center">
                    <GraduationCap className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground">No grades yet.</p>
                  </div>
                ) : (
                  <ChartContainer
                    config={{ count: { label: 'Count', color: 'hsl(var(--primary))' } }}
                    className="h-[240px] w-full"
                  >
                    <BarChart data={gradeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grade" tickLine={false} axisLine={false} />
                      <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} animationDuration={800} />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Submissions */}
          <section className="space-y-4 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">Student Submissions</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Click a row to view the detailed result.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={studentFilter} onValueChange={setStudentFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All students</SelectItem>
                    {studentOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-[170px]"
                />
                <Select value={sortOrder} onValueChange={(v: any) => setSortOrder(v)}>
                  <SelectTrigger className="w-[170px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_desc">Newest first</SelectItem>
                    <SelectItem value="score_desc">Score: High → Low</SelectItem>
                    <SelectItem value="score_asc">Score: Low → High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <Skeleton className="h-64 w-full rounded-lg" />
            ) : (
              <SubmissionTable submissions={filtered} onView={handleView} />
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TeacherDashboard;
