import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import type {
  Activity,
  Conversation,
  Message,
  MessageReaction,
  MessageStatus,
  MessageType,
  SearchResult,
} from '../types';
import {
  getConversations,
  getActivities,
  sendMessage as sendMessageToStore,
  togglePin as togglePinInStore,
  toggleFavorite as toggleFavoriteInStore,
  deleteConversation as deleteConversationInStore,
  addReaction as addReactionInStore,
  markAsRead as markConversationAsReadInStore,
  markActivityViewed as markActivityViewedInStore,
  searchMessages as searchMessagesInStore,
} from '../store/messagesStore';

const FALLBACK_DELAY_MS = 200;

type ConversationRow = Tables<'conversations'> & {
  conversation_messages?: (Tables<'conversation_messages'> & {
    message_reactions?: Tables<'message_reactions'>[];
  })[];
};

type ActivityRow = Tables<'message_activities'>;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mapReactionRow = (row: Tables<'message_reactions'>): MessageReaction => ({
  emoji: row.emoji,
  userId: row.user_id,
  timestamp: new Date(row.created_at),
});

const mapMessageRow = (
  row: Tables<'conversation_messages'> & { message_reactions?: Tables<'message_reactions'>[] },
): Message => {
  const timestamp = row.timestamp ?? row.created_at;
  return {
    id: row.id,
    conversationId: row.conversation_id,
    sender: (row.sender as Message['sender']) ?? 'them',
    type: (row.type as MessageType) ?? 'text',
    content: row.content,
    timestamp: new Date(timestamp),
    status: (row.status as MessageStatus | undefined) ?? undefined,
    reactions: row.message_reactions?.map(mapReactionRow),
    duration: row.duration ?? undefined,
    thumbnail: row.thumbnail ?? undefined,
    mediaUrl: row.media_url ?? undefined,
    translated: row.translated_text
      ? {
          language: row.translated_language ?? 'auto',
          text: row.translated_text,
        }
      : undefined,
  };
};

const mapConversationRow = (row: ConversationRow): Conversation => {
  const messages = (row.conversation_messages ?? [])
    .map(mapMessageRow)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const lastMessage =
    messages.find((message) => message.id === row.last_message_id) ??
    messages[messages.length - 1] ??
    {
      id: `${row.id}-placeholder`,
      conversationId: row.id,
      sender: 'them',
      type: 'text',
      content: row.last_message_preview ?? '...',
      timestamp: row.last_message_at ? new Date(row.last_message_at) : new Date(row.created_at),
      status: 'delivered',
    };

  return {
    id: row.id,
    matchId: row.match_id,
    matchName: row.match_name ?? 'MoyDate user',
    matchAvatar:
      row.match_avatar ?? 'https://ui-avatars.com/api/?name=MoyDate&background=EBF1FF&color=4B5BFF',
    lastMessage,
    unreadCount: row.unread_count ?? 0,
    isPinned: row.is_pinned ?? false,
    isFavorite: row.is_favorite ?? false,
    isOnline: row.is_online ?? false,
    lastSeen: row.last_seen_at ? new Date(row.last_seen_at) : undefined,
    isTyping: row.is_typing ?? false,
    messages,
  };
};

const mapActivityRow = (row: ActivityRow): Activity => ({
  id: row.id,
  userId: row.user_id,
  userName: row.user_name,
  avatar:
    row.avatar ?? 'https://ui-avatars.com/api/?name=MoyDate&background=FFE4EC&color=E94057',
  type: row.type as Activity['type'],
  content: row.content_type === 'text'
    ? { type: 'text', text: row.content_text ?? '' }
    : {
        type: row.content_type as 'image' | 'video',
        url: row.content_url ?? undefined,
      },
  timestamp: new Date(row.created_at),
  viewed: Boolean(row.viewed),
  expiresAt: new Date(row.expires_at),
});

interface WithUser {
  userId?: string | null;
}

export interface SendMessagePayload extends WithUser {
  conversationId: string;
  content: string;
  type: Message['type'];
}

export interface AddReactionPayload extends WithUser {
  conversationId: string;
  messageId: string;
  emoji: string;
}

export interface ToggleConversationPayload extends WithUser {
  conversationId: string;
}

const fetchConversationRows = async (userId: string) => {
  return supabase
    .from('conversations')
    .select('*, conversation_messages(*, message_reactions(*))')
    .eq('user_id', userId)
    .order('last_message_at', { ascending: false });
};

