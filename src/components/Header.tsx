
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Home, Sparkles, Book, Users, UserCheck, Menu, X, Upload, CheckCheck, MessageSquare, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      await fetchProfile(session.user.id);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="border-b sticky top-0 bg-white z-50">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-lg blue-purple-gradient p-1.5 text-white">
            <BookOpen size={24} />
          </div>
          <span className="text-xl font-bold font-display gradient-text">SCOLARIT</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={`text-sm font-medium ${location.pathname === '/' ? 'text-brand-blue' : 'hover:text-brand-blue'} transition-colors flex items-center gap-1`}>
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link to="/features" className={`text-sm font-medium ${location.pathname === '/features' ? 'text-brand-blue' : 'hover:text-brand-blue'} transition-colors flex items-center gap-1`}>
            <Sparkles className="h-4 w-4" />
            <span>Features</span>
          </Link>
          <Link to="/how-it-works" className={`text-sm font-medium ${location.pathname === '/how-it-works' ? 'text-brand-blue' : 'hover:text-brand-blue'} transition-colors flex items-center gap-1`}>
            <Book className="h-4 w-4" />
            <span>How It Works</span>
          </Link>
          <Link to="/upload" className={`text-sm font-medium ${location.pathname === '/upload' ? 'text-brand-blue' : 'hover:text-brand-blue'} transition-colors flex items-center gap-1`}>
            <Upload className="h-4 w-4" />
            <span>Upload Assignments</span>
          </Link>
          <Link to="/contact" className={`text-sm font-medium ${location.pathname === '/contact' ? 'text-brand-blue' : 'hover:text-brand-blue'} transition-colors flex items-center gap-1`}>
            <MessageSquare className="h-4 w-4" />
            <span>Contact</span>
          </Link>
          
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
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md blue-purple-gradient p-6 no-underline outline-none focus:shadow-md"
                          to="/google-classroom"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Google Classroom Integration
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Seamlessly integrate with Google Classroom to automate your grading workflow
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          to="/for-teachers"
                        >
                          <div className="text-sm font-medium leading-none">For Teachers</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Save time with AI-powered grading and feedback
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          to="/for-students"
                        >
                          <div className="text-sm font-medium leading-none">For Students</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Receive detailed and consistent feedback on your work
                          </p>
                        </Link>
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
        
        {/* Login/Signup or User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {profile?.full_name ? getInitials(profile.full_name) : <User className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    localStorage.removeItem('user');
                    window.location.href = '/';
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" className="text-brand-blue border-brand-blue hover:bg-brand-blue/10" asChild>
                <Link to="/login">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Log in
                </Link>
              </Button>
              <Button className="blue-purple-gradient hover:opacity-90" asChild>
                <Link to="/signup">
                  Try for free
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg z-50 animate-fade-in">
          <div className="container py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/features" 
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles className="h-4 w-4" />
              <span>Features</span>
            </Link>
            <Link 
              to="/how-it-works" 
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Book className="h-4 w-4" />
              <span>How It Works</span>
            </Link>
            <Link 
              to="/upload" 
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Upload className="h-4 w-4" />
              <span>Upload Assignments</span>
            </Link>
            <Link 
              to="/contact" 
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Contact</span>
            </Link>
            <div className="border-t pt-2">
              <p className="px-2 text-sm font-medium text-gray-500">For Educators</p>
              <Link 
                to="/google-classroom" 
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md mt-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users className="h-4 w-4" />
                <span>Google Classroom</span>
              </Link>
              <Link 
                to="/for-teachers" 
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserCheck className="h-4 w-4" />
                <span>For Teachers</span>
              </Link>
              <Link 
                to="/for-students" 
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users className="h-4 w-4" />
                <span>For Students</span>
              </Link>
            </div>
            <div className="flex flex-col gap-2 pt-2 border-t">
              {user ? (
                <>
                  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                        {profile?.full_name ? getInitials(profile.full_name) : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{profile?.full_name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      localStorage.removeItem('user');
                      setMobileMenuOpen(false);
                      window.location.href = '/';
                    }}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="text-brand-blue border-brand-blue hover:bg-brand-blue/10" asChild>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button className="blue-purple-gradient hover:opacity-90" asChild>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      Try for free
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
