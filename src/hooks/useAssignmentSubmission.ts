
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Assignment } from '@/components/assignments/UploadForm';

export const useAssignmentSubmission = (userId: string | undefined) => {
  const [step, setStep] = useState<'upload' | 'assessment' | 'review'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessment, setAssessment] = useState<{ grade: string; feedback: string } | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (userId) {
      fetchAssignments(userId);
      setupStorageBucket();
    }
  }, [userId]);

  const setupStorageBucket = async () => {
    const { data: buckets } = await supabase.storage.listBuckets();
    const assignmentsBucketExists = buckets?.some(bucket => bucket.name === 'assignments');
    
    if (!assignmentsBucketExists) {
      await supabase.storage.createBucket('assignments', {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
    }
  };
  
  const fetchAssignments = async (userId: string) => {
    setLoadingAssignments(true);
    try {
      // Get enrollments for the student
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('student_id', userId);
        
      if (enrollmentsError) throw enrollmentsError;
      
      if (!enrollments || enrollments.length === 0) {
        setLoadingAssignments(false);
        return;
      }
      
      // Get course IDs the student is enrolled in
      const courseIds = enrollments.map(enrollment => enrollment.course_id);
      
      // Get assignments for these courses
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select(`
          *,
          courses:course_id (
            name
          )
        `)
        .in('course_id', courseIds);
        
      if (assignmentsError) throw assignmentsError;
      
      const formattedAssignments = assignmentsData.map(assignment => ({
        ...assignment,
        course_name: assignment.courses?.name
      }));
      
      setAssignments(formattedAssignments);
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
      toast({
        title: "Failed to load assignments",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingAssignments(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!userId) return;
    
    if (!selectedAssignment) {
      toast({
        title: "Assignment selection required",
        description: "Please select an assignment to submit for.",
        variant: "destructive",
      });
      return;
    }
    
    if (!file && !textInput.trim()) {
      toast({
        title: "Missing content",
        description: "Please upload a file or enter text to submit for assessment.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let filePath = null;
      
      // If file is uploaded, store it in Supabase Storage
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        
        const { error: storageError } = await supabase.storage
          .from('assignments')
          .upload(fileName, file);
          
        if (storageError) throw storageError;
        
        filePath = fileName;
      }
      
      // Create submission record in database
      const { data: submission, error: submissionError } = await supabase
        .from('submissions')
        .insert([{
          assignment_id: selectedAssignment,
          student_id: userId,
          content_type: file ? 'file' : 'text',
          text_content: textInput || null,
          file_path: filePath,
        }])
        .select();
        
      if (submissionError) throw submissionError;
      
      setSubmissionId(submission[0].id);
      
      // Start AI assessment
      setStep('assessment');
      
      const content = file ? `File submission: ${file.name}` : textInput;
      
      // Call the OpenAI assessment edge function
      const { data: aiResponse, error: aiError } = await supabase.functions
        .invoke('assess-assignment', {
          body: {
            submissionId: submission[0].id,
            contentType: file ? 'file' : 'text',
            content
          }
        });
        
      if (aiError) throw aiError;
      
      setIsSubmitting(false);
      setStep('review');
      setAssessment({
        grade: aiResponse.grade,
        feedback: aiResponse.feedback
      });
      
      toast({
        title: "Assessment complete",
        description: "Your assignment has been assessed.",
      });
    } catch (error: any) {
      console.error('Error submitting assignment:', error);
      setIsSubmitting(false);
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleApprove = async () => {
    try {
      // Update submission status to 'graded'
      if (submissionId) {
        const { error } = await supabase
          .from('submissions')
          .update({ status: 'graded' })
          .eq('id', submissionId);
          
        if (error) throw error;
      }
      
      toast({
        title: "Assessment approved",
        description: "The assessment has been saved to your dashboard.",
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error approving assessment:', error);
      toast({
        title: "Failed to save assessment",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleReset = () => {
    setFile(null);
    setTextInput('');
    setAssessment(null);
    setStep('upload');
    setSubmissionId(null);
  };
  
  return {
    step,
    file,
    setFile,
    textInput,
    setTextInput,
    isSubmitting,
    assessment,
    assignments,
    selectedAssignment,
    setSelectedAssignment,
    loadingAssignments,
    handleSubmit,
    handleApprove,
    handleReset
  };
};
