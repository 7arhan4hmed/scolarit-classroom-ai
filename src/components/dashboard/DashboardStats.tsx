import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Award, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Stats {
  totalAssignments: number;
  averageGrade: number;
  timeSaved: number;
}

export const DashboardStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalAssignments: 0,
    averageGrade: 0,
    timeSaved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: assignments } = await supabase
        .from('assignments')
        .select('grade, time_saved_minutes')
        .eq('teacher_id', user.id);

      if (assignments) {
        const total = assignments.length;
        const gradedAssignments = assignments.filter(a => a.grade !== null);
        const avgGrade = gradedAssignments.length > 0
          ? gradedAssignments.reduce((sum, a) => sum + (a.grade || 0), 0) / gradedAssignments.length
          : 0;
        const totalTime = assignments.reduce((sum, a) => sum + (a.time_saved_minutes || 0), 0);

        setStats({
          totalAssignments: total,
          averageGrade: Math.round(avgGrade * 10) / 10,
          timeSaved: totalTime,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Assignments',
      value: stats.totalAssignments,
      icon: FileText,
      suffix: '',
      color: 'text-primary',
    },
    {
      title: 'Average Grade',
      value: stats.averageGrade,
      icon: Award,
      suffix: '%',
      color: 'text-accent',
    },
    {
      title: 'Time Saved',
      value: Math.round(stats.timeSaved / 60),
      icon: Clock,
      suffix: ' hours',
      color: 'text-secondary',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-8 w-20" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold">
              {stat.value}
              <span className="text-lg text-muted-foreground">{stat.suffix}</span>
            </p>
          </Card>
        );
      })}
    </div>
  );
};
