# Flow Nexus - Système de Crédits Expliqué

## 📊 Vue d'ensemble

Flow Nexus utilise **deux systèmes de crédits parallèles** pour gérer l'utilisation des ressources:

### 1. **Credits Balance** (Jetons de plateforme)
- **Type**: Crédits techniques pour consommation API
- **Valeur actuelle**: **602 crédits** ✓
- **Usage**: Tokens Anthropic Claude, stockage, bandwidth
- **Rechargement**: Automatique ou manuel via paiement
- **Limite mensuelle**: 1,000,000 crédits (Plan Free)

### 2. **rUv Balance** (Reward Units virtual)
- **Type**: Monnaie de gamification/récompenses
- **Valeur actuelle**: **0 rUv** (bug de synchronisation détecté)
- **Usage**: Swarms cloud, templates premium, features spéciales
- **Gain**: Bonus login, challenges, contributions

---

## 💰 Credits Balance (602 crédits)

### Utilisation

| Feature | Coût | Description |
|---------|------|-------------|
| **Claude API** | ~0.1-1 crédit/requête | Appels API Claude (selon tokens) |
| **Stockage** | 0.01 crédit/GB/mois | Fichiers, databases, sandboxes |
| **Bandwidth** | 0.001 crédit/GB | Upload/download de données |
| **Sandboxes E2B** | 0.5-5 crédits/h | Exécution code isolé |
| **Templates déploiement** | 0 crédit | Gratuit avec credits_balance |

### Recharge

```javascript
// Auto-refill configuration
{
  "auto_refill_enabled": false,
  "auto_refill_threshold": 20,   // Trigger à 20 crédits
  "auto_refill_amount": 50        // Recharge 50 crédits
}
```

**Tarifs achat:**
- 100 crédits = $10 USD
- 500 crédits = $40 USD (-20%)
- 1000 crédits = $70 USD (-30%)

---

## 🎮 rUv Balance (Reward Units virtual)

### Utilisation

| Feature | Coût rUv | Description |
|---------|----------|-------------|
| **Swarm Init** | 10-23 rUv | Initialiser swarm cloud |
| **Agent Spawn** | 2-5 rUv | Spawner agent spécialisé |
| **Neural Training** | 50-200 rUv | Entraînement modèles AI |
| **Templates Premium** | 0-100 rUv | Templates marketplace |
| **Challenges** | Gratuit | Participation challenges |

### Comment Gagner rUv

#### 1. **Bonus Login Quotidien**
```
Jour 1: +100 rUv
Jour 2: +110 rUv (+10% streak)
Jour 3: +121 rUv (+21% streak)
...
Jour 7: +200 rUv (bonus hebdo)
```

#### 2. **Challenges de Code**
- Beginner: 10-25 rUv
- Intermediate: 50-100 rUv
- Advanced: 150-300 rUv
- Expert: 500-1000 rUv

#### 3. **Contributions Marketplace**
- Publier template: +50 rUv
- Template featured: +200 rUv
- 10 downloads: +25 rUv
- 100 downloads: +500 rUv
- 5★ review: +10 rUv

#### 4. **Achievements**
- First swarm: +50 rUv
- 10 successful deploys: +100 rUv
- Help 5 users: +150 rUv

---

## 🔍 Ton Profil Actuel

```json
{
  "email": "johaneoyaraht@gmail.com",
  "username": "johanito203",
  "organization": "Midas Corp",

  // CREDITS BALANCE ✓
  "credits_balance": 602,
  "monthly_usage_limit": 1000000,
  "total_tokens_used": 0,
  "plan_type": "free",

  // RUV BALANCE ⚠️
  "ruv_credits": 602,      // Profile indique 602
  "ruv_balance": 0,        // API indique 0 (BUG!)

  // GAMIFICATION
  "level": 1,
  "experience_points": 0,
  "login_streak": 1,
  "last_daily_bonus": "2025-10-04",

  // HISTORIQUE
  "transactions": [
    {
      "type": "bonus",
      "amount": +100,
      "description": "Daily login bonus (Day 1 streak)"
    },
    {
      "type": "usage",
      "amount": -10,
      "description": "swarm_init x1"
    }
  ]
}
```

