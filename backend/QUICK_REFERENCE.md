# Quick Reference - МойDate Backend

## Ports
3001: Auth | 3002: Profile | 3003: Matching | 3004: Chat
3005: Narrative | 3006: Premium | 3007: Social | 3008: Gamification
3009: Tracking | 3010: Notification | 3011: Translation

## Complete Services
- **Auth (3001):** VK OAuth, Phone OTP, JWT, Redis
- **Profile (3002):** CRUD, Photos (6 max), PostGIS, Nearby search

## To Complete (9 services)
Matching, Chat, Narrative, Premium, Social, Gamification, Tracking, Notification, Translation

## Stack
Node.js 20, Express 4.18, TypeScript 5.3, PostgreSQL 16, Redis 7, Docker

## Test
```bash
docker-compose up -d
curl localhost:3001/health
curl localhost:3002/health
```

## Files
- 42+ TypeScript files
- 306 KB total
- 2 services production-ready
- 9 services structure ready

## Docs
- `backend/README.md` - Full documentation
- `backend/STATUS.md` - Current status
- `RESUME_SESSION_BACKEND.md` - Session summary
- `docs/BACKEND_PLAN_FLOW_NEXUS.md` - Original plan
