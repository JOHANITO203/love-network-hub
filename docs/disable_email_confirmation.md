# Solution temporaire : Désactiver la confirmation d'email

## Dans le dashboard Supabase :

1. **Authentication** → **Settings**
2. **Email Auth** → Décochez **"Enable email confirmations"**
3. **Save**

## Ou via SQL :

```sql
-- Confirmer tous les emails automatiquement
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email_confirmed_at IS NULL;
```

## Créer un utilisateur de test :

**Email :** test@moydate.com
**Password :** motdepasse123

Utilisez ces identifiants pour vous connecter.