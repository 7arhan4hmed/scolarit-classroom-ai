import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  accent: 'teacher' | 'student';
}

const AuthLayout = ({ children, accent }: AuthLayoutProps) => {
  const isTeacher = accent === 'teacher';

  return (
    <div className="min-h-screen flex bg-[hsl(220,20%,98%)]">
      {/* LEFT — Branding (60%) */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden">
        <div
          className="absolute inset-0 transition-colors duration-500"
          style={{
            background: isTeacher
              ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 60%, #818CF8 100%)'
              : 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 60%, #A78BFA 100%)',
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="rounded-[12px] bg-white/15 backdrop-blur p-2.5 border border-white/20">
              <BookOpen size={22} />
            </div>
            <span className="text-xl font-bold font-display tracking-tight">SCOLARIT</span>
          </Link>

          <div className="max-w-lg space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-bold font-display leading-[1.1] tracking-tight">
                Grade smarter.<br />Teach better.
              </h1>
              <p className="text-base xl:text-lg text-white/85 leading-relaxed font-medium">
                AI-powered assessment that gives you back hours every week —
                so you can focus on what really matters: your students.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {[
                { icon: Sparkles, text: 'Instant, consistent AI feedback' },
                { icon: Zap, text: 'Save 10+ hours of grading per week' },
                { icon: ShieldCheck, text: 'Privacy-first. Your data stays yours.' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="rounded-[10px] bg-white/15 p-2 border border-white/10">
                    <Icon size={16} />
                  </div>
                  <span className="text-sm font-medium text-white/95">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/70 font-medium">
            © {new Date().getFullYear()} SCOLARIT. Built for educators.
          </p>
        </div>
      </div>

      {/* RIGHT — Form (40%) */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div
              className="rounded-[10px] p-2 text-white"
              style={{
                background: isTeacher
                  ? 'linear-gradient(135deg, #4F46E5, #6366F1)'
                  : 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
              }}
            >
              <BookOpen size={20} />
            </div>
            <span className="text-lg font-bold font-display">SCOLARIT</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
