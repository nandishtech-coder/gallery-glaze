
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS offer_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS offer_label text NOT NULL DEFAULT 'Offer ends soon',
  ADD COLUMN IF NOT EXISTS offer_discount_percent integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS offer_ends_at timestamptz;

DROP VIEW IF EXISTS public.public_projects;
CREATE VIEW public.public_projects AS
  SELECT id, name, description, live_url, thumbnail_url, created_at,
         offer_enabled, offer_label, offer_discount_percent, offer_ends_at
  FROM public.projects;

GRANT SELECT ON public.public_projects TO anon, authenticated;
