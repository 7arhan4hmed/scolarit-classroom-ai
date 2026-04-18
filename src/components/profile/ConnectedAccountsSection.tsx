import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2, Loader2, Link2 } from 'lucide-react';

interface ConnectedAccountsSectionProps {
  user: any;
}

const ConnectedAccountsSection = ({ user }: ConnectedAccountsSectionProps) => {
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkConnectedProviders();
  }, [user]);

  const checkConnectedProviders = () => {
    const providers: string[] = [];
    if (user?.app_metadata?.providers) providers.push(...user.app_metadata.providers);
    if (user?.app_metadata?.provider && !providers.includes(user.app_metadata.provider)) {
      providers.push(user.app_metadata.provider);
    }
    setConnectedProviders(providers);
  };

  const handleConnectGoogle = async () => {
    setConnecting('google');
    try {
      const { error } = await supabase.auth.linkIdentity({ provider: 'google' });
      if (error) throw error;
      toast({ title: 'Redirecting…', description: 'Continue in the Google window to finish linking.' });
    } catch (error: any) {
      console.error('Error connecting Google:', error);
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to connect Google account.' });
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnectGoogle = async () => {
    setDisconnecting('google');
    try {
      const { data, error: listError } = await supabase.auth.getUserIdentities();
      if (listError) throw listError;
      const googleIdentity = data?.identities?.find((i: any) => i.provider === 'google');
      if (!googleIdentity) throw new Error('No Google identity found');
      const { error } = await supabase.auth.unlinkIdentity(googleIdentity);
      if (error) throw error;
      setConnectedProviders((prev) => prev.filter((p) => p !== 'google'));
      toast({ title: 'Disconnected', description: 'Your Google account has been unlinked.' });
    } catch (error: any) {
      console.error('Error disconnecting Google:', error);
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to disconnect.' });
    } finally {
      setDisconnecting(null);
    }
  };

  const isConnected = (provider: string) => connectedProviders.includes(provider);
  const googleConnected = isConnected('google');

  return (
    <Card className="border-border/50 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="border-b">
        <CardTitle className="text-xl flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          Connected Accounts
        </CardTitle>
        <CardDescription>Link social accounts for faster sign-in</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 p-4 border border-border/60 rounded-lg bg-card hover:bg-muted/30 transition-colors flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center border shadow-sm">
                <svg viewBox="0 0 24 24" className="h-6 w-6">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Google</p>
                  {googleConnected ? (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">Not connected</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Sign in faster with your Google account</p>
              </div>
            </div>
            <div>
              {googleConnected ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnectGoogle}
                  disabled={disconnecting === 'google'}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  {disconnecting === 'google' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Disconnecting...
                    </>
                  ) : (
                    'Disconnect'
                  )}
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleConnectGoogle}
                  disabled={connecting === 'google'}
                  className="blue-purple-gradient text-white border-0 hover:opacity-90 transition-all shadow-sm hover:shadow-md"
                >
                  {connecting === 'google' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect Google'
                  )}
                </Button>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground pt-1">
            More providers can be enabled in your Supabase authentication settings.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectedAccountsSection;
