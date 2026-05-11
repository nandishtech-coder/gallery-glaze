-- Revert view to safe defaults
ALTER VIEW public.public_projects SET (security_invoker = on);

-- Allow public read on projects table, but only for non-sensitive columns
CREATE POLICY "Public can view projects"
  ON public.projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Lock down column access: revoke all, then grant only safe columns to anon/authenticated
REVOKE SELECT ON public.projects FROM anon, authenticated;
GRANT SELECT (id, name, description, live_url, thumbnail_url, created_at, updated_at)
  ON public.projects TO anon, authenticated;
-- Admins read github_url via service role / explicit grant
GRANT SELECT (github_url) ON public.projects TO authenticated;