# Configuration Manuelle du Stockage Supabase

## Étape 1: Créer le bucket via SQL

1. Allez dans **SQL Editor** de votre projet Supabase
2. Exécutez ce code :

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images',
  'profile-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
```

## Étape 2: Configurer les politiques RLS via l'interface

1. Allez dans **Storage** → **Policies** dans votre dashboard Supabase

2. Cliquez sur **"New Policy"** et créez ces 4 politiques :

### Politique 1: Lecture publique
- **Table**: `objects`
- **Policy name**: `Public profile images are publicly accessible`
- **Allowed operation**: `SELECT`
- **Policy definition**:
```sql
bucket_id = 'profile-images'
```

### Politique 2: Upload par utilisateur authentifié
- **Table**: `objects`
- **Policy name**: `Users can upload their own profile images`
- **Allowed operation**: `INSERT`
- **Policy definition**:
```sql
bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1] AND auth.role() = 'authenticated'
```

### Politique 3: Mise à jour par propriétaire
- **Table**: `objects`
- **Policy name**: `Users can update their own profile images`
- **Allowed operation**: `UPDATE`
- **Policy definition**:
```sql
bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1] AND auth.role() = 'authenticated'
```

### Politique 4: Suppression par propriétaire
- **Table**: `objects`
- **Policy name**: `Users can delete their own profile images`
- **Allowed operation**: `DELETE`
- **Policy definition**:
```sql
bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1] AND auth.role() = 'authenticated'
```

## Étape 3: Vérification

1. Allez dans **Storage** → **Buckets**
2. Vous devriez voir le bucket `profile-images`
3. Il doit être marqué comme **Public**

## Alternative: Configuration automatique (si les permissions le permettent)

Si vous êtes owner du projet, vous pouvez essayer d'exécuter tout le script original dans l'éditeur SQL.

## Test

Une fois configuré, testez l'upload dans l'application. Les erreurs spécifiques s'afficheront dans la console du navigateur.