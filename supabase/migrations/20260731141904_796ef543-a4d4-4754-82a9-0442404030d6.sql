-- 1. Validation helper (immutable, usable inside RLS policies)
CREATE OR REPLACE FUNCTION public.is_valid_email(_email text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT _email IS NOT NULL
     AND length(_email) BETWEEN 5 AND 254
     AND _email ~ '^[A-Za-z0-9._%%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
$$;

REVOKE ALL ON FUNCTION public.is_valid_email(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_valid_email(text) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.is_safe_link(_url text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT _url IS NULL OR (length(_url) <= 2048 AND _url ~ '^https://')
$$;

REVOKE ALL ON FUNCTION public.is_safe_link(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_safe_link(text) TO anon, authenticated, service_role;

-- 2. companies: replace always-true insert policy with a validating one
DROP POLICY IF EXISTS "Anyone can submit a company" ON public.companies;

CREATE POLICY "Validated company submissions"
ON public.companies
FOR INSERT
TO anon, authenticated
WITH CHECK (
  public.is_valid_email(owner_email)
  AND (
    auth.uid() IS NULL
    OR lower(owner_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
  AND length(name) BETWEEN 2 AND 200
  AND length(sector) BETWEEN 2 AND 120
  AND length(description) BETWEEN 10 AND 5000
  AND (owner_name IS NULL OR length(owner_name) <= 150)
  AND (owner_phone IS NULL OR length(owner_phone) <= 40)
  AND (owner_position IS NULL OR length(owner_position) <= 80)
  AND (location IS NULL OR length(location) <= 300)
  AND (city IS NULL OR length(city) <= 120)
  AND (postal_code IS NULL OR length(postal_code) <= 20)
  AND (country IS NULL OR length(country) <= 80)
  AND (age IS NULL OR length(age) <= 40)
  AND (revenue IS NULL OR length(revenue) <= 60)
  AND (share_ref IS NULL OR length(share_ref) <= 120)
  AND (price_amount IS NULL OR (price_amount >= 0 AND price_amount < 1e15))
  AND price_currency IN ('USD', 'EUR')
  AND public.is_safe_link(linkedin)
  AND public.is_safe_link(google_profile)
  AND public.is_safe_link(maps_url)
  AND public.is_safe_link(financials_url)
);

-- 3. buyers
DROP POLICY IF EXISTS "Anyone can submit a buyer profile" ON public.buyers;

CREATE POLICY "Validated buyer submissions"
ON public.buyers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  public.is_valid_email(email)
  AND (
    auth.uid() IS NULL
    OR lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
  AND length(sectors) BETWEEN 2 AND 1000
  AND (name IS NULL OR length(name) <= 150)
  AND (phone IS NULL OR length(phone) <= 40)
  AND (role IS NULL OR role IN ('buyer', 'seller', 'both'))
  AND (location_pref IS NULL OR length(location_pref) <= 300)
  AND (country IS NULL OR length(country) <= 80)
  AND (thesis IS NULL OR length(thesis) <= 5000)
  AND currency IN ('USD', 'EUR')
  AND (budget_min IS NULL OR (budget_min >= 0 AND budget_min < 1e15))
  AND (budget_max IS NULL OR (budget_max >= 0 AND budget_max < 1e15))
  AND public.is_safe_link(linkedin)
);

-- 4. contacts
DROP POLICY IF EXISTS "Anyone can log a contact" ON public.contacts;

CREATE POLICY "Validated contact logs"
ON public.contacts
FOR INSERT
TO anon, authenticated
WITH CHECK (
  public.is_valid_email(buyer_email)
  AND (
    auth.uid() IS NULL
    OR lower(buyer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
  AND (company_name IS NULL OR length(company_name) <= 200)
  AND (company_ref IS NULL OR length(company_ref) <= 120)
  AND direction IN ('buyer_to_seller', 'seller_to_buyer')
);

-- 5. Lock down SECURITY DEFINER functions that must not be callable from the API
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.grant_admin_for_owner_email() FROM PUBLIC, anon, authenticated;

-- Public shared-listing preview stays callable (returns only non-sensitive columns)
REVOKE ALL ON FUNCTION public.get_public_company(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_company(text) TO anon, authenticated, service_role;