
DROP VIEW IF EXISTS public.public_testimonials;

REVOKE SELECT ON public.testimonials FROM anon;
GRANT SELECT (id, name, company, role, rating, message, created_at, updated_at, approved)
  ON public.testimonials TO anon;
