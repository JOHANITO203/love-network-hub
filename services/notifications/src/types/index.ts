export enum NotificationType {
  NEW_MATCH = 'NEW_MATCH',
  NEW_MESSAGE = 'NEW_MESSAGE',
  LIKE = 'LIKE',
  SUPER_LIKE = 'SUPER_LIKE',
  PROFILE_VIEW = 'PROFILE_VIEW',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
  PROMOTIONAL = 'PROMOTIONAL',
  REMINDER = 'REMINDER',
  SUBSCRIPTION = 'SUBSCRIPTION'
}

export enum NotificationChannel {
  PUSH = 'PUSH',
  EMAIL = 'EMAIL',
  IN_APP = 'IN_APP',
  SMS = 'SMS'
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
  READ = 'READ'
}

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  imageUrl?: string;
  actionUrl?: string;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  scheduledFor?: Date;
  expiresAt?: Date;
  templateId?: string;
  templateData?: Record<string, any>;
  abTestVariant?: string;
}

export interface NotificationPreferences {
  userId: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  smsEnabled: boolean;
  notificationTypes: {
    [key in NotificationType]?: {
      push: boolean;
      email: boolean;
      inApp: boolean;
      sms: boolean;
    };
  };
  quietHoursStart?: string; // HH:mm format
  quietHoursEnd?: string;
  timezone: string;
  emailFrequency: 'INSTANT' | 'DAILY_DIGEST' | 'WEEKLY_DIGEST' | 'NEVER';
}

export interface DeviceToken {
  id: string;
  userId: string;
  token: string;
  platform: 'IOS' | 'ANDROID' | 'WEB';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  channel: NotificationChannel;
  subject?: string; // For email
  titleTemplate: string;
  bodyTemplate: string;
  htmlTemplate?: string; // For email
  isActive: boolean;
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  imageUrl?: string;
  actionUrl?: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  deliveryStatus: {
    [key in NotificationChannel]?: DeliveryStatus;
  };
  scheduledFor?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  expiresAt?: Date;
  failureReason?: string;
  retryCount: number;
  templateId?: string;
  abTestVariant?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationAnalytics {
  notificationId: string;
  userId: string;
  channel: NotificationChannel;
  status: DeliveryStatus;
  deliveryTime?: number; // milliseconds
  openedAt?: Date;
  clickedAt?: Date;
  deviceInfo?: Record<string, any>;
  location?: string;
  abTestVariant?: string;
}

export interface RateLimitConfig {
  windowMs: number;
  maxNotifications: number;
  perUser: boolean;
  perType?: boolean;
}

export interface BatchConfig {
  enabled: boolean;
  maxBatchSize: number;
  batchWindowMs: number;
  types: NotificationType[];
}

export interface ABTestVariant {
  id: string;
  notificationType: NotificationType;
  variantName: string;
  titleTemplate: string;
  bodyTemplate: string;
  weight: number; // 0-100
  isActive: boolean;
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    conversionRate: number;
  };
}
