// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";

type Phase = 'day3' | 'day7' | 'day14' | 'day30';

interface RelationshipStatusRow {
  match_id: string;
  phase: Phase;
  answers: Record<string, unknown>;
  public_opt_in: boolean;
}

interface AnswerPayload {
  matchId?: string;
  phase?: Phase;
  answer?: string;
  lang?: string;
  publicOptIn?: boolean;
}

const getUserSupabaseClient = (req: Request) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !anonKey) {
    throw new Error('Missing Supabase configuration');
  }

  const authHeader = req.headers.get('Authorization');
  const accessToken = authHeader?.split('Bearer ')[1];

  return createClient(supabaseUrl, accessToken ?? anonKey, {
    global: {
      headers: {
        Authorization: authHeader ?? '',
      },
    },
    auth: {
      persistSession: false,
    },
  });
};

const getServiceClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
    },
  });
};

const parsePayload = async (req: Request): Promise<AnswerPayload> => {
  try {
    return (await req.json()) as AnswerPayload;
  } catch (_error) {
    throw new Error('invalid_payload');
  }
};

const fetchStatus = async (
  supabase: ReturnType<typeof createClient>,
  matchId: string
): Promise<RelationshipStatusRow | null> => {
  const { data, error } = await supabase
    .from('relationship_status')
    .select('match_id, phase, answers, public_opt_in')
    .eq('match_id', matchId)
    .maybeSingle();

  if (error) {
    console.error('Failed to load relationship status', { matchId, error });
    throw error;
  }

  return data;
};

const verifyOwnership = async (
  supabase: ReturnType<typeof createClient>,
  matchId: string,
  userId: string
) => {
  const { data, error } = await supabase
    .from('matches')
    .select('user1_id, user2_id')
    .eq('id', matchId)
    .maybeSingle();

  if (error) {
    console.error('Failed to load match for answer submission', { matchId, error });
    throw error;
  }

  if (!data || (data.user1_id !== userId && data.user2_id !== userId)) {
    throw new Error('forbidden');
  }
};

const buildAnswersArray = (
  existing: unknown,
  phase: Phase,
  userId: string,
  answer: string,
  lang: string,
  publicOptIn: boolean | undefined
) => {
  const answers = Array.isArray(existing) ? [...existing] : [];
  const filtered = answers.filter(
    (entry) => !(entry.phase === phase && entry.user_id === userId)
  );

  filtered.push({
    user_id: userId,
    phase,
    answer,
    lang,
    public_opt_in: publicOptIn ?? false,
    created_at: new Date().toISOString(),
  });

  return filtered;
};

interface AnswerEntry {
  phase: Phase;
  user_id: string;
  answer: string;
  lang?: string;
  public_opt_in?: boolean;
}

const evaluateConcordance = (
  answers: AnswerEntry[],
  phase: Phase
) => {
  const relevant = answers.filter((entry) => entry.phase === phase);
  if (relevant.length < 2) {
    return { concordant: false, commonAnswer: null, allOptedIn: false };
  }

  const normalized = relevant.map((entry) => ({
    user_id: entry.user_id,
    answer: String(entry.answer ?? '').trim(),
    normalized: String(entry.answer ?? '').trim().toLowerCase(),
    public_opt_in: Boolean(entry.public_opt_in),
  }));

  const allOptedIn = normalized.every((entry) => entry.public_opt_in);
  const normalizedSet = new Set(normalized.map((entry) => entry.normalized));

  return {
    concordant: normalizedSet.size === 1,
    commonAnswer: normalizedSet.size === 1 ? normalized[0].answer : null,
    allOptedIn,
  };
};

const createFeedPost = async (
  matchId: string,
  phase: Phase,
  answer: string
) => {
  const serviceClient = getServiceClient();
  if (!serviceClient) {
    console.warn('Service key missing; skipping feed post creation');
    return;
  }

  const { data: match, error: matchError } = await serviceClient
    .from('matches')
    .select('id, is_intercultural, user1_id, user2_id')
    .eq('id', matchId)
    .maybeSingle();

  if (matchError || !match) {
    console.error('Failed to load match for feed creation', { matchId, matchError });
    return;
  }

  const { data: profiles, error: profilesError } = await serviceClient
    .from('profiles')
    .select('user_id, abbrev_name, origin_country_code, location_country')
    .in('user_id', [match.user1_id, match.user2_id]);

  if (profilesError) {
    console.error('Failed to load match profiles for feed', { matchId, profilesError });
    return;
  }

  const findProfile = (userId: string) =>
    profiles?.find((profile) => profile.user_id === userId) ?? null;

  const profileA = findProfile(match.user1_id);
  const profileB = findProfile(match.user2_id);

  const payload = {
    match_id: matchId,
    phase,
    status: answer,
    flags: match.is_intercultural ? ['intercultural'] : [],
    abbrev_names: [profileA?.abbrev_name ?? '', profileB?.abbrev_name ?? ''],
    countries: [
      profileA?.origin_country_code ?? profileA?.location_country ?? null,
      profileB?.origin_country_code ?? profileB?.location_country ?? null,
    ].map((value) => value ?? null),
  };

  const { error: insertError } = await serviceClient
    .from('feed_posts')
    .insert({
      match_id: matchId,
      type: 'REL_STATUS_UPDATE',
      payload,
      visibility: 'public',
      lang: 'en',
    })
    .select('id')
    .maybeSingle();

  if (insertError && insertError.code !== '23505') {
    console.error('Failed to create feed post', { matchId, insertError });
  }
};

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const supabase = getUserSupabaseClient(req);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload = await parsePayload(req);
    const matchId = payload.matchId;
    const phase = payload.phase;
    const answer = payload.answer;

    if (!matchId || !phase || !answer) {
      return new Response(JSON.stringify({ error: 'missing_fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await verifyOwnership(supabase, matchId, user.id);
    const statusRow = await fetchStatus(supabase, matchId);
    if (!statusRow) {
      return new Response(JSON.stringify({ error: 'relationship_not_found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (statusRow.phase !== phase) {
      return new Response(JSON.stringify({ error: 'phase_mismatch' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const answers = buildAnswersArray(
      statusRow.answers,
      phase,
      user.id,
      answer,
      payload.lang ?? 'en',
      payload.publicOptIn
    );

    const { concordant, commonAnswer, allOptedIn } = evaluateConcordance(answers, phase);

    const { error: updateError } = await supabase
      .from('relationship_status')
      .update({
        answers,
        public_opt_in: allOptedIn ? true : statusRow.public_opt_in,
      })
      .eq('match_id', matchId);

    if (updateError) {
      console.error('Failed to update relationship answers', updateError);
      throw updateError;
    }

    if (concordant && allOptedIn && commonAnswer) {
      await createFeedPost(matchId, phase, commonAnswer);
    }

    return new Response(
      JSON.stringify({
        success: true,
        concordant,
        commonAnswer,
        allOptedIn,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Relationship answer handler failed', error);

    const statusCode = error?.message === 'forbidden' ? 403 : 500;
    const errorKey = error?.message === 'forbidden' ? 'forbidden' : 'unexpected_error';

    return new Response(JSON.stringify({ error: errorKey }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
