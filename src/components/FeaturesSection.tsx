
import React from 'react';
import { Bot, Clock, BarChart4, BookOpen, FileText, Users } from 'lucide-react';

const features = [
  {
    icon: <Bot className="h-8 w-8 text-brand-blue" />,
    title: "AI-Powered Grading",
    description: "Automatically evaluate assignments, essays, and tests using Google's Gemini API and Vertex AI for consistent and objective assessment."
  },
  {
    icon: <Clock className="h-8 w-8 text-brand-purple" />,
    title: "Save 70% of Grading Time",
    description: "Reduce your workload dramatically by automating repetitive assessment tasks while maintaining high-quality feedback."
  },
  {
    icon: <FileText className="h-8 w-8 text-brand-teal" />,
    title: "Personalized Feedback",
    description: "Provide tailored comments and suggestions to each student based on their specific strengths and areas for improvement."
  },
  {
    icon: <BarChart4 className="h-8 w-8 text-brand-orange" />,
    title: "Detailed Analytics",
    description: "Track student progress and identify common misconceptions with comprehensive performance analytics and insights."
  },
  {
    icon: <BookOpen className="h-8 w-8 text-brand-blue" />,
    title: "Curriculum Alignment",
    description: "Ensure assessments and feedback align perfectly with your curriculum standards and learning objectives."
  },
  {
    icon: <Users className="h-8 w-8 text-brand-purple" />,
    title: "Works for Any Class Size",
    description: "Scale effortlessly from small groups to large classes without compromising on assessment quality or feedback depth."
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Modern Educators
          </h2>
          <p className="text-lg text-muted-foreground">
            EduGrade combines cutting-edge AI with pedagogical expertise to transform the assessment experience for teachers and students alike.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow"
            >
              <div className="p-2 w-14 h-14 rounded-lg bg-gray-50 mb-4 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
