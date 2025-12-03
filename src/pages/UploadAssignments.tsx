
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useActivityLog } from '@/hooks/useActivityLog';
import StepIndicator from '@/components/upload/StepIndicator';
import UploadStep from '@/components/upload/UploadStep';
import AssessmentStep from '@/components/upload/AssessmentStep';
import ReviewStep from '@/components/upload/ReviewStep';

interface FileWithValidation {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  progress?: number;
}

const UploadAssignments = () => {
  const [step, setStep] = useState<'upload' | 'assessment' | 'review'>('upload');
  const [files, setFiles] = useState<FileWithValidation[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessment, setAssessment] = useState<{ grade: string; feedback: string } | null>(null);
  const [title, setTitle] = useState('');
  const [rubricId, setRubricId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logActivity } = useActivityLog();
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStep('assessment');
    
    try {
      // Process first file if available (for now, batch processing would be future enhancement)
      let fileData = null;
      let fileType = null;

      if (files.length > 0) {
        const firstFile = files[0].file;
        fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(firstFile);
        });
        fileType = firstFile.type;
      }

      const { data, error } = await supabase.functions.invoke('generate-ai-feedback', {
        body: {
          assignmentText: textInput.trim(),
          assignmentTitle: title,
          rubricId: rubricId,
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
        description: `Your assignment "${title}" has been graded.`,
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
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
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

      const fileNames = files.map(f => f.file.name).join(', ');
      const contentDescription = textInput || (files.length > 0 ? `[Files: ${fileNames}]` : null);

      const { data: assignmentData, error } = await supabase
        .from('assignments')
        .insert({
          teacher_id: currentUser.id,
          title: title,
          content: contentDescription,
          grade: numericGrade,
          feedback: assessment.feedback,
          status: 'completed',
          rubric_id: rubricId,
          time_saved_minutes: 15 * files.length || 15
        })
        .select()
        .single();

      if (error) throw error;

      // Log file uploads
      if (files.length > 0 && assignmentData) {
        const fileUploads = files.map(f => ({
          user_id: currentUser.id,
          assignment_id: assignmentData.id,
          file_name: f.file.name,
          file_type: f.file.type,
          file_size: f.file.size,
          status: 'uploaded'
        }));

        await supabase.from('file_uploads').insert(fileUploads);
      }

      // Log activity
      await logActivity('assignment_graded', 'assignment', assignmentData?.id, {
        title,
        grade: assessment.grade,
        rubric_id: rubricId
      });

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
    setFiles([]);
    setTextInput('');
    setTitle('');
    setRubricId(null);
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
                  files={files}
                  setFiles={setFiles}
                  rubricId={rubricId}
                  setRubricId={setRubricId}
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
