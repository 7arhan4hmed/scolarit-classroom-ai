
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import AuthHeader from '@/components/auth/AuthHeader';
import UserTypeInfo from '@/components/auth/UserTypeInfo';
import SignUpForm from '@/components/auth/SignUpForm';

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'teacher' | 'student'>('teacher');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, signInWithGoogle, profile } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    if (profile) {
      navigate('/dashboard');
    }
  }, [profile, navigate]);

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      const { error } = await signUp(values.email, values.password, values.name, userType);
      
      if (error) {
        console.error('Sign up error:', error);
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message || "Something went wrong. Please try again.",
        });
      } else {
        toast({
          title: "Account created",
          description: `Welcome to SCOLARIT, ${values.name}! Let's set up your profile.`,
        });
        
        navigate(`/profile-setup?type=${userType}`);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await signInWithGoogle(userType);
      
      if (error) {
        console.error('Google sign up error:', error);
        toast({
          variant: "destructive",
          title: "Google sign up failed",
          description: error.message || "An error occurred during Google sign up.",
        });
      }
      // Successful sign up will redirect to the callback URL
    } catch (error) {
      console.error('Google sign up error:', error);
      toast({
        variant: "destructive",
        title: "Google sign up failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthHeader 
          title="Create your account" 
          subtitle="Sign up to start using SCOLARIT" 
        />
        
        <Tabs defaultValue="teacher" onValueChange={(value) => setUserType(value as 'teacher' | 'student')} className="mt-8">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="teacher" className="text-center">I'm a Teacher</TabsTrigger>
            <TabsTrigger value="student" className="text-center">I'm a Student</TabsTrigger>
          </TabsList>
          
          <TabsContent value="teacher">
            <UserTypeInfo userType="teacher" />
          </TabsContent>
          
          <TabsContent value="student">
            <UserTypeInfo userType="student" />
          </TabsContent>
        
          <SignUpForm 
            onSubmit={handleSubmit}
            onGoogleSignUp={handleGoogleSignUp}
            isLoading={isLoading} 
            userType={userType} 
          />
          
          <div className="text-center text-sm mt-6">
            <span className="text-gray-600">Already have an account?</span>{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Log in
            </Link>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SignUp;
