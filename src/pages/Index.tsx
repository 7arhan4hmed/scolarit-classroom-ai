
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import CtaSection from '@/components/CtaSection';
import FaqSection from '@/components/FaqSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <CtaSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
