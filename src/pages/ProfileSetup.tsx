
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import TeacherProfileForm from '@/components/profile/TeacherProfileForm';
import StudentProfileForm from '@/components/profile/StudentProfileForm';
import { supabase } from '@/integrations/supabase/client';

const ProfileSetup = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState({});
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const userType = profile?.user_type || searchParams.get('type') as 'teacher' | 'student' || 'student';

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to set up your profile",
        variant: "destructive",
      });
      navigate('/login');
    }
    
    // If profile is already set up, redirect to dashboard
    if (profile?.institution) {
      navigate('/dashboard');
    }
  }, [user, profile, navigate, toast]);

  const handleProfileUpdate = (data: any) => {
    setProfileData((prev) => ({ ...prev, ...data }));
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile set up successfully",
        description: "Welcome to SCOLARIT!",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error setting up profile:', error);
      toast({
        variant: "destructive",
        title: "Profile setup failed",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl">
            {userType === 'teacher' ? 'Teacher Profile Setup' : 'Student Profile Setup'}
          </CardTitle>
          <CardDescription>
            Step {step} of 3: {step === 1 ? 'Basic Information' : step === 2 ? 'Education Details' : 'Preferences'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userType === 'teacher' ? (
            <TeacherProfileForm step={step} onUpdate={handleProfileUpdate} />
          ) : (
            <StudentProfileForm step={step} onUpdate={handleProfileUpdate} />
          )}
          
          <div className="flex items-center justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={handleSkip}
              disabled={isSubmitting}
            >
              {step < 3 ? 'Skip' : 'Skip & Finish'}
            </Button>
            
            <Button 
              type="button"
              onClick={() => document.getElementById(`profile-form-step-${step}`)?.dispatchEvent(
                new Event('submit', { cancelable: true, bubbles: true })
              )}
              disabled={isSubmitting}
              className={userType === 'teacher' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-purple-600 hover:bg-purple-500'}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Saving...</span>
                </>
              ) : step < 3 ? 'Continue' : 'Complete Setup'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
