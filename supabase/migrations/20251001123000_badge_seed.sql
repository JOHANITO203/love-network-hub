-- Seed initial badges
INSERT INTO public.badges(code, title, icon, rules)
VALUES
  ('INTERCULTURAL_SPARK','Etincelle interculturelle','spark.svg','{"event":"match.confirmed","conditions":{"isIntercultural":true}}'),
  ('RELATIONSHIP_DAY14','Phase 14 atteinte','day14.svg','{"event":"relationship.phase_completed","conditions":{"phase":"day14"}}'),
  ('PUBLIC_FEED_STREAK','Chef.fe de la scene','feed.svg','{"event":"feed.posted","conditions":{"streak":3}}'),
  ('PREMIUM_UPGRADE','Upgrade premium','crown.svg','{"event":"premium.upgraded"}')
ON CONFLICT (code) DO NOTHING;
