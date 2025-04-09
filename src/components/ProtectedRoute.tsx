
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: ('teacher' | 'student')[];
}

const ProtectedRoute = ({ children, allowedUserTypes }: ProtectedRouteProps) => {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    // Store the current path to redirect back after login
    sessionStorage.setItem('redirectPath', location.pathname);
    
    toast({
      title: "Authentication required",
      description: "Please sign in to access this page",
      variant: "destructive",
    });
    
    return <Navigate to="/login" replace />;
  }

  // If user type restrictions are specified and user doesn't match, redirect to appropriate dashboard
  if (profile && allowedUserTypes && !allowedUserTypes.includes(profile.user_type)) {
    toast({
      title: "Access restricted",
      description: `This page is for ${allowedUserTypes.join('/')}s only`,
      variant: "destructive",
    });
    
    // Redirect based on user type
    const redirectPath = profile.user_type === 'teacher' ? '/dashboard' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // If authenticated and passes role check, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
