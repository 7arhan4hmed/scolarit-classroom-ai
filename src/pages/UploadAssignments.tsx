
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Import refactored components
import StepIndicator from '@/components/assignments/StepIndicator';
import UploadForm from '@/components/assignments/UploadForm';
import AssessmentProcessing from '@/components/assignments/AssessmentProcessing';
import AssessmentReview from '@/components/assignments/AssessmentReview';
import { useAssignmentSubmission } from '@/hooks/useAssignmentSubmission';

const UploadAssignments = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const getUser = async () => {
      setLoading(true);
      
      try {
        // First set up listener for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === 'SIGNED_IN') {
              setUser(session?.user || null);
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              navigate('/login');
            }
          }
        );
        
        // Then check current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
        } else {
          toast({
            title: "Authentication required",
            description: "Please log in to submit assignments.",
            variant: "destructive",
          });
          navigate('/login');
        }
      } catch (error) {
        console.error("Authentication error:", error);
        toast({
          title: "Authentication error",
          description: "There was a problem checking your login status.",
          variant: "destructive",
        });
        navigate('/login');
      } finally {
        setLoading(false);
      }
      
      return () => {
        // Clean up the subscription when the component unmounts
        subscription?.unsubscribe();
      };
    };
    
    getUser();
  }, [navigate, toast]);
  
  const {
    step,
    file,
    setFile,
    textInput,
    setTextInput,
    assessment,
    assignments,
    selectedAssignment,
    setSelectedAssignment,
    loadingAssignments,
    handleSubmit,
    handleApprove,
    handleReset
  } = useAssignmentSubmission(user?.id);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center gradient-text">
            Upload Assignments
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <StepIndicator currentStep={step} />
            
            <Card>
              {step === 'upload' && (
                <>
                  <CardHeader>
                    <CardTitle>Submit Your Assignment</CardTitle>
                    <CardDescription>
                      Upload a file or enter text directly for assessment.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UploadForm
                      assignments={assignments}
                      loadingAssignments={loadingAssignments}
                      selectedAssignment={selectedAssignment}
                      setSelectedAssignment={setSelectedAssignment}
                      file={file}
                      setFile={setFile}
                      textInput={textInput}
                      setTextInput={setTextInput}
                      onSubmit={handleSubmit}
                    />
                  </CardContent>
                </>
              )}
              
              {step === 'assessment' && (
                <>
                  <CardHeader>
                    <CardTitle>Assessing Your Assignment</CardTitle>
                    <CardDescription>
                      Our AI is analyzing your submission...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AssessmentProcessing />
                  </CardContent>
                </>
              )}
              
              {step === 'review' && assessment && (
                <>
                  <CardHeader>
                    <CardTitle>Assignment Assessment</CardTitle>
                    <CardDescription>
                      Review the AI-generated assessment before finalizing.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AssessmentReview
                      assessment={assessment}
                      onApprove={handleApprove}
                      onReset={handleReset}
                    />
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UploadAssignments;
