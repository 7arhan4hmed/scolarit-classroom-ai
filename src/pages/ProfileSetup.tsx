
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import TeacherProfileForm from '@/components/profile/TeacherProfileForm';
import StudentProfileForm from '@/components/profile/StudentProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ProfileSetup = () => {
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();
  const userType = profile?.user_type || searchParams.get('type') || 'teacher';
  const [step, setStep] = useState(1);
  const [maxSteps, setMaxSteps] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign up or login first.",
      });
      navigate('/login');
      return;
    }

    // Set max steps based on user type
    setMaxSteps(userType === 'teacher' ? 3 : 2);
  }, [navigate, toast, user, userType]);

  const handleFormUpdate = (data: any) => {
    setFormData(prevData => ({
      ...prevData,
      ...data
    }));
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
    if (!user?.id) return;
    setIsLoading(true);

    try {
      // Update user profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

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

  if (!user) {
    return null; // Will redirect in useEffect
  }

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
                <TeacherProfileForm step={step} onUpdate={handleFormUpdate} />
              ) : (
                <StudentProfileForm step={step} onUpdate={handleFormUpdate} />
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
