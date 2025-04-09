
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the session from the URL
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data.session) {
          // Get the user type that was selected before redirect
          const userType = sessionStorage.getItem('selectedUserType') as 'teacher' | 'student' || 'student';
          sessionStorage.removeItem('selectedUserType'); // Clean up

          // If user already has a profile, redirect to dashboard
          if (profile?.institution) {
            toast({
              title: "Login successful",
              description: `Welcome back to SCOLARIT, ${profile.first_name || 'User'}!`,
            });
            navigate('/dashboard');
          } else {
            // If new user or profile not set up, redirect to profile setup
            toast({
              title: "Account created",
              description: "Let's set up your profile!",
            });
            navigate(`/profile-setup?type=${userType}`);
          }
        } else {
          // If no session, redirect to login
          navigate('/login');
        }
      } catch (error: any) {
        console.error('Error during OAuth callback:', error);
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: error.message || "An unexpected error occurred during authentication.",
        });
        navigate('/login');
      }
    };

    handleOAuthCallback();
  }, [navigate, profile, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
      <h2 className="text-xl font-medium">Completing authentication...</h2>
      <p className="text-gray-500 mt-2">Please wait while we set up your account.</p>
    </div>
  );
};

export default AuthCallback;
