import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError(err: Error) {
    const targetErrors = ['READONLY', 'ECONNREFUSED'];
    return targetErrors.some(targetError => err.message.includes(targetError));
  }
};

// Main Redis client for general operations
export const redisClient = new Redis(redisConfig);

// Separate Redis client for Bull queues (required by Bull)
export const redisQueueClient = new Redis(redisConfig);

// Redis client for pub/sub
export const redisPubClient = new Redis(redisConfig);
export const redisSubClient = new Redis(redisConfig);

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

redisQueueClient.on('error', (err) => {
  console.error('Redis queue client error:', err);
});

// Rate limiting helper
export class RateLimiter {
  private prefix: string;

  constructor(prefix: string = 'ratelimit') {
    this.prefix = prefix;
  }

  async checkLimit(
    key: string,
    maxRequests: number,
    windowMs: number
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const redisKey = `${this.prefix}:${key}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    const pipeline = redisClient.pipeline();

    // Remove old entries
    pipeline.zremrangebyscore(redisKey, 0, windowStart);

    // Count current entries
    pipeline.zcard(redisKey);

    // Add current request
    pipeline.zadd(redisKey, now, `${now}-${Math.random()}`);

    // Set expiration
    pipeline.expire(redisKey, Math.ceil(windowMs / 1000));

    const results = await pipeline.exec();

    if (!results) {
      throw new Error('Redis pipeline execution failed');
    }

    const count = (results[1][1] as number) || 0;
    const allowed = count < maxRequests;
    const remaining = Math.max(0, maxRequests - count - 1);
    const resetAt = now + windowMs;

    return { allowed, remaining, resetAt };
  }

  async resetLimit(key: string): Promise<void> {
    const redisKey = `${this.prefix}:${key}`;
    await redisClient.del(redisKey);
  }
}

// Caching helper
export class CacheManager {
  async get<T>(key: string): Promise<T | null> {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await redisClient.setex(key, ttlSeconds, serialized);
    } else {
      await redisClient.set(key, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await redisClient.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await redisClient.exists(key);
    return result === 1;
  }

  async increment(key: string, by: number = 1): Promise<number> {
    return await redisClient.incrby(key, by);
  }

  async decrement(key: string, by: number = 1): Promise<number> {
    return await redisClient.decrby(key, by);
  }
}

export const cacheManager = new CacheManager();
export const rateLimiter = new RateLimiter();
