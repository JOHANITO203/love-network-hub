import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import phoneRoutes from './routes/phone.routes';
import oauthRoutes from './routes/oauth.routes';
import tokenRoutes from './routes/token.routes';
import { pool } from './config/database';
import { redis } from './config/redis';

const app = express();
const PORT = parseInt(process.env.PORT || '3001');
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || [],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    await redis.ping();

    res.json({
      status: 'healthy',
      service: 'auth-service',
      timestamp: new Date().toISOString(),
      database: 'connected',
      redis: 'connected',
    });
  } catch (error) {
    logger.error('Health check failed', { error });
    res.status(503).json({
      status: 'unhealthy',
      service: 'auth-service',
    });
  }
});

app.use(`${API_PREFIX}/auth/phone`, phoneRoutes);
app.use(`${API_PREFIX}/auth/oauth`, oauthRoutes);
app.use(`${API_PREFIX}/auth`, tokenRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    await pool.query('SELECT 1');
    logger.info('Database connected');

    await redis.ping();
    logger.info('Redis connected');

    app.listen(PORT, () => {
      logger.info(`Auth service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start', { error });
    process.exit(1);
  }
}

startServer();

export default app;
