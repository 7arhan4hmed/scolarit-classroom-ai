
import React, { useState } from 'react';
import { Bot, Clock, BarChart4, BookOpen, FileText, Users, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const features = [
  {
    icon: <Bot className="h-8 w-8 text-brand-blue" />,
    title: "AI-Powered Grading",
    description: "Automatically evaluate assignments, essays, and tests using Google's Gemini API and Vertex AI for consistent and objective assessment.",
    demo: "ai-demo"
  },
  {
    icon: <Clock className="h-8 w-8 text-brand-purple" />,
    title: "Save 70% of Grading Time",
    description: "Reduce your workload dramatically by automating repetitive assessment tasks while maintaining high-quality feedback.",
    demo: "time-demo"
  },
  {
    icon: <FileText className="h-8 w-8 text-brand-teal" />,
    title: "Personalized Feedback",
    description: "Provide tailored comments and suggestions to each student based on their specific strengths and areas for improvement.",
    demo: "feedback-demo"
  },
  {
    icon: <BarChart4 className="h-8 w-8 text-brand-orange" />,
    title: "Detailed Analytics",
    description: "Track student progress and identify common misconceptions with comprehensive performance analytics and insights.",
    demo: "analytics-demo"
  },
  {
    icon: <BookOpen className="h-8 w-8 text-brand-blue" />,
    title: "Curriculum Alignment",
    description: "Ensure assessments and feedback align perfectly with your curriculum standards and learning objectives.",
    demo: "curriculum-demo"
  },
  {
    icon: <Users className="h-8 w-8 text-brand-purple" />,
    title: "Works for Any Class Size",
    description: "Scale effortlessly from small groups to large classes without compromising on assessment quality or feedback depth.",
    demo: "scaling-demo"
  }
];

const FeaturesSection = () => {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const [activeDemoType, setActiveDemoType] = useState("");
  const [demoInput, setDemoInput] = useState("");
  const [demoResult, setDemoResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLearnMore = (index: number) => {
    setExpandedFeature(expandedFeature === index ? null : index);
  };

  const handleFeatureDemo = (featureTitle: string, demoType: string) => {
    setActiveDemoType(demoType);
    setDemoOpen(true);
    setDemoInput("");
    setDemoResult(null);
  };

  const handleDemoSubmit = () => {
    if (demoInput.trim().length < 10) {
      toast({
        title: "Input too short",
        description: "Please enter a longer sample for analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsLoading(false);
      
      switch (activeDemoType) {
        case "ai-demo":
          setDemoResult({
            grade: "B+",
            feedback: "Good understanding of core concepts. Strong thesis and evidence provided. Work on paragraph structure and transitions."
          });
          break;
        case "feedback-demo":
          setDemoResult({
            strengths: ["Clear thesis statement", "Good use of evidence", "Logical structure"],
            improvements: ["More specific examples needed", "Work on transitions between paragraphs", "Elaborate on your conclusions"]
          });
          break;
        case "analytics-demo":
          setDemoResult({
            competencies: [
              { name: "Critical Thinking", score: 85 },
              { name: "Evidence Usage", score: 78 },
              { name: "Organization", score: 90 },
              { name: "Language Use", score: 82 }
            ]
          });
          break;
        default:
          setDemoResult({
            message: "Feature demo completed successfully!",
            success: true
          });
      }

      toast({
        title: "Demo Completed",
        description: "Check out the results below.",
      });
    }, 1500);
  };

  const getDemoContent = () => {
    switch (activeDemoType) {
      case "ai-demo":
        return (
          <>
            <DialogHeader>
              <DialogTitle>AI-Powered Grading Demo</DialogTitle>
              <DialogDescription>
                Enter a sample student response to see how our AI evaluates it.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {!demoResult ? (
                <>
                  <Textarea 
                    placeholder="Enter a student essay or short answer..."
                    className="min-h-[150px]"
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                  />
                  <Button onClick={handleDemoSubmit} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></div>
                        Processing...
                      </>
                    ) : "Analyze Response"}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-lg font-medium">Grade: {demoResult.grade}</h3>
                    <p className="mt-2">{demoResult.feedback}</p>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setDemoResult(null)} className="mr-2">Try Again</Button>
                    <Button onClick={() => setDemoOpen(false)}>Close Demo</Button>
                  </div>
                </div>
              )}
            </div>
          </>
        );
      
      case "feedback-demo":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Personalized Feedback Demo</DialogTitle>
              <DialogDescription>
                Enter a sample response to see personalized feedback in action.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {!demoResult ? (
                <>
                  <Textarea 
                    placeholder="Enter a student essay or short answer..."
                    className="min-h-[150px]"
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                  />
                  <Button onClick={handleDemoSubmit} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></div>
                        Generating Feedback...
                      </>
                    ) : "Generate Feedback"}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-green-700">Strengths</h3>
                    <ul className="mt-2 space-y-1 list-disc pl-5">
                      {demoResult.strengths.map((strength: string, i: number) => (
                        <li key={i} className="text-green-700">{strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-amber-700">Areas for Improvement</h3>
                    <ul className="mt-2 space-y-1 list-disc pl-5">
                      {demoResult.improvements.map((improvement: string, i: number) => (
                        <li key={i} className="text-amber-700">{improvement}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setDemoResult(null)} className="mr-2">Try Again</Button>
                    <Button onClick={() => setDemoOpen(false)}>Close Demo</Button>
                  </div>
                </div>
              )}
            </div>
          </>
        );

      case "analytics-demo":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Analytics Demo</DialogTitle>
              <DialogDescription>
                Enter a student response to see detailed analytics.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {!demoResult ? (
                <>
                  <Textarea 
                    placeholder="Enter a student essay or short answer..."
                    className="min-h-[150px]"
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                  />
                  <Button onClick={handleDemoSubmit} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></div>
                        Analyzing...
                      </>
                    ) : "Analyze"}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Competency Breakdown</h3>
                  {demoResult.competencies.map((competency: {name: string, score: number}, i: number) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between">
                        <span>{competency.name}</span>
                        <span className="font-medium">{competency.score}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            competency.score >= 90 ? 'bg-green-500' : 
                            competency.score >= 80 ? 'bg-blue-500' : 
                            competency.score >= 70 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{width: `${competency.score}%`}}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setDemoResult(null)} className="mr-2">Try Again</Button>
                    <Button onClick={() => setDemoOpen(false)}>Close Demo</Button>
                  </div>
                </div>
              )}
            </div>
          </>
        );

      default:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Feature Demo</DialogTitle>
              <DialogDescription>
                This feature will be available in the full version.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {!demoResult ? (
                <>
                  <Textarea 
                    placeholder="Enter a sample input..."
                    className="min-h-[150px]"
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                  />
                  <Button onClick={handleDemoSubmit} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></div>
                        Processing...
                      </>
                    ) : "Run Demo"}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p>{demoResult.message}</p>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setDemoResult(null)} className="mr-2">Try Again</Button>
                    <Button onClick={() => setDemoOpen(false)}>Close Demo</Button>
                  </div>
                </div>
              )}
            </div>
          </>
        );
    }
  };

  const handleOpenGoogleClassroom = () => {
    window.location.href = '/google-classroom';
  };

  return (
    <section id="features" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Modern Educators
          </h2>
          <p className="text-lg text-muted-foreground">
            EduGrade combines cutting-edge AI with pedagogical expertise to transform the assessment experience for teachers and students alike.
          </p>
          <div className="mt-6">
            <Button 
              onClick={handleOpenGoogleClassroom} 
              className="bg-brand-blue hover:bg-brand-blue/90"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Connect to Google Classroom
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow"
            >
              <div className="p-2 w-14 h-14 rounded-lg bg-gray-50 mb-4 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              
              {expandedFeature === index && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
                  <h4 className="font-medium mb-2">How it works:</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    This feature uses advanced algorithms to analyze student work against 
                    rubrics and learning objectives, providing consistent and accurate assessments.
                  </p>
                  <Button 
                    onClick={() => handleFeatureDemo(feature.title, feature.demo)}
                    className="text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue/90"
                    size="sm"
                  >
                    Try Demo
                  </Button>
                </div>
              )}
              
              <button 
                onClick={() => handleLearnMore(index)} 
                className="mt-2 text-sm font-medium text-brand-purple hover:text-brand-purple/80"
              >
                {expandedFeature === index ? 'Show Less' : 'Learn More'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="sm:max-w-md">
          {getDemoContent()}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FeaturesSection;
