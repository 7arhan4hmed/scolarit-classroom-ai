import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Lock, Mail, CheckCircle, XCircle, Monitor, Loader2, LogOut } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface SecuritySectionProps {
  user: any;
}

const SecuritySection = ({ user }: SecuritySectionProps) => {
  const [changingPassword, setChangingPassword] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [loggingOutAll, setLoggingOutAll] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    // Mock recent activity - in production, this would come from auth logs
    setRecentActivity([
      { device: 'Chrome on Windows', location: 'New York, US', time: 'Current session' },
      { device: 'Safari on iPhone', location: 'New York, US', time: '2 hours ago' },
    ]);
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'New passwords do not match.',
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Password must be at least 6 characters long.',
      });
      return;
    }

    setChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setPasswordData({
        newPassword: '',
        confirmPassword: '',
      });
      
      toast({
        title: 'Success',
        description: 'Password updated successfully.',
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update password.',
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleResendVerification = async () => {
    setSendingVerification(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user?.email,
      });

      if (error) throw error;

      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox for the verification link.',
      });
    } catch (error: any) {
      console.error('Error sending verification email:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to send verification email.',
      });
    } finally {
      setSendingVerification(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    setLoggingOutAll(true);
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Logged out from all devices.',
      });
      
      // Refresh the page to redirect to login
      window.location.href = '/login';
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to log out from all devices.',
      });
    } finally {
      setLoggingOutAll(false);
    }
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="border-b bg-card">
        <CardTitle className="text-xl">Security</CardTitle>
        <CardDescription>Manage your password, email verification, and sessions</CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        {/* Email Verification Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium">Email Verification</Label>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            {user?.email_confirmed_at ? (
              <Badge variant="default" className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-orange-500/10 text-orange-700 hover:bg-orange-500/20 border-orange-200">
                <XCircle className="h-3 w-3 mr-1" />
                Not Verified
              </Badge>
            )}
          </div>
          {!user?.email_confirmed_at && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendVerification}
              disabled={sendingVerification}
            >
              {sendingVerification ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend Verification Email'
              )}
            </Button>
          )}
        </div>

        <Separator />

        {/* Password Change */}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <Label className="text-base font-semibold flex items-center gap-2 mb-4">
              <Lock className="h-4 w-4" />
              Change Password
            </Label>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
                <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={changingPassword || !passwordData.newPassword || !passwordData.confirmPassword}
            className="bg-[#005558] hover:bg-[#004445]"
          >
            {changingPassword ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Update Password
              </>
            )}
          </Button>
        </form>

        <Separator />

        {/* Recent Activity */}
        <div className="space-y-4">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Recent Login Activity
          </Label>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{activity.device}</p>
                    <p className="text-xs text-muted-foreground">{activity.location}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Session Management */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">Session Management</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Log out from all devices except this one
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <LogOut className="mr-2 h-4 w-4" />
                Log Out from Other Devices
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Log out from all devices?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will end all active sessions on other devices. You'll need to log in again on those devices.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogoutAllDevices} disabled={loggingOutAll}>
                  {loggingOutAll ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    'Log Out All'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySection;
