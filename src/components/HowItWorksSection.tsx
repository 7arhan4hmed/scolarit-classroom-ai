
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
    description: "Import student submissions directly from your LMS or upload files manually.",
    details: [
      "Supports PDF, Word, and text formats",
      "Bulk upload multiple submissions at once",
      "Auto-sync with Google Classroom, Canvas, Moodle & more"
    ]
  },
  {
    icon: <Sparkles className="h-8 w-8 text-white" />,
    title: "AI Assessment",
    description: "Advanced AI analyzes each submission against your custom rubric in seconds.",
    details: [
      "Applies your specific grading criteria",
      "Identifies strengths and areas for improvement",
      "Generates personalized, constructive feedback"
    ]
  },
  {
    icon: <CheckCheck className="h-8 w-8 text-white" />,
    title: "Review & Approve",
    description: "Review AI suggestions, make adjustments, and approve with one click.",
    details: [
      "Edit grades and feedback as needed",
      "Add personal notes or comments",
      "Push results directly to your LMS"
    ]
  }
];

const sampleAssignments = [
  {
    title: "Short Essay Response",
    text: "The Industrial Revolution fundamentally transformed society through mechanization and urbanization. Steam power enabled factories to mass-produce goods, while railroads connected distant markets. This economic shift drew millions from rural farms to crowded cities, creating new social classes and labor movements. However, these advances came at a cost: harsh working conditions, child labor, and environmental degradation challenged the era's progress narrative."
  },
  {
    title: "Science Lab Report",
    text: "Hypothesis: Plants exposed to blue light will grow taller than those under red light. Method: Two identical seedlings were placed under different LED lights for 3 weeks. Results: The blue-light plant grew 12cm vs 8cm for red-light. Conclusion: Blue wavelengths appear more effective for vertical growth, likely due to phototropism and chlorophyll absorption peaks."
  },
  {
    title: "Math Problem Solution",
    text: "Problem: A train travels 120 miles in 2 hours. If it maintains this speed, how far will it travel in 5 hours?\n\nSolution:\nSpeed = Distance ÷ Time = 120 miles ÷ 2 hours = 60 mph\nDistance = Speed × Time = 60 mph × 5 hours = 300 miles\n\nAnswer: The train will travel 300 miles in 5 hours."
  }
];

const integrations = [
  {
    name: 'Google Classroom',
    description: 'Seamlessly sync classes, assignments, and submissions. Push grades and feedback directly to your Google Classroom gradebook.',
    icon: '/google-classroom-icon.png',
    active: true,
    connectAction: 'connect-google',
    features: ['Two-way sync', 'Auto-import rosters', 'Direct gradebook posting']
  },
  {
    name: 'Canvas',
    description: 'Full integration with Canvas LMS. Import assignments, sync submissions, and update grades automatically.',
    icon: '/canvas-icon.png',
    active: true,
    connectAction: 'connect-canvas',
    features: ['SpeedGrader compatible', 'Assignment sync', 'Rubric import']
  },
  {
    name: 'Moodle',
    description: 'Connect your Moodle courses to import student work and export graded assignments with comprehensive feedback.',
    icon: '/moodle-icon.png',
    active: true,
    connectAction: 'connect-moodle',
    features: ['Course integration', 'Batch processing', 'Custom rubrics']
  },
  {
    name: 'Blackboard',
    description: 'Integrate with Blackboard Learn to access submissions, apply grades, and provide detailed feedback seamlessly.',
    icon: '/blackboard-icon.png',
    active: true,
    connectAction: 'connect-blackboard',
    features: ['Grade Center sync', 'Assignment import', 'Feedback export']
  }
];

