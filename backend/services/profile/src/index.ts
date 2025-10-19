import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { logger } from './utils/logger';
import profileRoutes from './routes/profile.routes';
import photoRoutes from './routes/photo.routes';
import locationRoutes from './routes/location.routes';
import { pool } from './config/database';
import { redis } from './config/redis';

const app = express();
const PORT = parseInt(process.env.PORT || '3002');
const API_PREFIX = '/api/v1';

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    await redis.ping();
    res.json({
      status: 'healthy',
      service: 'profile-service',
      database: 'connected',
      redis: 'connected',
    });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy' });
  }
});

app.use(`${API_PREFIX}/profiles`, profileRoutes);
app.use(`${API_PREFIX}/profiles`, photoRoutes);
app.use(`${API_PREFIX}/profiles`, locationRoutes);

app.listen(PORT, () => {
  logger.info(`Profile service running on port ${PORT}`);
});

export default app;
