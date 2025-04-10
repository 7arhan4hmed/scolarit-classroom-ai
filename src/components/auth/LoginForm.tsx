
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import EmailField from './EmailField';
import PasswordField from './PasswordField';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  userType: 'teacher' | 'student';
}

const LoginForm = ({ userType }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      // Use Supabase's auth.signInWithPassword method to sign in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        throw error;
      }
      
      // Check if the user's type matches the selected tab
      const userMetadata = data.user?.user_metadata;
      const actualUserType = userMetadata?.user_type || 'student';
      
      if (actualUserType !== userType) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: `You're trying to log in as a ${userType}, but your account is registered as a ${actualUserType}.`,
        });
        setIsLoading(false);
        return;
      }
      
      // Still set localStorage for backward compatibility with other parts of the app
      localStorage.setItem('user', JSON.stringify({ 
        email: values.email, 
        type: actualUserType,
        name: userMetadata?.full_name || ''
      }));
      
      toast({
        title: "Login successful",
        description: `Welcome back to SCOLARIT, ${userMetadata?.full_name || ''}!`,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <EmailField 
            control={form.control} 
            disabled={isLoading} 
            placeholder={userType === 'teacher' ? "teacher@school.edu" : "student@school.edu"} 
          />
          
          <PasswordField control={form.control} disabled={isLoading} />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </Link>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className={`w-full flex items-center justify-center gap-2 ${
            userType === 'teacher' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-purple-600 hover:bg-purple-500'
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <LogIn size={18} />
              <span>Sign in as {userType === 'teacher' ? 'Teacher' : 'Student'}</span>
            </>
          )}
        </Button>
        
        <div className="text-center text-sm">
          <span className="text-gray-600">Don't have an account?</span>{" "}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
