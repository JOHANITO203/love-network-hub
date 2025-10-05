import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/token.service';
import { getSession } from '../config/redis';
import { findUserById } from '../models/user.model';
import { AuthenticatedRequest, UnauthorizedError } from '../types';
import { logger } from '../utils/logger';

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7);

    const payload = verifyAccessToken(token);

    const session = await getSession(payload.sessionId);

    if (!session) {
      throw new UnauthorizedError('Session expired');
    }

    const user = await findUserById(payload.userId);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = user;
    req.sessionId = payload.sessionId;

    next();
  } catch (error: any) {
    logger.warn('Authentication failed', { error: error.message });
    res.status(401).json({
      success: false,
      error: error.message || 'Unauthorized',
    });
  }
}
