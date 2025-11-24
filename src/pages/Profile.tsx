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
import { User, Mail, BookOpen, Upload, Loader2, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('user');
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully.',
      });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to log out.',
      });
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#005558]">My Profile</h1>
            <p className="text-gray-500 mt-1">Manage your account information</p>
          </div>

          <div className="grid gap-6">
            {/* Profile Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Upload a profile picture to personalize your account</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {profile?.full_name ? getInitials(profile.full_name) : <User />}
                    </AvatarFallback>
                  </Avatar>
                  {uploadingAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-sm text-gray-600 mb-3">
                    JPG, PNG or WEBP. Max size 2MB.
                  </p>
                  <div>
                    <Input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      disabled={uploadingAvatar}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploadingAvatar ? 'Uploading...' : 'Upload Picture'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="pl-10 bg-gray-50"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="user_type">Account Type</Label>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <Badge variant={profile?.user_type === 'teacher' ? 'default' : 'secondary'}>
                          {profile?.user_type === 'teacher' ? 'Teacher' : 'Student'}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="full_name"
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          placeholder="Enter your full name"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio || ''}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        maxLength={500}
                      />
                      <p className="text-xs text-gray-500 text-right">
                        {formData.bio?.length || 0}/500
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={updating}
                      className="bg-[#005558] hover:bg-[#005558]/90"
                    >
                      {updating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
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

            {/* Account Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Manage your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full md:w-auto"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
