import sharp from 'sharp';
import { uploadPhoto, deletePhoto } from '../config/supabase';
import { logger } from '../utils/logger';

const MAX_SIZE = 5 * 1024 * 1024;
const WIDTH = 1080;
const HEIGHT = 1080;

export async function processAndUploadPhoto(
  userId: string,
  buffer: Buffer,
  filename: string
): Promise<{ url: string; path: string }> {
  if (buffer.length > MAX_SIZE) {
    throw new Error('Photo too large');
  }

  const processed = await sharp(buffer)
    .resize(WIDTH, HEIGHT, { fit: 'cover' })
    .webp({ quality: 80 })
    .toBuffer();

  const result = await uploadPhoto(userId, processed, filename);
  return result;
}

export async function deleteUserPhoto(path: string): Promise<void> {
  await deletePhoto(path);
}
