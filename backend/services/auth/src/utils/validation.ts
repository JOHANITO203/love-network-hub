import { z } from 'zod';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const russianPhoneRegex = /^\+7\d{10}$/;

export const phoneSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Invalid phone number').min(10).max(15),
  countryCode: z.string().length(2).default('RU'),
});

export const verifyOTPSchema = z.object({
  phone: z.string().regex(phoneRegex),
  code: z.string().length(6).regex(/^\d+$/, 'OTP must be 6 digits'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const logoutSchema = z.object({
  everywhere: z.boolean().optional().default(false),
});

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

export function validateSafe<T>(schema: z.ZodSchema<T>, data: unknown) {
  return schema.safeParse(data);
}

export function normalizeRussianPhone(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  
  if (digits.startsWith('8') && digits.length === 11) {
    digits = '7' + digits.substring(1);
  } else if (digits.length === 10) {
    digits = '7' + digits;
  }
  
  return '+' + digits;
}

export function validateRussianPhone(phone: string): string {
  const normalized = normalizeRussianPhone(phone);
  
  if (!russianPhoneRegex.test(normalized)) {
    throw new Error('Invalid Russian phone number');
  }
  
  return normalized;
}
