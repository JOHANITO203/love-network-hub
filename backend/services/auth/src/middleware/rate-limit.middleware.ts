import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis';

export const otpRateLimit = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'ratelimit:otp:',
  }),
  windowMs: parseInt(process.env.OTP_RATE_LIMIT_WINDOW_MINUTES || '60') * 60 * 1000,
  max: parseInt(process.env.OTP_RATE_LIMIT_MAX || '3'),
  message: { success: false, error: 'Too many OTP requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginRateLimit = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'ratelimit:login:',
  }),
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
