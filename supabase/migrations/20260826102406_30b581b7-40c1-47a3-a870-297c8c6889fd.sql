alter table public.companies add column if not exists website_url text;

-- Postgres no permite cambiar el tipo de retorno de una función existente; se eliminan y recrean en orden por dependencia.
drop function if exists public.get_public_company(text);
drop function if exists private.get_public_company(text);

create or replace function private.get_public_company(_ref text)
returns table(share_ref text, name text, sector text, city text, country text, age text, revenue text, price_amount numeric, price_currency text, description text, maps_url text, owner_position text, website_url text)
language sql
stable
security definer
set search_path to 'public'
as $$
  select c.share_ref, c.name, c.sector, c.city, c.country, c.age, c.revenue,
         c.price_amount, c.price_currency, c.description, c.maps_url, c.owner_position, c.website_url
  from public.companies c
  where c.share_ref = _ref
  order by c.created_at desc
  limit 1
$$;

revoke all on function private.get_public_company(text) from public;
grant execute on function private.get_public_company(text) to anon, authenticated, service_role;

create or replace function public.get_public_company(_ref text)
returns table(share_ref text, name text, sector text, city text, country text, age text, revenue text, price_amount numeric, price_currency text, description text, maps_url text, owner_position text, website_url text)
language sql
stable
security invoker
set search_path to 'public'
as $$
  select * from private.get_public_company(_ref)
$$;

revoke all on function public.get_public_company(text) from public;
grant execute on function public.get_public_company(text) to anon, authenticated, service_role;

drop policy if exists "Validated company submissions" on public.companies;
create policy "Validated company submissions"
on public.companies
for insert
to anon, authenticated
with check (
  is_valid_email(owner_email)
  and (
    ((auth.uid() is null) and (user_id is null))
    or (
      (auth.uid() is not null)
      and (user_id = auth.uid())
      and (lower(owner_email) = lower(coalesce((auth.jwt() ->> 'email'::text), ''::text)))
    )
  )
  and ((length(name) >= 2) and (length(name) <= 200))
  and ((length(sector) >= 2) and (length(sector) <= 120))
  and ((length(description) >= 10) and (length(description) <= 5000))
  and ((owner_name is null) or (length(owner_name) <= 150))
  and ((owner_phone is null) or (length(owner_phone) <= 40))
  and ((owner_position is null) or (length(owner_position) <= 80))
  and ((location is null) or (length(location) <= 300))
  and ((city is null) or (length(city) <= 120))
  and ((postal_code is null) or (length(postal_code) <= 20))
  and ((country is null) or (length(country) <= 80))
  and ((age is null) or (length(age) <= 40))
  and ((revenue is null) or (length(revenue) <= 60))
  and ((share_ref is null) or (length(share_ref) <= 120))
  and ((price_amount is null) or ((price_amount >= (0)::numeric) and (price_amount < ('1000000000000000'::bigint)::numeric)))
  and (price_currency = any (array['USD'::text, 'EUR'::text]))
  and is_safe_link(linkedin)
  and is_safe_link(google_profile)
  and is_safe_link(maps_url)
  and is_safe_link(financials_url)
  and is_safe_link(website_url)
);