create or replace function private.get_market_stats()
returns table(kind text, sector text, total bigint)
language sql stable security definer set search_path to 'public'
as $$
  select 'vendo'::text, c.sector, count(*) from public.companies c group by c.sector
  union all
  select 'compro'::text, trim(s), count(*) from public.buyers b, unnest(string_to_array(coalesce(b.sectors::text, ''), ',')) s where trim(s) <> '' group by trim(s)
$$;
revoke all on function private.get_market_stats() from public;
grant execute on function private.get_market_stats() to anon, authenticated, service_role;
create or replace function public.get_market_stats()
returns table(kind text, sector text, total bigint)
language sql stable security invoker set search_path to 'public'
as $$ select * from private.get_market_stats() $$;
revoke all on function public.get_market_stats() from public;
grant execute on function public.get_market_stats() to anon, authenticated, service_role;