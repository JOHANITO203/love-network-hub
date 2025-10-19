import { Request, Response } from 'express';
import {
  createProfile,
  findProfileByUserId,
  findProfileById,
  updateProfile,
} from '../models/profile.model';
import { validate, createProfileSchema, updateProfileSchema } from '../utils/validation';
import { logger } from '../utils/logger';

export async function getProfile(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const profile = await findProfileByUserId(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found',
      });
    }

    res.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    logger.error('Get profile failed', { error });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

export async function createUserProfile(req: Request, res: Response) {
  try {
    const data = validate(createProfileSchema, req.body);

    const existing = await findProfileByUserId(data.user_id);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Profile already exists',
      });
    }

    const profile = await createProfile(data);

    res.status(201).json({
      success: true,
      profile,
    });
  } catch (error: any) {
    logger.error('Create profile failed', { error });
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
}

export async function updateUserProfile(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const data = validate(updateProfileSchema, req.body);

    const profile = await updateProfile(userId, data);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found',
      });
    }

    res.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    logger.error('Update profile failed', { error });
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
}
