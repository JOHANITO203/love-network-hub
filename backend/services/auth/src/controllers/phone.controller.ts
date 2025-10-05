import { Request, Response } from 'express';
import { generateOTP, verifyOTP, checkOTPRateLimit } from '../services/otp.service';
import { sendOTPSMS } from '../services/sms.service';
import { generateTokenPair } from '../services/token.service';
import { setSession } from '../config/redis';
import { createUser, findUserByPhone, verifyUserPhone, updateUserLogin } from '../models/user.model';
import { validate, phoneSchema, verifyOTPSchema, validateRussianPhone } from '../utils/validation';
import { logger, auditLog } from '../utils/logger';
import { nanoid } from 'nanoid';

export async function sendOTP(req: Request, res: Response) {
  try {
    const data = validate(phoneSchema, req.body);
    const phone = validateRussianPhone(data.phone);

    await checkOTPRateLimit(phone);

    const { code, expiresAt } = await generateOTP(phone);
    await sendOTPSMS(phone, code);

    auditLog('otp_sent', { phone, ip: req.ip });

    res.json({
      success: true,
      expiresAt: expiresAt.toISOString(),
      message: 'OTP sent successfully',
    });
  } catch (error: any) {
    logger.error('Send OTP failed', { error });
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
}

export async function verifyOTPAndLogin(req: Request, res: Response) {
  try {
    const data = validate(verifyOTPSchema, req.body);
    const phone = validateRussianPhone(data.phone);

    const isValid = await verifyOTP(phone, data.code);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired OTP code',
      });
    }

    let user = await findUserByPhone(phone);

    if (!user) {
      user = await createUser({ phone, phone_verified: true });
    } else {
      await verifyUserPhone(user.id);
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

    auditLog('login_success', { user_id: user.id, provider: 'phone', ip: req.ip });

    res.json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
    });
  } catch (error: any) {
    logger.error('Verify OTP failed', { error });
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
}
