import { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  min: 2,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  logger.error('Unexpected database error', { error: err });
});

export async function query<T = any>(text: string, params?: any[]) {
  const start = Date.now();
  const result = await pool.query<T>(text, params);
  const duration = Date.now() - start;
  logger.debug('Query executed', { duration: `${duration}ms`, rows: result.rowCount });
  return result;
}

export async function getClient(): Promise<PoolClient> {
  return await pool.connect();
}

export async function transaction<T>(callback: (client: PoolClient) => Promise<T>) {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export { pool };
