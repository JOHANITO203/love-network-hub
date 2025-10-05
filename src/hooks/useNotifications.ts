import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

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
  sent_at?: string;
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
    icon: '💕',
    category: 'Matches',
    title: 'It\'s a match! 💕',
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
];

export const useNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(1);
  const [preferences, setPreferences] = useState<NotificationPreferences[]>(MOCK_PREFERENCES);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        toast({
          title: 'Notifications activées',
          description: 'Vous recevrez maintenant des notifications mockées.',
        });
      }
      return result;
    }
    return 'denied';
  }, [toast]);

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

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 150));
    setNotifications(MOCK_NOTIFICATIONS);
    setUnreadCount(MOCK_NOTIFICATIONS.filter((notification) => !notification.is_read).length);
    setLoading(false);
  }, []);

  const loadPreferences = useCallback(async () => {
    setPreferences(MOCK_PREFERENCES);
  }, []);

  const updatePreferences = useCallback(async (updatedPrefs: NotificationPreferences[]) => {
    setPreferences(updatedPrefs);
    toast({
      title: 'Préférences enregistrées',
      description: 'Vos préférences locales ont été mises à jour.',
    });
    return true;
  }, [toast]);

  const markAllAsRead = useCallback(async () => {
    const unreadIds = notifications.filter((notification) => !notification.is_read).map((notification) => notification.id);
    if (unreadIds.length > 0) {
      await markAsRead(unreadIds);
    }
  }, [notifications, markAsRead]);

  const sendTestNotification = useCallback(async () => {
    const mockNotification: Notification = {
      id: Date.now().toString(),
      notification_type: 'system_update',
      type_name: 'System Update',
      icon: '🔔',
      category: 'System',
      title: 'Test Notification',
      message: 'Ceci est une notification simulée.',
      is_read: false,
      created_at: new Date().toISOString(),
      scheduled_for: new Date().toISOString(),
    };
    setNotifications((prev) => [mockNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);
    toast({
      title: 'Notification simulée',
      description: 'Une notification fictive a été ajoutée.',
    });
    showBrowserNotification(mockNotification);
  }, [showBrowserNotification, toast]);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadPreferences();
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
