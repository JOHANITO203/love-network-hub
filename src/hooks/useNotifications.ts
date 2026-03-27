import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useConsent } from './useConsent';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { subscribeToPush, registerPushSubscription } from '@/utils/pushSubscription';
import { sendPushNotification } from '@/utils/pushClient';

export interface Notification {
  id: string;
  notification_type: string;
  type_name: string;
  icon: string;
  category: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
  scheduled_for: string;
  sent_at?: string | null;
}

export interface NotificationPreferences {
  notification_type: string;
  push_enabled: boolean;
  email_enabled: boolean;
  in_app_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  timezone: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    notification_type: 'match',
    type_name: 'New Match',
    icon: 'ðŸ’•',
    category: 'Matches',
    title: "It's a match! ðŸ’•",
    message: 'Annabelle has matched with you. Say hello!',
    data: { match_id: 'match-1' },
    is_read: false,
    created_at: new Date().toISOString(),
    scheduled_for: new Date().toISOString(),
  },
];

const MOCK_PREFERENCES: NotificationPreferences[] = [
  {
    notification_type: 'match',
    push_enabled: true,
    email_enabled: false,
    in_app_enabled: true,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
    timezone: 'UTC',
  },
  {
    notification_type: 'system',
    push_enabled: true,
    email_enabled: true,
    in_app_enabled: true,
    quiet_hours_start: '00:00',
    quiet_hours_end: '00:00',
    timezone: 'UTC',
  },
];

export const useNotifications = () => {
  const { user } = useAuth();
  const { updateConsent } = useConsent();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(1);
  const [preferences, setPreferences] = useState<NotificationPreferences[]>(MOCK_PREFERENCES);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscriptionRegistered, setSubscriptionRegistered] = useState(false);

  const ensureSubscription = useCallback(async () => {
    if (!user) return;
    try {
      const subscription = await subscribeToPush();
      await registerPushSubscription(user.id, subscription);
      setSubscriptionRegistered(true);
    } catch (error) {
      console.error('[push] subscription failed', error);
      toast({
        title: 'Erreur notification',
        description: "Impossible dâ€™enregistrer votre abonnement push.",
        variant: 'destructive',
      });
    }
  }, [toast, user]);

  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        void updateConsent('push', true);
        toast({
          title: 'Notifications activÃ©es',
          description: 'Vous recevrez maintenant des notifications.',
        });
        await ensureSubscription();
      } else if (result === 'denied') {
        void updateConsent('push', false);
      }
      return result;
    }
    return 'denied';
  }, [toast, updateConsent, ensureSubscription]);

  const mapOutboxRow = (row: any): Notification => {
    const payload = row?.payload ?? {};
    return {
      id: row.id ?? `${row.created_at ?? Date.now()}`,
      notification_type: payload.type ?? row.type ?? 'system',
      type_name: payload.title ?? 'Notification',
      icon: payload.icon ?? 'ðŸ””',
      category: row.category ?? 'system',
      title: payload.title ?? 'Notification',
      message: payload.body ?? '',
      data: payload.data ?? {},
      is_read: row.status === 'read',
      created_at: row.created_at ?? new Date().toISOString(),
      scheduled_for: row.created_at ?? new Date().toISOString(),
      sent_at: row.sent_at ?? null,
    };
  };

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notification_outbox')
        .select('id,user_id,payload,status,created_at,sent_at,category,type')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (data && data.length > 0) {
        const mapped = data.map(mapOutboxRow);
        setNotifications(mapped);
        setUnreadCount(mapped.filter((item) => !item.is_read).length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.warn('[notifications] fallback to mocks', error);
      setNotifications(MOCK_NOTIFICATIONS);
      setUnreadCount(MOCK_NOTIFICATIONS.filter((notification) => !notification.is_read).length);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadPreferences = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('notification_type,push_enabled,email_enabled,in_app_enabled,quiet_hours_start,quiet_hours_end,timezone')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        setPreferences(data as NotificationPreferences[]);
      } else {
        setPreferences(MOCK_PREFERENCES);
      }
    } catch (error) {
      console.warn('[notifications] failed to load preferences', error);
      setPreferences(MOCK_PREFERENCES);
    }
  }, [user]);

  const updatePreferences = useCallback(
    async (updatedPrefs: NotificationPreferences[]) => {
      if (!user) {
        setPreferences(updatedPrefs);
        return true;
      }

      try {
        const payload = updatedPrefs.map((pref) => ({
          ...pref,
          user_id: user.id,
        }));
        const { error } = await supabase.from('notification_preferences').upsert(payload);
        if (error) throw error;

        setPreferences(updatedPrefs);
        toast({
          title: 'PrÃ©fÃ©rences enregistrÃ©es',
          description: 'Vos paramÃ¨tres de notification ont Ã©tÃ© sauvegardÃ©s.',
        });
        return true;
      } catch (error) {
        console.error('[notifications] failed to update preferences', error);
        toast({
          title: 'Erreur',
          description: "Impossible dâ€™enregistrer vos prÃ©fÃ©rences.",
          variant: 'destructive',
        });
        return false;
      }
    },
    [toast, user]
  );

  const markAsRead = useCallback(async (notificationIds: string[]) => {
    if (!user || notificationIds.length === 0) return;
    setNotifications((prev) =>
      prev.map((notification) =>
        notificationIds.includes(notification.id)
          ? { ...notification, is_read: true }
          : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - notificationIds.length));
  }, [user]);

  const showBrowserNotification = useCallback((notification: Notification) => {
    if (permission === 'granted' && 'Notification' in window) {
      const options = {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
      };
      const browserNotification = new Notification(notification.title, options);
      setTimeout(() => browserNotification.close(), 5000);
    }
  }, [permission]);

  const markAllAsRead = useCallback(async () => {
    const unreadIds = notifications
      .filter((notification) => !notification.is_read)
      .map((notification) => notification.id);
    if (unreadIds.length > 0) {
      await markAsRead(unreadIds);
    }
  }, [notifications, markAsRead]);

  const sendTestNotification = useCallback(async () => {
    const mockNotification: Notification = {
      id: Date.now().toString(),
      notification_type: 'system_update',
      type_name: 'System Update',
      icon: 'ðŸ””',
      category: 'System',
      title: 'Test Notification',
      message: 'Ceci est une notification simulÃ©e.',
      is_read: false,
      created_at: new Date().toISOString(),
      scheduled_for: new Date().toISOString(),
    };
    setNotifications((prev) => [mockNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);
    toast({
      title: 'Notification simulÃ©e',
      description: 'Une notification fictive a Ã©tÃ© ajoutÃ©e.',
    });
    showBrowserNotification(mockNotification);
    if (user) {
      void sendPushNotification(user.id, {
        title: mockNotification.title,
        body: mockNotification.message,
        icon: '/favicon.ico',
        data: mockNotification.data,
      });
    }
  }, [showBrowserNotification, toast, user]);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (permission === 'granted' && user && !subscriptionRegistered) {
      void ensureSubscription();
    }
  }, [permission, user, subscriptionRegistered, ensureSubscription]);

  useEffect(() => {
    if (user) {
      void loadNotifications();
      void loadPreferences();
    }
  }, [user, loadNotifications, loadPreferences]);

  return {
    notifications,
    unreadCount,
    preferences,
    loading,
    permission,
    loadNotifications,
    loadPreferences,
    updatePreferences,
    markAsRead,
    markAllAsRead,
    requestPermission,
    sendTestNotification,
  };
};
