import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { User, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, MailCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AuthLayout from '@/components/auth/AuthLayout';
import RoleToggle from '@/components/auth/RoleToggle';
import SocialButton from '@/components/auth/SocialButton';
import { signInWithGoogle } from '@/lib/googleAuth';
import EmailField from '@/components/auth/EmailField';
import PasswordField from '@/components/auth/PasswordField';
import useResendCooldown from '@/hooks/useResendCooldown';

const formSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof formSchema>;

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [signedUpEmail, setSignedUpEmail] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const [userType, setUserType] = useState<'teacher' | 'student'>('teacher');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { seconds: cooldownSeconds, isActive: cooldownActive, start: startCooldown } = useResendCooldown(30);
  const accentColor = userType === 'teacher' ? '#4F46E5' : '#7C3AED';

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: values.name, user_type: userType },
        },
      });
      if (error) throw error;

      // If Supabase auto-confirms (email confirmation disabled), session exists → continue setup
      if (data.session) {
        toast({
          title: 'Account created',
          description: `Welcome to SCOLARIT, ${values.name}!`,
        });
        navigate(`/profile-setup?type=${userType}`);
        return;
      }

      // Email confirmation required: do not auto-login
      setSignedUpEmail(values.email);
      setSuccessMsg('Verification email sent. Please check your inbox before logging in.');
      // Keep email pre-filled; clear only password fields
      form.reset({ name: values.name, email: values.email, password: '', confirmPassword: '' });
      startCooldown(30);
    } catch (error: any) {
      const raw = (error?.message || '').toLowerCase();
      if (raw.includes('already registered') || raw.includes('user already')) {
        setErrorMsg('This email is already registered. Try logging in.');
      } else {
        setErrorMsg(error?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!signedUpEmail) return;
    if (cooldownActive) return;
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: signedUpEmail,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      if (error) throw error;
      setSuccessMsg(`Verification email re-sent to ${signedUpEmail}.`);
      startCooldown(30);
    } catch (error: any) {
      setErrorMsg(error?.message || 'Could not resend verification email.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout accent={userType}>
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[hsl(220,15%,12%)] tracking-tight">
            Create your account
          </h2>
          <p className="text-sm text-[hsl(220,12%,40%)] font-medium">
            Start grading smarter in less than a minute.
          </p>
        </div>

        <RoleToggle value={userType} onChange={setUserType} />

        <div className="bg-white rounded-[14px] border border-[hsl(220,15%,92%)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.06),0_24px_48px_-16px_rgba(15,23,42,0.08)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_20px_-6px_rgba(0,0,0,0.08),0_32px_64px_-20px_rgba(15,23,42,0.12)] hover:scale-[1.005] transition-all duration-300 p-7 sm:p-8 space-y-5">
          <SocialButton
            onClick={async () => {
              const { error } = await signInWithGoogle(userType);
              if (error) {
                toast({
                  variant: 'destructive',
                  title: 'Google sign-up failed',
                  description: error.message,
                });
              }
            }}
          >
            Continue with Google
          </SocialButton>

          <div className="relative flex items-center">
            <div className="flex-1 h-px bg-[hsl(220,15%,92%)]" />
            <span className="px-3 text-xs font-medium text-[hsl(220,10%,55%)] uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-[hsl(220,15%,92%)]" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {errorMsg && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-[10px] border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p className="font-medium leading-snug">{errorMsg}</p>
                </div>
              )}

              {successMsg && (
                <div
                  role="status"
                  className="flex gap-2 rounded-[10px] border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800"
                >
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <p className="font-medium leading-snug">{successMsg}</p>
                    {signedUpEmail && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isResending}
                        onClick={handleResendEmail}
                        className="h-8 gap-1.5 border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-100"
                      >
                        <MailCheck size={14} />
                        {isResending ? 'Sending...' : 'Resend verification email'}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-[hsl(220,15%,20%)]">Full name</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,55%)] group-focus-within:text-[var(--a)] transition-colors"
                          size={18}
                          style={{ ['--a' as any]: accentColor }}
                        />
                        <Input
                          placeholder="Jane Cooper"
                          className="pl-10 h-11 rounded-[10px] border-[hsl(220,15%,88%)] bg-white focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent transition-all"
                          style={{ ['--tw-ring-color' as any]: `${accentColor}33` }}
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <EmailField
                control={form.control}
                disabled={isLoading}
                accentColor={accentColor}
                placeholder={userType === 'teacher' ? 'teacher@school.edu' : 'student@school.edu'}
              />

              <PasswordField control={form.control} disabled={isLoading} accentColor={accentColor} />
              <PasswordField
                control={form.control}
                disabled={isLoading}
                accentColor={accentColor}
                name="confirmPassword"
                label="Confirm password"
              />

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
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight size={16} className="ml-1.5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>
                <p className="text-center text-[11px] text-[hsl(220,10%,55%)] font-medium">
                  Free forever · No credit card required
                </p>
              </div>
            </form>
          </Form>
        </div>

        <div className="space-y-4">
          <p className="text-center text-sm text-[hsl(220,12%,40%)] font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold transition-colors" style={{ color: accentColor }}>
              Sign in
            </Link>
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-[hsl(220,12%,38%)] font-semibold">
            <div
              className="rounded-full p-1"
              style={{ background: `${accentColor}15`, color: accentColor }}
            >
              <ShieldCheck size={12} />
            </div>
            <span>256-bit encrypted · SOC 2 compliant</span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
