import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import RoleToggle from '@/components/auth/RoleToggle';
import SocialButton from '@/components/auth/SocialButton';
import AuthLayout from '@/components/auth/AuthLayout';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [userType, setUserType] = useState<'teacher' | 'student'>('teacher');
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const accentColor = userType === 'teacher' ? '#4F46E5' : '#7C3AED';

  useEffect(() => {
    if (!loading && user) navigate('/dashboard', { replace: true });
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(220,20%,98%)]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[hsl(220,15%,88%)] border-t-[#4F46E5]" />
      </div>
    );
  }
  if (user) return null;

  return (
    <AuthLayout accent={userType}>
      <div className="space-y-8 animate-fade-in">
        {/* Heading */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[hsl(220,15%,12%)] tracking-tight">
            Welcome back, {userType === 'teacher' ? 'Teacher' : 'Student'} 👋
          </h2>
          <p className="text-sm text-[hsl(220,12%,40%)] font-medium">
            Sign in to continue to your SCOLARIT workspace.
          </p>
        </div>

        {/* Role toggle */}
        <RoleToggle value={userType} onChange={setUserType} />

        {/* Card */}
        <div className="bg-white rounded-[14px] border border-[hsl(220,15%,92%)] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.06)] p-7 sm:p-8 space-y-5">
          <SocialButton
            onClick={() =>
              toast({
                title: 'Coming soon',
                description: 'Google sign-in will be available shortly.',
              })
            }
          >
            Continue with Google
          </SocialButton>

          <div className="relative flex items-center">
            <div className="flex-1 h-px bg-[hsl(220,15%,92%)]" />
            <span className="px-3 text-xs font-medium text-[hsl(220,10%,55%)] uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 h-px bg-[hsl(220,15%,92%)]" />
          </div>

          <LoginForm userType={userType} />
        </div>

        {/* Footer */}
        <div className="space-y-4">
          <p className="text-center text-sm text-[hsl(220,12%,40%)] font-medium">
            New to SCOLARIT?{' '}
            <Link
              to="/signup"
              className="font-semibold transition-colors"
              style={{ color: accentColor }}
            >
              Create an account
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-xs text-[hsl(220,10%,50%)] font-medium">
            <ShieldCheck size={14} />
            Your data is encrypted and secure.
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
