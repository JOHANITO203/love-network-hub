import { Request, Response } from 'express';
import { generateTokenPair, verifyRefreshToken } from '../services/token.service';
import { findUserById } from '../models/user.model';
import { setSession, deleteSession, deleteAllUserSessions } from '../config/redis';
import { validate, refreshTokenSchema, logoutSchema } from '../utils/validation';
import { AuthenticatedRequest } from '../types';
import { logger, auditLog } from '../utils/logger';

export async function refreshToken(req: Request, res: Response) {
  try {
    const data = validate(refreshTokenSchema, req.body);

    const payload = verifyRefreshToken(data.refreshToken);

    const user = await findUserById(payload.userId);

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    const tokens = generateTokenPair(user.id);

    const sessionData = {
      userId: user.id,
      deviceInfo: req.get('user-agent') || 'unknown',
      ipAddress: req.ip!,
      userAgent: req.get('user-agent') || '',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };

    await setSession(tokens.accessToken, sessionData);

    auditLog('token_refresh', { user_id: user.id, ip: req.ip });

    res.json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error: any) {
    logger.error('Token refresh failed', { error });
    res.status(401).json({ success: false, error: 'Invalid refresh token' });
  }
}

export async function logout(req: AuthenticatedRequest, res: Response) {
  try {
    const data = validate(logoutSchema, req.body);

    if (data.everywhere && req.user) {
      await deleteAllUserSessions(req.user.id);
      auditLog('logout_all_devices', { user_id: req.user.id, ip: req.ip });
    } else if (req.sessionId) {
      await deleteSession(req.sessionId);
      auditLog('logout', { user_id: req.user?.id, ip: req.ip });
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout failed', { error });
    res.status(500).json({ success: false, error: 'Logout failed' });
  }
}
