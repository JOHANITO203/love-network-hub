import { query } from '../config/database';
import { OTPCode, RateLimitError } from '../types';
import { logger } from '../utils/logger';
import { nanoid } from 'nanoid';

const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || '5');
const OTP_CODE_LENGTH = parseInt(process.env.OTP_CODE_LENGTH || '6');
const MAX_ATTEMPTS = parseInt(process.env.OTP_RATE_LIMIT_MAX || '3');

export async function generateOTP(phone: string): Promise<{ code: string; expiresAt: Date }> {
  const code = Math.floor(Math.random() * Math.pow(10, OTP_CODE_LENGTH))
    .toString()
    .padStart(OTP_CODE_LENGTH, '0');
  
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await query(
    `INSERT INTO otp_codes (phone, code, expires_at) VALUES ($1, $2, $3)`,
    [phone, code, expiresAt]
  );

  logger.info('OTP generated', { phone, expiresAt });

  return { code, expiresAt };
}

export async function verifyOTP(phone: string, code: string): Promise<boolean> {
  const result = await query<OTPCode>(
    `SELECT * FROM otp_codes 
     WHERE phone = $1 AND code = $2 AND verified = false 
     AND expires_at > NOW() 
     ORDER BY created_at DESC LIMIT 1`,
    [phone, code]
  );

  if (result.rows.length === 0) {
    await incrementOTPAttempts(phone);
    return false;
  }

  const otpRecord = result.rows[0];

  if (otpRecord.attempts >= MAX_ATTEMPTS) {
    throw new RateLimitError('Too many OTP verification attempts');
  }

  await query(`UPDATE otp_codes SET verified = true WHERE id = $1`, [otpRecord.id]);

  logger.info('OTP verified successfully', { phone });

  return true;
}

async function incrementOTPAttempts(phone: string): Promise<void> {
  await query(
    `UPDATE otp_codes SET attempts = attempts + 1 
     WHERE phone = $1 AND verified = false AND expires_at > NOW()`,
    [phone]
  );
}

export async function checkOTPRateLimit(phone: string): Promise<void> {
  const windowMinutes = parseInt(process.env.OTP_RATE_LIMIT_WINDOW_MINUTES || '60');
  const maxAttempts = parseInt(process.env.OTP_RATE_LIMIT_MAX || '3');

  const result = await query(
    `SELECT COUNT(*) as count FROM otp_codes 
     WHERE phone = $1 AND created_at > NOW() - INTERVAL '${windowMinutes} minutes'`,
    [phone]
  );

  const count = parseInt(result.rows[0].count);

  if (count >= maxAttempts) {
    throw new RateLimitError(`Too many OTP requests. Try again in ${windowMinutes} minutes.`);
  }
}
