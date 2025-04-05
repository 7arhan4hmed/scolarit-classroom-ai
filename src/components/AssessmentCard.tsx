
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeedbackItem {
  text: string;
  type: 'positive' | 'suggestion';
}

const initialFeedback: FeedbackItem[] = [
  { text: 'Strong thesis and supporting arguments', type: 'positive' },
  { text: 'Well-structured paragraphs with clear transitions', type: 'positive' },
  { text: 'Consider adding more specific examples', type: 'suggestion' },
];

const AssessmentCard: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [studentResponse, setStudentResponse] = useState('');
  const [feedback, setFeedback] = useState<FeedbackItem[]>(initialFeedback);
  const [score, setScore] = useState(86);
  const { toast } = useToast();

  const handleResponseSubmit = () => {
    if (studentResponse.trim().length < 10) {
      toast({
        title: "Response too short",
        description: "Please enter a more detailed response for assessment.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate API processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setShowResult(true);
      
      // Generate feedback based on response length
      const newFeedback = [...initialFeedback];
      if (studentResponse.length > 50) {
        newFeedback.push({ 
          text: 'Good use of evidence to support claims', 
          type: 'positive' 
        });
        setScore(92);
      }
      setFeedback(newFeedback);
      
      toast({
        title: "Assessment complete",
        description: "Your essay has been evaluated by our AI."
      });
    }, 1500);
  };

  const handleReset = () => {
    setShowResult(false);
    setStudentResponse('');
    setFeedback(initialFeedback);
    setScore(86);
  };

  const handleApprove = () => {
    toast({
      title: "Assessment approved",
      description: "The feedback has been saved and sent to the student."
    });
    handleReset();
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border p-4 max-w-md mx-auto animate-float">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center">
          <span className="font-medium text-brand-purple">AI</span>
        </div>
        <div>
          <h3 className="font-medium">Automated Assessment</h3>
          <p className="text-sm text-muted-foreground">
            {isProcessing ? "Processing essay response..." : showResult ? "Assessment complete" : "Enter student response"}
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm">Student response on "The impact of climate change"</p>
          {!showResult ? (
            <Textarea
              value={studentResponse}
              onChange={(e) => setStudentResponse(e.target.value)}
              className="mt-2 min-h-16 bg-white"
              placeholder="Type or paste student response here..."
              disabled={isProcessing}
            />
          ) : (
            <div className="h-16 bg-gray-100 rounded mt-2 p-2 text-xs overflow-y-auto">
              {studentResponse}
            </div>
          )}
        </div>
        
        {isProcessing && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-blue"></div>
          </div>
        )}
        
        {showResult && (
          <div className="bg-brand-blue/5 border-l-2 border-brand-blue rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center">
                <span className="text-xs font-medium text-brand-blue">AI</span>
              </div>
              <h4 className="text-sm font-medium">Feedback Summary</h4>
            </div>
            <ul className="space-y-1">
              {feedback.map((item, index) => (
                <li key={index} className="text-xs flex gap-1.5">
                  <CheckCircle 
                    className={`h-3.5 w-3.5 ${
                      item.type === 'positive' ? 'text-brand-teal' : 'text-brand-orange'
                    } flex-shrink-0 mt-0.5`} 
                  />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          {showResult ? (
            <>
              <div>
                <span className="text-sm font-medium">Score: </span>
                <span className="text-sm text-brand-blue font-semibold">{score}/100</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleReset}>Edit</Button>
                <Button 
                  size="sm" 
                  className="bg-brand-blue hover:bg-brand-blue/90"
                  onClick={handleApprove}
                >
                  Approve
                </Button>
              </div>
            </>
          ) : (
            <Button 
              className="w-full bg-brand-blue hover:bg-brand-blue/90" 
              size="sm"
              onClick={handleResponseSubmit}
              disabled={isProcessing || studentResponse.length === 0}
            >
              {isProcessing ? "Processing..." : "Submit for assessment"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentCard;
