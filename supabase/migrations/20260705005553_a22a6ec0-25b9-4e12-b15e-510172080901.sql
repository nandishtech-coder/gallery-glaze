
DROP POLICY IF EXISTS "Public can view approved testimonials" ON public.testimonials;

CREATE OR REPLACE VIEW public.public_testimonials AS
SELECT id, name, company, role, rating, message, created_at
FROM public.testimonials
WHERE approved = true;

GRANT SELECT ON public.public_testimonials TO anon, authenticated;
