**Cahier des charges МойDate – MVP v1.0**

1. **Objet & vision**
- Application mobile de dating interculturel pour russophones basés en Russie. [R]
- Différenciation : traduction intégrée RU↔EN, matching intelligent, sécurité et conformité locale. [R]

2. **Public, langues, plateformes**
- Cibles : résidents russophones, étudiants/expats, voyageurs longue durée. [R]
- Langues : russe prioritaire, anglais en second pour interface et contenus. [R]
- Plateformes : Flutter multiplateforme (iOS, Android). Distribution App Store et RuStore. [F]
- Paiements : RuStore Pay requis pour Android en Russie (cf. §11). [F]

3. **Périmètre MVP (must have)**
- Onboarding/Auth : e-mail + VK ID (SSO), contrôle 18+. [R]
- Profils : photos, bio, intérêts, langues, signe astro (option), préférences. [R]
- Localisation : opt-in, ville + rayon ajustable, valeur par défaut 50 km. [R]
- Matching : distance, intérêts, similarité de bio (embeddings), co-présence, comportement, boost interculturel modéré, équité monitorée. [R]
- Messagerie temps réel : texte, photos, blocage, signalement, modération UGC. [F]
- Traduction chat : RU↔EN via service Marian/OPUS-MT. [F/R]
- Interactions : likes, superlikes, double-match, notifications push. [R]
- Vérification 18+ : optionnelle, post-profil, bonus non punitif. [R]
- Notifications : APNs, FCM ou Yandex Cloud CNS/RuStore Push. [F]
- Monétisation : superlikes, boosts, abonnements (IAP iOS, RuStore Pay Android). [F]
- Post-MVP (can wait) : fil social, badges/jeux, store premium élargi. [R]

4. **Parcours utilisateur MVP**
- Création profil → préférences, intérêts, langues, astro (option).
- Localisation opt-in → calcul feed.
- Feed profils : scoring + diversité.
- Actions : Like/Pass/Superlike → double-match → chat + traduction.
- Vérif 18+ : bandeau + push, aucun malus. [R]

5. **Modules & fonctionnalités**
- Auth/Onboarding : e-mail, VK ID, consentements, suppression compte in-app (Apple 5.1.1). [F]
- Profils : édition, préférences, photos (stockage objet), visibilité rayon. [R]
- Localisation : géohash, profils urbain/mixte/épars, mode Voyage auto. [R]
- Matching API : GET /match/feed, POST /vote (cf. §10). [R]
- Messagerie : WebSockets + historique, blocage, signalement, anti-spam léger. [F]
- Traduction : POST /translate RU↔EN. [R]
- Média/Modération : upload → NSFWJS client + vérifications serveur. [F/R]
- Notifications : orchestration APNs/FCM ou alternatives russes. [F]
- Paiements : IAP iOS, RuStore Pay SDK Android. [F]

6. **Architecture & stack**
- Mobile : Flutter, i18n RU/EN, mode sombre. [R]
- Backend : monolithe modulaire (NestJS/Node ou Go), PostgreSQL, Redis. [R]
- Similarité texte : pgvector (cosinus, HNSW/IVFFlat). [F]
- Temps réel : WebSockets + Redis (présence, queues). [R]
- Stockage média : objet compatible S3. [R]
- Observabilité : OpenTelemetry (logs, metrics, traces). [R]

7. **Algorithme de matching V1**
**a. Signaux**
- Distance (pondérée par densité urbaine).
- Intérêts (chevauchement de tags).
- Similarité de bio via embeddings pgvector.
- Co-présence (statut en ligne).
- Comportement (taux de réponse, signalements).
- Astro (poids faible, optionnel).
- Interculturel : multiplicateur si nationalités différentes + proximité. [R]

**b. Formule**
- S_base = wD*fD + wI*fI + wE*fE + wA*fA + wT*fT + wB*fB.
- S = clamp(interculturel(S_base), 0, 1).
- Interculturel : nationalité différente et distance ≤ cutoff → S_base * 1,55, sinon S_base.
- Bonus vérifié : +8 % de rang (cap 12 %), aucun malus. [R]

