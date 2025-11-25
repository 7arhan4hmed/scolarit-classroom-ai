import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface ConnectedAccountsSectionProps {
  user: any;
}

const ConnectedAccountsSection = ({ user }: ConnectedAccountsSectionProps) => {
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkConnectedProviders();
  }, [user]);

  const checkConnectedProviders = () => {
    // Check if user has connected OAuth providers
    const providers: string[] = [];
    if (user?.app_metadata?.providers) {
      providers.push(...user.app_metadata.providers);
    }
    if (user?.app_metadata?.provider && !providers.includes(user.app_metadata.provider)) {
      providers.push(user.app_metadata.provider);
    }
    setConnectedProviders(providers);
  };

  const handleConnectGoogle = async () => {
    setConnecting('google');
    try {
      const { error } = await supabase.auth.linkIdentity({
        provider: 'google',
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Google account connected successfully.',
      });
    } catch (error: any) {
      console.error('Error connecting Google:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to connect Google account.',
      });
    } finally {
      setConnecting(null);
    }
  };

  const isConnected = (provider: string) => {
    return connectedProviders.includes(provider);
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="border-b bg-card">
        <CardTitle className="text-xl">Connected Accounts</CardTitle>
        <CardDescription>Link your social accounts for easier sign-in</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-4">
          {/* Google Account */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 24 24" className="h-6 w-6">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">Google</p>
                <p className="text-sm text-muted-foreground">
                  Sign in with your Google account
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isConnected('google') ? (
                <Badge variant="default" className="bg-green-500/10 text-green-700 border-green-200">
                  Connected
                </Badge>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleConnectGoogle}
                  disabled={connecting === 'google'}
                >
                  {connecting === 'google' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect'
                  )}
                </Button>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground pt-2">
            More providers can be added in your Supabase authentication settings
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectedAccountsSection;
