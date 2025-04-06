
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MessageSquare, Lightbulb, History, TrendingUp, BarChart, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentFeatures = [
  {
    icon: <MessageSquare className="h-6 w-6 text-white" />,
    title: "Detailed Feedback",
    description: "Receive comprehensive, personalized feedback that helps you understand exactly where to improve."
  },
  {
    icon: <Lightbulb className="h-6 w-6 text-white" />,
    title: "Actionable Insights",
    description: "Get specific suggestions on how to strengthen your work, not just what you did wrong."
  },
  {
    icon: <History className="h-6 w-6 text-white" />,
    title: "Quick Turnaround",
    description: "No more waiting days or weeks for grades. Get feedback minutes after submission."
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-white" />,
    title: "Progress Tracking",
    description: "Monitor your improvement over time with visual dashboards showing your growth."
  },
  {
    icon: <BarChart className="h-6 w-6 text-white" />,
    title: "Skills Analysis",
    description: "See which specific skills you've mastered and which need more attention."
  },
  {
    icon: <Clock className="h-6 w-6 text-white" />,
    title: "More Teacher Time",
    description: "When teachers spend less time grading, they can spend more time supporting you directly."
  }
];

const ForStudents = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#005558]">SCOLARIT for Students</h1>
              <p className="text-lg text-gray-600">
                Get faster, more consistent feedback to accelerate your learning journey.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {StudentFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl border p-6 shadow-sm">
                  <div className="w-12 h-12 bg-[#005558] rounded-full flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center text-[#005558]">Experience better feedback today</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-[#005558] hover:bg-[#005558]/90">
                  <Link to="/upload">Upload Assignment</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/signup">Create Student Account</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-center">How Students Benefit from SCOLARIT</h2>
              
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#005558] text-white font-bold text-lg">1</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Upload Your Work</h3>
                    <p className="text-gray-600 mb-2">
                      Submit your assignments through SCOLARIT's student portal or through your school's existing learning management system.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#005558] text-white font-bold text-lg">2</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Receive Comprehensive Feedback</h3>
                    <p className="text-gray-600 mb-2">
                      Get detailed, personalized feedback highlighting your strengths and specific areas for improvement.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#005558] text-white font-bold text-lg">3</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
                    <p className="text-gray-600 mb-2">
                      Monitor your improvement over time with visual dashboards and analytics that show your growth across different skills and subjects.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#005558] text-white font-bold text-lg">4</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Apply Targeted Learning</h3>
                    <p className="text-gray-600 mb-2">
                      Use the specific suggestions to focus your study time on the areas where you'll see the biggest improvement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForStudents;
