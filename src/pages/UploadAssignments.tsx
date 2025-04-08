import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Sparkles, CheckCheck, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Database } from '@/integrations/supabase/types';

type Assignment = Database['public']['Tables']['assignments']['Row'] & {
  course_name?: string;
};

const UploadAssignments = () => {
  const [step, setStep] = useState<'upload' | 'assessment' | 'review'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessment, setAssessment] = useState<{ grade: string; feedback: string } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  
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
      fetchAssignments(session.user.id);
    };
    
    getUser();
  }, [navigate, toast]);
  
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
          courses (
            name
          )
        `)
        .in('course_id', courseIds);
        
      if (assignmentsError) throw assignmentsError;
      
      if (!assignmentsData) {
        setLoadingAssignments(false);
        return;
      }

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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };
  
  const handleSubmit = async () => {
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
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
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
          student_id: user.id,
          content_type: file ? 'file' : 'text',
          text_content: textInput || null,
          file_path: filePath,
        }])
        .select();
        
      if (submissionError) throw submissionError;
      
      if (submission && submission.length > 0) {
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
      }
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

  useEffect(() => {
    // Check if Storage bucket exists, if not create it
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
    
    if (user) {
      setupStorageBucket();
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center gradient-text">
            Upload Assignments
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 'upload' ? 'blue-purple-gradient text-white' : 'bg-gray-200'
                }`}>
                  <Upload size={20} />
                </div>
                <span className={step === 'upload' ? 'font-medium' : 'text-gray-500'}>Upload</span>
              </div>
              
              <div className="h-0.5 w-10 bg-gray-200"></div>
              
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 'assessment' ? 'blue-purple-gradient text-white' : 'bg-gray-200'
                }`}>
                  <Sparkles size={20} />
                </div>
                <span className={step === 'assessment' ? 'font-medium' : 'text-gray-500'}>Assessment</span>
              </div>
              
              <div className="h-0.5 w-10 bg-gray-200"></div>
              
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 'review' ? 'blue-purple-gradient text-white' : 'bg-gray-200'
                }`}>
                  <CheckCheck size={20} />
                </div>
                <span className={step === 'review' ? 'font-medium' : 'text-gray-500'}>Review</span>
              </div>
            </div>
            
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
                    {assignments.length === 0 && !loadingAssignments ? (
                      <Alert className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No assignments available</AlertTitle>
                        <AlertDescription>
                          You don't have any active assignments. Please contact your teacher or enroll in a course.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <>
                        <div className="mb-6">
                          <Label htmlFor="assignment-select" className="mb-2 block">Select Assignment</Label>
                          <Select 
                            value={selectedAssignment} 
                            onValueChange={setSelectedAssignment}
                            disabled={loadingAssignments}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select an assignment" />
                            </SelectTrigger>
                            <SelectContent>
                              {assignments.map((assignment) => (
                                <SelectItem key={assignment.id} value={assignment.id}>
                                  {assignment.title} {assignment.course_name ? `(${assignment.course_name})` : ''}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Tabs defaultValue="file">
                          <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="file">Upload File</TabsTrigger>
                            <TabsTrigger value="text">Enter Text</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="file">
                            <div className="border-2 border-dashed rounded-lg p-12 text-center">
                              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <Label htmlFor="file-upload" className="cursor-pointer">
                                <div className="mb-2 text-brand-blue font-medium">Click to upload</div>
                                <p className="text-sm text-gray-500">
                                  Supported formats: .doc, .docx, .pdf, .txt
                                </p>
                                <Input 
                                  id="file-upload" 
                                  type="file" 
                                  className="hidden" 
                                  accept=".doc,.docx,.pdf,.txt" 
                                  onChange={handleFileChange}
                                />
                              </Label>
                              {file && (
                                <div className="mt-4 text-sm p-2 bg-gray-50 rounded flex items-center justify-between">
                                  <span>{file.name}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setFile(null)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="text">
                            <Textarea
                              placeholder="Enter your assignment text here..."
                              className="min-h-[200px]"
                              value={textInput}
                              onChange={handleTextChange}
                            />
                          </TabsContent>
                        </Tabs>
                      </>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleSubmit} 
                      className="w-full blue-purple-gradient hover:opacity-90"
                      disabled={assignments.length === 0 || !selectedAssignment || (!file && !textInput.trim())}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Submit for Assessment
                    </Button>
                  </CardFooter>
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
                  <CardContent className="flex flex-col items-center py-12">
                    <Sparkles className="h-16 w-16 text-brand-purple animate-pulse mb-4" />
                    <p className="text-center text-lg font-medium mb-2">Processing...</p>
                    <p className="text-center text-gray-500 mb-6">
                      This will take just a moment
                    </p>
                    <div className="w-full max-w-md h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full blue-purple-gradient rounded-full animate-progress"></div>
                    </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Grade</h3>
                        <p className="text-4xl font-bold gradient-text">{assessment.grade}</p>
                      </div>
                      <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Feedback</h3>
                        <p className="text-sm">{assessment.feedback}</p>
                      </div>
                    </div>
                    
                    <Alert className="mt-6" variant="default">
                      <Info className="h-4 w-4" />
                      <AlertTitle>AI-Powered Assessment</AlertTitle>
                      <AlertDescription className="text-sm">
                        This assessment was generated by an AI system. Your teacher may provide additional feedback and adjust the final grade if needed.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                  <CardFooter className="flex flex-col md:flex-row gap-4">
                    <Button 
                      variant="outline" 
                      onClick={handleReset}
                      className="w-full md:w-auto"
                    >
                      Start Over
                    </Button>
                    <Button 
                      onClick={handleApprove} 
                      className="w-full md:w-auto blue-purple-gradient hover:opacity-90"
                    >
                      Approve & Save
                    </Button>
                  </CardFooter>
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
