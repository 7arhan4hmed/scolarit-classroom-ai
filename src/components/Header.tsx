
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-brand-blue p-1.5 text-white">
            <BookOpen size={24} />
          </div>
          <span className="text-xl font-bold font-display">EduGrade</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium hover:text-brand-blue transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium hover:text-brand-blue transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="text-sm font-medium hover:text-brand-blue transition-colors">
            Testimonials
          </a>
          <a href="#pricing" className="text-sm font-medium hover:text-brand-blue transition-colors">
            Pricing
          </a>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden md:inline-flex">
            Log in
          </Button>
          <Button className="bg-brand-blue hover:bg-brand-blue/90">
            Try for free
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
