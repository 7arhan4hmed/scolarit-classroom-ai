
import React, { useState } from 'react';
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
import { Upload, FileText, Sparkles, CheckCheck } from 'lucide-react';

const UploadAssignments = () => {
  const [step, setStep] = useState<'upload' | 'assessment' | 'review'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessment, setAssessment] = useState<{ grade: string; feedback: string } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };
  
  const handleSubmit = () => {
    if (!file && !textInput.trim()) {
      toast({
        title: "Missing content",
        description: "Please upload a file or enter text to submit for assessment.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setStep('assessment');
    
    // Simulate assessment process
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('review');
      setAssessment({
        grade: "B+",
        feedback: "The assignment demonstrates good understanding of the core concepts. There's a clear thesis statement and supporting evidence. Consider adding more specific examples and improving the transitions between paragraphs for a stronger argument flow. The conclusion effectively summarizes the main points but could be strengthened by connecting back to the broader implications of your thesis."
      });
      
      toast({
        title: "Assessment complete",
        description: "Your assignment has been assessed.",
      });
    }, 3000);
  };
  
  const handleApprove = () => {
    toast({
      title: "Assessment approved",
      description: "The assessment has been saved to your dashboard.",
    });
    navigate('/dashboard');
  };
  
  const handleReset = () => {
    setFile(null);
    setTextInput('');
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
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleSubmit} 
                      className="w-full blue-purple-gradient hover:opacity-90"
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
