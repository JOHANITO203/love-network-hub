import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';
const logFormat = process.env.LOG_FORMAT || 'json';

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
  logFormat === 'json'
    ? winston.format.json()
    : winston.format.printf(({ timestamp, level, message, metadata }) => {
        const metaStr = Object.keys(metadata).length ? JSON.stringify(metadata) : '';
        const lvl = level.toUpperCase();
        return `${timestamp} [${lvl}]: ${message} ${metaStr}`;
      })
);

export const logger = winston.createLogger({
  level: logLevel,
  format: customFormat,
  defaultMeta: { service: 'auth-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), customFormat),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 10,
    }),
  ],
  exitOnError: false,
});

export const auditLog = (action: string, details: any) => {
  if (process.env.ENABLE_AUDIT_LOGGING === 'true') {
    logger.info('[AUDIT]', {
      action,
      timestamp: new Date().toISOString(),
      dataResidency: process.env.DATA_RESIDENCY || 'RU',
      ...details,
    });
  }
};

export default logger;