**c. Paramètres initiaux**
- Poids : wD 0,18, wI 0,22, wE 0,18, wA 0,05, wT 0,12, wB 0,20. [R]
- Distance/logistique : urbain 60 km, mixte 120 km, épars 200 km.
- Mode Voyage : jusqu’à 300 km sur 7 jours si déplacement >100 km en 48 h. [R]
- Co-présence : ≥15 min (bonus fort), 15–120 min (bonus faible), sinon 0. [R]

**d. Diversité & équité**
- Diversité : lot de 20 profils → ≥30 % d’un cluster d’intérêts différent. [R]
- Équité : surveiller écart RR24 (vérifiés/non, nationalités) ≤5–7 %. Ajuster bonus vérif (8 % → 6 %) ou multiplicateur interculturel (1,55 → 1,35) si dépassement. [R]

**e. Amélioration continue V1.5**
- Ajustement quotidien ±0,02 des poids intérêts/comportement selon RR24/Double-match. [R]

8. **Vérification 18+ (optionnelle)**
- Statut : incitative, badge check. [R]
- Déclenchement : push J0 + bandeau profil persistant. [R]
- Flux : capture ID (DOB), selfie liveness, face-match (Sumsub RU). [F/R]
- Bonus doux : +8 % visibilité, +15 likes/jour (cap 12 %), aucun malus. [R]
- Données : conserver DOB, horodatage, hash doc. Purge images doc ≤30 jours. [R]
- Légal RU : consentement explicite, biométrie → consentement dédié, localisation données en Russie (citoyens RU). [F]

9. **Modèle de données (extrait) [R]**
- User(id, email, vk_id?, birthdate, gender, nationality, created_at, consent_bits)
- Profile(user_id PK, bio, languages[], astro_sign?, interests[], photos[], radius_km, looking_for)
- Location(user_id, geohash7, city, updated_at)
- Interaction(from, to, type=LIKE|SUPERLIKE|PASS, ts)
- Match(id, user_a, user_b, created_at, is_open)
- Message(id, match_id, from, body, media_url?, ts, status)
- Verification(user_id, status, dob, method, ts, evidence_hash, purge_at)
- Behavior(user_id, reply_rate_24h, thread_len_norm, like_match_ratio, reports_24h)
- Purchase(id, user_id, store=IOS|RUSTORE, sku, amount, currency, receipt, ts, status)
- ConsentLog(user_id, version, accepted_at, ip)

10. **API (extraits) [R]**
- Matching : GET /match/feed?limit=30 → [Candidate]; POST /vote {targetId, action} → {match: bool}.
- Chat : WS /chat, POST /messages.
- Vérif 18+ : POST /verify/start ; webhooks verify.completed | verify.failed.
- Traduction : POST /translate {text, from?, to}.
- Profil : GET/PUT /me/profile, PUT /me/location.

11. **Paiements & stores**
- iOS : IAP Apple obligatoire pour contenus numériques. [F]
- Android Russie : Google Play Billing requis mais suspendu pour banques RU → RuStore Pay SDK prioritaire. [F]

12. **Notifications**
- iOS : APNs. [F]
- Android : FCM. [F]
- Alternatives Russie : Yandex Cloud CNS, RuStore Push. [F]

13. **Traduction**
- MVP : Marian/OPUS-MT RU↔EN côté serveur. [F/R]
- Post-MVP : Bergamot on-device pour confidentialité. [F/R]

14. **Sécurité & conformité**
- Apple UGC : modération, report, blocage requis. [F]
- Suppression compte in-app (iOS). [F]
- Google Play : Play Billing, justification localisation arrière-plan. [F]
- Russie : 152-FZ (données perso, biométrie → consentement spécial). [F]
- 242-FZ : stockage données citoyens RU en Russie. [F]
- Transferts transfrontaliers : notification Roskomnadzor (depuis 01/03/2023). [F]
- Notification incident : schéma 24 h / 72 h. [F]
- RGPD (utilisateurs UE) : orientation sexuelle = donnée spéciale (Art. 9) → consentement explicite. [F]
- Modération image : NSFWJS client + revue humaine si signalement. [F/R]
- E2EE post-MVP : Signal Protocol (libsignal). [F/R]

