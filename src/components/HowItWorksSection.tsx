
import React, { useState } from 'react';
import { Upload, Sparkles, CheckCheck, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    icon: <Upload className="h-8 w-8 text-white" />,
    title: "Upload Assignments",
    description: "Simply upload student work through our intuitive interface or integrate with your existing LMS."
  },
  {
    icon: <Sparkles className="h-8 w-8 text-white" />,
    title: "AI Assessment",
    description: "Our AI analyzes submissions, applying your rubric and standards."
  },
  {
    icon: <CheckCheck className="h-8 w-8 text-white" />,
    title: "Review & Approve",
    description: "Quickly review AI-generated grades and personalized feedback before sending to students."
  }
];

const integrations = [
  {
    name: 'Google Classroom',
    description: 'Connect SCOLARIT to your Google Classroom to automatically import classes, assignments, and student submissions.',
    icon: '/google-classroom-icon.png',
    active: true,
    connectAction: 'connect-google'
  },
  {
    name: 'Canvas',
    description: 'Integrate with Canvas LMS to sync your courses and assignments.',
    icon: '/canvas-icon.png',
    active: true,
    connectAction: 'connect-canvas'
  },
  {
    name: 'Moodle',
    description: 'Connect with Moodle to streamline your grading workflow.',
    icon: '/moodle-icon.png',
    active: true,
    connectAction: 'connect-moodle'
  },
  {
    name: 'Blackboard',
    description: 'Integrate SCOLARIT with Blackboard Learn for seamless grading.',
    icon: '/blackboard-icon.png',
    active: true,
    connectAction: 'connect-blackboard'
  }
];

