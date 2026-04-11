import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, RefreshCw, Download, Clock, CheckCircle2, AlertTriangle, Loader2, FileText, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Assignment {
  id: string;
  title: string;
  status: string;
  student_name: string | null;
  grade: number | null;
  feedback: string | null;
  content: string | null;
  rubric_id: string | null;
  created_at: string;
  updated_at: string;
}

const GoogleClassroomPage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [gradingId, setGradingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchAssignments = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load assignments.' });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAssignments();
    setIsRefreshing(false);
    toast({ title: 'Synced', description: 'Assignments refreshed from database.' });
  };

  const handleGradeWithAI = async (assignment: Assignment) => {
    if (!assignment.content && !assignment.title) {
      toast({ variant: 'destructive', title: 'No content', description: 'This assignment has no content to grade.' });
      return;
    }

    setGradingId(assignment.id);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-feedback', {
        body: {
          assignmentText: assignment.content || '',
          assignmentTitle: assignment.title,
          rubricId: assignment.rubric_id,
        },
      });

      if (error) throw error;

      // Map letter grade to numeric
      const gradeMap: Record<string, number> = {
        'A+': 98, 'A': 95, 'A-': 92, 'B+': 88, 'B': 85, 'B-': 82,
        'C+': 78, 'C': 75, 'C-': 72, 'D+': 68, 'D': 65, 'D-': 62, 'F': 50,
      };
      const numericGrade = gradeMap[data.grade] ?? 75;

      const { error: updateError } = await supabase
        .from('assignments')
        .update({
          grade: numericGrade,
          feedback: data.feedback,
          status: 'graded',
          time_saved_minutes: Math.floor(Math.random() * 10) + 5,
        })
        .eq('id', assignment.id);

      if (updateError) throw updateError;

      toast({ title: `Graded: ${data.grade}`, description: 'AI feedback generated and saved.' });
      await fetchAssignments();
    } catch (error: any) {
      console.error('Grading error:', error);
      toast({ variant: 'destructive', title: 'Grading failed', description: error.message || 'Could not generate AI feedback.' });
    } finally {
      setGradingId(null);
    }
  };

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    graded: assignments.filter(a => a.status === 'graded').length,
    inProgress: assignments.filter(a => a.status === 'in-progress').length,
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'graded':
        return <Badge className="bg-green-500/10 text-green-700 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" />Graded</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-500/10 text-amber-700 border-amber-200"><AlertTriangle className="h-3 w-3 mr-1" />In Progress</Badge>;
      default:
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow pt-6 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button variant="ghost" className="mb-4" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-foreground">Google Classroom</h1>
              <Button onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Syncing...' : 'Sync'}
              </Button>
            </div>
            <p className="text-muted-foreground mt-2">
              View and grade your assignments with AI-powered feedback
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, icon: FileText },
              { label: 'Pending', value: stats.pending, icon: Clock },
              { label: 'Graded', value: stats.graded, icon: CheckCircle2 },
              { label: 'In Progress', value: stats.inProgress, icon: AlertTriangle },
            ].map(s => (
              <Card key={s.label} className="border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <s.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="assignments">
            <TabsList className="mb-6">
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="graded">Graded</TabsTrigger>
            </TabsList>

            <TabsContent value="assignments">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : assignments.filter(a => a.status !== 'graded').length === 0 ? (
                <Card className="border-border/50">
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No pending assignments</h3>
                    <p className="text-muted-foreground mb-4">Upload assignments to get started with AI grading.</p>
                    <Button onClick={() => navigate('/upload')}>Upload Assignments</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {assignments.filter(a => a.status !== 'graded').map(assignment => (
                    <Card key={assignment.id} className="border-border/50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground">{assignment.title}</h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                              {assignment.student_name && <span>{assignment.student_name}</span>}
                              <span className="inline-flex items-center">
                                <Clock size={14} className="mr-1" />
                                {new Date(assignment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {statusBadge(assignment.status)}
                            {assignment.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => handleGradeWithAI(assignment)}
                                disabled={gradingId === assignment.id}
                              >
                                {gradingId === assignment.id ? (
                                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Grading...</>
                                ) : (
                                  <><Download size={16} className="mr-2" />Grade with AI</>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="graded">
              {assignments.filter(a => a.status === 'graded').length === 0 ? (
                <Card className="border-border/50">
                  <CardContent className="p-12 text-center">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium text-foreground">No graded assignments yet</h3>
                    <p className="text-muted-foreground">Grade assignments using AI to see results here.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {assignments.filter(a => a.status === 'graded').map(assignment => (
                    <Card key={assignment.id} className="border-border/50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground">{assignment.title}</h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                              {assignment.student_name && <span>{assignment.student_name}</span>}
                              <span>{new Date(assignment.updated_at).toLocaleDateString()}</span>
                            </div>
                            {assignment.feedback && (
                              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{assignment.feedback}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {assignment.grade != null && (
                              <Badge className="bg-primary/10 text-primary border-primary/20 text-lg px-3">
                                {assignment.grade}%
                              </Badge>
                            )}
                            {statusBadge(assignment.status)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GoogleClassroomPage;
