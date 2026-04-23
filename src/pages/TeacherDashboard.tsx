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
    { label: 'Total Submissions', value: stats.totalSubmissions, icon: FileText },
    { label: 'Average Score', value: `${stats.averageScore}%`, icon: TrendingUp },
    { label: 'Total Students', value: stats.totalStudents, icon: Users },
    { label: 'Recent (7 days)', value: stats.recentCount, icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Teacher Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Review submissions, scores, and class performance.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((c) => (
              <Card key={c.label}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{c.label}</p>
                      {loading ? (
                        <Skeleton className="h-7 w-16 mt-2" />
                      ) : (
                        <p className="text-2xl font-bold mt-1">{c.value}</p>
                      )}
                    </div>
                    <c.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Average Score Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {scoreTrend.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-12 text-center">
                    No scored submissions yet.
                  </p>
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
                      />
                    </LineChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {gradeDistribution.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-12 text-center">
                    No grades yet.
                  </p>
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
                      <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Submissions */}
          <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Student Submissions</h2>
                <p className="text-sm text-muted-foreground">
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
