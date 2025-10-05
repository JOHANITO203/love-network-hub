import { Request, Response } from 'express';
import { processAndUploadPhoto, deleteUserPhoto, validatePhotoFile } from '../services/photo.service';
import { findProfileByUserId, addPhoto, removePhoto } from '../models/profile.model';
import { logger } from '../utils/logger';

export async function uploadProfilePhoto(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No photo provided',
      });
    }

    if (!validatePhotoFile(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid photo format',
      });
    }

    const profile = await findProfileByUserId(userId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found',
      });
    }

    if (profile.photos.length >= 6) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 6 photos allowed',
      });
    }

    const result = await processAndUploadPhoto(
      userId,
      req.file.buffer,
      req.file.originalname
    );

    await addPhoto(userId, result.url);

    res.json({
      success: true,
      photo: result,
    });
  } catch (error: any) {
    logger.error('Photo upload failed', { error });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

export async function deleteProfilePhoto(req: Request, res: Response) {
  try {
    const { userId, photoId } = req.params;

    const profile = await findProfileByUserId(userId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found',
      });
    }

    const photoUrl = profile.photos[parseInt(photoId)];
    if (!photoUrl) {
      return res.status(404).json({
        success: false,
        error: 'Photo not found',
      });
    }

    const path = photoUrl.split('/').slice(-2).join('/');
    await deleteUserPhoto(path);
    await removePhoto(userId, photoUrl);

    res.json({
      success: true,
      message: 'Photo deleted',
    });
  } catch (error: any) {
    logger.error('Photo deletion failed', { error });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
