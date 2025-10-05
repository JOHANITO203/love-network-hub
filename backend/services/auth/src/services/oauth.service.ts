import axios from 'axios';
import { OAuthProvider } from '../types';
import { logger } from '../utils/logger';

interface VKProfile {
  id: number;
  first_name: string;
  last_name: string;
  photo_200?: string;
}

export async function getVKProfile(accessToken: string): Promise<VKProfile | null> {
  try {
    const response = await axios.get('https://api.vk.com/method/users.get', {
      params: {
        access_token: accessToken,
        v: '5.131',
        fields: 'photo_200',
      },
    });

    if (response.data.error) {
      logger.error('VK API error', { error: response.data.error });
      return null;
    }

    const user = response.data.response[0];
    logger.info('VK profile fetched', { vk_id: user.id });

    return user;
  } catch (error) {
    logger.error('Failed to fetch VK profile', { error });
    return null;
  }
}

export function getVKAuthURL(): string {
  const clientId = process.env.VK_CLIENT_ID;
  const redirectUri = process.env.VK_CALLBACK_URL;
  const scope = 'email';
  
  return `https://oauth.vk.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&v=5.131`;
}

export async function exchangeVKCode(code: string): Promise<{ access_token: string; user_id: number } | null> {
  try {
    const response = await axios.get('https://oauth.vk.com/access_token', {
      params: {
        client_id: process.env.VK_CLIENT_ID,
        client_secret: process.env.VK_CLIENT_SECRET,
        redirect_uri: process.env.VK_CALLBACK_URL,
        code,
      },
    });

    logger.info('VK access token obtained');
    return response.data;
  } catch (error) {
    logger.error('Failed to exchange VK code', { error });
    return null;
  }
}
