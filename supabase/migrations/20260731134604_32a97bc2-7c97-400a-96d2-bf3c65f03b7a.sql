ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS share_ref text;
CREATE INDEX IF NOT EXISTS companies_share_ref_idx ON public.companies (share_ref);

CREATE OR REPLACE FUNCTION public.get_public_company(_ref text)
RETURNS TABLE (
  share_ref text,
  name text,
  sector text,
  city text,
  country text,
  age text,
  revenue text,
  price_amount numeric,
  price_currency text,
  description text,
  maps_url text,
  owner_position text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.share_ref, c.name, c.sector, c.city, c.country, c.age, c.revenue,
         c.price_amount, c.price_currency, c.description, c.maps_url, c.owner_position
  FROM public.companies c
  WHERE c.share_ref = _ref
  ORDER BY c.created_at DESC
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION public.get_public_company(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_company(text) TO anon, authenticated;