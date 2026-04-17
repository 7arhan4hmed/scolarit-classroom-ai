import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, ListChecks, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WelcomeOnboardingProps {
  userName?: string;
}

const steps = [
  {
    icon: Upload,
    title: 'Upload your first assignment',
    description: 'Drop a PDF, DOCX, or paste text — we handle the rest.',
    cta: 'Upload now',
    to: '/upload-assignments',
    accent: 'from-primary/15 to-primary/5',
    iconClass: 'bg-primary/10 text-primary',
  },
  {
    icon: ListChecks,
    title: 'Choose a grading rubric',
    description: 'Pick a preset or create your own custom criteria.',
    cta: 'Browse rubrics',
    to: '/upload-assignments',
    accent: 'from-accent/15 to-accent/5',
    iconClass: 'bg-accent/10 text-accent',
  },
  {
    icon: Sparkles,
    title: 'Get instant AI feedback',
    description: 'Receive grades, comments, and time-saving insights.',
    cta: 'See how it works',
    to: '/how-it-works',
    accent: 'from-secondary/30 to-secondary/10',
    iconClass: 'bg-secondary text-secondary-foreground',
  },
];

export const WelcomeOnboarding = ({ userName }: WelcomeOnboardingProps) => {
  return (
    <section className="space-y-8">
      <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Welcome to SCOLARIT{userName ? `, ${userName}` : ''} 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Let's get you started with AI-powered grading in just a few steps.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Link to="/upload-assignments">
              <Upload className="mr-2 h-4 w-4" />
              Upload Assignment
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <Card
              key={step.title}
              className="group relative overflow-hidden border-2 hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${step.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <CardContent className="relative p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl ${step.iconClass} flex items-center justify-center`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    STEP {idx + 1}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-lg leading-tight">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm" className="px-0 hover:bg-transparent hover:text-primary group/btn">
                  <Link to={step.to}>
                    {step.cta}
                    <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
