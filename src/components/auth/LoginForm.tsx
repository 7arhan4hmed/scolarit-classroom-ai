import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, AlertCircle, CheckCircle2, MailCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import useResendCooldown from '@/hooks/useResendCooldown';

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { seconds: cooldownSeconds, isActive: cooldownActive, start: startCooldown } = useResendCooldown(30);
  const accentColor = userType === 'teacher' ? '#4F46E5' : '#7C3AED';

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setNeedsVerification(false);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) {
        const raw = (error.message || '').toLowerCase();
        const code = (error as any).code as string | undefined;
        if (raw.includes('email not confirmed') || code === 'email_not_confirmed') {
          setUnverifiedEmail(values.email);
          setNeedsVerification(true);
          setErrorMsg('Please verify your email before logging in.');
        } else if (
          raw.includes('invalid login credentials') ||
          raw.includes('invalid_credentials') ||
          code === 'invalid_credentials'
        ) {
          setErrorMsg('Incorrect email or password.');
        } else if (raw.includes('user already registered') || raw.includes('already registered')) {
          setErrorMsg('This email is already registered. Try logging in.');
        } else {
          setErrorMsg(error.message);
        }
        setIsLoading(false);
        return;
      }

      const userMetadata = data.user?.user_metadata;
      const actualUserType = userMetadata?.user_type || 'student';

      if (actualUserType !== userType) {
        await supabase.auth.signOut();
        setErrorMsg(
          `You're trying to log in as a ${userType}, but your account is registered as a ${actualUserType}.`
        );
        setIsLoading(false);
        return;
      }

      toast({
        title: 'Welcome back',
        description: `Signed in as ${userMetadata?.full_name || values.email}`,
      });
      navigate('/dashboard');
    } catch (error: any) {
      setErrorMsg(error?.message || 'Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    const email = unverifiedEmail || form.getValues('email');
    if (!email) {
      setErrorMsg('Enter your email above first.');
      return;
    }
    if (cooldownActive) return;
    setIsResending(true);
    setSuccessMsg(null);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      if (error) throw error;
      setErrorMsg(null);
      setSuccessMsg(`Verification email sent to ${email}. Check your inbox.`);
      startCooldown(30);
    } catch (error: any) {
      setErrorMsg(error?.message || 'Could not resend verification email.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {errorMsg && (
          <div
            role="alert"
            className="flex gap-2 rounded-[10px] border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <div className="flex-1 space-y-2">
              <p className="font-medium leading-snug">{errorMsg}</p>
              {needsVerification && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isResending || cooldownActive}
                  onClick={handleResendEmail}
                  className="h-8 gap-1.5 border-destructive/30 bg-white text-destructive hover:bg-destructive/10"
                >
                  <MailCheck size={14} />
                  {isResending
                    ? 'Sending...'
                    : cooldownActive
                      ? `Resend in ${cooldownSeconds}s`
                      : 'Resend verification email'}
                </Button>
              )}
            </div>
          </div>
        )}

        {successMsg && (
          <div
            role="status"
            className="flex items-start gap-2 rounded-[10px] border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800"
          >
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <p className="font-medium leading-snug">{successMsg}</p>
          </div>
        )}

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

        <div className="space-y-2 pt-1">
          <Button
            type="submit"
            disabled={isLoading}
            className="group w-full h-11 rounded-[10px] text-sm font-semibold text-white border-0 hover:-translate-y-[1px] hover:shadow-[0_12px_28px_-6px_var(--glow),0_4px_12px_-2px_var(--glow)] active:translate-y-0 transition-all duration-200"
            style={{
              background: userType === 'teacher'
                ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)'
                : 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
              boxShadow: `0 6px 16px -4px ${accentColor}66, inset 0 1px 0 rgba(255,255,255,0.15)`,
              ['--glow' as any]: `${accentColor}80`,
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
                <ArrowRight size={16} className="ml-1.5 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
          <p className="text-center text-[11px] text-[hsl(220,10%,55%)] font-medium">
            Takes less than 30 seconds
          </p>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
