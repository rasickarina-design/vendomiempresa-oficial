create schema if not exists private;

revoke all on schema private from anon, authenticated;
grant usage on schema private to anon, authenticated, service_role;

create or replace function private.get_public_company(_ref text)
returns table(share_ref text, name text, sector text, city text, country text, age text, revenue text, price_amount numeric, price_currency text, description text, maps_url text, owner_position text)
language sql
stable
security definer
set search_path to 'public'
as $$
  select c.share_ref, c.name, c.sector, c.city, c.country, c.age, c.revenue,
         c.price_amount, c.price_currency, c.description, c.maps_url, c.owner_position
  from public.companies c
  where c.share_ref = _ref
  order by c.created_at desc
  limit 1
$$;

revoke all on function private.get_public_company(text) from public;
grant execute on function private.get_public_company(text) to anon, authenticated, service_role;

create or replace function public.get_public_company(_ref text)
returns table(share_ref text, name text, sector text, city text, country text, age text, revenue text, price_amount numeric, price_currency text, description text, maps_url text, owner_position text)
language sql
stable
security invoker
set search_path to 'public'
as $$
  select * from private.get_public_company(_ref)
$$;

revoke all on function public.get_public_company(text) from public;
grant execute on function public.get_public_company(text) to anon, authenticated, service_role;