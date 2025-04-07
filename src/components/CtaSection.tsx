
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const CtaSection = () => {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const { toast } = useToast();

  const handleScheduleDemo = () => {
    setShowDemoModal(true);
    toast({
      title: "Demo Requested",
      description: "Thank you for your interest! A team member will contact you shortly to schedule your personalized demo.",
    });
    
    // Close modal after a delay
    setTimeout(() => {
      setShowDemoModal(false);
    }, 3000);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl blue-purple-gradient p-8 md:p-12 lg:p-16">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Revolutionize Your Assessment Process?
            </h2>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Join thousands of educators who are using SCOLARIT to save time, provide better feedback, and improve student outcomes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90" asChild>
                <Link to="/signup">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/20"
                onClick={handleScheduleDemo}
              >
                Schedule a Demo
              </Button>
            </div>
            <p className="mt-6 text-sm text-white/80">
              No credit card required. 14-day free trial. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
      
      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Demo Request Received</h3>
            <p className="mb-6">Thank you for your interest in SCOLARIT! Our team will contact you shortly to schedule your personalized demo.</p>
            <div className="flex justify-end">
              <Button onClick={() => setShowDemoModal(false)} className="blue-purple-gradient hover:opacity-90">Close</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CtaSection;
