import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { TokenPair, JWTPayload } from '../types';
import { logger } from '../utils/logger';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '30d';

export function generateTokenPair(userId: string): TokenPair {
  const sessionId = nanoid();

  const accessToken = jwt.sign(
    { userId, sessionId, type: 'access' } as JWTPayload,
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { userId, sessionId, type: 'refresh' } as JWTPayload,
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRY }
  );

  logger.debug('Token pair generated', { userId, sessionId });

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JWTPayload;
  } catch (error) {
    logger.warn('Access token verification failed', { error });
    throw new Error('Invalid access token');
  }
}

export function verifyRefreshToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, REFRESH_SECRET) as JWTPayload;
  } catch (error) {
    logger.warn('Refresh token verification failed', { error });
    throw new Error('Invalid refresh token');
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
}
