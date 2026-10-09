CREATE TABLE public.admin_login_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_id text NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  attempts int NOT NULL DEFAULT 0,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.admin_login_otps TO service_role;
ALTER TABLE public.admin_login_otps ENABLE ROW LEVEL SECURITY;
CREATE INDEX admin_login_otps_session_idx ON public.admin_login_otps(session_id);