---

## ⚠️ Problème Détecté: Incohérence rUv

### Symptôme
```bash
GET /user_profile → ruv_credits: 602  ✓
GET /ruv_balance  → balance: 0        ✗
POST /swarm_init  → Error: Insufficient rUv (need 23, have 0)
```

### Cause Probable
Désynchronisation entre:
- `users.ruv_credits` (table users) = 602
- `ruv_transactions` balance calculé = 0

### Solution
**Option 1: Recalculer balance**
```sql
-- Recalculer depuis transactions
SELECT
  user_id,
  SUM(amount) as calculated_balance
FROM ruv_transactions
WHERE user_id = 'd6a0de79-14fd-4d9a-bf11-23ef5da3f696'
GROUP BY user_id;
```

**Option 2: Forcer sync manuel**
```javascript
mcp__flow-nexus__app_store_earn_ruv({
  user_id: "d6a0de79-14fd-4d9a-bf11-23ef5da3f696",
  amount: 602,
  reason: "Manual sync correction",
  source: "admin_correction"
})
```

**Option 3: Contacter support**
Email: support@flow-nexus.ruv.io
Discord: https://discord.gg/flow-nexus

---

## 🎯 Recommandations

### Immédiat
1. ✅ **Utiliser Hive Mind Local** (gratuit, déjà configuré)
   - Pas besoin de rUv
   - Fonctionnalités similaires
   - 10 agents max

2. **Gagner rUv quotidien**
   - Login chaque jour: +100 rUv (streak)
   - Compléter challenges: +25-1000 rUv
   - Publier templates: +50-200 rUv

### Court terme (1-7 jours)
1. **Résoudre bug synchronisation**
   - Contacter support Flow Nexus
   - Ou forcer recalcul balance

2. **Accumuler 100 rUv**
   - 7 jours login streak = 721 rUv total
   - Suffit pour plusieurs swarms cloud

### Long terme
1. **Passer à plan payant** (si besoin intensif)
   - Pro: $29/mois (5000 rUv/mois + 1000 credits)
   - Enterprise: $99/mois (illimité rUv + 5000 credits)

2. **Optimiser usage**
   - Utiliser templates gratuits
   - Préférer Hive Mind local pour dev
   - Swarms cloud uniquement pour prod

---

## 📋 Templates Gratuits Disponibles

Sans rUv nécessaire:

| Template | Cost | Features |
|----------|------|----------|
| **Claude Flow Swarm** | 0 rUv | Dynamic agent spawning, coordination |
| **Claude Flow Hive Mind** | 0 rUv | Hierarchical coordination, memory |
| **Claude Code Deployment** | 0 rUv | Code generation avec Claude |
| **GitHub Integration** | 0 rUv | PR automation, workflow CI/CD |

Avec credits_balance (pas de rUv):

| Template | Credits | Description |
|----------|---------|-------------|
| **E2B Sandboxes** | 0.5-5/h | Node, Python, React, Next.js |
| **Neural Training** | 10-50 | TensorFlow.js, PyTorch |
| **DAA Orchestrator** | 20 | Decentralized agents |

---

## 💡 Conclusion

**Credits Balance (602)** → **Utilisable maintenant** ✓
- Sandboxes E2B
- Templates deployment
- Claude API calls
- Stockage et bandwidth

**rUv Balance (0)** → **Bug à résoudre** ⚠️
- Contacter support
- Ou gagner via login daily
- Alternative: Hive Mind local gratuit

**Recommandation:** Commence avec **Hive Mind Local** (gratuit) pendant que le bug rUv se résout!
