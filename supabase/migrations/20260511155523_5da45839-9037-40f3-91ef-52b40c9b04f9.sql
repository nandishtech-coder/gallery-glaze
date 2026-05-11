ALTER VIEW public.public_projects SET (security_invoker = off);
GRANT SELECT ON public.public_projects TO anon, authenticated;