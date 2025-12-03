import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

type ActivityAction = 
  | 'assignment_created'
  | 'assignment_graded'
  | 'assignment_updated'
  | 'assignment_deleted'
  | 'profile_updated'
  | 'settings_updated'
  | 'file_uploaded'
  | 'rubric_created'
  | 'login'
  | 'logout';

type EntityType = 'assignment' | 'profile' | 'settings' | 'file' | 'rubric' | 'auth';

export const useActivityLog = () => {
  const { user } = useAuth();

  const logActivity = async (
    action: ActivityAction,
    entityType: EntityType,
    entityId?: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return;

    try {
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action,
        entity_type: entityType,
        entity_id: entityId,
        metadata: metadata || {},
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  return { logActivity };
};
