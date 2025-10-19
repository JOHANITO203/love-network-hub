import { z } from 'zod';

export const createProfileSchema = z.object({
  user_id: z.string().uuid(),
  display_name: z.string().min(2).max(50),
  bio: z.string().max(500).optional(),
  age: z.number().min(18).max(100),
  gender: z.enum(['male', 'female', 'other']),
  looking_for: z.enum(['male', 'female', 'both']),
  city: z.string().max(100).optional(),
  interests: z.array(z.string()).max(10).optional(),
});

export const updateProfileSchema = z.object({
  display_name: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
  age: z.number().min(18).max(100).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  city: z.string().max(100).optional(),
  interests: z.array(z.string()).max(10).optional(),
});

export const nearbySearchSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(1).max(100).default(10),
  minAge: z.number().min(18).max(100).optional(),
  maxAge: z.number().min(18).max(100).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  limit: z.number().min(1).max(50).default(20),
});

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}
