CREATE TABLE public.site_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  heading text NOT NULL DEFAULT 'We''re Here To Do Better Business.',
  subheading text NOT NULL DEFAULT 'Our skilled professionals bring years of experience in software development, automation testing, and digital solutions tailored to your business needs.',
  projects_count text NOT NULL DEFAULT '350+',
  projects_label text NOT NULL DEFAULT 'Project has been completed',
  success_rate text NOT NULL DEFAULT '5.0%',
  success_label text NOT NULL DEFAULT 'Companies success rate',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_stats TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_stats TO authenticated;
GRANT ALL ON public.site_stats TO service_role;

ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view site stats" ON public.site_stats FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins insert site stats" ON public.site_stats FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update site stats" ON public.site_stats FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete site stats" ON public.site_stats FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER site_stats_updated_at BEFORE UPDATE ON public.site_stats FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_stats (projects_count, success_rate) VALUES ('50+', '5.0%');