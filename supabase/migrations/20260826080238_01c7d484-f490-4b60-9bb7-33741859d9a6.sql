CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  phone text,
  name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id AND public.is_valid_email(email) AND (phone IS NULL OR length(phone) <= 40) AND (name IS NULL OR length(name) <= 150));
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id AND public.is_valid_email(email) AND (phone IS NULL OR length(phone) <= 40) AND (name IS NULL OR length(name) <= 150));
CREATE POLICY "Admins can read profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.companies ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.buyers ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Companies: authenticated users own their rows
DROP POLICY IF EXISTS "Validated company submissions" ON public.companies;
CREATE POLICY "Validated company submissions" ON public.companies
FOR INSERT TO anon, authenticated
WITH CHECK (
  public.is_valid_email(owner_email)
  AND (
    (auth.uid() IS NULL AND user_id IS NULL)
    OR (auth.uid() IS NOT NULL AND user_id = auth.uid() AND lower(owner_email) = lower(COALESCE(auth.jwt() ->> 'email', '')))
  )
  AND (length(name) >= 2 AND length(name) <= 200)
  AND (length(sector) >= 2 AND length(sector) <= 120)
  AND (length(description) >= 10 AND length(description) <= 5000)
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
  AND (price_currency = ANY (ARRAY['USD','EUR']))
  AND public.is_safe_link(linkedin) AND public.is_safe_link(google_profile)
  AND public.is_safe_link(maps_url) AND public.is_safe_link(financials_url)
);

CREATE POLICY "Owners can read own companies" ON public.companies
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Owners can update own companies" ON public.companies
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Owners can delete own companies" ON public.companies
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Buyers: authenticated users own their rows
DROP POLICY IF EXISTS "Validated buyer submissions" ON public.buyers;
CREATE POLICY "Validated buyer submissions" ON public.buyers
FOR INSERT TO anon, authenticated
WITH CHECK (
  public.is_valid_email(email)
  AND (
    (auth.uid() IS NULL AND user_id IS NULL)
    OR (auth.uid() IS NOT NULL AND user_id = auth.uid() AND lower(email) = lower(COALESCE(auth.jwt() ->> 'email', '')))
  )
  AND (length(sectors) >= 2 AND length(sectors) <= 1000)
  AND (name IS NULL OR length(name) <= 150)
  AND (phone IS NULL OR length(phone) <= 40)
  AND (role IS NULL OR role = ANY (ARRAY['buyer','seller','both']))
  AND (location_pref IS NULL OR length(location_pref) <= 300)
  AND (country IS NULL OR length(country) <= 80)
  AND (thesis IS NULL OR length(thesis) <= 5000)
  AND (currency = ANY (ARRAY['USD','EUR']))
  AND (budget_min IS NULL OR (budget_min >= 0 AND budget_min < 1000000000000000))
  AND (budget_max IS NULL OR (budget_max >= 0 AND budget_max < 1000000000000000))
  AND public.is_safe_link(linkedin)
);

CREATE POLICY "Owners can read own buyer profile" ON public.buyers
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Owners can update own buyer profile" ON public.buyers
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Owners can delete own buyer profile" ON public.buyers
  FOR DELETE TO authenticated USING (user_id = auth.uid());