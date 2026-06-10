ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS discount_percent integer NOT NULL DEFAULT 0
CHECK (discount_percent >= 0 AND discount_percent <= 100);