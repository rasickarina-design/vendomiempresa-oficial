DROP POLICY IF EXISTS "Validated company submissions" ON public.companies;
CREATE POLICY "Validated company submissions" ON public.companies FOR INSERT TO authenticated WITH CHECK (
  is_valid_email(owner_email)
  AND auth.uid() IS NOT NULL
  AND user_id = auth.uid()
  AND lower(owner_email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
  AND length(name) >= 2 AND length(name) <= 200
  AND length(sector) >= 2 AND length(sector) <= 120
  AND length(description) >= 10 AND length(description) <= 5000
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
  AND (price_amount IS NULL OR (price_amount >= 0 AND price_amount < 1000000000000000))
  AND price_currency IN ('USD','EUR')
  AND is_safe_link(linkedin) AND is_safe_link(google_profile) AND is_safe_link(maps_url) AND is_safe_link(financials_url) AND is_safe_link(website_url)
);

DROP POLICY IF EXISTS "Validated buyer submissions" ON public.buyers;
CREATE POLICY "Validated buyer submissions" ON public.buyers FOR INSERT TO authenticated WITH CHECK (
  is_valid_email(email)
  AND auth.uid() IS NOT NULL
  AND user_id = auth.uid()
  AND lower(email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
  AND length(sectors) >= 2 AND length(sectors) <= 1000
  AND (name IS NULL OR length(name) <= 150)
  AND (phone IS NULL OR length(phone) <= 40)
  AND (role IS NULL OR role IN ('buyer','seller','both'))
  AND (location_pref IS NULL OR length(location_pref) <= 300)
  AND (country IS NULL OR length(country) <= 80)
  AND (thesis IS NULL OR length(thesis) <= 5000)
  AND currency IN ('USD','EUR')
  AND (budget_min IS NULL OR (budget_min >= 0 AND budget_min < 1000000000000000))
  AND (budget_max IS NULL OR (budget_max >= 0 AND budget_max < 1000000000000000))
  AND is_safe_link(linkedin)
);

DROP POLICY IF EXISTS "Validated contact logs" ON public.contacts;
CREATE POLICY "Validated contact logs" ON public.contacts FOR INSERT TO authenticated WITH CHECK (
  is_valid_email(buyer_email)
  AND auth.uid() IS NOT NULL
  AND lower(buyer_email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
  AND (company_name IS NULL OR length(company_name) <= 200)
  AND (company_ref IS NULL OR length(company_ref) <= 120)
  AND direction IN ('buyer_to_seller','seller_to_buyer')
);