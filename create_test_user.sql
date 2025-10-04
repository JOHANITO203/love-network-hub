-- Script pour créer un utilisateur de test
-- À exécuter dans SQL Editor de Supabase

-- 1. Insérer un utilisateur de test dans auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'test@moydate.com',
  crypt('motdepasse123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  'authenticated'
);

-- 2. Vérifier que l'utilisateur a été créé
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
WHERE email = 'test@moydate.com';