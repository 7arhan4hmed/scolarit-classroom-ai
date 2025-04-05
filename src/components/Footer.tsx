
import React from 'react';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-brand-blue p-1.5 text-white">
                <BookOpen size={24} />
              </div>
              <span className="text-xl font-bold font-display">EduGrade</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering educators with AI-powered grading and feedback tools.
              Supporting UN SDG 4: Quality Education.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-brand-blue">Features</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-brand-blue">Pricing</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-brand-blue">Integrations</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-brand-blue">Updates</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-brand-blue">Documentation</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-brand-blue">Tutorials</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-brand-blue">Blog</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-brand-blue">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-brand-blue">About</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-brand-blue">Careers</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-brand-blue">Privacy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-brand-blue">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2025 EduGrade AI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-brand-blue">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-brand-blue">
              LinkedIn
            </a>
            <a href="#" className="text-muted-foreground hover:text-brand-blue">
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
