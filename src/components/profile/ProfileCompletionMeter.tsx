import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle } from 'lucide-react';

interface ProfileCompletionMeterProps {
  profile: any;
  user: any;
}

const ProfileCompletionMeter = ({ profile, user }: ProfileCompletionMeterProps) => {
  const completionItems = [
    { label: 'Profile picture', completed: !!profile?.avatar_url },
    { label: 'Full name', completed: !!profile?.full_name },
    { label: 'Bio', completed: !!profile?.bio },
    { label: 'Email verified', completed: user?.email_confirmed_at !== null },
  ];

  const completedCount = completionItems.filter(item => item.completed).length;
  const completionPercentage = (completedCount / completionItems.length) * 100;

  return (
    <Card className="border-border/50 shadow-sm bg-gradient-to-br from-[#005558]/5 to-transparent">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Profile Completion</h3>
              <p className="text-sm text-muted-foreground">
                {completedCount} of {completionItems.length} completed
              </p>
            </div>
            <div className="text-3xl font-bold text-[#005558]">{Math.round(completionPercentage)}%</div>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <div className="grid grid-cols-2 gap-2 pt-2">
            {completionItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                {item.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-[#005558]" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={item.completed ? 'text-foreground' : 'text-muted-foreground'}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionMeter;
