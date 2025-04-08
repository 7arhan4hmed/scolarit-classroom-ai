
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Authentication required",
          description: "Please log in to submit assignments.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }
      setUser(session.user);
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
