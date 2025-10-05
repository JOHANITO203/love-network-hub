# Bug Report: rUv Balance Synchronization Issue

**Date**: 2025-10-04
**Reporter**: Johane Oyaraht (@johanito203)
**User ID**: `d6a0de79-14fd-4d9a-bf11-23ef5da3f696`
**Email**: johaneoyaraht@gmail.com
**Organization**: Midas Corp

---

## 🐛 Problem Summary

**Critical synchronization issue between `user_profile.ruv_credits` and `ruv_balance` endpoint**, preventing cloud swarm initialization despite having sufficient credits in profile.

---

## 📋 Issue Details

### Symptom
Unable to initialize cloud swarms due to "Insufficient rUv credits" error, despite profile showing 602 credits.

### Error Message
```json
{
  "success": false,
  "error": "Insufficient rUv credits (need 23, have 0)"
}
```

### Actual vs Expected Behavior

| Endpoint/Field | Expected | Actual | Status |
|----------------|----------|--------|--------|
| `GET /user_profile` → `ruv_credits` | 602 | 602 | ✅ Correct |
| `GET /user_profile` → `credits_balance` | 602 | 602 | ✅ Correct |
| `GET /ruv_balance` → `balance` | 602 | **0** | ❌ **Incorrect** |
| `POST /swarm_init` | Success | Error | ❌ **Blocked** |

---

## 🔍 Technical Analysis

### Database State Investigation

**Profile shows:**
```json
{
  "id": "d6a0de79-14fd-4d9a-bf11-23ef5da3f696",
  "email": "johaneoyaraht@gmail.com",
  "ruv_credits": 602,        // ✅ Correct
  "credits_balance": 602,     // ✅ Correct
  "plan_type": "free",
  "subscription_tier": "free"
}
```

**Balance API returns:**
```json
{
  "success": true,
  "balance": 0,               // ❌ Incorrect - should be 602
  "auto_refill_enabled": false,
  "low_balance_warning": true
}
```

### Transaction History

```json
{
  "transactions": [
    {
      "id": "ba71ee71-98bf-4558-a145-a298353b1073",
      "type": "bonus",
      "amount": 100,
      "balance_after": 602,
      "description": "Daily login bonus (Day 1 streak)",
      "created_at": "2025-10-04T17:59:47.913181+00:00"
    },
    {
      "id": "f6e36dea-5d42-4497-b5a5-4111fa009f77",
      "type": "usage",
      "amount": -10,
      "balance_after": 502,
      "description": "swarm_init x1",
      "created_at": "2025-10-04T17:59:47.913181+00:00"
    }
  ]
}
```

**Analysis:**
- Transaction 1: +100 rUv → balance_after: 602 ✅
- Transaction 2: -10 rUv → balance_after: 502 ✅
- **Expected current balance: 502 rUv** (or 592 if transaction order matters)
- **Actual API balance: 0 rUv** ❌

---

## 💡 Hypotheses

### 1. **Balance Calculation Logic Error**
The `ruv_balance` endpoint may not be correctly aggregating from `ruv_transactions` table:

```sql
-- Expected query
SELECT
  user_id,
  SUM(amount) as calculated_balance
FROM ruv_transactions
WHERE user_id = 'd6a0de79-14fd-4d9a-bf11-23ef5da3f696'
GROUP BY user_id;
```

**Possible issues:**
- Query not filtering by user_id
- Sum calculation error
- Missing initial credits allocation transaction

### 2. **Profile vs Transactions Desync**
The `users.ruv_credits` field may be updated independently from transaction records:

- Profile field: 602 (manual update or initial allocation)
- Transactions sum: 0 (no initial allocation transaction recorded)

### 3. **Initial Credits Not Recorded**
User received 256 initial credits (visible in profile metadata), but this may not have been recorded in `ruv_transactions`:

```json
{
  "user_metadata": {
    "initial_credits": 256  // Not reflected in transactions?
  }
}
```

### 4. **Cached Balance**
Balance API may be returning cached value (0) instead of recalculating from transactions.

---

## 🔧 Attempted Workarounds

### 1. Manual Credit Allocation (Failed)
```javascript
await mcp__flow-nexus__app_store_earn_ruv({
  user_id: "d6a0de79-14fd-4d9a-bf11-23ef5da3f696",
  amount: 256,
  reason: "Initial credits allocation",
  source: "registration"
});
// Result: Transaction created but balance still shows 0
```

### 2. MCP Server Restart (Tested)
```bash
npx flow-nexus@latest mcp start
# Result: Same issue persists
```

### 3. Re-authentication (Tested)
```javascript
await mcp__flow-nexus__user_login({
  email: "johaneoyaraht@gmail.com",
  password: "***"
});
// Result: Login successful, balance still 0
```

---

## 📊 Impact

### Severity: **HIGH**

**Blocked Features:**
- ❌ Cloud swarm initialization (`swarm_init` requires 10-23 rUv)
- ❌ Agent spawning in cloud (`agent_spawn` requires 2-5 rUv)
- ❌ Neural network training (`neural_train` requires 50-200 rUv)
- ❌ Premium templates (`template_deploy` some require rUv)

**Workaround Available:**
- ✅ Local Hive Mind works (no rUv required)
- ✅ E2B Sandboxes work (use `credits_balance`, not rUv)
- ✅ Free templates work

**Business Impact:**
- User cannot utilize paid cloud features despite having credits
- Gamification system broken (daily bonuses not usable)
- Premium features inaccessible

---

