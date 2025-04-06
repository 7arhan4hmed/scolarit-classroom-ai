
import React from 'react';
import { BookOpen, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-[#005558] p-1.5 text-white">
                <BookOpen size={24} />
              </div>
              <span className="text-xl font-bold font-display text-[#005558]">SCOLARIT</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering educators with AI-powered grading and feedback tools.
              Supporting UN SDG 4: Quality Education.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-[#005558]">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-sm text-muted-foreground hover:text-[#005558] transition-colors">Features</Link></li>
              <li><Link to="/upload" className="text-sm text-muted-foreground hover:text-[#005558] transition-colors">Upload Assignments</Link></li>
              <li><Link to="/google-classroom" className="text-sm text-muted-foreground hover:text-[#005558] transition-colors">Integrations</Link></li>
              <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-[#005558] transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-[#005558]">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-[#005558] transition-colors">How It Works</Link></li>
              <li><Link to="/for-teachers" className="text-sm text-muted-foreground hover:text-[#005558] transition-colors">For Teachers</Link></li>
              <li><Link to="/for-students" className="text-sm text-muted-foreground hover:text-[#005558] transition-colors">For Students</Link></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-[#005558] transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-[#005558]">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-[#005558] transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-[#005558] transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-[#005558] transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-[#005558] transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2025 SCOLARIT AI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-[#005558] transition-colors">
              <Twitter size={20} />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="text-muted-foreground hover:text-[#005558] transition-colors">
              <Linkedin size={20} />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="#" className="text-muted-foreground hover:text-[#005558] transition-colors">
              <Facebook size={20} />
              <span className="sr-only">Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
