# Profile Service

Gestion profils utilisateurs avec photos (max 6) et géolocalisation.

## Endpoints
- GET /profiles/:id
- POST /profiles
- PUT /profiles/:id
- POST /profiles/:id/photos

## Stack
- Node.js 20 + Express + TypeScript
- PostgreSQL + PostGIS
- Supabase Storage
- Sharp (image processing)
