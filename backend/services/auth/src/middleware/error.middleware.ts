import { Request, Response, NextFunction } from 'express';
import { AuthError } from '../types';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';

export function errorHandler(
  error: Error | AuthError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Request error', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.errors,
    });
  }

  if (error instanceof AuthError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      code: error.code,
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
}
