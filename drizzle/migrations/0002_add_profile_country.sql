ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS country text;

COMMENT ON COLUMN public.profiles.country IS 'Country selected by the registered user; used as the default country for company searches.';

ALTER POLICY "Users can insert own profile"
ON public.profiles
WITH CHECK (
  (auth.uid() = id)
  AND is_valid_email(email)
  AND ((phone IS NULL) OR (length(phone) <= 40))
  AND ((name IS NULL) OR (length(name) <= 150))
  AND ((country IS NULL) OR (length(country) <= 80))
);

ALTER POLICY "Users can update own profile"
ON public.profiles
WITH CHECK (
  (auth.uid() = id)
  AND is_valid_email(email)
  AND ((phone IS NULL) OR (length(phone) <= 40))
  AND ((name IS NULL) OR (length(name) <= 150))
  AND ((country IS NULL) OR (length(country) <= 80))
);