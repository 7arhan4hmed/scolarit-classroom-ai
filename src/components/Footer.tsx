
import React from 'react';
import { BookOpen, Twitter, Linkedin, Facebook, Instagram, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-blue-600/5 to-purple-500/10 border-t">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg blue-purple-gradient p-1.5 text-white">
                <BookOpen size={24} />
              </div>
              <span className="text-xl font-bold font-display blue-purple-text">SCOLARIT</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering educators with AI-powered grading and feedback tools.
              Supporting UN SDG 4: Quality Education.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-brand-blue/70 hover:text-brand-blue transition-colors">
                <Twitter size={18} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-brand-blue/70 hover:text-brand-blue transition-colors">
                <Linkedin size={18} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-brand-purple/70 hover:text-brand-purple transition-colors">
                <Facebook size={18} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-brand-purple/70 hover:text-brand-purple transition-colors">
                <Instagram size={18} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-brand-purple/70 hover:text-brand-purple transition-colors">
                <Github size={18} />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-brand-blue">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-sm text-muted-foreground hover:text-brand-purple transition-colors">Features</Link></li>
              <li><Link to="/upload" className="text-sm text-muted-foreground hover:text-brand-purple transition-colors">Upload Assignments</Link></li>
              <li><Link to="/google-classroom" className="text-sm text-muted-foreground hover:text-brand-purple transition-colors">Integrations</Link></li>
              <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-brand-purple transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-brand-blue">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-brand-purple transition-colors">How It Works</Link></li>
              <li><Link to="/for-teachers" className="text-sm text-muted-foreground hover:text-brand-purple transition-colors">For Teachers</Link></li>
              <li><Link to="/for-students" className="text-sm text-muted-foreground hover:text-brand-purple transition-colors">For Students</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-brand-purple transition-colors">Support</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-brand-purple transition-colors">Documentation</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-brand-blue">Company</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-brand-purple transition-colors">About</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-brand-purple transition-colors">Careers</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-brand-purple transition-colors">Privacy</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-brand-purple transition-colors">Terms</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-brand-purple transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-600/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-brand-blue/70">
            © 2025 SCOLARIT AI. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-sm">
              <li><Link to="#" className="text-brand-blue/70 hover:text-brand-blue transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-brand-blue/70 hover:text-brand-blue transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="text-brand-blue/70 hover:text-brand-blue transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
