import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useUserSettings } from '@/hooks/useUserSettings';
import { Bell, Loader2 } from 'lucide-react';

interface NotificationsSectionProps {
  userId: string;
}

const NotificationsSection = ({ userId }: NotificationsSectionProps) => {
  const { settings, loading, updateSettings } = useUserSettings();
  const { toast } = useToast();

  const handleToggle = async (key: 'email_notifications' | 'push_notifications' | 'grading_reminders') => {
    if (!settings) return;

    const result = await updateSettings({
      [key]: !settings[key],
    });

    if (result.success) {
      toast({
        title: 'Preferences updated',
        description: 'Your notification preferences have been saved.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update preferences.',
      });
    }
  };

  if (loading) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="border-b bg-card">
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
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="border-b bg-card">
        <CardTitle className="text-xl flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <CardDescription>Manage how you receive notifications and updates</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings?.email_notifications ?? true}
              onCheckedChange={() => handleToggle('email_notifications')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive browser push notifications
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings?.push_notifications ?? true}
              onCheckedChange={() => handleToggle('push_notifications')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="grading-reminders" className="text-base">Grading Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get reminders for pending assignments
              </p>
            </div>
            <Switch
              id="grading-reminders"
              checked={settings?.grading_reminders ?? true}
              onCheckedChange={() => handleToggle('grading_reminders')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsSection;
