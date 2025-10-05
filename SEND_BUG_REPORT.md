# 📧 Instructions pour Envoyer le Rapport de Bug

## Rapport Créé
Le rapport de bug complet se trouve dans: **`docs/BUG_REPORT_RUV_SYNC.md`**

---

## Option 1: Email Support (Recommandé)

**À:** support@flow-nexus.ruv.io
**Sujet:** [URGENT] rUv Balance Synchronization Bug - User d6a0de79-14fd-4d9a-bf11-23ef5da3f696

**Corps du message:**
```
Bonjour l'équipe Flow Nexus,

Je rencontre un problème critique de synchronisation des crédits rUv qui m'empêche
d'utiliser les swarms cloud malgré avoir 602 crédits dans mon profil.

User ID: d6a0de79-14fd-4d9a-bf11-23ef5da3f696
Email: johaneoyaraht@gmail.com
Organization: Midas Corp

Problème:
- GET /user_profile → ruv_credits: 602 ✓
- GET /ruv_balance → balance: 0 ✗
- POST /swarm_init → Error: "Insufficient rUv credits (need 23, have 0)"

J'ai préparé un rapport de bug détaillé avec toutes les données techniques
dans le fichier joint (BUG_REPORT_RUV_SYNC.md).

Merci de votre aide pour résoudre ce problème urgent.

Cordialement,
Johane Oyaraht
```

**Pièce jointe:** `D:\love-network-hub\docs\BUG_REPORT_RUV_SYNC.md`

---

## Option 2: Discord Support

1. Rejoindre le serveur Discord Flow Nexus: https://discord.gg/flow-nexus
2. Aller dans le channel `#support` ou `#bug-reports`
3. Créer un nouveau thread avec:

**Titre:** `🐛 rUv Balance Sync Bug - Urgent`

**Message:**
```
**User:** @johanito203 (johaneoyaraht@gmail.com)
**User ID:** d6a0de79-14fd-4d9a-bf11-23ef5da3f696
**Severity:** High - Blocking cloud swarm usage

**Problem:** rUv balance shows 0 despite profile having 602 credits

**Details:**
- Profile: ruv_credits = 602 ✅
- API: ruv_balance = 0 ❌
- Blocking: Cannot init swarms (need 23 rUv, have 0)

Full technical report available in GitHub:
[Lien vers ton repo GitHub]/docs/BUG_REPORT_RUV_SYNC.md

Can provide additional logs/data if needed. Available for debugging session.
```

4. Uploader le fichier `BUG_REPORT_RUV_SYNC.md` comme attachment

---

## Option 3: GitHub Issue

Si Flow Nexus a un repo public:

1. Aller sur https://github.com/ruvnet/flow-nexus (ou repo approprié)
2. Créer une nouvelle issue
3. Utiliser le template "Bug Report"
4. Copier le contenu de `docs/BUG_REPORT_RUV_SYNC.md`

---

## Option 4: Support Ticket Web

Si Flow Nexus a un formulaire de support sur https://flow-nexus.ruv.io:

1. Aller sur https://flow-nexus.ruv.io/support
2. Créer un nouveau ticket
3. Remplir les champs avec les informations du rapport
4. Uploader le fichier BUG_REPORT_RUV_SYNC.md

---

## 📋 Checklist Avant Envoi

- [ ] Vérifier que le fichier `docs/BUG_REPORT_RUV_SYNC.md` est complet
- [ ] Confirmer ton email: johaneoyaraht@gmail.com
- [ ] Confirmer ton User ID: d6a0de79-14fd-4d9a-bf11-23ef5da3f696
- [ ] Joindre le rapport complet
- [ ] Mentionner que c'est URGENT (bloque production)
- [ ] Indiquer disponibilité pour session de debugging

---

## ⏱️ Temps de Réponse Attendu

**Support Email:**
- Tier Free: 24-48h
- Tier Pro: 12-24h
- Tier Enterprise: <4h

**Discord:**
- Réponse communauté: 1-6h
- Réponse staff: 12-24h

**GitHub Issues:**
- Variable selon activité du repo

---

## 🔄 Suivi

Après envoi:
1. Note le numéro de ticket/issue
2. Vérifie tes emails pour confirmation
3. Vérifie régulièrement pour updates
4. Prépare-toi à fournir données additionnelles si demandées

---

**Créé le:** 2025-10-04
**Rapport:** docs/BUG_REPORT_RUV_SYNC.md
