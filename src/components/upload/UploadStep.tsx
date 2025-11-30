import React, { useState } from 'react';
import { FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import FileUploadZone from './FileUploadZone';
import RubricSelector from './RubricSelector';

interface FileWithValidation {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  progress?: number;
}

interface UploadStepProps {
  title: string;
  setTitle: (title: string) => void;
  textInput: string;
  setTextInput: (text: string) => void;
  files: FileWithValidation[];
  setFiles: (files: FileWithValidation[]) => void;
  rubricId: string | null;
  setRubricId: (id: string) => void;
  onSubmit: () => void;
}

const UploadStep = ({ 
  title, 
  setTitle, 
  textInput, 
  setTextInput, 
  files,
  setFiles,
  rubricId,
  setRubricId,
  onSubmit 
}: UploadStepProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFilesAdd = (newFiles: File[]) => {
    const filesWithValidation: FileWithValidation[] = newFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'success' as const
    }));
    setFiles([...files, ...filesWithValidation]);
  };

  const handleFileRemove = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const validateSubmission = (): boolean => {
    const errors: string[] = [];
    
    if (!title.trim()) {
      errors.push('Assignment title is required');
    }
    
    if (files.length === 0 && !textInput.trim()) {
      errors.push('Please upload at least one file or enter text');
    }

    if (!rubricId) {
      errors.push('Please select a grading rubric');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmitClick = () => {
    if (validateSubmission()) {
      if (showPreview) {
        onSubmit();
      } else {
        setShowPreview(true);
      }
    }
  };

  if (showPreview) {
    return (
      <>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Review Submission</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
              Edit
            </Button>
          </div>

          {/* Title Preview */}
          <div className="p-4 bg-accent/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Assignment Title</p>
            <p className="font-semibold">{title}</p>
          </div>

          {/* Files Preview */}
          {files.length > 0 && (
            <div className="p-4 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Files ({files.length})</p>
              <ul className="space-y-1">
                {files.map(f => (
                  <li key={f.id} className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    {f.file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Text Preview */}
          {textInput && (
            <div className="p-4 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Text Content</p>
              <p className="text-sm whitespace-pre-wrap line-clamp-6">{textInput}</p>
            </div>
          )}

          {/* Rubric Preview */}
          <div className="p-4 bg-accent/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Selected Rubric</p>
            <p className="font-medium">{rubricId}</p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button variant="outline" onClick={() => setShowPreview(false)} className="flex-1">
            Back to Edit
          </Button>
          <Button onClick={onSubmit} className="flex-1 blue-purple-gradient hover:opacity-90">
            Confirm & Submit
          </Button>
        </CardFooter>
      </>
    );
  }

  return (
    <>
      <CardContent className="space-y-6">
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside">
                {validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Title Input */}
        <div>
          <Label htmlFor="title">Assignment Title *</Label>
          <Input 
            id="title" 
            placeholder="e.g., Essay on Climate Change"
            value={title}
            onChange={handleTitleChange}
            className="mt-2"
          />
        </div>
        
        {/* Rubric Selection */}
        <RubricSelector selectedRubricId={rubricId} onRubricSelect={setRubricId} />

        {/* File Upload / Text Input Tabs */}
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="file">Upload Files</TabsTrigger>
            <TabsTrigger value="text">Enter Text</TabsTrigger>
          </TabsList>
          
          <TabsContent value="file" className="space-y-4">
            <FileUploadZone
              files={files}
              onFilesAdd={handleFilesAdd}
              onFileRemove={handleFileRemove}
            />
          </TabsContent>
          
          <TabsContent value="text">
            <Textarea
              placeholder="Paste or type assignment content here..."
              className="min-h-[250px]"
              value={textInput}
              onChange={handleTextChange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmitClick} 
          className="w-full blue-purple-gradient hover:opacity-90"
          disabled={files.length === 0 && !textInput.trim()}
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview & Submit
        </Button>
      </CardFooter>
    </>
  );
};

export default UploadStep;
