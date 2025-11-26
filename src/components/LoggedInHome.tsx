import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, BarChart3, MessageSquare, Grid3x3 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LoggedInHomeProps {
  userName?: string;
}

const LoggedInHome = ({ userName }: LoggedInHomeProps) => {
  const quickActions = [
    {
      title: 'Upload Assignment',
      description: 'Upload and grade student work',
      icon: Upload,
      link: '/upload-assignments',
      color: 'from-blue-600 to-blue-500',
    },
    {
      title: 'Grading Dashboard',
      description: 'View all graded assignments',
      icon: BarChart3,
      link: '/dashboard',
      color: 'from-purple-600 to-purple-500',
    },
    {
      title: 'Feedback History',
      description: 'Review past AI feedback',
      icon: MessageSquare,
      link: '/dashboard?tab=assignments',
      color: 'from-blue-500 to-purple-500',
    },
    {
      title: 'Integrations',
      description: 'Connect your LMS platforms',
      icon: Grid3x3,
      link: '/dashboard?tab=integrations',
      color: 'from-purple-500 to-blue-600',
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome back{userName ? `, ${userName}` : ' to SCOLARIT'}
            </h1>
            <p className="text-lg text-muted-foreground">
              Ready to streamline your grading workflow? Choose an action below to get started.
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} to={action.link}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 cursor-pointer group">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{action.title}</CardTitle>
                      <CardDescription className="text-base">
                        {action.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Recent Activity Section */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Your activity at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold blue-purple-text">--</div>
                    <p className="text-sm text-muted-foreground mt-1">Assignments This Week</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold blue-purple-text">--</div>
                    <p className="text-sm text-muted-foreground mt-1">Hours Saved</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold blue-purple-text">--</div>
                    <p className="text-sm text-muted-foreground mt-1">Average Grade</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Need help?{' '}
              <Link to="/how-it-works" className="text-primary hover:underline">
                Learn how SCOLARIT works
              </Link>
              {' or '}
              <Link to="/contact" className="text-primary hover:underline">
                contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoggedInHome;
