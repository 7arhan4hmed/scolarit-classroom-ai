import React from 'react';
import { Clock, FileStack, TrendingDown, Users } from 'lucide-react';

const problems = [
  {
    icon: Clock,
    title: "Hours Spent Grading",
    description: "Teachers spend 5-10 hours per week on grading, taking time away from lesson planning and student interaction.",
    stat: "70%"
  },
  {
    icon: FileStack,
    title: "Inconsistent Feedback",
    description: "Maintaining consistent grading standards across hundreds of assignments is challenging and time-consuming.",
    stat: "45%"
  },
  {
    icon: TrendingDown,
    title: "Delayed Feedback",
    description: "Students often wait days or weeks for feedback, missing the optimal learning moment.",
    stat: "2 weeks"
  },
  {
    icon: Users,
    title: "Large Class Sizes",
    description: "With growing class sizes, providing personalized feedback to each student becomes nearly impossible.",
    stat: "30+"
  }
];

const ProblemsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Challenges Teachers Face
          </h2>
          <p className="text-lg text-muted-foreground">
            Traditional grading methods are time-consuming and inefficient. SCOLARIT solves these problems with AI.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-xl border border-border hover:shadow-lg transition-all">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600/10 to-purple-500/10 mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold blue-purple-text mb-2">{problem.stat}</div>
                <h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
                <p className="text-sm text-muted-foreground">{problem.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;