const HowItWorksSection = () => {
  const [connectingTo, setConnectingTo] = useState<string | null>(null);
  const [connectedServices, setConnectedServices] = useState<string[]>(['Google Classroom']);
  const [activeStep, setActiveStep] = useState(0);
  const [sampleAssignment, setSampleAssignment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ grade: string; feedback: string } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);

  const handleConnect = (integration: typeof integrations[0]) => {
    setConnectingTo(integration.name);
    
    if (integration.name === 'Google Classroom') {
      setTimeout(() => {
        setConnectingTo(null);
        navigate('/google-classroom');
      }, 1000);
      return;
    }
    
    // Simulate API connection for other integrations
    setTimeout(() => {
      if (!connectedServices.includes(integration.name)) {
        setConnectedServices([...connectedServices, integration.name]);
      }
      setConnectingTo(null);
      
      toast({
        title: "Connected Successfully",
        description: `Your ${integration.name} account is now connected to SCOLARIT.`,
      });
      
      if (integration.name === 'Canvas') {
        navigate('/canvas');
      } else if (integration.name === 'Moodle') {
        navigate('/moodle');
      } else if (integration.name === 'Blackboard') {
        navigate('/blackboard');
      }
    }, 1500);
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex === 0 || (stepIndex === 1 && sampleAssignment.trim().length > 0) || 
        (stepIndex === 2 && result !== null)) {
      setActiveStep(stepIndex);
    } else if (stepIndex === 1 && sampleAssignment.trim().length === 0) {
      toast({
        title: "Upload Required",
        description: "Please enter a sample assignment first.",
      });
    }
  };

  const handleAssignmentSubmit = () => {
    if (sampleAssignment.trim().length < 10) {
      toast({
        title: "Too Short",
        description: "Please enter a longer sample assignment for analysis.",
      });
      return;
    }

    setIsProcessing(true);
    setActiveStep(1);

    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      setResult({
        grade: "B+",
        feedback: "Good work overall. The response demonstrates understanding of key concepts, but could benefit from more specific examples and clearer organization. Consider expanding on your analysis in the second paragraph."
      });
      setActiveStep(2);
      
      toast({
        title: "Analysis Complete",
        description: "Your sample assignment has been graded.",
      });
    }, 2000);
  };

  const handleApprove = () => {
    toast({
      title: "Feedback Approved",
      description: "The grade and feedback have been approved and would be sent to the student in a real scenario.",
    });
    
    // Redirect to dashboard on approval
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };
  
  const handleScheduleDemo = () => {
    setShowDemoModal(true);
    toast({
      title: "Demo Requested",
      description: "Thank you for your interest! A team member will contact you shortly to schedule your personalized demo.",
    });
    
    // Close modal after a delay
    setTimeout(() => {
      setShowDemoModal(false);
    }, 3000);
  };

  const isConnected = (name: string) => connectedServices.includes(name);
  
  return (
    <section id="how-it-works" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-bg opacity-[0.03] -z-10" />
      
      <div className="container mx-auto px-4">        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative mb-16">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center text-center cursor-pointer transition-all duration-300 ${
                activeStep === index ? 'scale-105' : 'opacity-80 hover:opacity-100'
              }`}
              onClick={() => handleStepClick(index)}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center z-10 mb-6 transition-colors ${
                index === activeStep ? 
                  "blue-purple-gradient" : 
                  "bg-gray-300"
              }`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
        
        {/* Interactive Demo Area */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl border shadow-sm p-8 mb-16">
          <h3 className="text-xl font-semibold mb-6 text-center">Try It Yourself</h3>
          
          {activeStep === 0 && (
            <div className="animate-fade-in">
              <p className="mb-4 text-center text-muted-foreground">Enter a sample student response to see how SCOLARIT works:</p>
              <Textarea
                value={sampleAssignment}
                onChange={(e) => setSampleAssignment(e.target.value)}
                placeholder="Paste a student essay or short answer response here..."
                className="min-h-[150px] mb-4"
              />
              <div className="flex justify-center">
                <Button 
                  onClick={handleAssignmentSubmit}
                  className="blue-purple-gradient hover:opacity-90"
                >
                  Submit for Analysis
                </Button>
              </div>
            </div>
          )}
          
          {activeStep === 1 && (
            <div className="animate-fade-in text-center">
              <Sparkles className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">AI is analyzing the submission...</h4>
              <p className="text-muted-foreground mb-6">
                Our AI is evaluating the response against standard rubrics and looking for key concepts.
              </p>
              <div className="flex justify-center">
                <div className="h-2 w-64 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full blue-purple-gradient animate-pulse rounded-full" style={{width: isProcessing ? '100%' : '0%', transition: 'width 2s ease-in-out'}}></div>
                </div>
              </div>
            </div>
          )}
          
          {activeStep === 2 && result && (
            <div className="animate-fade-in">
              <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-center">Grade</h4>
                  <div className="text-4xl font-bold text-blue-600 text-center">{result.grade}</div>
                </div>
                <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Feedback</h4>
                  <p className="text-muted-foreground">{result.feedback}</p>
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setActiveStep(0);
                    toast({
                      title: "Edit Requested",
                      description: "You can now modify the feedback before approving.",
                    });
                  }}
                >
                  Edit Feedback
                </Button>
                <Button 
                  className="blue-purple-gradient hover:opacity-90"
                  onClick={handleApprove}
                >
                  Approve & Send
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-xl border shadow-sm p-8 max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-semibold mb-6 text-center">Seamlessly Integrates With Your Workflow</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="border rounded-lg p-6 bg-gray-50 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center shadow-sm">
                    <img 
                      src={integration.icon} 
                      alt={`${integration.name} icon`} 
                      className="h-8 w-8 object-contain"
                      onError={(e) => {
                        // Fallback if image doesn't load
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <h4 className="text-lg font-medium ml-3">{integration.name}</h4>
                  {isConnected(integration.name) && (
                    <span className="ml-auto flex items-center text-green-600 text-sm font-medium">
                      <Check size={16} className="mr-1" />
                      Connected
                    </span>
                  )}
                </div>
                
                <p className="text-muted-foreground text-sm flex-grow mb-4">
                  {integration.description}
                </p>
                
                <Button 
                  onClick={() => handleConnect(integration)}
                  variant={isConnected(integration.name) ? "outline" : "default"}
                  className={`w-full ${isConnected(integration.name) ? 'border-green-200 text-green-700 hover:bg-green-50' : 'blue-purple-gradient hover:opacity-90'}`}
                  disabled={connectingTo !== null}
                >
                  {connectingTo === integration.name ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></div>
                      Connecting...
                    </>
                  ) : isConnected(integration.name) ? (
                    <>
                      <ExternalLink size={16} className="mr-2" />
                      Manage Connection
                    </>
                  ) : (
                    'Connect'
                  )}
                </Button>
              </div>
            ))}
          </div>
          
          {/* Demo Request Button */}
          <div className="mt-8 flex justify-center">
            <Button 
              onClick={handleScheduleDemo}
              size="lg"
              className="blue-purple-gradient hover:opacity-90"
            >
              Schedule a Personalized Demo
            </Button>
          </div>
          
          {/* Demo Modal */}
          {showDemoModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Demo Request Received</h3>
                <p className="mb-6">Thank you for your interest in SCOLARIT! Our team will contact you shortly to schedule your personalized demo.</p>
                <div className="flex justify-end">
                  <Button onClick={() => setShowDemoModal(false)}>Close</Button>
                </div>
              </div>
            </div>
          )}
          
          {isConnected('Google Classroom') && (
            <div className="mt-8 p-5 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-lg font-medium text-green-800 mb-2">Google Classroom Connected!</h4>
              <p className="text-green-700 mb-4">Your Google Classroom account is now connected to SCOLARIT. You can now:</p>
              <ul className="list-disc pl-5 text-green-700 space-y-1">
                <li>Import your classes and student roster</li>
                <li>See assignments and due dates</li>
                <li>Automatically collect submissions</li>
                <li>Push grades and feedback directly to Google Classroom</li>
              </ul>
              <Button 
                variant="outline" 
                className="mt-4 border-green-300 text-green-700 hover:bg-green-100"
                onClick={() => navigate('/google-classroom')}
              >
                View Connected Classes
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
