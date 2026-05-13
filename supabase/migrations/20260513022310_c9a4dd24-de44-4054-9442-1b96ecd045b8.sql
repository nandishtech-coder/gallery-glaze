
-- Profiles table for approval workflow
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT false,
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update profiles" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete profiles" ON public.profiles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Replace handle_new_user: owner email auto-admin + approved; everyone else pending
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_owner BOOLEAN := lower(NEW.email) = 'contactnandishtech@gmail.com';
BEGIN
  INSERT INTO public.profiles (user_id, email, approved, approved_at)
  VALUES (NEW.id, NEW.email, is_owner, CASE WHEN is_owner THEN now() ELSE NULL END);

  IF is_owner THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Backfill: owner if already exists
INSERT INTO public.profiles (user_id, email, approved, approved_at)
SELECT id, email, true, now() FROM auth.users
WHERE lower(email) = 'contactnandishtech@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET approved = true, approved_at = COALESCE(public.profiles.approved_at, now());

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users
WHERE lower(email) = 'contactnandishtech@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Backfill: all other existing users as pending
INSERT INTO public.profiles (user_id, email, approved)
SELECT id, email, false FROM auth.users
WHERE lower(email) <> 'contactnandishtech@gmail.com'
ON CONFLICT (user_id) DO NOTHING;
