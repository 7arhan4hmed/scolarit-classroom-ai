import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { WelcomeOnboarding } from '@/components/dashboard/WelcomeOnboarding';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [assignmentCount, setAssignmentCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  useEffect(() => {
    if (searchParams.get('uploaded') === '1') {
      toast.success('Assignment uploaded successfully', {
        description: 'It now appears in your recent activity.',
      });
      searchParams.delete('uploaded');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const loadDashboard = async () => {
    try {
      const [{ data: profileData }, { count }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user?.id).single(),
        supabase
          .from('assignments')
          .select('id', { count: 'exact', head: true })
          .eq('teacher_id', user!.id),
      ]);
      if (profileData) setProfile(profileData);
      setAssignmentCount(count ?? 0);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setAssignmentCount(0);
    } finally {
      setLoading(false);
    }
  };

  const firstName = profile?.full_name?.split(' ')[0];
  const isFirstTime = !loading && assignmentCount === 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl space-y-10">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          ) : isFirstTime ? (
            <>
              <WelcomeOnboarding userName={firstName} />

              {profile && !profile.bio && (
                <Alert className="border-yellow-500/40 bg-yellow-50 dark:bg-yellow-950/30">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                  <AlertTitle className="text-yellow-700 dark:text-yellow-400">
                    Complete your profile
                  </AlertTitle>
                  <AlertDescription className="text-yellow-700/90 dark:text-yellow-500/90">
                    Add a bio to personalize your AI feedback style.
                    <div className="mt-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-yellow-500/60 text-yellow-700 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900"
                      >
                        <Link to="/profile-setup">Complete Profile</Link>
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </>
          ) : (
            <>
              {/* Welcome */}
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Welcome back{firstName ? `, ${firstName}` : ''} 👋
                </h1>
                <p className="text-muted-foreground text-lg">
                  Here's what's happening with your assignments today.
                </p>
              </div>

              {profile && !profile.bio && (
                <Alert className="border-yellow-500/40 bg-yellow-50 dark:bg-yellow-950/30">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                  <AlertTitle className="text-yellow-700 dark:text-yellow-400">
                    Complete your profile
                  </AlertTitle>
                  <AlertDescription className="text-yellow-700/90 dark:text-yellow-500/90">
                    Complete your profile to unlock all features.
                    <div className="mt-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-yellow-500/60 text-yellow-700 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900"
                      >
                        <Link to="/profile-setup">Complete Profile</Link>
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Quick Actions */}
              <section className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Quick Actions</h2>
                  <p className="text-sm text-muted-foreground">Jump straight into your workflow.</p>
                </div>
                <QuickActions />
              </section>

              {/* Stats */}
              <section className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Your Statistics</h2>
                  <p className="text-sm text-muted-foreground">Insights from your grading activity.</p>
                </div>
                <DashboardStats />
              </section>

              {/* Recent Activity */}
              <section>
                <RecentActivity />
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
