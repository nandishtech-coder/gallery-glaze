ALTER TABLE public.projects ADD COLUMN project_type text NOT NULL DEFAULT 'Web Application', ADD COLUMN live_enabled boolean NOT NULL DEFAULT true;
UPDATE public.projects SET project_type = 'Web Application' WHERE project_type IS NULL;
DROP VIEW public.public_projects;
CREATE VIEW public.public_projects WITH (security_invoker=true) AS
SELECT id, name, description, CASE WHEN live_enabled THEN live_url ELSE NULL END AS live_url, live_enabled, project_type, thumbnail_url, created_at, offer_enabled, offer_label, offer_discount_percent, offer_ends_at FROM public.projects;
GRANT SELECT ON public.public_projects TO anon, authenticated;