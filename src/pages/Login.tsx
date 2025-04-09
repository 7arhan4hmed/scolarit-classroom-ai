
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import AuthHeader from '@/components/auth/AuthHeader';
import UserTypeInfo from '@/components/auth/UserTypeInfo';
import LoginForm from '@/components/auth/LoginForm';

type FormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'teacher' | 'student'>('teacher');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signIn, signInWithGoogle, profile } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    if (profile) {
      redirectToDashboard();
    }
  }, [profile]);

  const redirectToDashboard = () => {
    // Check if there's a stored redirect path
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      navigate(redirectPath);
    } else {
      // Default redirect to dashboard
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        console.error('Login error:', error);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message || "Please check your credentials and try again.",
        });
      } else {
        toast({
          title: "Login successful",
          description: "Welcome back to SCOLARIT!",
        });
        
        redirectToDashboard();
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await signInWithGoogle(userType);
      
      if (error) {
        console.error('Google login error:', error);
        toast({
          variant: "destructive",
          title: "Google login failed",
          description: error.message || "An error occurred during Google login.",
        });
      }
      // Successful login will redirect to the callback URL and then to dashboard
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        variant: "destructive",
        title: "Google login failed",
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
          title="Welcome back" 
          subtitle="Sign in to continue to SCOLARIT" 
        />
        
        <Tabs defaultValue="teacher" onValueChange={(value) => setUserType(value as 'teacher' | 'student')} className="mt-8">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="teacher" className="text-center">Teacher</TabsTrigger>
            <TabsTrigger value="student" className="text-center">Student</TabsTrigger>
          </TabsList>
          
          <TabsContent value="teacher">
            <UserTypeInfo userType="teacher" />
          </TabsContent>
          
          <TabsContent value="student">
            <UserTypeInfo userType="student" />
          </TabsContent>
          
          <LoginForm 
            onSubmit={handleSubmit}
            onGoogleLogin={handleGoogleLogin}
            isLoading={isLoading} 
            userType={userType} 
          />
          
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>
          </div>
          
          <div className="text-center text-sm mt-6">
            <span className="text-gray-600">Don't have an account?</span>{" "}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
