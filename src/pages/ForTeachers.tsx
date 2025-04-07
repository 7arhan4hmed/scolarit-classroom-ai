
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, Clock, FileText, PieChart, Users, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherFeatures = [
  {
    icon: <Check className="h-6 w-6 text-white" />,
    title: "Effortless Grading",
    description: "Grade 100+ assignments in minutes, not hours. Our AI handles the repetitive work while you maintain full control."
  },
  {
    icon: <Clock className="h-6 w-6 text-white" />,
    title: "Time Savings",
    description: "Reclaim your evenings and weekends. Teachers using SCOLARIT report saving 70% of their grading time."
  },
  {
    icon: <FileText className="h-6 w-6 text-white" />,
    title: "Consistent Feedback",
    description: "Provide detailed, personalized feedback to every student consistently, regardless of class size."
  },
  {
    icon: <PieChart className="h-6 w-6 text-white" />,
    title: "Advanced Analytics",
    description: "Gain insights into student performance trends and identify learning gaps with comprehensive reports."
  },
  {
    icon: <Users className="h-6 w-6 text-white" />,
    title: "Class Management",
    description: "Easily organize students, assignments, and grades in one intuitive dashboard."
  },
  {
    icon: <Sparkles className="h-6 w-6 text-white" />,
    title: "Custom Rubrics",
    description: "Create and save custom grading rubrics that align perfectly with your teaching standards."
  }
];

const ForTeachers = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">SCOLARIT for Teachers</h1>
              <p className="text-lg text-gray-600">
                Revolutionize your assessment workflow and reclaim your valuable time.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {TeacherFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl border p-6 shadow-sm">
                  <div className="w-12 h-12 blue-purple-gradient rounded-full flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center gradient-text">Ready to transform your teaching?</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-brand-blue hover:bg-brand-blue/90 text-white">
                  <Link to="/signup">Start Free Trial</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-brand-purple border-brand-purple hover:bg-brand-purple/10">
                  <Link to="/how-it-works">See How It Works</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center gradient-text">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-2">How accurate is the AI grading?</h3>
                  <p className="text-gray-600">
                    SCOLARIT's AI grading system has been trained on thousands of educator-graded assignments and achieves over 95% accuracy compared to human grading. You maintain full control and can always adjust grades before finalizing.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Is SCOLARIT compatible with my existing LMS?</h3>
                  <p className="text-gray-600">
                    Yes, SCOLARIT integrates seamlessly with Google Classroom, Canvas, and other major learning management systems. We're constantly adding new integrations.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-2">How do I customize grading criteria?</h3>
                  <p className="text-gray-600">
                    SCOLARIT allows you to create custom rubrics with specific criteria and point values. You can save these rubrics to use across multiple assignments and classes.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Is my students' data secure?</h3>
                  <p className="text-gray-600">
                    Absolutely. SCOLARIT is FERPA compliant and employs enterprise-grade encryption. We never share student data with third parties or use it to train our AI models without explicit permission.
                  </p>
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

export default ForTeachers;
