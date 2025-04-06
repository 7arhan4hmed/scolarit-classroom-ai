
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Home, Sparkles, Book, Users, UserCheck, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b sticky top-0 bg-white z-50">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-brand-blue p-1.5 text-white">
            <BookOpen size={24} />
          </div>
          <span className="text-xl font-bold font-display">EduGrade</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#top" className="text-sm font-medium hover:text-brand-blue transition-colors flex items-center gap-1">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </a>
          <a href="#features" className="text-sm font-medium hover:text-brand-blue transition-colors flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span>Features</span>
          </a>
          <a href="#how-it-works" className="text-sm font-medium hover:text-brand-blue transition-colors flex items-center gap-1">
            <Book className="h-4 w-4" />
            <span>How It Works</span>
          </a>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>For Educators</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-brand-blue/50 to-brand-blue p-6 no-underline outline-none focus:shadow-md"
                          href="/google-classroom"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Google Classroom Integration
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Seamlessly integrate with Google Classroom to automate your grading workflow
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="#features"
                        >
                          <div className="text-sm font-medium leading-none">For Teachers</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Save time with AI-powered grading and feedback
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="#features"
                        >
                          <div className="text-sm font-medium leading-none">For Students</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Receive detailed and consistent feedback on your work
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
        
        {/* Login/Signup Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/login">
              <UserCheck className="mr-2 h-4 w-4" />
              Log in
            </Link>
          </Button>
          <Button className="bg-brand-blue hover:bg-brand-blue/90" asChild>
            <Link to="/signup">
              Try for free
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg z-50 animate-fade-in">
          <div className="container py-4 flex flex-col space-y-4">
            <a 
              href="#top" 
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </a>
            <a 
              href="#features" 
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles className="h-4 w-4" />
              <span>Features</span>
            </a>
            <a 
              href="#how-it-works" 
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Book className="h-4 w-4" />
              <span>How It Works</span>
            </a>
            <div className="border-t pt-2">
              <p className="px-2 text-sm font-medium text-gray-500">For Educators</p>
              <a 
                href="/google-classroom" 
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md mt-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users className="h-4 w-4" />
                <span>Google Classroom</span>
              </a>
              <a 
                href="#features" 
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserCheck className="h-4 w-4" />
                <span>For Teachers</span>
              </a>
            </div>
            <div className="flex flex-col gap-2 pt-2 border-t">
              <Button variant="outline" asChild>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  Log in
                </Link>
              </Button>
              <Button className="bg-brand-blue hover:bg-brand-blue/90" asChild>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  Try for free
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
