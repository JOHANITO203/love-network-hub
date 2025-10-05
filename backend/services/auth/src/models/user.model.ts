import { query } from '../config/database';
import { User } from '../types';
import { logger } from '../utils/logger';

export async function createUser(data: Partial<User>): Promise<User> {
  const result = await query<User>(
    `INSERT INTO users (phone, phone_verified, email, vk_id, google_id, apple_id, instagram_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.phone || null,
      data.phone_verified || false,
      data.email || null,
      data.vk_id || null,
      data.google_id || null,
      data.apple_id || null,
      data.instagram_id || null,
    ]
  );

  logger.info('User created', { user_id: result.rows[0].id });
  return result.rows[0];
}

export async function findUserById(id: string): Promise<User | null> {
  const result = await query<User>(`SELECT * FROM users WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

export async function findUserByPhone(phone: string): Promise<User | null> {
  const result = await query<User>(`SELECT * FROM users WHERE phone = $1`, [phone]);
  return result.rows[0] || null;
}

export async function findUserByVKId(vk_id: string): Promise<User | null> {
  const result = await query<User>(`SELECT * FROM users WHERE vk_id = $1`, [vk_id]);
  return result.rows[0] || null;
}

export async function updateUserLogin(userId: string): Promise<void> {
  await query(`UPDATE users SET last_login_at = NOW() WHERE id = $1`, [userId]);
}

export async function verifyUserPhone(userId: string): Promise<void> {
  await query(`UPDATE users SET phone_verified = true WHERE id = $1`, [userId]);
  logger.info('User phone verified', { user_id: userId });
}
