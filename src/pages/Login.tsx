
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'teacher' | 'student'>('teacher');
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="rounded-lg blue-purple-gradient p-2 text-white">
              <BookOpen size={28} />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold font-display gradient-text">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue to SCOLARIT
          </p>
        </div>
        
        <Tabs defaultValue="teacher" onValueChange={(value) => setUserType(value as 'teacher' | 'student')} className="mt-8">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="teacher" className="text-center">Teacher</TabsTrigger>
            <TabsTrigger value="student" className="text-center">Student</TabsTrigger>
          </TabsList>
          
          <TabsContent value="teacher">
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-blue-800 mb-2">Teacher Portal</h3>
              <p className="text-sm text-blue-700">Access your classes, grade assignments, and view student progress.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="student">
            <div className="bg-purple-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-purple-800 mb-2">Student Portal</h3>
              <p className="text-sm text-purple-700">View your assignments, check grades, and communicate with teachers.</p>
            </div>
          </TabsContent>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <Input 
                            placeholder={userType === 'teacher' ? "teacher@school.edu" : "student@school.edu"} 
                            className="pl-10" 
                            disabled={isLoading}
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="******" 
                            className="pl-10 pr-10" 
                            disabled={isLoading}
                            {...field} 
                          />
                          <button 
                            type="button" 
                            onClick={togglePasswordVisibility} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
