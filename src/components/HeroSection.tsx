
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue px-4 py-1.5 rounded-full text-sm font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
              AI-Powered Education Assistant
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Grade Smarter, <span className="gradient-text">Teach Better</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground">
              EduGrade streamlines assessment workflows with AI-powered grading and personalized feedback, giving teachers more time to focus on what matters most—their students.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-brand-blue hover:bg-brand-blue/90">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
            
            <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-brand-teal" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-brand-teal" />
                <span className="text-sm">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-brand-teal" />
                <span className="text-sm">Cancel anytime</span>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative">
            <div className="bg-white rounded-xl shadow-xl border p-4 max-w-md mx-auto animate-float">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center">
                  <span className="font-medium text-brand-purple">AI</span>
                </div>
                <div>
                  <h3 className="font-medium">Automated Assessment</h3>
                  <p className="text-sm text-muted-foreground">Processing essay response...</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm">Student response on "The impact of climate change"</p>
                  <div className="h-16 bg-gray-100 rounded mt-2"></div>
                </div>
                
                <div className="bg-brand-blue/5 border-l-2 border-brand-blue rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center">
                      <span className="text-xs font-medium text-brand-blue">AI</span>
                    </div>
                    <h4 className="text-sm font-medium">Feedback Summary</h4>
                  </div>
                  <ul className="space-y-1">
                    <li className="text-xs flex gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-brand-teal flex-shrink-0 mt-0.5" />
                      <span>Strong thesis and supporting arguments</span>
                    </li>
                    <li className="text-xs flex gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-brand-teal flex-shrink-0 mt-0.5" />
                      <span>Well-structured paragraphs with clear transitions</span>
                    </li>
                    <li className="text-xs flex gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-brand-orange flex-shrink-0 mt-0.5" />
                      <span>Consider adding more specific examples</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium">Score: </span>
                    <span className="text-sm text-brand-blue font-semibold">86/100</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button size="sm" className="bg-brand-blue hover:bg-brand-blue/90">Approve</Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-blue/5 rounded-full blur-xl"></div>
            <div className="absolute -z-10 bottom-10 right-10 w-20 h-20 bg-brand-purple/10 rounded-full blur-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
