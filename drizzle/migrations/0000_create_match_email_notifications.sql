CREATE TABLE public.match_email_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_key text NOT NULL,
  company_ref text,
  company_name text,
  buyer_email text NOT NULL,
  seller_email text NOT NULL,
  recipient_email text NOT NULL,
  recipient_side text NOT NULL CHECK (recipient_side IN ('buyer', 'seller')),
  template_name text NOT NULL DEFAULT 'match-notification',
  idempotency_key text NOT NULL UNIQUE,
  sent boolean NOT NULL DEFAULT false,
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.match_email_notifications TO authenticated;
GRANT ALL ON public.match_email_notifications TO service_role;

ALTER TABLE public.match_email_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read match email notifications"
ON public.match_email_notifications
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX match_email_notifications_match_key_idx
ON public.match_email_notifications (match_key);

CREATE INDEX match_email_notifications_recipient_email_idx
ON public.match_email_notifications (lower(recipient_email));