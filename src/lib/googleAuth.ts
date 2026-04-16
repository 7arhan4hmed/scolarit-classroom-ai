import { supabase } from '@/integrations/supabase/client';

export const signInWithGoogle = async (userType?: 'teacher' | 'student') => {
  const redirectTo = `${window.location.origin}/dashboard`;
  if (userType) {
    try {
      sessionStorage.setItem('pending_user_type', userType);
    } catch {}
  }
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
};
