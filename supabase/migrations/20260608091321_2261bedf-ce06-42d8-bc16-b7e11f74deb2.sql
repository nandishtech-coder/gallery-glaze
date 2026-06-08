
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  price_suffix TEXT NOT NULL DEFAULT 'onwards',
  features TEXT[] NOT NULL DEFAULT '{}',
  popular BOOLEAN NOT NULL DEFAULT false,
  cta_label TEXT NOT NULL DEFAULT 'Get Started',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view services" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update services" ON public.services FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete services" ON public.services FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.services (title, description, price, features, popular, sort_order) VALUES
('Website Setup / Deployment', 'I will deploy your website and make it live on the internet.', '₹499', ARRAY['Deploy website on hosting','Connect custom domain (paid)','Fix deployment errors','SSL setup (HTTPS)','Basic performance optimization','Live URL delivery'], true, 1),
('Bug Fixing / Small Tasks', 'Quick fixes and small changes in existing websites or applications.', '₹500', ARRAY['Fix UI/UX issues','Debug frontend/backend errors','Fix API or database issues','Cross-browser fixes','Minor feature updates','Performance improvements','Fast delivery (same day / 1–2 days)'], true, 2),
('Website Maintenance (Monthly)', 'Ensuring your website runs smoothly, securely, and up-to-date without downtime.', '₹1,500', ARRAY['Regular updates','Bug fixing','Performance optimization','Content updates','Backup management','Website monitoring','Email/WhatsApp support'], true, 3),
('Landing Page', 'Single-page website designed to convert visitors into leads or customers.', '₹4,000', ARRAY['Responsive design (mobile-friendly)','Modern UI/UX','Contact form integration','Basic SEO setup','Fast loading speed','WhatsApp / call button integration'], true, 4),
('Portfolio Website', 'Personal or business portfolio website to showcase work.', '₹8,000', ARRAY['Home, About, Projects, Contact pages','Fully responsive design','Clean UI','Contact form','Admin edit option (optional)'], true, 5),
('Business Website', 'Professional multi-page website for businesses.', '₹10,000', ARRAY['5–10 pages','SEO optimization','Contact + WhatsApp integration','Image optimization','Fast performance','Basic analytics setup'], true, 6),
('Full Stack Web Application', 'Complete web application with frontend, backend, and database.', '₹11,000', ARRAY['User authentication (login/signup)','Admin dashboard','Database integration','API integration','Responsive UI','Deployment support'], true, 7),
('Advanced / Custom Projects', 'Custom large-scale applications based on client requirements.', '₹12,000', ARRAY['Complex system architecture','Payment integration','Real-time features','Third-party API integration','Scalable backend','Ongoing support'], true, 8);
