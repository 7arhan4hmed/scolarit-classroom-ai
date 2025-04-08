import React, { useState } from 'react';
import { FileText, AlertCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  course_id: string;
  course_name?: string;
}

interface UploadFormProps {
  assignments: Assignment[];
  loadingAssignments: boolean;
  selectedAssignment: string;
  setSelectedAssignment: (id: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  textInput: string;
  setTextInput: (text: string) => void;
  onSubmit: () => void;
}

const UploadForm = ({
  assignments,
  loadingAssignments,
  selectedAssignment,
  setSelectedAssignment,
  file,
  setFile,
  textInput,
  setTextInput,
  onSubmit
}: UploadFormProps) => {
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };
  
  return (
    <>
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
          
          <div className="mt-6">
            <Button 
              onClick={onSubmit} 
              className="w-full blue-purple-gradient hover:opacity-90"
              disabled={assignments.length === 0 || !selectedAssignment || (!file && !textInput.trim())}
            >
              <Upload className="mr-2 h-4 w-4" />
              Submit for Assessment
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default UploadForm;
