-- ============================================================================
-- CONFIGURATION SIMPLIFIÉE DU STOCKAGE SUPABASE
-- Exécutez uniquement cette partie dans l'interface SQL
-- ============================================================================

-- 1. Créer le bucket pour les images de profil
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images',
  'profile-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Vérifier que le bucket a été créé
SELECT * FROM storage.buckets WHERE id = 'profile-images';