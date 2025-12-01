import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';


const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}
            </h1>
            <p className="text-muted-foreground text-lg">
              Here's what's happening with your assignments today.
            </p>
          </div>

          {/* Profile Incomplete Alert */}
          {profile && !profile.bio && (
            <Alert className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
              <AlertTitle className="text-yellow-700 dark:text-yellow-400">Complete your profile</AlertTitle>
              <AlertDescription className="text-yellow-600 dark:text-yellow-500">
                Your profile is incomplete. Complete your profile to unlock all features.
                <div className="mt-2">
                  <Button asChild variant="outline" size="sm" className="border-yellow-500 text-yellow-700 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900">
                    <Link to="/profile-setup">
                      Complete Profile
                    </Link>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <QuickActions />
          </div>

          {/* Statistics */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Statistics</h2>
            <DashboardStats />
          </div>

          {/* Recent Activity */}
          <div>
            <RecentActivity />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
