import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface RubricCriteria {
  name: string;
  weight: number;
}

interface Rubric {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  criteria: RubricCriteria[];
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const useRubrics = () => {
  const { user } = useAuth();
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRubrics();
  }, [user]);

  const fetchRubrics = async () => {
    try {
      // Fetch default rubrics and user's custom rubrics
      const { data, error } = await supabase
        .from('rubrics')
        .select('*')
        .or(`is_default.eq.true${user ? `,user_id.eq.${user.id}` : ''}`)
        .order('is_default', { ascending: false })
        .order('name');

      if (error) throw error;
      
      // Parse criteria JSON
      const parsedRubrics = (data || []).map(rubric => ({
        ...rubric,
        criteria: typeof rubric.criteria === 'string' 
          ? JSON.parse(rubric.criteria) 
          : rubric.criteria
      }));
      
      setRubrics(parsedRubrics);
    } catch (error) {
      console.error('Error fetching rubrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRubric = async (
    name: string, 
    description: string, 
    criteria: RubricCriteria[]
  ) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const { data, error } = await supabase
        .from('rubrics')
        .insert([{
          user_id: user.id,
          name,
          description,
          criteria: criteria as any,
          is_default: false,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setRubrics(prev => [...prev, { ...data, criteria }]);
      return { success: true, data };
    } catch (error) {
      console.error('Error creating rubric:', error);
      return { success: false, error };
    }
  };

  const deleteRubric = async (id: string) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('rubrics')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setRubrics(prev => prev.filter(r => r.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting rubric:', error);
      return { success: false, error };
    }
  };

  return { rubrics, loading, createRubric, deleteRubric, refetch: fetchRubrics };
};
