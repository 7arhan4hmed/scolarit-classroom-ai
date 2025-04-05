
import React, { useState } from 'react';
import { Upload, Sparkles, CheckCheck, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const steps = [
  {
    icon: <Upload className="h-8 w-8 text-white" />,
    title: "Upload Assignments",
    description: "Simply upload student work through our intuitive interface or integrate with your existing LMS."
  },
  {
    icon: <Sparkles className="h-8 w-8 text-white" />,
    title: "AI Assessment",
    description: "Our AI analyzes submissions using Google's Gemini API, applying your rubric and standards."
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
    description: 'Connect EduGrade to your Google Classroom to automatically import classes, assignments, and student submissions.',
    icon: '/google-classroom-icon.png',
    active: true,
    connectAction: 'connect-google'
  },
  {
    name: 'Canvas',
    description: 'Integrate with Canvas LMS to sync your courses and assignments.',
    icon: '/canvas-icon.png',
    active: false,
    connectAction: 'connect-canvas'
  },
  {
    name: 'Moodle',
    description: 'Connect with Moodle to streamline your grading workflow.',
    icon: '/moodle-icon.png',
    active: false,
    connectAction: 'connect-moodle'
  },
  {
    name: 'Blackboard',
    description: 'Coming soon: integrate EduGrade with Blackboard Learn.',
    icon: '/blackboard-icon.png',
    active: false,
    connectAction: 'connect-blackboard'
  }
];

const HowItWorksSection = () => {
  const [connectingTo, setConnectingTo] = useState<string | null>(null);
  const [connectedServices, setConnectedServices] = useState<string[]>(['Google Classroom']);
  const { toast } = useToast();

  const handleConnect = (integration: typeof integrations[0]) => {
    if (!integration.active) {
      toast({
        title: "Coming Soon",
        description: `${integration.name} integration is coming soon. Stay tuned!`,
      });
      return;
    }

    setConnectingTo(integration.name);
    
    // Simulate API connection
    setTimeout(() => {
      if (!connectedServices.includes(integration.name)) {
        setConnectedServices([...connectedServices, integration.name]);
      }
      setConnectingTo(null);
      
      toast({
        title: "Connected Successfully",
        description: `Your ${integration.name} account is now connected to EduGrade.`,
      });
    }, 1500);
  };

  const isConnected = (name: string) => connectedServices.includes(name);
  
  return (
    <section id="how-it-works" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-bg opacity-[0.03] -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How EduGrade Works
          </h2>
          <p className="text-lg text-muted-foreground">
            A simple three-step process that transforms hours of grading into minutes of review.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (visible on md screens and up) */}
          <div className="absolute top-24 left-0 right-0 h-0.5 bg-brand-blue/20 hidden md:block"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center z-10 mb-6 ${
                index === 0 ? "bg-brand-blue" : 
                index === 1 ? "bg-brand-purple" : "bg-brand-teal"
              }`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 bg-white rounded-xl border shadow-sm p-8 max-w-4xl mx-auto">
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
                  className={`w-full ${isConnected(integration.name) ? 'border-green-200 text-green-700 hover:bg-green-50' : 'bg-brand-blue hover:bg-brand-blue/90'}`}
                  disabled={connectingTo !== null || (!integration.active && !isConnected(integration.name))}
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
                    <>
                      {integration.active ? 'Connect' : 'Coming Soon'}
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
          
          {isConnected('Google Classroom') && (
            <div className="mt-8 p-5 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-lg font-medium text-green-800 mb-2">Google Classroom Connected!</h4>
              <p className="text-green-700 mb-4">Your Google Classroom account is now connected to EduGrade. You can now:</p>
              <ul className="list-disc pl-5 text-green-700 space-y-1">
                <li>Import your classes and student roster</li>
                <li>See assignments and due dates</li>
                <li>Automatically collect submissions</li>
                <li>Push grades and feedback directly to Google Classroom</li>
              </ul>
              <Button variant="outline" className="mt-4 border-green-300 text-green-700 hover:bg-green-100">
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