const HowItWorksSection = () => {
  const [connectingTo, setConnectingTo] = useState<string | null>(null);
  const [connectedServices, setConnectedServices] = useState<string[]>(['Google Classroom']);
  const [activeStep, setActiveStep] = useState(0);
  const [sampleAssignment, setSampleAssignment] = useState('');
  const [selectedSample, setSelectedSample] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ grade: string; feedback: string } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);

  const loadSampleAssignment = (index: number) => {
    setSelectedSample(index);
    setSampleAssignment(sampleAssignments[index].text);
    toast({
      title: "Sample Loaded",
      description: `"${sampleAssignments[index].title}" has been loaded for testing.`,
    });
  };

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
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Three Simple Steps to Transform Your Grading
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            SCOLARIT streamlines your workflow from assignment submission to final grades
          </p>
        </div>
        
        {/* Steps with connecting flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative mb-20">
          {/* Connecting lines for desktop */}
          <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent" 
               style={{width: '50%', left: '25%'}}
          />
          
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center text-center cursor-pointer transition-all duration-500 ${
                activeStep === index ? 'scale-105 animate-slide-up' : 'opacity-70 hover:opacity-100'
              }`}
              onClick={() => handleStepClick(index)}
            >
              {/* Step number badge */}
              <div className="relative mb-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center z-10 transition-all duration-300 shadow-lg ${
                  index === activeStep ? 
                    "blue-purple-gradient animate-pulse-soft" : 
                    "bg-gray-300"
                }`}>
                  {step.icon}
                </div>
                <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  index === activeStep 
                    ? 'bg-white text-brand-purple border-brand-purple' 
                    : 'bg-gray-200 text-gray-600 border-gray-300'
                }`}>
                  {index + 1}
                </div>
              </div>
              
              <h3 className={`text-xl font-bold mb-3 transition-colors ${
                index === activeStep ? 'gradient-text' : 'text-gray-700'
              }`}>
                {step.title}
              </h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                {step.description}
              </p>
              
              {/* Step details */}
              <ul className="space-y-2 text-left w-full max-w-xs">
                {step.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start text-sm text-muted-foreground">
                    <Check className={`h-4 w-4 mr-2 flex-shrink-0 mt-0.5 ${
                      index === activeStep ? 'text-brand-purple' : 'text-gray-400'
                    }`} />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Interactive Demo Area */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl border-2 shadow-lg p-8 md:p-10 mb-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 gradient-text">
              Interactive Demo: Try It Yourself
            </h3>
            <p className="text-muted-foreground">
              Experience SCOLARIT's AI grading in real-time with sample assignments
            </p>
          </div>
          
          {activeStep === 0 && (
            <div className="animate-fade-in">
              {/* Sample assignment selector */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-3 text-gray-700">Choose a sample assignment or write your own:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                  {sampleAssignments.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => loadSampleAssignment(idx)}
                      className={`p-4 text-left border-2 rounded-lg transition-all hover:shadow-md ${
                        selectedSample === idx 
                          ? 'border-brand-purple bg-purple-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm mb-1">{sample.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {sample.text.substring(0, 80)}...
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <Textarea
                value={sampleAssignment}
                onChange={(e) => {
                  setSampleAssignment(e.target.value);
                  setSelectedSample(null);
                }}
                placeholder="Or paste your own student essay, short answer, lab report, or problem solution here..."
                className="min-h-[200px] mb-4 text-base"
              />
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-center text-sm text-gray-700">
                  <Sparkles className="h-5 w-5 text-brand-purple mr-2" />
                  <span>AI will analyze content, structure, accuracy, and provide personalized feedback</span>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleAssignmentSubmit}
                  size="lg"
                  className="blue-purple-gradient hover:opacity-90 text-base px-8"
                  disabled={sampleAssignment.trim().length < 10}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analyze with AI
                </Button>
              </div>
            </div>
          )}
          
          {activeStep === 1 && (
            <div className="animate-fade-in text-center py-8">
              <div className="relative inline-block mb-6">
                <Sparkles className="h-20 w-20 text-brand-purple mx-auto animate-pulse-soft" />
                <div className="absolute inset-0 blue-purple-gradient opacity-20 blur-2xl animate-pulse"></div>
              </div>
              
              <h4 className="text-2xl font-bold mb-3">AI Assessment in Progress</h4>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Our advanced AI is analyzing the submission comprehensively...
              </p>
              
              {/* Progress indicators */}
              <div className="space-y-4 mb-8 max-w-md mx-auto text-left">
                {[
                  { label: 'Analyzing content quality', delay: 0 },
                  { label: 'Evaluating against rubric', delay: 300 },
                  { label: 'Generating personalized feedback', delay: 600 }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center animate-fade-in"
                    style={{animationDelay: `${item.delay}ms`}}
                  >
                    <div className="w-2 h-2 bg-brand-purple rounded-full mr-3 animate-pulse"></div>
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center">
                <div className="h-2 w-80 max-w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full blue-purple-gradient rounded-full animate-progress"></div>
                </div>
              </div>
            </div>
          )}
          
          {activeStep === 2 && result && (
            <div className="animate-scale-up">
              <div className="text-center mb-6">
                <CheckCheck className="h-16 w-16 text-green-600 mx-auto mb-3" />
                <h4 className="text-2xl font-bold mb-2">Assessment Complete!</h4>
                <p className="text-muted-foreground">Review the AI-generated grade and feedback below</p>
              </div>
              
              <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-purple-200">
                  <h4 className="font-semibold mb-3 text-center text-gray-700">Assigned Grade</h4>
                  <div className="text-5xl font-bold gradient-text text-center mb-2">{result.grade}</div>
                  <p className="text-xs text-center text-muted-foreground">Based on standard rubric</p>
                </div>
                <div className="col-span-1 md:col-span-2 bg-gray-50 p-6 rounded-xl border">
                  <h4 className="font-semibold mb-3 text-gray-700 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-brand-purple" />
                    Personalized Feedback
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{result.feedback}</p>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-gray-600">
                      💡 <strong>Pro tip:</strong> You can edit this feedback to add personal touches before sending to students
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setActiveStep(0);
                    setSampleAssignment('');
                    setSelectedSample(null);
                    setResult(null);
                    toast({
                      title: "Reset Complete",
                      description: "Try another sample assignment or enter your own.",
                    });
                  }}
                >
                  Try Another Sample
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setActiveStep(0);
                    toast({
                      title: "Edit Mode",
                      description: "You can now modify the feedback before approving.",
                    });
                  }}
                >
                  Edit Feedback
                </Button>
                <Button 
                  size="lg"
                  className="blue-purple-gradient hover:opacity-90"
                  onClick={handleApprove}
                >
                  <CheckCheck className="mr-2 h-5 w-5" />
                  Approve & Send
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 shadow-lg p-8 md:p-10 max-w-6xl mx-auto mb-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">
              Seamless LMS Integration
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect SCOLARIT with your existing Learning Management System for a unified grading experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {integrations.map((integration, index) => (
              <div 
                key={index} 
                className="group border-2 rounded-xl p-6 bg-white flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:border-brand-purple"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                      <img 
                        src={integration.icon} 
                        alt={`${integration.name} icon`} 
                        className="h-9 w-9 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-bold text-gray-900">{integration.name}</h4>
                      {isConnected(integration.name) && (
                        <span className="inline-flex items-center text-green-600 text-xs font-semibold mt-1">
                          <Check size={14} className="mr-1" />
                          Connected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed flex-grow mb-4">
                  {integration.description}
                </p>
                
                {/* Features list */}
                <ul className="space-y-2 mb-6">
                  {integration.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handleConnect(integration)}
                  variant={isConnected(integration.name) ? "outline" : "default"}
                  className={`w-full ${isConnected(integration.name) ? 'border-green-300 text-green-700 hover:bg-green-50' : 'blue-purple-gradient hover:opacity-90'}`}
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
                    'Connect Now'
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
