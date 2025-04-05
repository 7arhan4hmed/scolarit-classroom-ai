
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CtaSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl gradient-bg p-8 md:p-12 lg:p-16">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Revolutionize Your Assessment Process?
            </h2>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Join thousands of educators who are using EduGrade to save time, provide better feedback, and improve student outcomes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-brand-blue hover:bg-white/90">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                Schedule a Demo
              </Button>
            </div>
            <p className="mt-6 text-sm text-white/80">
              No credit card required. 14-day free trial. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
