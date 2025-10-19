-- Seed questionnaire catalog (FR/PT/EN/RU)
INSERT INTO public.questionnaire_catalog(phase, lang, text, options, version, active)
VALUES
  ('day3','fr','Vous discutez encore ?', ARRAY['Tous les jours','De temps en temps','Rarement/Plus du tout'],1,true),
  ('day3','pt','Ainda estao conversando?', ARRAY['Todos os dias','De vez em quando','Raramente/Nao mais'],1,true),
  ('day3','en','Still chatting?', ARRAY['Every day','Sometimes','Rarely/Not anymore'],1,true),
  ('day3','ru','�� ��� ���������?', ARRAY['������ ����','������','�����/������ ���'],1,true),
  ('day7','fr','C�etait juste un date ou vous vous revoyez ?', ARRAY['Juste un date','On prevoit un autre','On s�est deja revus'],1,true),
  ('day7','pt','Foi so um encontro ou vao se ver de novo?', ARRAY['So um encontro','Planejando outro','Ja nos vimos de novo'],1,true),
  ('day7','en','Was it just one date or will you meet again?', ARRAY['Just one date','Planning another','Already met again'],1,true),
  ('day7','ru','��� ���� ������ ������� ��� ��������� �����?', ARRAY['������ ���� ��������','��������� ��� ����','��� �������� �����'],1,true),
  ('day14','fr','Ca devient serieux ?', ARRAY['Juste fun ??','On apprend a se connaitre ??','C�est officiel ??'],1,true),
  ('day14','pt','Esta ficando serio?', ARRAY['So diversao ??','Nos conhecendo ??','E oficial ??'],1,true),
  ('day14','en','Is it getting serious?', ARRAY['Just fun ??','Getting to know each other ??','It�s official ??'],1,true),
  ('day14','ru','�� ���������� ��������?', ARRAY['������ ������� ??','��������������� ??','���������� ??'],1,true),
  ('day30','fr','Annonce officielle d�un couple ���Date ?', ARRAY['Pas encore','Exclusif','Couple officiel'],1,true),
  ('day30','pt','Anuncio oficial de casal ���Date?', ARRAY['Ainda nao','Exclusivo','Casal oficial'],1,true),
  ('day30','en','Official ���Date couple announcement?', ARRAY['Not yet','Exclusive','Official couple'],1,true),
  ('day30','ru','���������� ��������� ���� ���Date?', ARRAY['���� ���','���������','����������� ����'],1,true)
ON CONFLICT DO NOTHING;
