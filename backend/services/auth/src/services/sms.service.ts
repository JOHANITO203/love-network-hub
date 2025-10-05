import axios from 'axios';
import { logger } from '../utils/logger';

const SMS_PROVIDER = process.env.SMS_PROVIDER || 'smsc';

export async function sendSMS(phone: string, message: string): Promise<boolean> {
  if (SMS_PROVIDER === 'smsc') {
    return await sendSMSviaSMSC(phone, message);
  }
  
  logger.warn('SMS provider not configured', { provider: SMS_PROVIDER });
  return false;
}

async function sendSMSviaSMSC(phone: string, message: string): Promise<boolean> {
  const login = process.env.SMSC_LOGIN;
  const password = process.env.SMSC_PASSWORD;
  const sender = process.env.SMSC_SENDER || 'МойDate';

  if (!login || !password) {
    logger.error('SMSC credentials not configured');
    return false;
  }

  try {
    const response = await axios.get('https://smsc.ru/sys/send.php', {
      params: {
        login,
        psw: password,
        phones: phone,
        mes: message,
        sender,
        charset: 'utf-8',
        fmt: 3,
      },
      timeout: 10000,
    });

    if (response.data.error) {
      logger.error('SMSC error', { error: response.data.error_code });
      return false;
    }

    logger.info('SMS sent successfully via SMSC', { phone });
    return true;
  } catch (error) {
    logger.error('Failed to send SMS via SMSC', { error });
    return false;
  }
}

export async function sendOTPSMS(phone: string, code: string): Promise<boolean> {
  const message = `Ваш код подтверждения МойDate: ${code}. Действителен 5 минут.`;
  return await sendSMS(phone, message);
}
