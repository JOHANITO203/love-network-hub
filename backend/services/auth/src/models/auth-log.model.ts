import { query } from '../config/database';
import { logger } from '../utils/logger';
import { AuthLog, AuthEventType } from '../types';

export class AuthLogModel {
  // Log authentication event
  static async log(
    userId: string | undefined,
    eventType: AuthEventType,
    provider: string | undefined,
    success: boolean,
    ipAddress?: string,
    userAgent?: string,
    errorMessage?: string
  ): Promise<void> {
    try {
      await query(
        `INSERT INTO auth_logs (user_id, event_type, provider, ip_address, user_agent, success, error_message)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          userId || null,
          eventType,
          provider || null,
          ipAddress || null,
          userAgent || null,
          success,
          errorMessage || null,
        ]
      );

      logger.debug('Auth event logged', { userId, eventType, success });
    } catch (error) {
      logger.error('Error logging auth event', {
        userId,
        eventType,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get logs for user
  static async getLogsForUser(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<AuthLog[]> {
    try {
      const result = await query<AuthLog>(
        `SELECT * FROM auth_logs
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );

      return result;
    } catch (error) {
      logger.error('Error getting user logs', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return [];
    }
  }

  // Get failed login attempts
  static async getFailedLoginAttempts(
    userId: string,
    sinceMinutes: number = 60
  ): Promise<number> {
    try {
      const result = await query<{ count: string }>(
        `SELECT COUNT(*) as count FROM auth_logs
         WHERE user_id = $1
         AND event_type IN ('login', 'otp_failed')
         AND success = false
         AND created_at > NOW() - INTERVAL '${sinceMinutes} minutes'`,
        [userId]
      );

      return parseInt(result[0]?.count || '0');
    } catch (error) {
      logger.error('Error getting failed login attempts', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return 0;
    }
  }

  // Get logs by event type
  static async getLogsByEventType(
    eventType: AuthEventType,
    limit: number = 100,
    offset: number = 0
  ): Promise<AuthLog[]> {
    try {
      const result = await query<AuthLog>(
        `SELECT * FROM auth_logs
         WHERE event_type = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [eventType, limit, offset]
      );

      return result;
    } catch (error) {
      logger.error('Error getting logs by event type', {
        eventType,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return [];
    }
  }

  // Get suspicious activity
  static async getSuspiciousActivity(
    userId: string,
    hours: number = 24
  ): Promise<{
    failedAttempts: number;
    differentIPs: number;
    differentDevices: number;
  }> {
    try {
      const [failedResult, ipResult, deviceResult] = await Promise.all([
        // Failed attempts
        query<{ count: string }>(
          `SELECT COUNT(*) as count FROM auth_logs
           WHERE user_id = $1
           AND success = false
           AND created_at > NOW() - INTERVAL '${hours} hours'`,
          [userId]
        ),
        // Different IP addresses
        query<{ count: string }>(
          `SELECT COUNT(DISTINCT ip_address) as count FROM auth_logs
           WHERE user_id = $1
           AND created_at > NOW() - INTERVAL '${hours} hours'`,
          [userId]
        ),
        // Different devices (user agents)
        query<{ count: string }>(
          `SELECT COUNT(DISTINCT user_agent) as count FROM auth_logs
           WHERE user_id = $1
           AND created_at > NOW() - INTERVAL '${hours} hours'`,
          [userId]
        ),
      ]);

      return {
        failedAttempts: parseInt(failedResult[0]?.count || '0'),
        differentIPs: parseInt(ipResult[0]?.count || '0'),
        differentDevices: parseInt(deviceResult[0]?.count || '0'),
      };
    } catch (error) {
      logger.error('Error getting suspicious activity', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return { failedAttempts: 0, differentIPs: 0, differentDevices: 0 };
    }
  }

  // Clean up old logs (run periodically for GDPR compliance)
  static async cleanupOldLogs(olderThanDays: number = 90): Promise<number> {
    try {
      const result = await query(
        `DELETE FROM auth_logs
         WHERE created_at < NOW() - INTERVAL '${olderThanDays} days'`
      );

      const deletedCount = result.length;

      if (deletedCount > 0) {
        logger.info('Cleaned up old auth logs', { count: deletedCount, olderThanDays });
      }

      return deletedCount;
    } catch (error) {
      logger.error('Error cleaning up old logs', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return 0;
    }
  }

  // Get authentication statistics
  static async getStats(userId: string): Promise<{
    totalLogins: number;
    successfulLogins: number;
    failedLogins: number;
    lastLogin?: Date;
    mostUsedProvider?: string;
  }> {
    try {
      const [totalResult, successResult, failedResult, lastLoginResult, providerResult] =
        await Promise.all([
          query<{ count: string }>(
            `SELECT COUNT(*) as count FROM auth_logs WHERE user_id = $1 AND event_type = 'login'`,
            [userId]
          ),
          query<{ count: string }>(
            `SELECT COUNT(*) as count FROM auth_logs WHERE user_id = $1 AND event_type = 'login' AND success = true`,
            [userId]
          ),
          query<{ count: string }>(
            `SELECT COUNT(*) as count FROM auth_logs WHERE user_id = $1 AND event_type = 'login' AND success = false`,
            [userId]
          ),
          query<{ created_at: Date }>(
            `SELECT created_at FROM auth_logs WHERE user_id = $1 AND event_type = 'login' AND success = true ORDER BY created_at DESC LIMIT 1`,
            [userId]
          ),
          query<{ provider: string; count: string }>(
            `SELECT provider, COUNT(*) as count FROM auth_logs WHERE user_id = $1 AND event_type = 'login' AND success = true GROUP BY provider ORDER BY count DESC LIMIT 1`,
            [userId]
          ),
        ]);

      return {
        totalLogins: parseInt(totalResult[0]?.count || '0'),
        successfulLogins: parseInt(successResult[0]?.count || '0'),
        failedLogins: parseInt(failedResult[0]?.count || '0'),
        lastLogin: lastLoginResult[0]?.created_at,
        mostUsedProvider: providerResult[0]?.provider,
      };
    } catch (error) {
      logger.error('Error getting auth stats', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return {
        totalLogins: 0,
        successfulLogins: 0,
        failedLogins: 0,
      };
    }
  }
}
