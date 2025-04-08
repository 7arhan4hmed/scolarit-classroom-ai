
import React from 'react';
import { Sparkles } from 'lucide-react';

const AssessmentProcessing = () => {
  return (
    <div className="flex flex-col items-center py-12">
      <Sparkles className="h-16 w-16 text-brand-purple animate-pulse mb-4" />
      <p className="text-center text-lg font-medium mb-2">Processing...</p>
      <p className="text-center text-gray-500 mb-6">
        This will take just a moment
      </p>
      <div className="w-full max-w-md h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full blue-purple-gradient rounded-full animate-progress"></div>
      </div>
    </div>
  );
};

export default AssessmentProcessing;
