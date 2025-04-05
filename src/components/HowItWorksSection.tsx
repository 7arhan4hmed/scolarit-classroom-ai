
import React from 'react';
import { Upload, Sparkles, CheckCheck } from 'lucide-react';

const steps = [
  {
    icon: <Upload className="h-8 w-8 text-white" />,
    title: "Upload Assignments",
    description: "Simply upload student work through our intuitive interface or integrate with your existing LMS."
  },
  {
    icon: <Sparkles className="h-8 w-8 text-white" />,
    title: "AI Assessment",
    description: "Our AI analyzes submissions using Google's Gemini API, applying your rubric and standards."
  },
  {
    icon: <CheckCheck className="h-8 w-8 text-white" />,
    title: "Review & Approve",
    description: "Quickly review AI-generated grades and personalized feedback before sending to students."
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-bg opacity-[0.03] -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How EduGrade Works
          </h2>
          <p className="text-lg text-muted-foreground">
            A simple three-step process that transforms hours of grading into minutes of review.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (visible on md screens and up) */}
          <div className="absolute top-24 left-0 right-0 h-0.5 bg-brand-blue/20 hidden md:block"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center z-10 mb-6 ${
                index === 0 ? "bg-brand-blue" : 
                index === 1 ? "bg-brand-purple" : "bg-brand-teal"
              }`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 bg-white rounded-xl border shadow-sm p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6 text-center">Seamlessly Integrates With Your Workflow</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Google Classroom', 'Canvas', 'Moodle', 'Blackboard'].map((platform, index) => (
              <div key={index} className="border rounded-lg p-4 flex items-center justify-center h-24 bg-gray-50">
                <span className="text-lg font-medium text-center text-gray-700">{platform}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
