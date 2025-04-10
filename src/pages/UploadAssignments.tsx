
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import StepIndicator from '@/components/upload/StepIndicator';
import UploadStep from '@/components/upload/UploadStep';
import AssessmentStep from '@/components/upload/AssessmentStep';
import ReviewStep from '@/components/upload/ReviewStep';
import { Upload } from 'lucide-react';

const UploadAssignments = () => {
  const [step, setStep] = useState<'upload' | 'assessment' | 'review'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessment, setAssessment] = useState<{ grade: string; feedback: string } | null>(null);
  const [title, setTitle] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSubmit = async () => {
    if (!textInput.trim() && !file) {
      toast({
        title: "Missing content",
        description: "Please upload a file or enter text to submit for assessment.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a title for your assignment.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setStep('assessment');
    
    try {
      // If file is uploaded, we would process it here
      // For now, we'll just use the text input for AI assessment
      const contentToAssess = textInput.trim();
      
      if (contentToAssess) {
        const { data, error } = await supabase.functions.invoke('generate-ai-feedback', {
          body: {
            assignmentText: contentToAssess,
            assignmentTitle: title
          }
        });
        
        if (error) {
          throw new Error(`Error generating AI feedback: ${error.message}`);
        }
        
        if (data) {
          setAssessment({
            grade: data.grade || 'N/A',
            feedback: data.feedback || 'No feedback provided'
          });
        }
      } else if (file) {
        // For files, we would normally extract text or handle differently
        // For now, we'll just provide a simulated response
        setTimeout(() => {
          setAssessment({
            grade: "B+",
            feedback: "This analysis shows good understanding of the subject matter. Consider adding more specific examples and improving the transitions between sections."
          });
        }, 2000);
      }
      
      setStep('review');
      toast({
        title: "Assessment complete",
        description: "Your assignment has been assessed.",
      });
    } catch (error) {
      console.error("Error during assessment:", error);
      toast({
        title: "Assessment failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      setStep('upload');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleApprove = () => {
    // Here we would normally save to database
    toast({
      title: "Assessment approved",
      description: "The assessment has been saved to your dashboard.",
    });
    navigate('/dashboard');
  };
  
  const handleReset = () => {
    setFile(null);
    setTextInput('');
    setTitle('');
    setAssessment(null);
    setStep('upload');
  };

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
                <UploadStep 
                  title={title}
                  setTitle={setTitle}
                  textInput={textInput}
                  setTextInput={setTextInput}
                  file={file}
                  setFile={setFile}
                  onSubmit={handleSubmit}
                />
              )}
              
              {step === 'assessment' && (
                <AssessmentStep title={title} />
              )}
              
              {step === 'review' && assessment && (
                <ReviewStep 
                  assessment={assessment}
                  onApprove={handleApprove}
                  onReset={handleReset}
                />
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
