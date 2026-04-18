import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useActivityLog } from '@/hooks/useActivityLog';
import { User, Mail, BookOpen, Loader2, Camera, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import ProfileCompletionMeter from '@/components/profile/ProfileCompletionMeter';
import SecuritySection from '@/components/profile/SecuritySection';
import ConnectedAccountsSection from '@/components/profile/ConnectedAccountsSection';
import NotificationsSection from '@/components/profile/NotificationsSection';
import PrivacySection from '@/components/profile/PrivacySection';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logActivity } = useActivityLog();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser(session.user);
      await fetchProfile(session.user.id);
    } catch (error) {
      console.error('Error checking user:', error);
      navigate('/login');
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          bio: data.bio || '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load profile information.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        toast({ variant: 'destructive', title: 'Error', description: 'File size must be less than 2MB.' });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please upload an image file.' });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split('/').pop();
        await supabase.storage.from('avatars').remove([`${user.id}/${oldPath}`]);
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      toast({ title: 'Photo updated', description: 'Your profile picture has been updated.' });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to upload profile picture.' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile({ ...profile, ...formData });
      await logActivity('profile_updated', 'profile', user.id, {
        updated_fields: ['full_name', 'bio']
      });

      toast({ title: 'Changes saved successfully', description: 'Your profile has been updated.' });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update profile.' });
    } finally {
      setUpdating(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 blue-purple-text">Account Settings</h1>
            <p className="text-muted-foreground">Manage your profile, security and preferences</p>
          </div>

          <div className="grid gap-6">
            {/* Profile Header Card — compact identity block */}
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <div className="h-24 blue-purple-gradient" />
              <CardContent className="p-6 -mt-12">
                <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                  <div className="relative group shrink-0">
                    <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                      <AvatarFallback className="text-2xl blue-purple-gradient text-white">
                        {profile?.full_name ? getInitials(profile.full_name) : <User className="h-10 w-10" />}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      disabled={uploadingAvatar}
                      className="absolute inset-0 flex items-center justify-center bg-black/55 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                      aria-label="Change photo"
                    >
                      {uploadingAvatar ? (
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      ) : (
                        <Camera className="h-6 w-6 text-white" />
                      )}
                    </button>
                    <Input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1 sm:pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-2xl font-semibold text-foreground">
                        {profile?.full_name || 'Unnamed user'}
                      </h2>
                      <Badge variant="secondary" className="capitalize">
                        {profile?.user_type || 'user'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    disabled={uploadingAvatar}
                    className="sm:pb-2"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <ProfileCompletionMeter profile={profile} user={user} />

            {/* Account Information */}
            <Card className="border-border/50 shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="border-b">
                <CardTitle className="text-xl">Account Information</CardTitle>
                <CardDescription>Update your personal details and bio</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-sm font-medium">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="full_name"
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          placeholder="John Doe"
                          className="pl-10 transition-all focus-visible:ring-primary/40"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Visible to other users</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="pl-10 bg-muted/50 cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Email cannot be modified</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user_type" className="text-sm font-medium">Account Type</Label>
                    <Select value={profile?.user_type} disabled>
                      <SelectTrigger className="w-full bg-muted/50 cursor-not-allowed">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Account type cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio || ''}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Share a brief description about yourself, your interests, or teaching philosophy..."
                      rows={5}
                      maxLength={500}
                      className="resize-none transition-all focus-visible:ring-primary/40"
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">A short intro shown on your profile</p>
                      <p className="text-xs text-muted-foreground font-medium">{formData.bio?.length || 0}/500</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={updating}
                      className="blue-purple-gradient text-white border-0 hover:opacity-90 transition-all shadow-sm hover:shadow-md"
                    >
                      {updating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/dashboard')}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Security */}
            <SecuritySection user={user} />

            {/* Notifications */}
            <NotificationsSection userId={user.id} />

            {/* Connected Accounts */}
            <ConnectedAccountsSection user={user} />

            {/* Danger Zone */}
            <PrivacySection user={user} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
