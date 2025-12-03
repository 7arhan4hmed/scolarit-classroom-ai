
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import TeacherProfileForm from '@/components/profile/TeacherProfileForm';
import StudentProfileForm from '@/components/profile/StudentProfileForm';
import { Shield, Lock, Database, Loader2 } from 'lucide-react';

const ProfileSetup = () => {
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [maxSteps, setMaxSteps] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign up or login first.",
      });
      navigate('/signup');
      return;
    }
    
    fetchProfile();
  }, [user, authLoading, navigate, toast]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setMaxSteps(data?.user_type === 'teacher' ? 3 : 2);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setInitialLoading(false);
    }
  };
  
  const handleNext = () => {
    if (step < maxSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmit = async () => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      // Log activity
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: 'profile_updated',
        entity_type: 'profile',
        entity_id: user.id,
        metadata: { completed_setup: true }
      });
      
      toast({
        title: "Profile setup complete!",
        description: "You're all set to use SCOLARIT.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Profile setup error:', error);
      toast({
        variant: "destructive",
        title: "Failed to save profile",
        description: "Please try again. If the problem persists, contact support.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const calculateProgress = () => {
    return (step / maxSteps) * 100;
  };
  
  if (authLoading || initialLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!user || !profile) {
    return null;
  }

  const userType = profile.user_type || 'teacher';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold gradient-text">Complete Your Profile</h1>
              <p className="text-gray-600 mt-2">
                {userType === 'teacher' 
                  ? "Help us personalize SCOLARIT for your teaching needs" 
                  : "Tell us more about your learning preferences"}
              </p>
            </div>
            
            <Card className="p-6">
              <div className="mb-8">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span>Step {step} of {maxSteps}</span>
                  <span>{Math.round(calculateProgress())}% Complete</span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </div>
              
              {userType === 'teacher' ? (
                <TeacherProfileForm step={step} />
              ) : (
                <StudentProfileForm step={step} />
              )}
              
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={step === 1 || isLoading}
                >
                  Previous
                </Button>
                
                <Button 
                  onClick={handleNext}
                  disabled={isLoading}
                  className={userType === 'teacher' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-purple-600 hover:bg-purple-500'}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                      <span>Saving...</span>
                    </>
                  ) : step === maxSteps ? 'Complete Profile' : 'Next Step'}
                </Button>
              </div>
            </Card>

            {/* New Supabase security messaging */}
            <div className="mt-8 bg-white p-6 rounded-lg border border-blue-100 shadow-sm">
              <h3 className="text-lg font-medium text-blue-800 mb-3">Powered by Supabase for Enhanced Security</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Secure Authentication</h4>
                    <p className="text-sm text-gray-600">Your login credentials are protected by Supabase's enterprise-grade authentication system.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Lock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Data Privacy</h4>
                    <p className="text-sm text-gray-600">Your personal information and educational data are encrypted and stored securely in Supabase's protected database.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Database className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Reliable Performance</h4>
                    <p className="text-sm text-gray-600">Enjoy seamless profile setup and data management backed by Supabase's reliable infrastructure.</p>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                SCOLARIT is committed to protecting your data. See our <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> for more information.
              </p>
            </div>
            
            <div className="text-center mt-6">
              <Button 
                variant="link" 
                onClick={() => navigate('/dashboard')}
                className="text-gray-500 hover:text-gray-700"
              >
                Skip for now
              </Button>
              <p className="text-xs text-gray-400 mt-1">
                You can complete your profile later from your account settings
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileSetup;
