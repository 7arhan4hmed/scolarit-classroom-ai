import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import SimpleFeaturesSection from '@/components/SimpleFeaturesSection';
import AIDemoSection from '@/components/AIDemoSection';
import SimpleHowItWorksSection from '@/components/SimpleHowItWorksSection';
import IntegrationsSection from '@/components/IntegrationsSection';
import LoggedInHome from '@/components/LoggedInHome';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      fetchProfile(user.id);
    }
  }, [user, loading]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {user ? (
          <LoggedInHome userName={profile?.full_name} />
        ) : (
          <>
            <HeroSection />
            <AIDemoSection />
            <SimpleFeaturesSection />
            <SimpleHowItWorksSection />
            <IntegrationsSection />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
