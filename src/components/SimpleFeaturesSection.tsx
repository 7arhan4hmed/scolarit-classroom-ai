import React from 'react';
import { Bot, Clock, FileText, BarChart4, BookOpen, Zap } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: "AI-Powered Grading",
    description: "Instantly evaluate assignments with consistent, objective AI analysis"
  },
  {
    icon: Clock,
    title: "Save 70% Time",
    description: "Reduce grading workload from hours to minutes per assignment"
  },
  {
    icon: FileText,
    title: "Personalized Feedback",
    description: "Generate detailed, tailored comments for each student automatically"
  },
  {
    icon: BarChart4,
    title: "Analytics Dashboard",
    description: "Track progress and identify learning gaps with comprehensive insights"
  },
  {
    icon: BookOpen,
    title: "Curriculum Aligned",
    description: "Assessments aligned with your standards and learning objectives"
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Students get immediate feedback to maximize their learning"
  }
];

const SimpleFeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Grade Smarter
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to save time and improve learning outcomes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="p-6 rounded-xl border border-border hover:shadow-md transition-all">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600/10 to-purple-500/10 mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SimpleFeaturesSection;
