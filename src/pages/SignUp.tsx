
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], 
});

type FormValues = z.infer<typeof formSchema>;

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'teacher' | 'student'>('teacher');
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      console.log(`${userType.charAt(0).toUpperCase() + userType.slice(1)} sign up attempt with:`, values);
      
      // Use Supabase's auth.signUp method to register the user
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.name,
            user_type: userType
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Still set localStorage for backward compatibility with other parts of the app
      localStorage.setItem('user', JSON.stringify({ 
        name: values.name, 
        email: values.email, 
        type: userType, 
        profileComplete: false 
      }));
      
      toast({
        title: "Account created",
        description: `Welcome to SCOLARIT, ${values.name}! Let's set up your profile.`,
      });
      
      navigate(`/profile-setup?type=${userType}`);
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
          <h2 className="mt-6 text-3xl font-bold font-display gradient-text">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign up to start using SCOLARIT
          </p>
        </div>
        
        <Tabs defaultValue="teacher" onValueChange={(value) => setUserType(value as 'teacher' | 'student')} className="mt-8">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="teacher" className="text-center">I'm a Teacher</TabsTrigger>
            <TabsTrigger value="student" className="text-center">I'm a Student</TabsTrigger>
          </TabsList>
          
          <TabsContent value="teacher">
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-blue-800 mb-2">Teacher Account</h3>
              <p className="text-sm text-blue-700">Create, grade, and manage assignments for your classes.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="student">
            <div className="bg-purple-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-purple-800 mb-2">Student Account</h3>
              <p className="text-sm text-purple-700">Submit assignments and receive detailed feedback on your work.</p>
            </div>
          </TabsContent>
        
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <Input 
                            placeholder="John Doe" 
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
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="******" 
                            className="pl-10 pr-10" 
                            disabled={isLoading}
                            {...field} 
                          />
                          <button 
                            type="button" 
                            onClick={toggleConfirmPasswordVisibility} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  `Create ${userType === 'teacher' ? 'Teacher' : 'Student'} Account`
                )}
              </Button>
              
              <div className="flex items-center justify-center">
                <div className="text-center text-sm">
                  <span className="text-gray-600">Already have an account?</span>{" "}
                  <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Log in
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </Tabs>
      </div>
    </div>
  );
};

export default SignUp;
