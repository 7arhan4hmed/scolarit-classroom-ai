
import React from 'react';
import { Loader2 } from 'lucide-react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AssessmentStepProps {
  title: string;
}

const AssessmentStep = ({ title }: AssessmentStepProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Assessing Your Assignment</CardTitle>
        <CardDescription>
          Our AI is analyzing your submission...
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center py-12">
        <div className="flex items-center justify-center">
          <Loader2 className="h-16 w-16 text-brand-purple animate-spin" />
        </div>
        <p className="text-center text-lg font-medium mt-6 mb-2">Processing...</p>
        <p className="text-center text-gray-500 mb-6">
          {title ? `Analyzing "${title}"` : "Analyzing your submission"}
        </p>
        <div className="w-full max-w-md h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full blue-purple-gradient rounded-full animate-progress"></div>
        </div>
      </CardContent>
    </>
  );
};

export default AssessmentStep;
