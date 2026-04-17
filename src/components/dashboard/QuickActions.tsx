import { Card, CardContent } from '@/components/ui/card';
import { Upload, BarChart3, MessageSquare, Grid3x3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const quickActions = [
  {
    title: 'Upload Assignment',
    description: 'Upload and grade student work',
    icon: Upload,
    link: '/upload-assignments',
    color: 'from-primary to-primary/80',
    primary: true,
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

export const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.title} to={action.link} className="block group">
            <Card
              className={`h-full border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/50 ${
                action.primary ? 'border-primary/30 bg-gradient-to-br from-primary/5 to-transparent' : ''
              }`}
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                </div>
                <h3 className="font-semibold text-base leading-tight mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {action.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};
