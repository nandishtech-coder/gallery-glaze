
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  live_url TEXT,
  github_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can see full row (including github_url) or modify
CREATE POLICY "Authenticated can view all" ON public.projects
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update" ON public.projects
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete" ON public.projects
  FOR DELETE TO authenticated USING (true);

-- Public view exposes everything EXCEPT github_url
CREATE VIEW public.public_projects
WITH (security_invoker = off) AS
SELECT id, name, description, live_url, thumbnail_url, created_at
FROM public.projects;

GRANT SELECT ON public.public_projects TO anon, authenticated;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
