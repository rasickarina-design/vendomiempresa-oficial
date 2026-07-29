INSERT INTO public.user_roles (user_id, role)
VALUES ('c76ba605-e4af-4b9c-a22b-f00c8d7263f6', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;