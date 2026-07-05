ALTER VIEW public.public_testimonials SET (security_invoker = true);
CREATE POLICY "Public can view approved testimonials safe"
ON public.testimonials FOR SELECT
TO anon, authenticated
USING (approved = true);
