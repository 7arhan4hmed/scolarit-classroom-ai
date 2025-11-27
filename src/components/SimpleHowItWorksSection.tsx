import React from 'react';
import { Upload, Sparkles, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Assignments",
    description: "Upload student work individually or in bulk from your computer or LMS"
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI Assessment",
    description: "Our AI analyzes each submission against your rubric and learning objectives"
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Review & Approve",
    description: "Review AI-generated grades and feedback, make adjustments, and share with students"
  }
];

const SimpleHowItWorksSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How SCOLARIT Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three simple steps to transform your grading workflow
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-600 to-purple-500 opacity-20" />
                  )}
                  
                  <div className="relative bg-white p-6 rounded-xl border border-border hover:shadow-lg transition-all">
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-500 flex items-center justify-center text-white font-bold">
                      {step.number}
                    </div>
                    
                    <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-blue-600/10 to-purple-500/10 mb-4 mt-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleHowItWorksSection;