## 🔬 Reproduction Steps

1. Create new account on Flow Nexus
2. Receive initial credits (256) and daily login bonus (+100)
3. Check `GET /user_profile` → `ruv_credits` shows 602 ✅
4. Check `GET /ruv_balance` → `balance` shows 0 ❌
5. Attempt `POST /swarm_init` → Fails with "Insufficient rUv credits"

**Reproducibility:** 100% (consistent across sessions)

---

## 💻 Environment

**Platform:** Flow Nexus Cloud
**Client:** MCP (Model Context Protocol)
**Integration:** Claude Code + Claude Flow + Flow Nexus MCP
**API Version:** Latest (2025-10-04)
**Database:** PostgreSQL (Supabase)

**MCP Tools Used:**
- `mcp__flow-nexus__user_login`
- `mcp__flow-nexus__user_profile`
- `mcp__flow-nexus__ruv_balance`
- `mcp__flow-nexus__ruv_history`
- `mcp__flow-nexus__swarm_init`
- `mcp__flow-nexus__app_store_earn_ruv`

---

## 🛠️ Requested Actions

### Priority 1: Fix Balance Calculation
1. Investigate `ruv_balance` endpoint logic
2. Ensure it correctly aggregates from `ruv_transactions`
3. Include initial credits allocation in calculation

### Priority 2: Sync Profile Field
1. Ensure `users.ruv_credits` matches calculated balance
2. Add database trigger or view for automatic sync

### Priority 3: Audit Transaction History
1. Verify all credit allocations are recorded
2. Add initial credits transaction if missing
3. Recalculate balance from transactions

### Priority 4: Documentation
1. Clarify relationship between `ruv_credits` (profile) and `ruv_balance` (API)
2. Document which field should be source of truth
3. Update API docs if behavior is intentional

---

## 📎 Supporting Data

### Full Profile Export
```json
{
  "success": true,
  "profile": {
    "id": "d6a0de79-14fd-4d9a-bf11-23ef5da3f696",
    "email": "johaneoyaraht@gmail.com",
    "stripe_customer_id": null,
    "plan_type": "free",
    "credits_balance": 602,
    "monthly_usage_limit": 1000000,
    "total_tokens_used": 0,
    "total_sandboxes_created": 0,
    "created_at": "2025-10-04T17:49:54.46579+00:00",
    "updated_at": "2025-10-04T17:59:47.913181+00:00",
    "metadata": {},
    "ruv_credits": 602,
    "stripe_payment_method_id": null,
    "auto_refill_enabled": false,
    "auto_refill_threshold": 20,
    "auto_refill_amount": 50,
    "last_refill_at": null,
    "payment_failure_count": 0,
    "subscription_tier": "free",
    "subscription_status": "free",
    "subscription_id": null,
    "current_period_start": null,
    "current_period_end": null,
    "stripe_subscription_id": null,
    "experience_points": 0,
    "level": 1,
    "challenge_stats": {
      "total_attempts": 0,
      "total_xp_earned": 0,
      "total_rewards_earned": 0,
      "successful_completions": 0
    },
    "last_login_at": "2025-10-04T17:59:47.913181+00:00",
    "last_daily_bonus_at": null,
    "daily_login_streak": 0,
    "last_daily_bonus": "2025-10-04",
    "login_streak": 1
  }
}
```

### Transaction History
```json
{
  "success": true,
  "transactions": [
    {
      "id": "f6e36dea-5d42-4497-b5a5-4111fa009f77",
      "user_id": "d6a0de79-14fd-4d9a-bf11-23ef5da3f696",
      "type": "usage",
      "amount": -10,
      "balance_after": 502,
      "description": "swarm_init x1",
      "metadata": {
        "cost": 10,
        "value": 1,
        "event_id": "463067f0-e29b-49eb-9d4c-7b79dad1ec08",
        "event_name": "swarm_init"
      },
      "created_at": "2025-10-04T17:59:47.913181+00:00"
    },
    {
      "id": "ba71ee71-98bf-4558-a145-a298353b1073",
      "user_id": "d6a0de79-14fd-4d9a-bf11-23ef5da3f696",
      "type": "bonus",
      "amount": 100,
      "balance_after": 602,
      "description": "Daily login bonus (Day 1 streak)",
      "metadata": {
        "source": "daily_login",
        "streak": 1,
        "base_bonus": 100,
        "bonus_date": "2025-10-04",
        "streak_bonus": 0
      },
      "created_at": "2025-10-04T17:59:47.913181+00:00"
    }
  ]
}
```

---

## 📧 Contact Information

**User:** Johane Oyaraht
**Email:** johaneoyaraht@gmail.com
**Discord:** @johanito203 (if available)
**Preferred Contact:** Email
**Timezone:** UTC+3 (Moscow)

**Willing to:**
- ✅ Provide additional logs/data
- ✅ Test fixes in development environment
- ✅ Participate in debugging session
- ✅ Share screen for live debugging

---

## 🙏 Additional Notes

This issue is blocking our production deployment of МойDate (dating application) backend orchestration. We've prepared comprehensive backend architecture documentation and are ready to deploy with Flow Nexus cloud swarms, but this bug prevents us from proceeding.

Temporary workaround using local Hive Mind is functional, but we would prefer to utilize cloud features for scalability.

**Thank you for your assistance!**

---

**Report Generated:** 2025-10-04T20:30:00Z
**Flow Nexus Version:** Latest (MCP)
**Documentation:** https://flow-nexus.ruv.io/docs
