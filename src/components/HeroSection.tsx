
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Sparkles, BookOpen, GraduationCap, Zap, Award, BarChart, Users } from 'lucide-react';
import AssessmentCard from './AssessmentCard';
import { Link } from 'react-router-dom';
import { BackgroundCellsDemo } from './ui/background-cells';

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-500/10 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium animate-pulse">
              <Sparkles className="h-4 w-4" />
              AI-Powered Education Assistant
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Grade Smarter, <span className="blue-purple-text">Teach Better</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground">
              SCOLARIT streamlines assessment workflows with AI-powered grading and personalized feedback, giving teachers more time to focus on what matters most—their students.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-500/10 rounded-full px-4 py-2 text-sm">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span>Automatic Grading</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-500/10 rounded-full px-4 py-2 text-sm">
                <GraduationCap className="h-4 w-4 text-purple-500" />
                <span>Personalized Feedback</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-500/10 rounded-full px-4 py-2 text-sm">
                <Zap className="h-4 w-4 text-blue-600" />
                <span>Time-Saving AI</span>
              </div>
            </div>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="blue-purple-gradient hover:opacity-90 animate-fade-in" asChild>
                <Link to="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600/10" asChild>
                <Link to="/how-it-works">
                  How It Works
                </Link>
              </Button>
            </div>
            
            <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="text-sm">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Cancel anytime</span>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative">
            <AssessmentCard />
            
            {/* Decorative elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-blue-600/5 to-purple-500/5 rounded-full blur-xl"></div>
            <div className="absolute -z-10 bottom-10 right-10 w-20 h-20 bg-gradient-to-r from-blue-600/10 to-purple-500/10 rounded-full blur-lg"></div>
          </div>
        </div>
        
        {/* Statistics section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-600/10 text-center hover:border-purple-500/20 transition-colors">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-500/10 mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold blue-purple-text">10,000+</h3>
            <p className="text-sm text-gray-500 mt-1">Educators Using SCOLARIT</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-600/10 text-center hover:border-purple-500/20 transition-colors">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-500/10 mb-4">
              <BookOpen className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-3xl font-bold blue-purple-text">500,000+</h3>
            <p className="text-sm text-gray-500 mt-1">Assignments Processed</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-600/10 text-center hover:border-purple-500/20 transition-colors">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-500/10 mb-4">
              <BarChart className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold blue-purple-text">98%</h3>
            <p className="text-sm text-gray-500 mt-1">Accuracy Rate</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-600/10 text-center hover:border-purple-500/20 transition-colors">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-500/10 mb-4">
              <Award className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-3xl font-bold blue-purple-text">25+</h3>
            <p className="text-sm text-gray-500 mt-1">Education Awards</p>
          </div>
        </div>
        
        {/* Background Cells Demo Section */}
        <div className="mt-16 rounded-xl overflow-hidden shadow-lg border border-blue-600/10">
          <BackgroundCellsDemo />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
