-- Seed keyword lexicon with multilingual variants
INSERT INTO public.keyword_lexicon(category, lang, variant, severity_score, pattern, fuzzy_key)
VALUES
  ('messaging','en','whatsapp',80,'\\bwh?@?ts?ap+p?\\b','whatsapp'),
  ('messaging','fr','whatsapp',80,'\\bwha?ts?ap+p?\\b','whatsapp'),
  ('messaging','pt','zap',80,'\\bzap(?:zap)?\\b','zap'),
  ('messaging','pt','whatsapp',80,'\\bwhats?app\\b','whatsapp'),
  ('messaging','ru','telegram_ru',80,U&'\\b(?:\0442\0435\043B\0435\0433\0440\0430\043C|\0442\0435\043B\0435\0433\0430|telegram|tg)\\b','telegram'),
  ('phone','en','phone_number',90,'\\b(?:\\+?\\d[\\s.-]?){7,}\\b','phone'),
  ('phone','fr','num_tel',90,'\\b(?:\\+?\\d[\\s.-]?){7,}\\b','phone'),
  ('phone','pt','telefone',90,'\\b(?:\\+?\\d[\\s.-]?){7,}\\b','phone'),
  ('phone','ru','phone_ru',90,'\\b(?:\\+?\\d[\\s.-]?){7,}\\b','phone'),
  ('handle','en','instagram',70,'\\b@?[a-z0-9_.]{3,}\\b','handle'),
  ('handle','fr','insta',70,'\\binsta|instagram|@[-_.a-z0-9]{3,}\\b','handle'),
  ('handle','pt','arroba',70,'\\b@[-_.a-z0-9]{3,}\\b','handle'),
  ('handle','ru','handle_ru',70,'\\b@[0-9a-z_.]{3,}\\b','handle'),
  ('meeting','en','meet',60,'\\bmeet(?:ing)?|link\\s*up|irl\\b','meet'),
  ('meeting','fr','rdv',60,'\\brdv|rendez[- ]?vous\\b','rdv'),
  ('meeting','pt','encontro',60,'\\bencontro|vamos? nos ver\\b','encontro'),
  ('meeting','ru','meeting_ru',60,U&'\\b(?:\0432\0441\0442\0440\0435\0447\0430|\0434\0430\0432\0430\0439\0441\044F|\0432 \0440\0435\0430\043B)\\b','meet')
ON CONFLICT DO NOTHING;
