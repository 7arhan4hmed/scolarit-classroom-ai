-- Create assignments table
CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL,
  student_name TEXT,
  title TEXT NOT NULL,
  content TEXT,
  grade NUMERIC(5,2),
  feedback TEXT,
  time_saved_minutes INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for teacher access
CREATE POLICY "Teachers can view their own assignments" 
ON public.assignments 
FOR SELECT 
USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can create their own assignments" 
ON public.assignments 
FOR INSERT 
WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own assignments" 
ON public.assignments 
FOR UPDATE 
USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own assignments" 
ON public.assignments 
FOR DELETE 
USING (auth.uid() = teacher_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_assignments_updated_at
BEFORE UPDATE ON public.assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_assignments_teacher_id ON public.assignments(teacher_id);
CREATE INDEX idx_assignments_status ON public.assignments(status);