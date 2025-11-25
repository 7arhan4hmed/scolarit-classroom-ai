import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bell } from 'lucide-react';

interface NotificationsSectionProps {
  userId: string;
}

const NotificationsSection = ({ userId }: NotificationsSectionProps) => {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    assignmentReminders: true,
    gradeUpdates: true,
    weeklyDigest: false,
    marketingEmails: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadPreferences();
  }, [userId]);

  const loadPreferences = () => {
    // Load from localStorage as a simple implementation
    // In production, this would be stored in the database
    const stored = localStorage.getItem(`notifications_${userId}`);
    if (stored) {
      setPreferences(JSON.parse(stored));
    }
  };

  const handleToggle = (key: keyof typeof preferences) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };
    setPreferences(newPreferences);
    
    // Save to localStorage
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(newPreferences));
    
    toast({
      title: 'Preferences updated',
      description: 'Your notification preferences have been saved.',
    });
  };

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
              checked={preferences.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="assignment-reminders" className="text-base">Assignment Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get reminders for upcoming assignments
              </p>
            </div>
            <Switch
              id="assignment-reminders"
              checked={preferences.assignmentReminders}
              onCheckedChange={() => handleToggle('assignmentReminders')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="grade-updates" className="text-base">Grade Updates</Label>
              <p className="text-sm text-muted-foreground">
                Notifications when grades are posted
              </p>
            </div>
            <Switch
              id="grade-updates"
              checked={preferences.gradeUpdates}
              onCheckedChange={() => handleToggle('gradeUpdates')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-digest" className="text-base">Weekly Digest</Label>
              <p className="text-sm text-muted-foreground">
                Receive a weekly summary of your activity
              </p>
            </div>
            <Switch
              id="weekly-digest"
              checked={preferences.weeklyDigest}
              onCheckedChange={() => handleToggle('weeklyDigest')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails" className="text-base">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new features and tips
              </p>
            </div>
            <Switch
              id="marketing-emails"
              checked={preferences.marketingEmails}
              onCheckedChange={() => handleToggle('marketingEmails')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsSection;
