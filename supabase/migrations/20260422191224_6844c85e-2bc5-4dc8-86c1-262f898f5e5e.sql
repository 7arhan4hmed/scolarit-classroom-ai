-- Enable RLS on results table and add policies so users only see their own results
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own results"
ON public.results
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own results"
ON public.results
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own results"
ON public.results
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own results"
ON public.results
FOR DELETE
USING (auth.uid() = user_id);