# Configuration du Stockage Supabase pour МойDate

## Étapes pour configurer l'upload d'images

### 1. Accéder à l'interface SQL de Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre projet
3. Cliquez sur "SQL Editor" dans le menu de gauche

### 2. Exécuter le script de configuration

Copiez et exécutez le contenu du fichier `setup_storage.sql` dans l'éditeur SQL :

```sql
-- Créer le bucket pour les images de profil
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

-- ... (reste du script dans setup_storage.sql)
```

### 3. Vérifier la configuration

Après avoir exécuté le script, vérifiez que :

1. Le bucket `profile-images` a été créé :
   - Allez dans "Storage" > "Buckets"
   - Vous devriez voir le bucket `profile-images`

2. Les politiques RLS sont actives :
   - Dans "SQL Editor", exécutez : `SELECT * FROM storage.buckets WHERE id = 'profile-images';`
   - Le bucket doit être marqué comme `public = true`

### 4. Test de l'upload

1. Lancez l'application : `npm run dev`
2. Créez un compte ou connectez-vous
3. Allez à l'étape 3 du profil setup
4. Testez l'upload d'une image
5. Vérifiez la console du navigateur pour les logs de debug

## Fonctionnalités implémentées

### ✅ Auto-sauvegarde du profil
- Sauvegarde automatique toutes les 3 secondes après modification
- Indicateur visuel dans l'en-tête (nuage avec "Sauvegarde..." ou "Sauvegardé")
- Notifications toast discrètes
- Sauvegarde sans validation stricte (permet de sauvegarder des profils partiels)

### ✅ Upload d'images sécurisé
- Validation des types de fichiers (JPG, PNG, WebP, GIF)
- Limite de taille : 5MB
- Organisation par utilisateur (`user_id/filename`)
- Politiques RLS pour la sécurité
- Messages d'erreur en français
- Gestion d'erreur robuste avec logs

### ✅ Interface utilisateur améliorée
- Sélecteur de date intuitif avec jour/mois/année séparés
- Calcul automatique de l'âge et du signe astrologique
- Navigation avec boutons retour
- Validation en temps réel
- Design moderne et responsive

## Dépannage

### Erreur : "Le stockage d'images n'est pas configuré"
➡️ Exécutez le script `setup_storage.sql` dans l'interface SQL de Supabase

### Erreur : "Permissions insuffisantes"
➡️ Vérifiez que les politiques RLS sont correctement configurées

### L'auto-sauvegarde ne fonctionne pas
➡️ Vérifiez la console du navigateur pour les erreurs
➡️ Assurez-vous que l'utilisateur est bien connecté

### Images non visibles après upload
➡️ Vérifiez que le bucket est bien public
➡️ Vérifiez les URL générées dans la console