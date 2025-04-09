
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import GoogleClassroom from "./pages/GoogleClassroom";
import NotFound from "./pages/NotFound";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import UploadAssignments from "./pages/UploadAssignments";
import ForTeachers from "./pages/ForTeachers";
import ForStudents from "./pages/ForStudents";
import Dashboard from "./pages/Dashboard";
import Canvas from "./pages/Canvas";
import Moodle from "./pages/Moodle";
import Blackboard from "./pages/Blackboard";
import Contact from "./pages/Contact";
import ProfileSetup from "./pages/ProfileSetup";
import VideoMeet from "./pages/VideoMeet";
import AuthCallback from "./pages/AuthCallback";

// Add custom keyframes for animations we need
import "./animations.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/features" element={<Features />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/for-teachers" element={<ForTeachers />} />
            <Route path="/for-students" element={<ForStudents />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            
            {/* Protected routes - general auth */}
            <Route path="/profile-setup" element={
              <ProtectedRoute>
                <ProfileSetup />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute>
                <UploadAssignments />
              </ProtectedRoute>
            } />
            <Route path="/video-meet" element={
              <ProtectedRoute>
                <VideoMeet />
              </ProtectedRoute>
            } />
            
            {/* LMS integration routes */}
            <Route path="/google-classroom" element={
              <ProtectedRoute>
                <GoogleClassroom />
              </ProtectedRoute>
            } />
            <Route path="/canvas" element={
              <ProtectedRoute>
                <Canvas />
              </ProtectedRoute>
            } />
            <Route path="/moodle" element={
              <ProtectedRoute>
                <Moodle />
              </ProtectedRoute>
            } />
            <Route path="/blackboard" element={
              <ProtectedRoute>
                <Blackboard />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