export const fetchConversations = async ({
  userId,
}: WithUser = {}): Promise<Conversation[]> => {
  if (!userId) {
    await delay(FALLBACK_DELAY_MS);
    return getConversations();
  }

  try {
    const { data, error } = await fetchConversationRows(userId);
    if (error) {
      throw error;
    }
    return (data ?? []).map(mapConversationRow);
  } catch (error) {
    console.warn('[messagesApi] Supabase conversations fallback', error);
    await delay(FALLBACK_DELAY_MS);
    return getConversations();
  }
};

export const fetchActivities = async ({ userId }: WithUser = {}): Promise<Activity[]> => {
  if (!userId) {
    await delay(FALLBACK_DELAY_MS);
    return getActivities();
  }

  try {
    const { data, error } = await supabase
      .from('message_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapActivityRow);
  } catch (error) {
    console.warn('[messagesApi] Supabase activities fallback', error);
    await delay(FALLBACK_DELAY_MS);
    return getActivities();
  }
};

export const sendMessage = async ({
  conversationId,
  content,
  type,
  userId,
}: SendMessagePayload): Promise<Conversation> => {
  if (!userId) {
    await delay(FALLBACK_DELAY_MS);
    return sendMessageToStore(conversationId, {
      conversationId,
      sender: 'me',
      type,
      content,
    });
  }

  const timestamp = new Date().toISOString();

  try {
    const { data: insertedMessages, error: insertError } = await supabase
      .from('conversation_messages')
      .insert({
        conversation_id: conversationId,
        content,
        sender: 'me',
        type,
        status: 'sent',
        timestamp,
      })
      .select()
      .maybeSingle();

    if (insertError || !insertedMessages) {
      throw insertError ?? new Error('Message insertion failed');
    }

    const { error: updateError } = await supabase
      .from('conversations')
      .update({
        last_message_id: insertedMessages.id,
        last_message_preview: content,
        last_message_at: timestamp,
        unread_count: 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId);

    if (updateError) {
      throw updateError;
    }

    const { data: conversationRow, error: fetchError } = await supabase
      .from('conversations')
      .select('*, conversation_messages(*, message_reactions(*))')
      .eq('id', conversationId)
      .maybeSingle();

    if (fetchError || !conversationRow) {
      throw fetchError ?? new Error('Conversation not found');
    }

    return mapConversationRow(conversationRow as ConversationRow);
  } catch (error) {
    console.warn('[messagesApi] Supabase sendMessage fallback', error);
    await delay(FALLBACK_DELAY_MS);
    return sendMessageToStore(conversationId, {
      conversationId,
      sender: 'me',
      type,
      content,
    });
  }
};

const toggleConversationFlag = async (
  { conversationId, userId }: ToggleConversationPayload,
  field: 'is_pinned' | 'is_favorite',
) => {
  if (!userId) {
    await delay(FALLBACK_DELAY_MS);
    if (field === 'is_pinned') {
      togglePinInStore(conversationId);
    } else {
      toggleFavoriteInStore(conversationId);
    }
    return getConversations();
  }

  try {
    const { data: conversation, error: fetchError } = await supabase
      .from('conversations')
      .select('id,' + field)
      .eq('id', conversationId)
      .maybeSingle();

    if (fetchError || !conversation) {
      throw fetchError ?? new Error('Conversation not found');
    }

    const nextValue = !(conversation[field] ?? false);
    const { error: updateError } = await supabase
      .from('conversations')
      .update({ [field]: nextValue, updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    if (updateError) {
      throw updateError;
    }

    const { data: rows, error: rowsError } = await fetchConversationRows(userId);
    if (rowsError) {
      throw rowsError;
    }
    return (rows ?? []).map(mapConversationRow);
  } catch (error) {
    console.warn('[messagesApi] Supabase toggle flag fallback', error);
    await delay(FALLBACK_DELAY_MS);
    if (field === 'is_pinned') {
      togglePinInStore(conversationId);
    } else {
      toggleFavoriteInStore(conversationId);
    }
    return getConversations();
  }
};

export const togglePin = (payload: ToggleConversationPayload): Promise<Conversation[]> =>
  toggleConversationFlag(payload, 'is_pinned');

export const toggleFavorite = (payload: ToggleConversationPayload): Promise<Conversation[]> =>
  toggleConversationFlag(payload, 'is_favorite');

export const deleteConversation = async ({
  conversationId,
  userId,
}: ToggleConversationPayload): Promise<Conversation[]> => {
  if (!userId) {
    await delay(FALLBACK_DELAY_MS);
    deleteConversationInStore(conversationId);
    return getConversations();
  }

  try {
    const { error: deleteMessagesError } = await supabase
      .from('conversation_messages')
      .delete()
      .eq('conversation_id', conversationId);

    if (deleteMessagesError) {
      throw deleteMessagesError;
    }

    const { error: deleteConvError } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (deleteConvError) {
      throw deleteConvError;
    }

    const { data: rows, error } = await fetchConversationRows(userId);
    if (error) {
      throw error;
    }
    return (rows ?? []).map(mapConversationRow);
  } catch (error) {
    console.warn('[messagesApi] Supabase delete conversation fallback', error);
    await delay(FALLBACK_DELAY_MS);
    deleteConversationInStore(conversationId);
    return getConversations();
  }
};

export const addReaction = async ({
  conversationId,
  messageId,
  emoji,
  userId,
}: AddReactionPayload): Promise<Conversation[]> => {
  if (!userId) {
    await delay(FALLBACK_DELAY_MS);
    addReactionInStore(conversationId, messageId, emoji);
    return getConversations();
  }

  try {
    const { error: insertError } = await supabase.from('message_reactions').insert({
      message_id: messageId,
      user_id: userId,
      emoji,
    });

    if (insertError) {
      throw insertError;
    }

    const { data: rows, error } = await fetchConversationRows(userId);
    if (error) {
      throw error;
    }
    return (rows ?? []).map(mapConversationRow);
  } catch (error) {
    console.warn('[messagesApi] Supabase addReaction fallback', error);
    await delay(FALLBACK_DELAY_MS);
    addReactionInStore(conversationId, messageId, emoji);
    return getConversations();
  }
};

export const markConversationAsRead = async ({
  conversationId,
  userId,
}: ToggleConversationPayload): Promise<Conversation[]> => {
  if (!userId) {
    await delay(FALLBACK_DELAY_MS);
    markConversationAsReadInStore(conversationId);
    return getConversations();
  }

  try {
    const { error } = await supabase
      .from('conversations')
      .update({ unread_count: 0, updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    if (error) {
      throw error;
    }

    const { data: rows, error: fetchError } = await fetchConversationRows(userId);
    if (fetchError) {
      throw fetchError;
    }
    return (rows ?? []).map(mapConversationRow);
  } catch (error) {
    console.warn('[messagesApi] Supabase markConversationAsRead fallback', error);
    await delay(FALLBACK_DELAY_MS);
    markConversationAsReadInStore(conversationId);
    return getConversations();
  }
};

export const markActivityViewed = async (
  activityId: string,
  userId?: string | null,
): Promise<Activity[]> => {
  if (!userId) {
    await delay(FALLBACK_DELAY_MS);
    markActivityViewedInStore(activityId);
    return getActivities();
  }

  try {
    const { error } = await supabase
      .from('message_activities')
      .update({ viewed: true, updated_at: new Date().toISOString() })
      .eq('id', activityId);

    if (error) {
      throw error;
    }

    const { data, error: fetchError } = await supabase
      .from('message_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      throw fetchError;
    }
    return (data ?? []).map(mapActivityRow);
  } catch (error) {
    console.warn('[messagesApi] Supabase markActivityViewed fallback', error);
    await delay(FALLBACK_DELAY_MS);
    markActivityViewedInStore(activityId);
    return getActivities();
  }
};

export const searchMessages = async (
  query: string,
  userId?: string | null,
): Promise<SearchResult[]> => {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  if (!userId) {
    await delay(FALLBACK_DELAY_MS);
    return searchMessagesInStore(trimmed);
  }

  try {
    const { data, error } = await supabase
      .from('conversation_messages')
      .select('*, conversations!inner(id,match_name,match_id,match_avatar,user_id)')
      .ilike('content', `%${trimmed}%`)
      .eq('conversations.user_id', userId)
      .limit(50);

    if (error) {
      throw error;
    }

    return (
      data?.map((row: any) => ({
        type: 'message' as const,
        conversationId: row.conversations.id,
        matchName: row.conversations.match_name ?? 'MoyDate user',
        message: mapMessageRow(row),
        highlight: trimmed,
      })) ?? []
    );
  } catch (error) {
    console.warn('[messagesApi] Supabase search fallback', error);
    await delay(FALLBACK_DELAY_MS);
    return searchMessagesInStore(trimmed);
  }
};
