alter table public.companies add column if not exists whatsapp text;
alter table public.buyers add column if not exists whatsapp text;
alter table public.companies add constraint companies_whatsapp_chk check (whatsapp is null or (length(whatsapp) <= 300 and whatsapp ~* '^https://'));
alter table public.buyers add constraint buyers_whatsapp_chk check (whatsapp is null or (length(whatsapp) <= 300 and whatsapp ~* '^https://'));