import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Loader2, LogOut, Trash2, ShieldAlert } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface PrivacySectionProps {
  user: any;
}

const PrivacySection = ({ user }: PrivacySectionProps) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('user');
      toast({ title: 'Logged out', description: 'You have been logged out successfully.' });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to log out.' });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast({ variant: 'destructive', title: 'Error', description: 'Please type DELETE to confirm account deletion.' });
      return;
    }

    setDeleting(true);

    try {
      const { error: profileError } = await supabase.from('profiles').delete().eq('id', user.id);
      if (profileError) throw profileError;

      toast({
        title: 'Account deletion initiated',
        description: 'Your account and data will be permanently deleted. You will be logged out.',
      });

      await supabase.auth.signOut();
      navigate('/');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete account. Please contact support.' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="border-destructive/30 shadow-sm bg-destructive/5 transition-shadow hover:shadow-md">
      <CardHeader className="border-b border-destructive/20">
        <CardTitle className="text-xl flex items-center gap-2 text-destructive">
          <ShieldAlert className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>Irreversible actions for your account</CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        {/* Sign Out */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-card border border-border/60 flex-wrap">
          <div>
            <Label className="text-base font-semibold">Sign Out</Label>
            <p className="text-sm text-muted-foreground mt-1">Sign out from this device only</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Delete Account */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-destructive/30 bg-background flex-wrap">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <Label className="text-base font-semibold text-destructive">Delete Account</Label>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Permanently delete your account, profile and all associated data. This action cannot be undone.
              </p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="shadow-sm hover:shadow-md transition-all">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Delete Account Permanently?
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  <span className="block">
                    This will permanently delete your account, profile, and all associated data. This action cannot be undone.
                  </span>
                  <span className="block space-y-2">
                    <Label htmlFor="delete-confirm">
                      Type <span className="font-bold">DELETE</span> to confirm
                    </Label>
                    <Input
                      id="delete-confirm"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="DELETE"
                      className="font-mono mt-2"
                    />
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteConfirmation('')}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleting || deleteConfirmation !== 'DELETE'}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Account'
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

export default PrivacySection;
