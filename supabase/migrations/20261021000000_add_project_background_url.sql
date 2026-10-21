ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS background_url TEXT;

DROP VIEW IF EXISTS public.public_projects;
CREATE VIEW public.public_projects WITH (security_invoker = true) AS
SELECT
  id,
  name,
  description,
  CASE WHEN live_enabled THEN live_url ELSE NULL END AS live_url,
  live_enabled,
  project_type,
  thumbnail_url,
  background_url,
  created_at,
  offer_enabled,
  offer_label,
  offer_discount_percent,
  offer_ends_at,
  is_completed,
  project_status
FROM public.projects;

GRANT SELECT ON public.public_projects TO anon, authenticated;
