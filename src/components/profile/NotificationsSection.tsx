import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useUserSettings } from '@/hooks/useUserSettings';
import { Bell, Mail, Smartphone, Clock, Loader2 } from 'lucide-react';

interface NotificationsSectionProps {
  userId: string;
}

const NotificationsSection = ({ userId }: NotificationsSectionProps) => {
  const { settings, loading, updateSettings } = useUserSettings();
  const { toast } = useToast();

  const handleToggle = async (key: 'email_notifications' | 'push_notifications' | 'grading_reminders') => {
    if (!settings) return;

    const result = await updateSettings({ [key]: !settings[key] });

    if (result.success) {
      toast({ title: 'Preferences updated', description: 'Your notification preferences have been saved.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update preferences.' });
    }
  };

  const items: {
    key: 'email_notifications' | 'push_notifications' | 'grading_reminders';
    icon: React.ElementType;
    title: string;
    description: string;
  }[] = [
    {
      key: 'email_notifications',
      icon: Mail,
      title: 'Email Notifications',
      description: 'Updates, summaries and account alerts sent to your inbox.',
    },
    {
      key: 'push_notifications',
      icon: Smartphone,
      title: 'Push Notifications',
      description: 'Real-time browser notifications when something needs your attention.',
    },
    {
      key: 'grading_reminders',
      icon: Clock,
      title: 'Grading Reminders',
      description: 'Gentle nudges for pending assignments waiting on your review.',
    },
  ];

  if (loading) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-xl flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Loading your notification preferences...</CardDescription>
        </CardHeader>
        <CardContent className="p-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="border-b">
        <CardTitle className="text-xl flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <CardDescription>Choose how SCOLARIT keeps you in the loop</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-3">
          {items.map(({ key, icon: Icon, title, description }) => {
            const checked = settings?.[key] ?? true;
            return (
              <div
                key={key}
                className="flex items-start justify-between gap-4 p-4 rounded-lg border border-border/60 bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor={key} className="text-sm font-medium cursor-pointer">
                      {title}
                    </Label>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
                <Switch
                  id={key}
                  checked={checked}
                  onCheckedChange={() => handleToggle(key)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsSection;
