
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface AssessmentResult {
  grade: string;
  feedback: string;
}

interface ReviewStepProps {
  assessment: AssessmentResult;
  onApprove: () => void;
  onReset: () => void;
}

const ReviewStep = ({ assessment, onApprove, onReset }: ReviewStepProps) => {
  return (
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
            <div className="text-sm whitespace-pre-line">{assessment.feedback}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col md:flex-row gap-4">
        <Button 
          variant="outline" 
          onClick={onReset}
          className="w-full md:w-auto"
        >
          Start Over
        </Button>
        <Button 
          onClick={onApprove} 
          className="w-full md:w-auto blue-purple-gradient hover:opacity-90"
        >
          Approve & Save
        </Button>
      </CardFooter>
    </>
  );
};

export default ReviewStep;
