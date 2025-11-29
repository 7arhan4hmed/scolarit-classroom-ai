
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
      let fileData = null;
      let fileType = null;

      // If file is uploaded, convert it to base64
      if (file) {
        fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        fileType = file.type;
      }

      const { data, error } = await supabase.functions.invoke('generate-ai-feedback', {
        body: {
          assignmentText: textInput.trim(),
          assignmentTitle: title,
          fileData,
          fileType
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
  
  const handleApprove = async () => {
    if (!assessment) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save assignments.",
          variant: "destructive",
        });
        return;
      }

      // Convert letter grade to numeric (simplified conversion)
      const gradeMap: { [key: string]: number } = {
        'A+': 97, 'A': 93, 'A-': 90,
        'B+': 87, 'B': 83, 'B-': 80,
        'C+': 77, 'C': 73, 'C-': 70,
        'D+': 67, 'D': 63, 'D-': 60,
        'F': 50
      };
      
      const numericGrade = gradeMap[assessment.grade] || null;

      const { error } = await supabase
        .from('assignments')
        .insert({
          teacher_id: user.id,
          title: title,
          content: textInput || (file ? `[File uploaded: ${file.name}]` : null),
          grade: numericGrade,
          feedback: assessment.feedback,
          status: 'completed',
          time_saved_minutes: 15 // Estimate 15 minutes saved per assignment
        });

      if (error) throw error;

      toast({
        title: "Assessment saved",
        description: "The assessment has been saved to your dashboard.",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving assignment:", error);
      toast({
        title: "Failed to save",
        description: error instanceof Error ? error.message : "An error occurred while saving the assignment.",
        variant: "destructive"
      });
    }
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
