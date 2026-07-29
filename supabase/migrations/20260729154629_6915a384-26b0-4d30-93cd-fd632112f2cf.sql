-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Auto-grant admin to the verified owner email
CREATE OR REPLACE FUNCTION public.grant_admin_for_owner_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF new.email_confirmed_at IS NOT NULL
     AND lower(new.email) = 'rasickarina@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_admin_for_owner_email();

CREATE TRIGGER on_auth_user_confirmed_grant_admin
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (old.email_confirmed_at IS NULL AND new.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.grant_admin_for_owner_email();

-- Empresas
CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sector text NOT NULL,
  location text,
  age text,
  revenue text,
  price_amount numeric,
  price_currency text NOT NULL DEFAULT 'USD',
  description text NOT NULL,
  owner_name text,
  owner_email text NOT NULL,
  owner_phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.companies TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a company" ON public.companies
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read companies" ON public.companies
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update companies" ON public.companies
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete companies" ON public.companies
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Compradores
CREATE TABLE public.buyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text NOT NULL,
  phone text,
  sectors text NOT NULL,
  budget_min numeric,
  budget_max numeric,
  currency text NOT NULL DEFAULT 'USD',
  location_pref text,
  thesis text,
  role text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.buyers TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.buyers TO authenticated;
GRANT ALL ON public.buyers TO service_role;
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a buyer profile" ON public.buyers
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read buyers" ON public.buyers
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update buyers" ON public.buyers
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete buyers" ON public.buyers
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Contactos
CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_email text NOT NULL,
  company_name text,
  company_ref text,
  direction text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.contacts TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contacts TO authenticated;
GRANT ALL ON public.contacts TO service_role;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log a contact" ON public.contacts
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read contacts" ON public.contacts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contacts" ON public.contacts
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete contacts" ON public.contacts
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));