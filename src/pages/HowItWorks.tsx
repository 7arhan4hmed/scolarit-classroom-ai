
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HowItWorksSection from '@/components/HowItWorksSection';
import SEO from '@/components/SEO';

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO title="How It Works | SCOLARIT" description="See how SCOLARIT grades assignments in three steps: upload, AI review, and instant personalized feedback for students." path="/how-it-works" />
      <Header />
      <main className="flex-grow">
        <div className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center gradient-text">
              How SCOLARIT Works
            </h1>
          </div>
        </div>
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
