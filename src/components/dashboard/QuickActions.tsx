import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, BarChart3, MessageSquare, Grid3x3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuickActions = () => {
  const quickActions = [
    {
      title: 'Upload Assignment',
      description: 'Upload and grade student work',
      icon: Upload,
      link: '/upload-assignments',
      color: 'from-primary to-primary/80',
    },
    {
      title: 'View Results',
      description: 'View all graded assignments',
      icon: BarChart3,
      link: '/dashboard',
      color: 'from-accent to-accent/80',
    },
    {
      title: 'Feedback History',
      description: 'Review past AI feedback',
      icon: MessageSquare,
      link: '/dashboard',
      color: 'from-secondary to-secondary/80',
    },
    {
      title: 'Integrations',
      description: 'Connect your LMS platforms',
      icon: Grid3x3,
      link: '/google-classroom',
      color: 'from-primary/80 to-accent',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.title} to={action.link}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription className="text-sm">
                  {action.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};
