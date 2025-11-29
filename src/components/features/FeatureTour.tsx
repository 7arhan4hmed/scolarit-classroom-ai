import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Bot, MessageSquare, ClipboardCheck, Upload, BarChart3, Link2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const tourSteps = [
  {
    icon: Bot,
    title: "AI Grading",
    description: "Automatically evaluate assignments with consistent, objective AI-powered assessment.",
    visual: "grading",
    details: "Our AI analyzes student work against rubrics and standards, providing accurate letter grades and detailed scoring in seconds."
  },
  {
    icon: MessageSquare,
    title: "Detailed Feedback",
    description: "Provide personalized, constructive feedback tailored to each student's work.",
    visual: "feedback",
    details: "Generate specific, actionable comments highlighting strengths and improvement areas for every submission."
  },
  {
    icon: ClipboardCheck,
    title: "Rubric Support",
    description: "Align assessments with custom rubrics and curriculum standards effortlessly.",
    visual: "rubric",
    details: "Create and apply custom rubrics that match your teaching objectives and assessment criteria perfectly."
  },
  {
    icon: Upload,
    title: "Bulk Uploads",
    description: "Process multiple assignments simultaneously to save time on large classes.",
    visual: "upload",
    details: "Upload dozens of assignments at once and let AI grade them all in parallel, saving hours of manual work."
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track student progress and performance trends with comprehensive insights.",
    visual: "analytics",
    details: "Visualize class performance, identify trends, and make data-driven decisions with intuitive charts and reports."
  },
  {
    icon: Link2,
    title: "LMS Integrations",
    description: "Seamlessly connect with Google Classroom, Canvas, Moodle, and Blackboard.",
    visual: "integrations",
    details: "Sync assignments and grades directly with your existing LMS workflow—no manual data entry required."
  },
  {
    icon: Shield,
    title: "Secure Data Handling",
    description: "Enterprise-grade security ensures your student data remains private and protected.",
    visual: "security",
    details: "Bank-level encryption, FERPA compliance, and secure cloud storage protect sensitive student information."
  }
];

const FeatureVisual = ({ visual }: { visual: string }) => {
  const getVisualComponent = () => {
    switch (visual) {
      case 'grading':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-48 h-48 relative"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-primary/20"
              />
              <div className="absolute inset-8 bg-primary/10 rounded-full flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="text-5xl font-bold gradient-text"
                >
                  A+
                </motion.div>
              </div>
            </motion.div>
          </div>
        );
      
      case 'feedback':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="space-y-3 w-full max-w-xs">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-primary/10 p-4 rounded-lg"
                >
                  <div className="h-2 bg-primary/30 rounded mb-2" style={{ width: `${90 - i * 15}%` }} />
                  <div className="h-2 bg-primary/20 rounded" style={{ width: `${70 - i * 10}%` }} />
                </motion.div>
              ))}
            </div>
          </div>
        );
      
      case 'rubric':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                    className="w-8 h-8 bg-primary rounded-full"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        );
      
      case 'upload':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="space-y-2 w-full max-w-xs">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.15, type: "spring" }}
                  className="h-12 bg-primary/10 rounded-lg flex items-center px-4 gap-3"
                >
                  <div className="w-8 h-8 bg-primary/30 rounded" />
                  <div className="flex-1 space-y-1">
                    <div className="h-2 bg-primary/30 rounded w-3/4" />
                    <div className="h-1.5 bg-primary/20 rounded w-1/2" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      
      case 'analytics':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="flex items-end gap-2 h-48">
              {[65, 85, 72, 90, 78].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  className="w-12 bg-primary/20 rounded-t-lg relative"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-primary"
                  >
                    {height}%
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      
      case 'integrations':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-64 h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.15, type: "spring" }}
                    className="absolute w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateY(-80px)`
                    }}
                  >
                    <div className="w-8 h-8 bg-primary rounded-full" />
                  </motion.div>
                ))}
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-primary rounded-full" />
              </div>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="relative"
            >
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 0 0 rgba(var(--primary-rgb), 0.4)",
                    "0 0 0 20px rgba(var(--primary-rgb), 0)",
                    "0 0 0 0 rgba(var(--primary-rgb), 0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center"
              >
                <Shield className="w-16 h-16 text-primary" />
              </motion.div>
            </motion.div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-64 flex items-center justify-center">
      {getVisualComponent()}
    </div>
  );
};

const FeatureTour = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextStep = () => {
    setDirection(1);
    setCurrentStep((prev) => (prev + 1) % tourSteps.length);
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => (prev - 1 + tourSteps.length) % tourSteps.length);
  };

  const goToStep = (index: number) => {
    setDirection(index > currentStep ? 1 : -1);
    setCurrentStep(index);
  };

  const currentFeature = tourSteps[currentStep];
  const Icon = currentFeature.icon;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 gradient-text">
            Interactive Feature Tour
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore SCOLARIT's powerful features through our interactive walkthrough
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="relative overflow-hidden min-h-[500px]">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute inset-0"
                >
                  <div className="flex flex-col h-full">
                    {/* Feature Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-4 rounded-xl bg-primary/10">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2 text-foreground">
                          {currentFeature.title}
                        </h3>
                        <p className="text-muted-foreground text-lg">
                          {currentFeature.description}
                        </p>
                      </div>
                    </div>

                    {/* Visual Demo */}
                    <div className="flex-1 bg-muted/30 rounded-xl p-8 mb-6">
                      <FeatureVisual visual={currentFeature.visual} />
                    </div>

                    {/* Details */}
                    <p className="text-muted-foreground leading-relaxed">
                      {currentFeature.details}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                size="icon"
                onClick={prevStep}
                className="h-10 w-10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              {/* Step Indicators */}
              <div className="flex gap-2">
                {tourSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToStep(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep 
                        ? 'w-8 bg-primary' 
                        : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextStep}
                className="h-10 w-10"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress */}
            <div className="text-center mt-4 text-sm text-muted-foreground">
              {currentStep + 1} of {tourSteps.length}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FeatureTour;