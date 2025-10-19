import Redis from 'ioredis';
import { logger } from '../utils/logger';

const redisConfig = {
  host: process.env.REDIS_URL?.replace('redis://', '').split(':')[0] || 'localhost',
  port: parseInt(process.env.REDIS_URL?.replace('redis://', '').split(':')[1] || '6379'),
  db: parseInt(process.env.REDIS_DB || '0'),
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
};

export const redis = new Redis(redisConfig);

redis.on('connect', () => logger.info('Redis connected'));
redis.on('error', (error) => logger.error('Redis error', { error }));

const SESSION_PREFIX = 'session:';
const SESSION_USER_PREFIX = 'user_sessions:';
const SESSION_TTL = 30 * 24 * 60 * 60;

export interface SessionData {
  userId: string;
  deviceInfo: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastActivity: string;
}

export async function setSession(sessionId: string, data: SessionData): Promise<void> {
  await redis.setex(`${SESSION_PREFIX}${sessionId}`, SESSION_TTL, JSON.stringify(data));
  await redis.sadd(`${SESSION_USER_PREFIX}${data.userId}`, sessionId);
}

export async function getSession(sessionId: string): Promise<SessionData | null> {
  const data = await redis.get(`${SESSION_PREFIX}${sessionId}`);
  return data ? JSON.parse(data) : null;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const session = await getSession(sessionId);
  if (session) {
    await redis.srem(`${SESSION_USER_PREFIX}${session.userId}`, sessionId);
  }
  await redis.del(`${SESSION_PREFIX}${sessionId}`);
}

export async function deleteAllUserSessions(userId: string): Promise<void> {
  const sessionIds = await redis.smembers(`${SESSION_USER_PREFIX}${userId}`);
  for (const sessionId of sessionIds) {
    await deleteSession(sessionId);
  }
  await redis.del(`${SESSION_USER_PREFIX}${userId}`);
}

export default redis;
