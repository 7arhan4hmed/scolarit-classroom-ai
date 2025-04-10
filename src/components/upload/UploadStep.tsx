
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardContent, CardFooter } from '@/components/ui/card';

interface UploadStepProps {
  title: string;
  setTitle: (title: string) => void;
  textInput: string;
  setTextInput: (text: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  onSubmit: () => void;
}

const UploadStep = ({ 
  title, 
  setTitle, 
  textInput, 
  setTextInput, 
  file, 
  setFile, 
  onSubmit 
}: UploadStepProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Assignment Title</Label>
          <Input 
            id="title" 
            placeholder="Enter assignment title"
            value={title}
            onChange={handleTitleChange}
            className="mt-1"
          />
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
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onSubmit} 
          className="w-full blue-purple-gradient hover:opacity-90"
        >
          <FileText className="mr-2 h-4 w-4" />
          Submit for Assessment
        </Button>
      </CardFooter>
    </>
  );
};

export default UploadStep;
