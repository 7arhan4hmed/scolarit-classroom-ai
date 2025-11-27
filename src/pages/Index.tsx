import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ProblemsSection from '@/components/ProblemsSection';
import SimpleFeaturesSection from '@/components/SimpleFeaturesSection';
import AIDemoSection from '@/components/AIDemoSection';
import SimpleHowItWorksSection from '@/components/SimpleHowItWorksSection';
import IntegrationsSection from '@/components/IntegrationsSection';
import CtaSection from '@/components/CtaSection';
import LoggedInHome from '@/components/LoggedInHome';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
    } finally {
      setLoading(false);
    }
  };

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
            <ProblemsSection />
            <AIDemoSection />
            <SimpleFeaturesSection />
            <SimpleHowItWorksSection />
            <IntegrationsSection />
            <CtaSection />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
