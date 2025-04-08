
import React from 'react';
import { Upload, Sparkles, CheckCheck } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: 'upload' | 'assessment' | 'review';
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          currentStep === 'upload' ? 'blue-purple-gradient text-white' : 'bg-gray-200'
        }`}>
          <Upload size={20} />
        </div>
        <span className={currentStep === 'upload' ? 'font-medium' : 'text-gray-500'}>Upload</span>
      </div>
      
      <div className="h-0.5 w-10 bg-gray-200"></div>
      
      <div className="flex items-center gap-2">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          currentStep === 'assessment' ? 'blue-purple-gradient text-white' : 'bg-gray-200'
        }`}>
          <Sparkles size={20} />
        </div>
        <span className={currentStep === 'assessment' ? 'font-medium' : 'text-gray-500'}>Assessment</span>
      </div>
      
      <div className="h-0.5 w-10 bg-gray-200"></div>
      
      <div className="flex items-center gap-2">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          currentStep === 'review' ? 'blue-purple-gradient text-white' : 'bg-gray-200'
        }`}>
          <CheckCheck size={20} />
        </div>
        <span className={currentStep === 'review' ? 'font-medium' : 'text-gray-500'}>Review</span>
      </div>
    </div>
  );
};

export default StepIndicator;
