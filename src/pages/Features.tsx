
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Bot, MessageSquare, ClipboardCheck, Upload, BarChart3, Link2, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Bot,
    title: "AI Grading",
    description: "Automatically evaluate assignments with consistent, objective AI-powered assessment."
  },
  {
    icon: MessageSquare,
    title: "Detailed Feedback",
    description: "Provide personalized, constructive feedback tailored to each student's work."
  },
  {
    icon: ClipboardCheck,
    title: "Rubric Support",
    description: "Align assessments with custom rubrics and curriculum standards effortlessly."
  },
  {
    icon: Upload,
    title: "Bulk Uploads",
    description: "Process multiple assignments simultaneously to save time on large classes."
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track student progress and performance trends with comprehensive insights."
  },
  {
    icon: Link2,
    title: "LMS Integrations",
    description: "Seamlessly connect with Google Classroom, Canvas, Moodle, and Blackboard."
  },
  {
    icon: Shield,
    title: "Secure Data Handling",
    description: "Enterprise-grade security ensures your student data remains private and protected."
  }
];

const Features = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Powerful Features for Modern Educators
            </h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to streamline grading, provide better feedback, and focus on what matters most—teaching.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card 
                    key={index}
                    className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2 text-foreground">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Feature Categories */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
              Built for Your Workflow
            </h2>
            
            <div className="space-y-12">
              {/* Assessment Tools */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                  <div className="h-1 w-12 bg-primary rounded-full"></div>
                  Assessment Tools
                </h3>
                <p className="text-muted-foreground leading-relaxed pl-16">
                  From AI-powered grading to custom rubrics, SCOLARIT gives you complete control over how you assess student work. Upload assignments individually or in bulk, and let our AI handle the heavy lifting while you focus on meaningful teaching interactions.
                </p>
              </div>

              {/* Feedback & Communication */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                  <div className="h-1 w-12 bg-primary rounded-full"></div>
                  Feedback & Communication
                </h3>
                <p className="text-muted-foreground leading-relaxed pl-16">
                  Deliver personalized, actionable feedback at scale. Our AI analyzes student submissions and generates detailed comments highlighting strengths and areas for improvement, ensuring every student receives the guidance they need to succeed.
                </p>
              </div>

              {/* Analytics & Insights */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                  <div className="h-1 w-12 bg-primary rounded-full"></div>
                  Analytics & Insights
                </h3>
                <p className="text-muted-foreground leading-relaxed pl-16">
                  Make data-driven decisions with comprehensive analytics. Track individual student progress, identify class-wide trends, and measure learning outcomes with easy-to-understand visualizations and reports.
                </p>
              </div>

              {/* Integration & Security */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                  <div className="h-1 w-12 bg-primary rounded-full"></div>
                  Integration & Security
                </h3>
                <p className="text-muted-foreground leading-relaxed pl-16">
                  Works seamlessly with your existing tools. Connect to popular learning management systems like Google Classroom, Canvas, Moodle, and Blackboard. All student data is encrypted and handled with enterprise-grade security standards.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
