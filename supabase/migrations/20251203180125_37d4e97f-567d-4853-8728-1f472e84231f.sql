-- Create rubrics table for storing grading rubrics
CREATE TABLE public.rubrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on rubrics
ALTER TABLE public.rubrics ENABLE ROW LEVEL SECURITY;

-- Rubrics policies
CREATE POLICY "Users can view their own rubrics" ON public.rubrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view default rubrics" ON public.rubrics
  FOR SELECT USING (is_default = true);

CREATE POLICY "Users can create their own rubrics" ON public.rubrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rubrics" ON public.rubrics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rubrics" ON public.rubrics
  FOR DELETE USING (auth.uid() = user_id AND is_default = false);

-- Create activity_logs table for tracking user actions
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on activity_logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Activity logs policies
CREATE POLICY "Users can view their own activity" ON public.activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activity logs" ON public.activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create user_settings table for user preferences
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  grading_reminders BOOLEAN DEFAULT true,
  feedback_style TEXT DEFAULT 'balanced',
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- User settings policies
CREATE POLICY "Users can view their own settings" ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings" ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Create file_uploads table for tracking uploaded files
CREATE TABLE public.file_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT,
  status TEXT DEFAULT 'uploaded',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on file_uploads
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;

-- File uploads policies
CREATE POLICY "Users can view their own uploads" ON public.file_uploads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own uploads" ON public.file_uploads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own uploads" ON public.file_uploads
  FOR DELETE USING (auth.uid() = user_id);

-- Add rubric_id column to assignments table
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS rubric_id UUID REFERENCES public.rubrics(id);

-- Create triggers for updated_at
CREATE TRIGGER update_rubrics_updated_at
  BEFORE UPDATE ON public.rubrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default rubrics (system-wide)
INSERT INTO public.rubrics (id, user_id, name, description, criteria, is_default) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'Essay Grading', 'Standard rubric for essay assignments', '[{"name": "Thesis & Argument", "weight": 25}, {"name": "Evidence & Support", "weight": 25}, {"name": "Organization", "weight": 20}, {"name": "Grammar & Style", "weight": 20}, {"name": "Citations", "weight": 10}]', true),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'Research Paper', 'Rubric for research-based assignments', '[{"name": "Research Quality", "weight": 30}, {"name": "Analysis", "weight": 25}, {"name": "Structure", "weight": 20}, {"name": "Writing Quality", "weight": 15}, {"name": "References", "weight": 10}]', true),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'Creative Writing', 'Rubric for creative writing assignments', '[{"name": "Creativity", "weight": 30}, {"name": "Voice & Tone", "weight": 25}, {"name": "Plot/Structure", "weight": 20}, {"name": "Character Development", "weight": 15}, {"name": "Technical Skill", "weight": 10}]', true),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'Technical Report', 'Rubric for technical documentation', '[{"name": "Technical Accuracy", "weight": 30}, {"name": "Clarity", "weight": 25}, {"name": "Completeness", "weight": 20}, {"name": "Format", "weight": 15}, {"name": "Visuals", "weight": 10}]', true);