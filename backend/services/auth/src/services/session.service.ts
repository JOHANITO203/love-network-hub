import { v4 as uuidv4 } from 'uuid';
import { RedisSessionStore, getRedisClient } from '../config/redis';
import { query } from '../config/database';
import { logger } from '../utils/logger';
import { SessionData, ActiveSession, AuthError } from '../types';

export class SessionService {
  private sessionStore: RedisSessionStore;
  private sessionDuration: number;
  private maxSessionsPerUser: number;

  constructor() {
    const redisClient = getRedisClient();
    this.sessionStore = new RedisSessionStore(redisClient);

    // Parse session duration (e.g., "30d" -> 30 days in seconds)
    const durationStr = process.env.SESSION_DURATION || '30d';
    this.sessionDuration = this.parseDuration(durationStr);

    this.maxSessionsPerUser = parseInt(process.env.MAX_SESSIONS_PER_USER || '5');
  }

  // Parse duration string to seconds
  private parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) return 2592000; // Default 30 days

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default: return 2592000;
    }
  }

  // Create new session
  async createSession(
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<SessionData> {
    try {
      const sessionId = uuidv4();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + this.sessionDuration * 1000);

      const sessionData: SessionData = {
        id: sessionId,
        userId,
        ipAddress,
        userAgent,
        createdAt: now,
        lastActivityAt: now,
        expiresAt,
      };

      // Store in Redis
      await this.sessionStore.set(sessionId, sessionData, this.sessionDuration);

      // Check and enforce max sessions per user
      await this.enforceMaxSessions(userId);

      // Log session creation
      await this.logAuthEvent(userId, 'session_created', true, {
        sessionId,
        ipAddress,
        userAgent,
      });

      logger.info('Session created', { userId, sessionId });

      return sessionData;
    } catch (error) {
      logger.error('Error creating session', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new AuthError('Failed to create session', 500);
    }
  }

  // Get session by ID
  async getSession(sessionId: string): Promise<SessionData | null> {
    try {
      const session = await this.sessionStore.get(sessionId);
      return session;
    } catch (error) {
      logger.error('Error getting session', {
        sessionId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  // Update session activity
  async updateSessionActivity(sessionId: string): Promise<void> {
    try {
      const session = await this.sessionStore.get(sessionId);

      if (!session) {
        return;
      }

      session.lastActivityAt = new Date();

      // Re-store with updated activity
      const ttl = Math.floor((session.expiresAt.getTime() - Date.now()) / 1000);
      if (ttl > 0) {
        await this.sessionStore.set(sessionId, session, ttl);
      }
    } catch (error) {
      logger.error('Error updating session activity', {
        sessionId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get all sessions for user
  async getUserSessions(userId: string): Promise<ActiveSession[]> {
    try {
      const sessions = await this.sessionStore.getAllForUser(userId);

      return sessions.map((session) => ({
        sessionId: session.sessionId,
        device: this.parseUserAgent(session.userAgent),
        ipAddress: session.ipAddress || 'Unknown',
        lastActive: session.lastActivityAt.toISOString(),
        current: false, // Will be set by controller if needed
      }));
    } catch (error) {
      logger.error('Error getting user sessions', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return [];
    }
  }

  // Revoke session
  async revokeSession(sessionId: string, userId?: string): Promise<void> {
    try {
      const session = await this.sessionStore.get(sessionId);

      if (!session) {
        throw new AuthError('Session not found', 404);
      }

      // Verify user owns the session
      if (userId && session.userId !== userId) {
        throw new AuthError('Unauthorized to revoke this session', 403);
      }

      await this.sessionStore.delete(sessionId);

      // Log session revocation
      await this.logAuthEvent(session.userId, 'session_revoked', true, { sessionId });

      logger.info('Session revoked', { sessionId, userId: session.userId });
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }

      logger.error('Error revoking session', {
        sessionId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new AuthError('Failed to revoke session', 500);
    }
  }

  // Revoke all sessions for user
  async revokeAllUserSessions(userId: string, exceptSessionId?: string): Promise<number> {
    try {
      const sessions = await this.sessionStore.getAllForUser(userId);
      let revokedCount = 0;

      for (const session of sessions) {
        if (session.sessionId !== exceptSessionId) {
          await this.sessionStore.delete(session.sessionId);
          revokedCount++;
        }
      }

      // Log bulk session revocation
      await this.logAuthEvent(userId, 'session_revoked', true, {
        revokedCount,
        exceptSessionId,
      });

      logger.info('All user sessions revoked', { userId, revokedCount, exceptSessionId });

      return revokedCount;
    } catch (error) {
      logger.error('Error revoking all user sessions', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new AuthError('Failed to revoke sessions', 500);
    }
  }

  // Enforce max sessions per user (remove oldest if exceeded)
  private async enforceMaxSessions(userId: string): Promise<void> {
    try {
      const sessions = await this.sessionStore.getAllForUser(userId);

      if (sessions.length > this.maxSessionsPerUser) {
        // Sort by creation date (oldest first)
        sessions.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

        // Remove oldest sessions
        const toRemove = sessions.length - this.maxSessionsPerUser;
        for (let i = 0; i < toRemove; i++) {
          await this.sessionStore.delete(sessions[i].sessionId);
          logger.info('Removed old session due to limit', {
            userId,
            sessionId: sessions[i].sessionId,
          });
        }
      }
    } catch (error) {
      logger.error('Error enforcing max sessions', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Parse user agent to device info
  private parseUserAgent(userAgent?: string): string {
    if (!userAgent) return 'Unknown Device';

    // Simple device detection
    if (userAgent.includes('iPhone')) return 'iPhone';
    if (userAgent.includes('iPad')) return 'iPad';
    if (userAgent.includes('Android')) return 'Android Device';
    if (userAgent.includes('Windows')) return 'Windows PC';
    if (userAgent.includes('Macintosh')) return 'Mac';
    if (userAgent.includes('Linux')) return 'Linux PC';

    return 'Unknown Device';
  }

  // Log auth event to database
  private async logAuthEvent(
    userId: string,
    eventType: string,
    success: boolean,
    meta?: any
  ): Promise<void> {
    try {
      await query(
        `INSERT INTO auth_logs (user_id, event_type, success, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          userId,
          eventType,
          success,
          meta?.ipAddress || null,
          meta?.userAgent || null,
        ]
      );
    } catch (error) {
      logger.error('Error logging auth event', {
        userId,
        eventType,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

// Export singleton instance
export const sessionService = new SessionService();
