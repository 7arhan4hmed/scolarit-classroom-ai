import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const integrations = [
  {
    name: "Google Classroom",
    description: "Seamlessly sync assignments and grades with Google Classroom",
    icon: "https://www.gstatic.com/images/branding/product/2x/classroom_48dp.png",
    features: ["Auto-sync assignments", "Grade export", "Student roster sync"]
  },
  {
    name: "Canvas",
    description: "Direct integration with Canvas LMS for streamlined workflow",
    icon: "https://www.instructure.com/themes/canvas/images/apple-touch-icon.png",
    features: ["Assignment import", "SpeedGrader sync", "Rubric alignment"]
  },
  {
    name: "Moodle",
    description: "Connect with Moodle to manage assignments and feedback",
    icon: "https://moodle.com/wp-content/uploads/2020/05/moodle-logo.svg",
    features: ["Course sync", "Gradebook integration", "Quiz support"]
  },
  {
    name: "Blackboard",
    description: "Full integration with Blackboard Learn for enterprise education",
    icon: "https://www.blackboard.com/themes/custom/themekit/logo.svg",
    features: ["Assignment sync", "Grade center", "Content integration"]
  }
];

const IntegrationsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Works With Your Existing Tools
          </h2>
          <p className="text-lg text-muted-foreground">
            SCOLARIT integrates seamlessly with popular Learning Management Systems
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {integrations.map((integration, index) => (
            <Card key={index} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600/10 to-purple-500/10 mb-4">
                  <img 
                    src={integration.icon} 
                    alt={integration.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <CardTitle className="text-lg">{integration.name}</CardTitle>
                <CardDescription className="text-sm">{integration.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {integration.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <span className="text-primary mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
