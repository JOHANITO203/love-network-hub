# Stratégie de Tarification Premium - МойDate
**Version:** 1.0.0
**Date:** 2025-10-04
**Psychologie:** Aversion à la Perte + Ancrage + Effet de Contraste

---

## 📋 Table des Matières

1. [Principes Psychologiques](#1-principes-psychologiques)
2. [Tarification Abonnements Premium](#2-tarification-abonnements-premium)
3. [Achats In-App (SuperLikes & Boosts)](#3-achats-in-app-superlikes--boosts)
4. [Stratégies d'Affichage UI/UX](#4-stratégies-daffichage-uiux)
5. [Formules Mathématiques](#5-formules-mathématiques)
6. [A/B Testing & Optimisation](#6-ab-testing--optimisation)

---

## 1. Principes Psychologiques

### 1.1 Aversion à la Perte (Loss Aversion)

**Principe:** Les humains ressentent la douleur d'une perte 2x plus fort que le plaisir d'un gain équivalent.

**Application:**
- ❌ "Économisez 3,288 RUB" (gain)
- ✅ **"NE PERDEZ PAS 3,288 RUB"** (perte évitée)
- ✅ **"Vous laissez 8,575 RUB sur la table"** (perte visuelle)

### 1.2 Ancrage (Price Anchoring)

**Principe:** Le premier prix vu sert de référence pour tous les autres.

**Application:**
- Toujours montrer le "prix normal" barré à côté du prix réduit
- Commencer par l'offre 6 mois (la plus "chère" en valeur absolue)
- L'offre 1 semaine sert d'ancre haute (599 RUB × 26 = 15,574 RUB pour 6 mois)

### 1.3 Effet de Contraste (Contrast Effect)

**Principe:** La perception de valeur change selon le contexte de comparaison.

**Application:**
```
❌ Mauvais affichage:
1 mois: 1,999 RUB

✅ Bon affichage:
Prix normal: 2,575 RUB
Prix premium: 1,999 RUB
Vous économisez: 576 RUB (22%)
```

### 1.4 Règle des "9" (Charm Pricing)

**Principe:** Les prix terminant en "99" ou "9" sont perçus comme significativement moins chers.

**Application:**
- 1,999 RUB vs 2,000 RUB → perçu comme "dans les 1,000" vs "2,000"
- 4,499 RUB vs 4,500 RUB → effet psychologique fort
- 6,999 RUB vs 7,000 RUB → "dans les 6,000" vs "7,000"

### 1.5 Effet de Décoy (Decoy Effect)

**Principe:** Ajouter une option moins attractive pour rendre l'option cible plus attrayante.

**Application:**
- Offre 1 mois (1,999 RUB) sert de "decoy"
- Fait paraître l'offre 3 mois (4,499 RUB) comme le meilleur rapport qualité/prix
- Badge "PLUS POPULAIRE" sur 3 mois

---

## 2. Tarification Abonnements Premium

### 2.1 Tableau Comparatif

| Durée | Prix Normal | Prix Premium | Économies | Économie % | Prix/jour | Badge | Recommandation |
|-------|-------------|--------------|-----------|------------|-----------|-------|----------------|
| **1 semaine** | - | **599 ₽** | - | - | 85.6 ₽ | - | Essai |
| **1 mois** | ~~2,575 ₽~~ | **1,999 ₽** | 576 ₽ | -22% | 66.6 ₽ | - | Découverte |
| **3 mois** | ~~7,787 ₽~~ | **4,499 ₽** | 3,288 ₽ | -42% | 49.9 ₽ | 🔥 POPULAIRE | ⭐ Optimal |
| **6 mois** | ~~15,574 ₽~~ | **6,999 ₽** | 8,575 ₽ | -55% | 38.8 ₽ | 💎 MEILLEURE VALEUR | Long terme |

### 2.2 Détail des Calculs

**Base de calcul:** 599 RUB/semaine

```python
# Formule générale
prix_normal = 599 × nombre_semaines
prix_premium = prix_normal × (1 - taux_reduction)

# 1 mois (4.3 semaines)
prix_normal = 599 × 4.3 = 2,575.7 RUB
taux_reduction = 22%
prix_premium = 2,575 × 0.78 = 2,008.5 RUB → arrondi à 1,999 RUB

# 3 mois (13 semaines)
prix_normal = 599 × 13 = 7,787 RUB
taux_reduction = 42%
prix_premium = 7,787 × 0.58 = 4,516 RUB → arrondi à 4,499 RUB

# 6 mois (26 semaines)
prix_normal = 599 × 26 = 15,574 RUB
taux_reduction = 55%
prix_premium = 15,574 × 0.45 = 7,008 RUB → arrondi à 6,999 RUB
```

### 2.3 Progression Psychologique Optimale

**Observation clé:** La progression des économies crée une urgence d'achat.

```
1 semaine → 1 mois:   +333% durée, +234% prix  → MAUVAIS DEAL
1 mois → 3 mois:      +200% durée, +125% prix  → BON DEAL
3 mois → 6 mois:      +100% durée, +56% prix   → EXCELLENT DEAL ✅
```

**Effet psychologique:**
- Plus la durée augmente, plus le "deal" s'améliore exponentiellement
- Créé un FOMO (Fear of Missing Out) sur l'offre 6 mois
- Le consommateur se dit: "Si je prends 1 mois maintenant, je PERDS 8,575 RUB à long terme"

### 2.4 Features Incluses par Abonnement

| Feature | Free | Premium (tous) |
|---------|------|----------------|
| Swipes quotidiens | 50 / 3h (400/jour max) | ♾️ Illimités |
| Messages | 100/jour | ♾️ Illimités |
| SuperLikes | 1/jour | 5/jour |
| Rewind (annuler swipe) | ❌ | ✅ |
| Voir qui vous a liké | ❌ | ✅ |
| Boost profil | ❌ | 1/mois (6 mois: 3/mois) |
| Mode invisible | ❌ | ✅ |
| Traduction auto DeepL | ❌ | ✅ |
| Badge Premium | ❌ | ✅ |
| Filtres avancés | ❌ | ✅ |
| Priorité dans découverte | ❌ | ✅ |

**Bonus progression:**
- **1 semaine:** Features de base
- **1 mois:** Features de base
- **3 mois:** Features + **2 Boosts gratuits** (valeur 598 RUB)
- **6 mois:** Features + **5 Boosts gratuits** + **25 SuperLikes gratuits** (valeur 2,294 RUB)

---

## 3. Achats In-App (SuperLikes & Boosts)

### 3.1 SuperLikes - Tarification

**Principe:** Montrer l'intérêt maximal à quelqu'un (notif prioritaire + badge doré)

| Pack | Prix Unitaire | Prix Total | Économies vs pack précédent | Économie % | Badge |
|------|---------------|------------|----------------------------|------------|-------|
| **5 SuperLikes** | 39.8 ₽ | **199 ₽** | - | - | Essai |
| **10 SuperLikes** | 34.9 ₽ | **349 ₽** | 50 ₽ | -13% | - |
| **25 SuperLikes** | 31.96 ₽ | **799 ₽** | 196 ₽ | -20% | 🔥 POPULAIRE |
| **50 SuperLikes** | 27.98 ₽ | **1,399 ₽** | 596 ₽ | -30% | 💎 MEILLEURE VALEUR |

**Calcul:**
```python
# Formule avec dégression progressive
prix_unitaire_base = 39.8  # RUB (pack de 5)

# Pack 10
reduction_10 = 13%
prix_10 = (39.8 × 0.87) × 10 = 34.9 × 10 = 349 RUB

# Pack 25
reduction_25 = 20%
prix_25 = (39.8 × 0.80) × 25 = 31.96 × 25 = 799 RUB

# Pack 50
reduction_50 = 30%
prix_50 = (39.8 × 0.70) × 50 = 27.98 × 50 = 1,399 RUB
```

**Affichage psychologique:**
```
❌ Mauvais:
25 SuperLikes: 799 RUB

✅ Bon:
25 SuperLikes: 799 RUB
Prix normal: 995 RUB (5 × 199)
TU PERDS: 196 RUB si tu achètes 5 packs de 5
Prix par SuperLike: 31.96 RUB (vs 39.8 RUB)
```

### 3.2 Boosts Profile - Tarification

**Principe:** Être montré en priorité pendant 24h (×10 visibilité)

| Pack | Prix Unitaire | Prix Total | Économies | Économie % | Visibilité estimée | Badge |
|------|---------------|------------|-----------|------------|--------------------|-------|
| **1 Boost (24h)** | 299 ₽ | **299 ₽** | - | - | ~500 profils | Essai |
| **3 Boosts** | 266.3 ₽ | **799 ₽** | 98 ₽ | -11% | ~1,500 profils | - |
| **5 Boosts** | 239.8 ₽ | **1,199 ₽** | 296 ₽ | -20% | ~2,500 profils | 🔥 POPULAIRE |
| **10 Boosts** | 199.9 ₽ | **1,999 ₽** | 991 ₽ | -33% | ~5,000 profils | 💎 MEILLEURE VALEUR |

**Calcul:**
```python
prix_base = 299  # 1 Boost

# Pack 3
prix_3 = 799  # 299 × 3 = 897, on offre à 799 (-11%)
economie_3 = (299 × 3) - 799 = 98 RUB

# Pack 5
prix_5 = 1,199  # 299 × 5 = 1,495, on offre à 1,199 (-20%)
economie_5 = (299 × 5) - 1,199 = 296 RUB

# Pack 10
prix_10 = 1,999  # 299 × 10 = 2,990, on offre à 1,999 (-33%)
economie_10 = (299 × 10) - 1,999 = 991 RUB
```

**Affichage avec aversion à la perte:**
```
💎 PACK 10 BOOSTS - 1,999 ₽

Si tu achètes 10 boosts individuels:
10 × 299 ₽ = 2,990 ₽

TU VAS PERDRE: 991 ₽ 💸

Avec ce pack:
✅ 991 ₽ économisés
✅ ~5,000 profils te verront
✅ 33% moins cher par boost
✅ Validité: 6 mois

⚠️ ATTENTION: Cette offre disparaît après achat
```

### 3.3 Bundles Stratégiques

**Bundle "Starter Pack"**
- 1 mois Premium + 10 SuperLikes + 3 Boosts
- Prix séparés: 1,999 + 349 + 799 = **3,147 RUB**
- Prix bundle: **2,699 RUB**
- **Économies: 448 RUB (-14%)**

**Bundle "Power User"**
- 3 mois Premium + 25 SuperLikes + 5 Boosts
- Prix séparés: 4,499 + 799 + 1,199 = **6,497 RUB**
- Prix bundle: **5,499 RUB**
- **Économies: 998 RUB (-15%)**

**Bundle "VIP"**
- 6 mois Premium + 50 SuperLikes + 10 Boosts
- Prix séparés: 6,999 + 1,399 + 1,999 = **10,397 RUB**
- Prix bundle: **8,499 RUB**
- **Économies: 1,898 RUB (-18%)**

---

## 4. Stratégies d'Affichage UI/UX

### 4.1 Page Premium - Ordre d'Affichage

**RÈGLE #1:** Toujours commencer par l'offre la plus longue (6 mois) pour ancrer le cerveau sur un "gros chiffre".

```
┌─────────────────────────────────────────────────┐
│  DEVIENS PREMIUM ET TROUVE L'AMOUR PLUS VITE    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 💎 MEILLEURE VALEUR - 6 MOIS                    │
│ ┌─────────────────────────────────────────────┐ │
│ │ 15,574 ₽ → 6,999 ₽                          │ │
│ │ TU ÉCONOMISES: 8,575 ₽ (55%)                │ │
│ │ Prix/jour: seulement 38.8 ₽                 │ │
│ │ ✅ BONUS: 5 Boosts + 25 SuperLikes gratuits │ │
│ │ ✅ Valeur totale bonus: 2,294 ₽             │ │
│ └─────────────────────────────────────────────┘ │
│ [ÉCONOMISE 8,575 ₽ MAINTENANT]                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 🔥 PLUS POPULAIRE - 3 MOIS                      │
│ ┌─────────────────────────────────────────────┐ │
│ │ 7,787 ₽ → 4,499 ₽                           │ │
│ │ TU ÉCONOMISES: 3,288 ₽ (42%)                │ │
│ │ Prix/jour: 49.9 ₽                           │ │
│ │ ✅ BONUS: 2 Boosts gratuits (598 ₽)        │ │
│ └─────────────────────────────────────────────┘ │
│ [ÉCONOMISE 3,288 ₽]                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 1 MOIS                                          │
│ ┌─────────────────────────────────────────────┐ │
│ │ 2,575 ₽ → 1,999 ₽                           │ │
│ │ Tu économises: 576 ₽ (22%)                  │ │
│ │ Prix/jour: 66.6 ₽                           │ │
│ └─────────────────────────────────────────────┘ │
│ [COMMENCER]                                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 1 SEMAINE (Essai)                               │
│ ┌─────────────────────────────────────────────┐ │
│ │ 599 ₽                                       │ │
│ │ Prix/jour: 85.6 ₽                           │ │
│ │ ⚠️ Aucune économie                          │ │
│ └─────────────────────────────────────────────┘ │
│ [ESSAYER 7 JOURS]                               │
└─────────────────────────────────────────────────┘
```

### 4.2 Comparaison Visuelle (Loss Aversion)

**Tableau comparatif avec couleurs:**

```
┌────────────────────────────────────────────────────────────┐
│   SI TU PRENDS 1 SEMAINE × 26 SEMAINES (6 MOIS)           │
│   Total payé: 15,574 ₽                                     │
│                                                            │
│   SI TU PRENDS L'ABONNEMENT 6 MOIS                        │
│   Total payé: 6,999 ₽                                      │
│                                                            │
│   🚨 TU VAS PERDRE: 8,575 ₽ 🚨                             │
│   (Plus de 55% de ton argent!)                            │
│                                                            │
│   [ÉVITE DE PERDRE 8,575 ₽ - PRENDS 6 MOIS]               │
└────────────────────────────────────────────────────────────┘
```

### 4.3 Timer d'Urgence (Scarcity)

**Offre limitée dans le temps:**

```
┌─────────────────────────────────────────────────┐
│ ⏰ OFFRE SPÉCIALE - EXPIRE DANS:                │
│                                                 │
│     [00] : [14] : [32] : [18]                  │
│     jours  heures  min    sec                  │
│                                                 │
│ 💎 6 MOIS à 6,999 ₽ (au lieu de 7,999 ₽)       │
│ TU PERDS 1,000 ₽ DE PLUS si tu rates ça!       │
│                                                 │
│ [PROFITE AVANT QU'IL SOIT TROP TARD]           │
└─────────────────────────────────────────────────┘
```

### 4.4 Social Proof (Preuve Sociale)

```
┌─────────────────────────────────────────────────┐
│ 👥 12,487 personnes ont choisi 3 mois ce mois   │
│                                                 │
│ ⭐⭐⭐⭐⭐ 4.8/5 - "Meilleur investissement"      │
│ - Dmitry, 28 ans, Moscou                       │
│                                                 │
│ 💬 "J'ai trouvé ma copine en 6 semaines grâce  │
│     au Premium. Les 4,499 ₽ valaient le coup!" │
│ - Anna, 25 ans, Saint-Pétersbourg             │
└─────────────────────────────────────────────────┘
```

### 4.5 Affichage SuperLikes/Boosts

**Modal d'achat SuperLikes:**

```
┌─────────────────────────────────────────────────┐
│           MONTRE TON INTÉRÊT MAXIMUM            │
│                                                 │
│ Les SuperLikes augmentent tes chances de match │
│ de 3× par rapport à un like normal!            │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ 💎 PACK 50 - 1,399 ₽ (27.98 ₽/unité)       │ │
│ │ Si tu achètes 10 packs de 5:               │ │
│ │ 10 × 199 ₽ = 1,990 ₽                        │ │
│ │ 🚨 TU PERDS: 591 ₽ 🚨                       │ │
│ │ [ÉCONOMISE 591 ₽]                           │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ 🔥 PACK 25 - 799 ₽ (31.96 ₽/unité)         │ │
│ │ Économie: 196 ₽ vs 5 packs de 5            │ │
│ │ [ÉCONOMISE 196 ₽]                           │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ PACK 10 - 349 ₽ (34.9 ₽/unité)             │ │
│ │ Économie: 50 ₽                              │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ PACK 5 - 199 ₽ (39.8 ₽/unité)              │ │
│ │ ⚠️ Prix le plus cher par unité              │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## 5. Formules Mathématiques

### 5.1 Formule Générale Abonnements

```python
def calculer_prix_premium(duree_semaines, taux_reduction_cible):
    """
    Calcule le prix premium optimal

    Args:
        duree_semaines: Nombre de semaines (7, 4.3, 13, 26)
        taux_reduction_cible: Réduction souhaitée (0.22, 0.42, 0.55)

    Returns:
        dict: {
            'prix_normal': float,
            'prix_premium': float,
            'economie': float,
            'taux_reduction': float,
            'prix_jour': float
        }
    """
    PRIX_SEMAINE_BASE = 599  # RUB

    prix_normal = PRIX_SEMAINE_BASE * duree_semaines
    prix_premium_brut = prix_normal * (1 - taux_reduction_cible)

    # Arrondir au 99 le plus proche
    prix_premium = round(prix_premium_brut / 100) * 100 - 1

    economie = prix_normal - prix_premium
    taux_reduction_reel = economie / prix_normal
    prix_jour = prix_premium / (duree_semaines * 7)

    return {
        'prix_normal': round(prix_normal),
        'prix_premium': prix_premium,
        'economie': round(economie),
        'taux_reduction': round(taux_reduction_reel * 100, 1),
        'prix_jour': round(prix_jour, 1)
    }

# Exemples d'utilisation:
abonnement_1_mois = calculer_prix_premium(4.3, 0.22)
# {'prix_normal': 2575, 'prix_premium': 1999, 'economie': 576, 'taux_reduction': 22.4, 'prix_jour': 66.6}

abonnement_3_mois = calculer_prix_premium(13, 0.42)
# {'prix_normal': 7787, 'prix_premium': 4499, 'economie': 3288, 'taux_reduction': 42.2, 'prix_jour': 49.4}

abonnement_6_mois = calculer_prix_premium(26, 0.55)
# {'prix_normal': 15574, 'prix_premium': 6999, 'economie': 8575, 'taux_reduction': 55.1, 'prix_jour': 38.5}
```

### 5.2 Formule Packs (SuperLikes/Boosts)

```python
def calculer_prix_pack(quantite, prix_unitaire_base, paliers_reduction):
    """
    Calcule le prix d'un pack avec réduction progressive

    Args:
        quantite: Nombre d'items dans le pack
        prix_unitaire_base: Prix d'un item individuel
        paliers_reduction: dict {quantite: taux_reduction}

    Returns:
        dict: {
            'prix_total': int,
            'prix_unitaire': float,
            'economie_vs_base': int,
            'taux_reduction': float
        }
    """
    # Trouver le palier de réduction applicable
    taux_reduction = 0
    for palier_qty, palier_reduction in sorted(paliers_reduction.items()):
        if quantite >= palier_qty:
            taux_reduction = palier_reduction

    prix_unitaire = prix_unitaire_base * (1 - taux_reduction)
    prix_total_brut = prix_unitaire * quantite

    # Arrondir au 99 le plus proche (sauf si < 100)
    if prix_total_brut >= 100:
        prix_total = round(prix_total_brut / 100) * 100 - 1
    else:
        prix_total = round(prix_total_brut)

    prix_normal = prix_unitaire_base * quantite
    economie = prix_normal - prix_total

    return {
        'prix_total': prix_total,
        'prix_unitaire': round(prix_total / quantite, 2),
        'economie_vs_base': round(economie),
        'taux_reduction': round(taux_reduction * 100, 1)
    }

# SuperLikes
PRIX_SUPERLIKE_BASE = 39.8  # RUB (pack de 5 = 199)
PALIERS_SUPERLIKE = {
    5: 0.00,   # Pas de réduction
    10: 0.13,  # -13%
    25: 0.20,  # -20%
    50: 0.30   # -30%
}

pack_25_superlikes = calculer_prix_pack(25, PRIX_SUPERLIKE_BASE, PALIERS_SUPERLIKE)
# {'prix_total': 799, 'prix_unitaire': 31.96, 'economie_vs_base': 196, 'taux_reduction': 20.0}

# Boosts
PRIX_BOOST_BASE = 299  # RUB
PALIERS_BOOST = {
    1: 0.00,
    3: 0.11,   # -11%
    5: 0.20,   # -20%
    10: 0.33   # -33%
}

pack_10_boosts = calculer_prix_pack(10, PRIX_BOOST_BASE, PALIERS_BOOST)
# {'prix_total': 1999, 'prix_unitaire': 199.9, 'economie_vs_base': 991, 'taux_reduction': 33.0}
```

### 5.3 Formule Valeur Perçue (Perceived Value)

```python
def calculer_valeur_percue(abonnement_premium, bonus_inclus):
    """
    Calcule la valeur totale perçue d'un abonnement avec bonus

    Args:
        abonnement_premium: Prix de l'abonnement seul
        bonus_inclus: Liste de dicts {'type': str, 'quantite': int, 'prix_unitaire': float}

    Returns:
        dict: {
            'prix_paye': int,
            'valeur_totale': int,
            'valeur_bonus': int,
            'ratio_valeur': float  # Combien de valeur pour 1 RUB dépensé
        }
    """
    valeur_bonus = sum(
        bonus['quantite'] * bonus['prix_unitaire']
        for bonus in bonus_inclus
    )

    valeur_totale = abonnement_premium + valeur_bonus
    ratio_valeur = valeur_totale / abonnement_premium

    return {
        'prix_paye': abonnement_premium,
        'valeur_totale': round(valeur_totale),
        'valeur_bonus': round(valeur_bonus),
        'ratio_valeur': round(ratio_valeur, 2)
    }

# Exemple: Abonnement 6 mois avec bonus
bonus_6_mois = [
    {'type': 'boost', 'quantite': 5, 'prix_unitaire': 299},
    {'type': 'superlike', 'quantite': 25, 'prix_unitaire': 39.8}
]

valeur_6_mois = calculer_valeur_percue(6999, bonus_6_mois)
# {
#   'prix_paye': 6999,
#   'valeur_totale': 9494,  # 6999 + 1495 + 995
#   'valeur_bonus': 2495,
#   'ratio_valeur': 1.36    # Tu reçois 1.36 ₽ de valeur pour chaque 1 ₽ dépensé
# }
```

---

## 6. A/B Testing & Optimisation

### 6.1 Tests à Réaliser

**Test A/B #1: Ordre d'affichage**
- **Variante A:** Afficher du plus long (6 mois) au plus court (1 semaine)
- **Variante B:** Afficher du plus court au plus long
- **Hypothèse:** A convertit mieux (ancrage sur "gros" montant d'économies)
- **Métrique:** Taux de conversion, revenue par utilisateur

**Test A/B #2: Formulation "perte" vs "gain"**
- **Variante A:** "Économise 8,575 ₽"
- **Variante B:** "Ne perds pas 8,575 ₽"
- **Hypothèse:** B convertit mieux (aversion à la perte)
- **Métrique:** Taux de clic, taux de conversion

**Test A/B #3: Affichage prix barré**
- **Variante A:** Montrer prix normal barré + économies
- **Variante B:** Montrer seulement prix final
- **Hypothèse:** A convertit mieux (effet de contraste)
- **Métrique:** Taux d'ajout au panier

**Test A/B #4: Badge "POPULAIRE"**
- **Variante A:** Badge sur 3 mois
- **Variante B:** Badge sur 6 mois
- **Hypothèse:** A convertit mieux sur 3 mois, mais B augmente revenue moyen
- **Métrique:** Distribution des ventes par durée

### 6.2 Optimisations Dynamiques

**Prix Dynamique (Dynamic Pricing):**

```python
def ajuster_prix_dynamique(utilisateur, contexte):
    """
    Ajuste les prix selon le comportement utilisateur
    """
    prix_base = PRIX_STANDARD

    # Nouvel utilisateur (première visite page premium)
    if utilisateur.visites_page_premium == 0:
        return prix_base  # Prix standard

    # Utilisateur qui a visité 2-3 fois sans acheter
    elif 1 <= utilisateur.visites_page_premium <= 3:
        # Montrer offre spéciale -10%
        return {
            'prix': prix_base * 0.9,
            'badge': '⏰ OFFRE SPÉCIALE - 24H',
            'timer': True
        }

    # Utilisateur qui a visité 4+ fois (très intéressé mais hésitant)
    elif utilisateur.visites_page_premium >= 4:
        # Montrer offre "dernière chance" -15%
        return {
            'prix': prix_base * 0.85,
            'badge': '🔥 DERNIÈRE CHANCE',
            'popup': 'Tu as visité 4 fois. On te fait -15% maintenant!',
            'timer': True
        }

    # Utilisateur qui a eu Premium avant (reconquête)
    elif utilisateur.premium_expire_depuis > 7:  # jours
        # Offre "reviens" -20%
        return {
            'prix': prix_base * 0.80,
            'badge': '💎 SPÉCIAL RETOUR',
            'message': 'Content de te revoir! -20% pour ton retour'
        }
```

**Recommandation Intelligente:**

```python
def recommander_plan(utilisateur):
    """
    Recommande le plan optimal selon le profil utilisateur
    """
    # Analyser comportement
    swipes_jour = utilisateur.swipes_count / utilisateur.jours_actif
    messages_jour = utilisateur.messages_count / utilisateur.jours_actif

    # Utilisateur très actif
    if swipes_jour > 40 or messages_jour > 20:
        return {
            'plan_recommande': '6_mois',
            'raison': 'Tu es très actif! Le plan 6 mois te fera économiser 8,575 ₽',
            'probabilite_succes': 'Tu as 85% de chances de trouver un match sérieux en 6 mois'
        }

    # Utilisateur moyennement actif
    elif swipes_jour > 20 or messages_jour > 10:
        return {
            'plan_recommande': '3_mois',
            'raison': 'Le plan 3 mois est parfait pour toi. 3,288 ₽ d\'économies!',
            'probabilite_succes': '70% de nos utilisateurs trouvent un match en 3 mois'
        }

    # Utilisateur peu actif ou nouveau
    else:
        return {
            'plan_recommande': '1_mois',
            'raison': 'Commence avec 1 mois pour tester toutes les features Premium',
            'probabilite_succes': 'Tu pourras toujours upgrader si ça te plaît!'
        }
```

### 6.3 Métriques à Suivre

**KPIs Principaux:**
1. **Taux de conversion global:** (achats / visiteurs page premium) × 100
2. **Revenue par utilisateur (ARPU):** Revenue total / utilisateurs actifs
3. **Lifetime Value (LTV):** Revenue moyen par utilisateur sur toute sa durée de vie
4. **Distribution des ventes:** % ventes par durée (1 semaine / 1 mois / 3 mois / 6 mois)
5. **Taux de renouvellement:** % utilisateurs qui renouvellent après expiration

**KPIs Secondaires:**
- Temps moyen avant premier achat Premium
- Taux d'abandon panier
- Taux de clic sur chaque offre
- Influence des badges "POPULAIRE" et "MEILLEURE VALEUR"
- Impact des bonus gratuits sur la conversion

**Objectifs Q1 2025:**
- Taux de conversion global: **8-12%** (benchmark dating apps: 5-10%)
- Distribution cible: 10% (1 sem), 20% (1 mois), **45%** (3 mois), 25% (6 mois)
- ARPU: 3,500 ₽/utilisateur/an
- LTV: 8,000-12,000 ₽ (sur 2-3 ans)

---

## 7. Implémentation Code (Exemple)

### 7.1 Configuration Pricing

```typescript
// services/premium/src/config/pricing.ts

export const SUBSCRIPTION_PLANS = {
  WEEK_1: {
    id: 'premium_1w',
    duration: '1_week',
    weeks: 1,
    price: 599,
    currency: 'RUB',
    normalPrice: null, // Pas d'économie
    savings: 0,
    savingsPercent: 0,
    pricePerDay: 85.6,
    badge: null,
    features: {
      unlimitedSwipes: true,
      unlimitedMessages: true,
      superLikesPerDay: 5,
      rewind: true,
      seeWhoLikesYou: true,
      boostsPerMonth: 0,
      invisibleMode: true,
      deeplTranslation: true,
      premiumBadge: true,
      advancedFilters: true,
      priorityDiscovery: true
    },
    bonuses: []
  },

  MONTH_1: {
    id: 'premium_1m',
    duration: '1_month',
    weeks: 4.3,
    price: 1999,
    currency: 'RUB',
    normalPrice: 2575,
    savings: 576,
    savingsPercent: 22,
    pricePerDay: 66.6,
    badge: null,
    features: { /* same as WEEK_1 */ },
    bonuses: []
  },

  MONTHS_3: {
    id: 'premium_3m',
    duration: '3_months',
    weeks: 13,
    price: 4499,
    currency: 'RUB',
    normalPrice: 7787,
    savings: 3288,
    savingsPercent: 42,
    pricePerDay: 49.9,
    badge: 'POPULAIRE',
    badgeIcon: '🔥',
    features: { /* same as WEEK_1 */ },
    bonuses: [
      { type: 'boost', quantity: 2, value: 598 }
    ]
  },

  MONTHS_6: {
    id: 'premium_6m',
    duration: '6_months',
    weeks: 26,
    price: 6999,
    currency: 'RUB',
    normalPrice: 15574,
    savings: 8575,
    savingsPercent: 55,
    pricePerDay: 38.8,
    badge: 'MEILLEURE VALEUR',
    badgeIcon: '💎',
    features: {
      /* same as WEEK_1 but: */
      boostsPerMonth: 3  // Bonus exclusif 6 mois
    },
    bonuses: [
      { type: 'boost', quantity: 5, value: 1495 },
      { type: 'superlike', quantity: 25, value: 995 }
    ]
  }
};

export const SUPERLIKE_PACKS = {
  PACK_5: {
    id: 'superlike_5',
    quantity: 5,
    price: 199,
    pricePerUnit: 39.8,
    normalPrice: null,
    savings: 0,
    savingsPercent: 0
  },
  PACK_10: {
    id: 'superlike_10',
    quantity: 10,
    price: 349,
    pricePerUnit: 34.9,
    normalPrice: 398,
    savings: 49,
    savingsPercent: 13
  },
  PACK_25: {
    id: 'superlike_25',
    quantity: 25,
    price: 799,
    pricePerUnit: 31.96,
    normalPrice: 995,
    savings: 196,
    savingsPercent: 20,
    badge: 'POPULAIRE',
    badgeIcon: '🔥'
  },
  PACK_50: {
    id: 'superlike_50',
    quantity: 50,
    price: 1399,
    pricePerUnit: 27.98,
    normalPrice: 1990,
    savings: 591,
    savingsPercent: 30,
    badge: 'MEILLEURE VALEUR',
    badgeIcon: '💎'
  }
};

export const BOOST_PACKS = {
  PACK_1: {
    id: 'boost_1',
    quantity: 1,
    price: 299,
    pricePerUnit: 299,
    normalPrice: null,
    savings: 0,
    savingsPercent: 0,
    estimatedViews: 500
  },
  PACK_3: {
    id: 'boost_3',
    quantity: 3,
    price: 799,
    pricePerUnit: 266.3,
    normalPrice: 897,
    savings: 98,
    savingsPercent: 11,
    estimatedViews: 1500
  },
  PACK_5: {
    id: 'boost_5',
    quantity: 5,
    price: 1199,
    pricePerUnit: 239.8,
    normalPrice: 1495,
    savings: 296,
    savingsPercent: 20,
    badge: 'POPULAIRE',
    badgeIcon: '🔥',
    estimatedViews: 2500
  },
  PACK_10: {
    id: 'boost_10',
    quantity: 10,
    price: 1999,
    pricePerUnit: 199.9,
    normalPrice: 2990,
    savings: 991,
    savingsPercent: 33,
    badge: 'MEILLEURE VALEUR',
    badgeIcon: '💎',
    estimatedViews: 5000
  }
};
```

### 7.2 Composant React UI

```typescript
// src/components/premium/PricingCard.tsx

import { motion } from 'framer-motion';

interface PricingCardProps {
  plan: SubscriptionPlan;
  recommended?: boolean;
}

export const PricingCard = ({ plan, recommended }: PricingCardProps) => {
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl border-2 p-6",
        recommended
          ? "border-pink-500 bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-950/30 dark:to-red-950/30"
          : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
      )}
      whileHover={{ scale: 1.02 }}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold shadow-lg">
          {plan.badgeIcon} {plan.badge}
        </div>
      )}

      {/* Durée */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {plan.duration === '1_week' && '1 Semaine'}
        {plan.duration === '1_month' && '1 Mois'}
        {plan.duration === '3_months' && '3 Mois'}
        {plan.duration === '6_months' && '6 Mois'}
      </h3>

      {/* Prix normal barré */}
      {plan.normalPrice && (
        <div className="text-sm text-gray-500 line-through mb-1">
          Prix normal: {plan.normalPrice.toLocaleString()} ₽
        </div>
      )}

      {/* Prix Premium */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
          {plan.price.toLocaleString()}
        </span>
        <span className="text-gray-600 dark:text-gray-400">₽</span>
      </div>

      {/* Prix par jour */}
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Seulement {plan.pricePerDay.toFixed(1)} ₽/jour
      </div>

      {/* ÉCONOMIES - Aversion à la perte */}
      {plan.savings > 0 && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🚨</span>
            <span className="font-bold text-red-700 dark:text-red-400">
              NE PERDS PAS {plan.savings.toLocaleString()} ₽
            </span>
          </div>
          <div className="text-xs text-red-600 dark:text-red-400">
            Tu laisses {plan.savings.toLocaleString()} ₽ sur la table si tu ne prends pas cette offre
          </div>
          <div className="text-sm font-bold text-red-700 dark:text-red-400 mt-1">
            Économise {plan.savingsPercent}% maintenant!
          </div>
        </div>
      )}

      {/* Bonus */}
      {plan.bonuses.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-3 mb-4">
          <div className="text-sm font-bold text-green-700 dark:text-green-400 mb-2">
            ✅ BONUS GRATUITS INCLUS:
          </div>
          {plan.bonuses.map((bonus, i) => (
            <div key={i} className="text-xs text-green-600 dark:text-green-400">
              • {bonus.quantity} {bonus.type === 'boost' ? 'Boosts' : 'SuperLikes'}
              (valeur {bonus.value} ₽)
            </div>
          ))}
          <div className="text-sm font-bold text-green-700 dark:text-green-400 mt-2">
            Valeur totale: {plan.bonuses.reduce((sum, b) => sum + b.value, 0)} ₽
          </div>
        </div>
      )}

      {/* CTA */}
      <Button
        onClick={() => handlePurchase(plan.id)}
        className={cn(
          "w-full h-12 text-base font-bold",
          recommended
            ? "bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
            : "bg-gray-800 hover:bg-gray-900"
        )}
      >
        {plan.savings > 0
          ? `ÉCONOMISE ${plan.savings.toLocaleString()} ₽`
          : `ACHETER ${plan.price.toLocaleString()} ₽`
        }
      </Button>

      {/* Features (liste condensée) */}
      <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <div>✓ Swipes & Messages illimités</div>
        <div>✓ 5 SuperLikes/jour</div>
        <div>✓ Voir qui t'a liké</div>
        <div>✓ Traduction auto DeepL</div>
        {plan.boostsPerMonth > 0 && (
          <div className="font-bold text-pink-600">
            ✓ {plan.boostsPerMonth} Boost{plan.boostsPerMonth > 1 ? 's' : ''}/mois
          </div>
        )}
      </div>
    </motion.div>
  );
};
```

---

## 8. Résumé Exécutif

### 8.1 Tarification Finale

**Abonnements:**
- 1 semaine: **599 ₽**
- 1 mois: **1,999 ₽** (-22%)
- 3 mois: **4,499 ₽** (-42%) 🔥 POPULAIRE
- 6 mois: **6,999 ₽** (-55%) 💎 MEILLEURE VALEUR

**SuperLikes:**
- 5: **199 ₽**
- 10: **349 ₽** (-13%)
- 25: **799 ₽** (-20%) 🔥
- 50: **1,399 ₽** (-30%) 💎

**Boosts:**
- 1: **299 ₽**
- 3: **799 ₽** (-11%)
- 5: **1,199 ₽** (-20%) 🔥
- 10: **1,999 ₽** (-33%) 💎

### 8.2 Biais Psychologiques Utilisés

1. ✅ **Aversion à la perte** - "NE PERDS PAS 8,575 ₽"
2. ✅ **Ancrage** - Prix normal barré crée contexte
3. ✅ **Contraste** - Économies massives affichées en rouge
4. ✅ **Règle des 9** - Tous les prix en x,999 ₽
5. ✅ **Decoy Effect** - 1 mois fait paraître 3 mois optimal
6. ✅ **Scarcity** - Timers urgence, "offre limitée"
7. ✅ **Social Proof** - "12,487 personnes ont choisi..."
8. ✅ **Bonus gratuits** - Augmente valeur perçue

### 8.3 Revenue Projeté

**Hypothèses:**
- 10,000 utilisateurs actifs/mois
- Taux de conversion: 10%
- Distribution ventes: 10% (1sem), 20% (1mois), 45% (3mois), 25% (6mois)

**Calcul:**
```
1,000 achats Premium/mois
- 100 × 599 = 59,900 ₽
- 200 × 1,999 = 399,800 ₽
- 450 × 4,499 = 2,024,550 ₽
- 250 × 6,999 = 1,749,750 ₽

Total abonnements: 4,234,000 ₽/mois

+ Achats SuperLikes/Boosts: ~600,000 ₽/mois

REVENUE TOTAL: ~4,834,000 ₽/mois (~$53,000 USD)
```

**Année 1:** ~58M ₽ (~$640K USD)

---

**Prêt pour implémentation! 🚀**
