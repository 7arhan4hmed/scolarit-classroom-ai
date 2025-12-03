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
import { User, Mail, BookOpen, Upload, Loader2, Camera } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
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

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'File size must be less than 2MB.',
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please upload an image file.',
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Delete old avatar if exists
      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split('/').pop();
        await supabase.storage.from('avatars').remove([`${user.id}/${oldPath}`]);
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      
      toast({
        title: 'Success',
        description: 'Profile picture updated successfully.',
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to upload profile picture.',
      });
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
      
      // Log activity
      await logActivity('profile_updated', 'profile', user.id, {
        updated_fields: ['full_name', 'bio']
      });
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile.',
      });
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
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#005558] mb-2">Account Settings</h1>
            <p className="text-muted-foreground">Manage your profile and account preferences</p>
          </div>

          <div className="grid gap-6">
            {/* Profile Completion Meter */}
            <ProfileCompletionMeter profile={profile} user={user} />

            {/* Profile Picture Section - Premium Design */}
            <Card className="overflow-hidden border-border/50 shadow-sm">
              <CardHeader className="border-b bg-card">
                <CardTitle className="text-xl">Profile Picture</CardTitle>
                <CardDescription>Your profile photo appears across the platform</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="relative group">
                    <Avatar className="h-32 w-32 ring-4 ring-border shadow-lg">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                      <AvatarFallback className="text-3xl bg-gradient-to-br from-[#005558] to-[#007a7e] text-white">
                        {profile?.full_name ? getInitials(profile.full_name) : <User className="h-12 w-12" />}
                      </AvatarFallback>
                    </Avatar>
                    {!uploadingAvatar && (
                      <button
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Camera className="h-8 w-8 text-white" />
                      </button>
                    )}
                    {uploadingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left space-y-4">
                    <div>
                      <p className="font-medium text-foreground mb-1">Upload a new photo</p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG or WEBP • Maximum size 2MB
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                        className="hidden"
                      />
                      <Button
                        variant="default"
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                        disabled={uploadingAvatar}
                        className="bg-[#005558] hover:bg-[#004445]"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="border-b bg-card">
                <CardTitle className="text-xl">Personal Information</CardTitle>
                <CardDescription>Update your personal details and bio</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6">
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
                            className="pl-10"
                          />
                        </div>
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
                        className="resize-none"
                      />
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">
                          Your bio will be visible to other users
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">
                          {formData.bio?.length || 0}/500
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={updating}
                      className="bg-[#005558] hover:bg-[#004445]"
                    >
                      {updating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        'Save Changes'
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

            {/* Security Section */}
            <SecuritySection user={user} />

            {/* Connected Accounts */}
            <ConnectedAccountsSection user={user} />

            {/* Notifications */}
            <NotificationsSection userId={user.id} />

            {/* Privacy & Account */}
            <PrivacySection user={user} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
