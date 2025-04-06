
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HowItWorksSection from '@/components/HowItWorksSection';

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#005558]">
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
