
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
import { extractTextFromFiles } from '@/services/fileParser';
import { gradeAssignment } from '@/services/aiGrader';

interface FileWithValidation {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  progress?: number;
}

const UploadAssignments = () => {
  const [step, setStep] = useState<'upload' | 'assessment'>('upload');
  const [files, setFiles] = useState<FileWithValidation[]>([]);
  const [textInput, setTextInput] = useState('');
  const [title, setTitle] = useState('');
  const [rubricId, setRubricId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logActivity } = useActivityLog();

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to grade assignments.',
        variant: 'destructive',
      });
      return;
    }

    setStep('assessment');
    let assignmentId: string | null = null;

    try {
      // 1. Extract text from files
      let extracted = textInput.trim();
      if (files.length > 0) {
        const fromFiles = await extractTextFromFiles(files.map((f) => f.file));
        extracted = extracted ? `${extracted}\n\n${fromFiles}` : fromFiles;
      }
      if (!extracted || extracted.length < 10) {
        throw new Error('Could not read any content from your submission.');
      }

      // 2. Call AI grader
      const result = await gradeAssignment({
        assignmentTitle: title,
        assignmentText: extracted,
        rubricId,
      });

      // 3. Save assignment
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('assignments')
        .insert({
          teacher_id: user.id,
          title,
          content: extracted.substring(0, 50000),
          grade: result.score,
          feedback: result.summary,
          status: 'completed',
          rubric_id: rubricId,
          time_saved_minutes: 15 + files.length * 10,
        })
        .select()
        .single();

      if (assignmentError) throw assignmentError;
      assignmentId = assignmentData.id;

      // 4. Save detailed result
      const { error: resultError } = await supabase.from('results').insert({
        assignment_id: assignmentData.id,
        user_id: user.id,
        grade: result.grade,
        score: result.score,
        structure_score: result.criteria.structure,
        clarity_score: result.criteria.clarity,
        grammar_score: result.criteria.grammar,
        evidence_score: result.criteria.evidence,
        summary: result.summary,
        strengths: result.strengths,
        improvements: result.improvements,
        suggestions: result.suggestions,
      });
      if (resultError) console.error('Result insert failed:', resultError);

      // 5. Save file metadata
      if (files.length > 0) {
        await supabase.from('file_uploads').insert(
          files.map((f) => ({
            user_id: user.id,
            assignment_id: assignmentData.id,
            file_name: f.file.name,
            file_type: f.file.type || 'application/octet-stream',
            file_size: f.file.size,
            status: 'processed',
          })),
        );
      }

      await logActivity('assignment_graded', 'assignment', assignmentData.id, {
        title,
        grade: result.grade,
        score: result.score,
      });

      toast({
        title: 'Grading complete',
        description: `${result.grade} • ${result.score}/100`,
      });
      navigate(`/results?id=${assignmentData.id}`);
    } catch (error) {
      console.error('Upload/grading failed:', error);
      // Rollback: delete assignment if it was created but result/log failed
      if (assignmentId) {
        await supabase.from('assignments').delete().eq('id', assignmentId);
      }
      toast({
        title: 'Grading failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
      setStep('upload');
    }
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
              
              {step === 'assessment' && <AssessmentStep title={title} />}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UploadAssignments;
