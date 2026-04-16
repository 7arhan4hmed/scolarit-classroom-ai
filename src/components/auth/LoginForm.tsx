import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight } from 'lucide-react';
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
  const accentColor = userType === 'teacher' ? '#4F46E5' : '#7C3AED';

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;

      const userMetadata = data.user?.user_metadata;
      const actualUserType = userMetadata?.user_type || 'student';

      if (actualUserType !== userType) {
        await supabase.auth.signOut();
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: `You're trying to log in as a ${userType}, but your account is registered as a ${actualUserType}.`,
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: 'Welcome back',
        description: `Signed in as ${userMetadata?.full_name || values.email}`,
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error.message || 'Please check your credentials and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <EmailField
          control={form.control}
          disabled={isLoading}
          accentColor={accentColor}
          placeholder={userType === 'teacher' ? 'teacher@school.edu' : 'student@school.edu'}
        />

        <div className="space-y-2">
          <PasswordField control={form.control} disabled={isLoading} accentColor={accentColor} />
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold transition-colors"
              style={{ color: accentColor }}
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-[10px] text-sm font-semibold text-white shadow-[0_4px_12px_-2px_var(--shadow)] hover:-translate-y-[1px] hover:shadow-[0_8px_20px_-4px_var(--shadow)] transition-all duration-200 border-0"
          style={{
            backgroundColor: accentColor,
            ['--shadow' as any]: `${accentColor}66`,
          }}
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white mr-2" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight size={16} className="ml-1.5" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
