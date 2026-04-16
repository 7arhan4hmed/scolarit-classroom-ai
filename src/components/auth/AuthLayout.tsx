import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, ShieldCheck, Zap, CheckCircle2, FileText } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  accent: 'teacher' | 'student';
}

const AuthLayout = ({ children, accent }: AuthLayoutProps) => {
  const isTeacher = accent === 'teacher';
  const accentHex = isTeacher ? '#4F46E5' : '#7C3AED';

  return (
    <div className="min-h-screen flex bg-[hsl(220,20%,98%)] relative overflow-hidden">
      {/* Right-side ambient glow for balance */}
      <div
        className="hidden lg:block absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none transition-colors duration-500"
        style={{
          background: `radial-gradient(circle, ${accentHex}0D 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* LEFT — Branding (60%) */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden">
        {/* Base gradient */}
        <div
          className="absolute inset-0 transition-colors duration-500"
          style={{
            background: isTeacher
              ? 'linear-gradient(135deg, #3730A3 0%, #4F46E5 45%, #6366F1 100%)'
              : 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 45%, #8B5CF6 100%)',
          }}
        />
        {/* Radial glows for depth */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 60%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute -bottom-40 -right-20 w-[600px] h-[600px] rounded-full opacity-40"
          style={{ background: `radial-gradient(circle, ${isTeacher ? '#A5B4FC' : '#C4B5FD'} 0%, transparent 65%)`, filter: 'blur(80px)' }}
        />
        {/* Subtle dotted grid (softer than lines) */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full">
          <Link to="/" className="flex items-center gap-3 w-fit group">
            <div className="rounded-[12px] bg-white/15 backdrop-blur-md p-2.5 border border-white/25 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)] group-hover:bg-white/20 transition-all">
              <BookOpen size={22} />
            </div>
            <span className="text-xl font-bold font-display tracking-tight">SCOLARIT</span>
          </Link>

          <div className="max-w-lg space-y-10">
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-[3.25rem] font-bold font-display leading-[1.05] tracking-tight">
                Grade smarter.<br />Teach better.
              </h1>
              <p className="text-base xl:text-lg text-white/85 leading-relaxed font-medium max-w-md">
                AI-powered assessment that gives you back hours every week —
                so you can focus on what really matters.
              </p>
            </div>

            {/* Floating glassmorphism preview card */}
            <div
              className="relative animate-[float_6s_ease-in-out_infinite]"
              style={{
                animation: 'float 6s ease-in-out infinite',
              }}
            >
              <style>{`
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-8px); }
                }
              `}</style>
              <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] max-w-[380px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-white/15 p-1.5 border border-white/15">
                      <FileText size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Essay_Draft.pdf</p>
                      <p className="text-[10px] text-white/60">Graded in 8 seconds</p>
                    </div>
                  </div>
                  <div className="rounded-full bg-emerald-400/20 border border-emerald-300/30 px-2.5 py-1">
                    <span className="text-[11px] font-bold text-emerald-100">A · 92</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {[
                    { label: 'Argument structure', score: 95 },
                    { label: 'Evidence & sources', score: 88 },
                    { label: 'Clarity & style', score: 93 },
                  ].map((c) => (
                    <div key={c.label}>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-white/80 font-medium">{c.label}</span>
                        <span className="text-white font-semibold">{c.score}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-white/90 to-white/60"
                          style={{ width: `${c.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-1.5">
                  <Sparkles size={11} className="text-white/80" />
                  <span className="text-[10px] text-white/75 font-medium">AI feedback ready · 3 suggestions</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { icon: Zap, text: 'Save 10+ hours of grading per week' },
                { icon: CheckCircle2, text: 'Consistent, rubric-aligned feedback' },
                { icon: ShieldCheck, text: 'Privacy-first. Your data stays yours.' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="rounded-[10px] bg-white/15 backdrop-blur p-1.5 border border-white/15">
                    <Icon size={14} />
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
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 relative">
        <div className="w-full max-w-[420px] relative z-10">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div
              className="rounded-[10px] p-2 text-white shadow-lg"
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