15. **Performance & qualité (cibles MVP) [R]**
- TTI feed ≤1,2 s (cache + pagination).
- Envoi message ≤300 ms P50.
- Sessions crash-free ≥99,5 %.
- Disponibilité backend ≥99,9 %.

16. **Analytics & KPI (hebdo) [R]**
- RR24, Double-Match Rate, CTR Like, Chat→10 messages.
- Équité : écart RR24 vérifiés vs non ≤5 %, par nationalité ≤7 %, sinon réduction auto bonus.
- Sécurité : signalements / 1000 impressions <8.

17. **Tests**
- Unitaires : distance/cutoff, co-présence (15/120 min), clamp boost interculturel, diversité feed, anti-modération upload. [R]
- E2E : onboarding → feed → match → chat → traduction → notifications. [R]
- Charge : chat 1000 msg/s, feed 500 rps, upload 50 ops/s. [R]
- Conformité : suppression compte iOS, consentements biométrie, export/suppression données. [F]

18. **Roadmap (jalons, sans dates)**
- Fondations : Auth/VK ID, profils, localisation, matching V1, chat, traduction Marian, push, modération. [R]
- Monétisation : IAP iOS, RuStore Pay SDK Android. [F]
- Conformité : stockage Russie (152-FZ/242-FZ), notification transferts, suppression compte iOS, localisation background Google Play. [F]
- Qualité/ML : V1.5 ajustements, V2 apprentissage supervisé, A/B bonus. [R]

19. **Déploiement & exploitation**
- Infrastructure en Russie pour données citoyens RU (DB, stockage objet). [F]
- Backups chiffrés, rotation clés, RBAC admin. [R]
- Observabilité : traces, metrics, logs, alertes SLO. [R]

20. **Risques & mitigations**
- Paiements Google Play RU : suspension, RuStore indispensable. [F]
- Équité matching : auto-réduction bonus si RR24 déséquilibré. [R]
- Transferts hors RU : notifier Roskomnadzor et hébergement RU. [F]

21. **Config as code (exemple) [R]**
```yaml
matching:
  weights: { distance: 0.18, interests: 0.22, embedding: 0.18, astro: 0.05, copresence: 0.12, behavior: 0.20 }
  intercultural_multiplier: 1.55
  diversity_min_ratio: 0.30
  verified_rank_bonus_pct: 8    # cap 12%
  show_again_threshold: 0.60
distance:
  urban:  { kappa: 10, tau: 5, cutoff_km: 60 }
  mixed:  { kappa: 25, tau: 8, cutoff_km: 120 }
  sparse: { kappa: 40, tau:10, cutoff_km: 200 }
  travel_mode_cutoff_km: 300
copresence: { strong_min: 15, weak_max: 120, max_daily_boosts_per_pair: 2 }
verification18:
  optional: true
  provider: sumsub
  purge_doc_days: 30
  verified_bonus_pct: 8
```

**Annexes – références clés (sélection)**
- Apple : suppression compte (5.1.1), UGC (1.2). [F]
- Google Play : paiements et localisations, suspension services vendeurs RU. [F]
- Russie : 152-FZ, 242-FZ, transferts transfrontaliers, notifications incidents. [F]
- RGPD Art. 9. [F]
- Yandex Cloud CNS, RuStore Push/Pay. [F]
- pgvector, Marian/OPUS-MT, Bergamot, NSFWJS, Signal Protocol. [R]

**TL;DR**
Le MVP livre un matching pertinent (distance, intérêts, texte, comportement, bonus interculturel), un chat temps réel avec traduction RU↔EN, une vérification 18+ incitative, une monétisation (IAP iOS, RuStore Pay) et la conformité RU/Apple/Google. L’architecture modulaire prépare la montée en charge et l’évolution vers des microservices.
