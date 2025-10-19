// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";

interface RelationshipStatusRow {
  match_id: string;
  phase: 'day3' | 'day7' | 'day14' | 'day30';
  next_survey_at: string | null;
  public_opt_in: boolean;
  answers: unknown;
}

interface QuestionnaireRow {
  id: string;
  phase: string;
  lang: string;
  text: string;
  options: string[];
  version: number;
}

interface MatchContext {
  languages: string[];
  fallbackSenderId: string;
}

const PHASE_SEQUENCE: Record<RelationshipStatusRow['phase'], RelationshipStatusRow['phase'] | null> = {
  day3: 'day7',
  day7: 'day14',
  day14: 'day30',
  day30: null,
};

const PHASE_INTERVAL_DAYS: Record<string, number> = {
  day3: 2,
  day7: 7,
  day14: 16,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericClient = SupabaseClient<any, any, any>;

const getSupabaseServiceClient = (): GenericClient => {
  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
    },
  });
};

const computeNextSurveyAt = (currentPhase: RelationshipStatusRow['phase']): string | null => {
  const nextPhase = PHASE_SEQUENCE[currentPhase];
  if (!nextPhase) {
    return null;
  }

  const intervalDays = PHASE_INTERVAL_DAYS[currentPhase] ?? 7;
  const now = new Date();
  now.setUTCDate(now.getUTCDate() + intervalDays);
  return now.toISOString();
};

const selectPrompt = (
  prompts: QuestionnaireRow[],
  preferredLangs: string[]
): QuestionnaireRow | null => {
  const fallbackOrder = [...preferredLangs, 'en'];
  for (const lang of fallbackOrder) {
    const match = prompts.find((item) => item.lang === lang);
    if (match) {
      return match;
    }
  }
  return prompts[0] ?? null;
};

const emitTeamMessage = async (
  supabase: GenericClient,
  matchId: string,
  prompt: QuestionnaireRow,
  locale: string,
  senderId: string
) => {
  const messagePayload = {
    match_id: matchId,
    sender_id: senderId,
    message_type: 'system',
    content: JSON.stringify({
      type: 'questionnaire',
      prompt: prompt.text,
      options: prompt.options,
      phase: prompt.phase,
      version: prompt.version,
      lang: locale,
    }),
  };

  const { error } = await supabase.from('chat_messages').insert(messagePayload);
  if (error) {
    console.error('Failed to emit questionnaire message', { matchId, locale, error });
    throw error;
  }
};

const markQueued = async (
  supabase: GenericClient,
  matchId: string,
  nextPhaseAt: string | null
) => {
  const { error } = await supabase
    .from('relationship_status')
    .update({ next_survey_at: nextPhaseAt, updated_at: new Date().toISOString() })
    .eq('match_id', matchId);

  if (error) {
    console.error('Failed to update relationship status', { matchId, error });
    throw error;
  }
};

const fetchMatchContext = async (
  supabase: GenericClient,
  matchId: string
): Promise<MatchContext> => {
  const { data, error } = await supabase
    .from('matches')
    .select('user1_id, user2_id')
    .eq('id', matchId)
    .maybeSingle();

  if (error) {
    console.error('Failed to read match partners', { matchId, error });
    throw error;
  }

  if (!data) {
    return { languages: ['en'], fallbackSenderId: '' };
  }

  const userIds = [data.user1_id, data.user2_id];
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('user_id, languages')
    .in('user_id', userIds);

  if (profilesError) {
    console.error('Failed to load participant profiles', { matchId, profilesError });
    throw profilesError;
  }

  const languages = new Set<string>();
  profiles?.forEach((profile) => {
    if (Array.isArray(profile.languages)) {
      profile.languages.forEach((lang: string) => languages.add(lang.toLowerCase()));
    }
  });

  return {
    languages: languages.size > 0 ? Array.from(languages) : ['en'],
    fallbackSenderId: data.user1_id,
  };
};

const loadPendingRelationships = async (
  supabase: GenericClient
): Promise<RelationshipStatusRow[]> => {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('relationship_status')
    .select('match_id, phase, next_survey_at, public_opt_in, answers')
    .lte('next_survey_at', now);

  if (error) {
    console.error('Failed to load relationship statuses', error);
    throw error;
  }

  return data ?? [];
};

const loadPromptsForPhase = async (
  supabase: GenericClient,
  phase: RelationshipStatusRow['phase']
): Promise<QuestionnaireRow[]> => {
  const { data, error } = await supabase
    .from('questionnaire_catalog')
    .select('id, phase, lang, text, options, version')
    .eq('phase', phase)
    .eq('active', true);

  if (error) {
    console.error('Failed to load questionnaire prompts', { phase, error });
    throw error;
  }

  return data ?? [];
};

const processRelationship = async (
  supabase: GenericClient,
  relationship: RelationshipStatusRow
) => {
  const prompts = await loadPromptsForPhase(supabase, relationship.phase);
  if (prompts.length === 0) {
    console.warn('No questionnaire prompts configured for phase', relationship.phase);
    return;
  }

  const context = await fetchMatchContext(supabase, relationship.match_id);
  const prompt = selectPrompt(prompts, context.languages);
  if (!prompt) {
    console.warn('Unable to select prompt for phase', relationship.phase);
    return;
  }

  const locale = context.languages[0] ?? 'en';
  await emitTeamMessage(supabase, relationship.match_id, prompt, locale, context.fallbackSenderId);

  const nextSurveyAt = computeNextSurveyAt(relationship.phase);
  await markQueued(supabase, relationship.match_id, nextSurveyAt);
};

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const supabase = getSupabaseServiceClient();

  try {
    const pending = await loadPendingRelationships(supabase);
    const results = [] as Array<{ matchId: string; status: string; error?: string }>;

    for (const relationship of pending) {
      try {
        await processRelationship(supabase, relationship);
        results.push({ matchId: relationship.match_id, status: 'queued' });
      } catch (error) {
        console.error('Failed to process relationship', { matchId: relationship.match_id, error });
        results.push({ matchId: relationship.match_id, status: 'errored', error: String(error) });
      }
    }

    return new Response(
      JSON.stringify({ processed: results.length, results }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Scheduler failure', error);
    return new Response(
      JSON.stringify({ error: 'scheduler_failed', details: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});



