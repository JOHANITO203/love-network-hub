import { Request, Response } from 'express';
import { getVKAuthURL, exchangeVKCode, getVKProfile } from '../services/oauth.service';
import { generateTokenPair } from '../services/token.service';
import { setSession } from '../config/redis';
import { createUser, findUserByVKId, updateUserLogin } from '../models/user.model';
import { logger, auditLog } from '../utils/logger';

export async function initiateVKAuth(req: Request, res: Response) {
  try {
    const authURL = getVKAuthURL();
    res.redirect(authURL);
  } catch (error) {
    logger.error('VK auth initiation failed', { error });
    res.status(500).json({ success: false, error: 'Failed to initiate VK authentication' });
  }
}

export async function handleVKCallback(req: Request, res: Response) {
  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, error: 'Authorization code missing' });
    }

    const tokenData = await exchangeVKCode(code);

    if (!tokenData) {
      return res.status(401).json({ success: false, error: 'Failed to exchange VK code' });
    }

    const vkProfile = await getVKProfile(tokenData.access_token);

    if (!vkProfile) {
      return res.status(401).json({ success: false, error: 'Failed to fetch VK profile' });
    }

    let user = await findUserByVKId(vkProfile.id.toString());

    if (!user) {
      user = await createUser({
        vk_id: vkProfile.id.toString(),
        email: undefined,
      });
    } else {
      await updateUserLogin(user.id);
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

    auditLog('login_success', { user_id: user.id, provider: 'vk', ip: req.ip });

    const redirectUrl = `${process.env.CORS_ORIGIN}?access_token=${tokens.accessToken}&refresh_token=${tokens.refreshToken}`;
    res.redirect(redirectUrl);
  } catch (error) {
    logger.error('VK callback failed', { error });
    res.status(500).json({ success: false, error: 'VK authentication failed' });
  }
}
