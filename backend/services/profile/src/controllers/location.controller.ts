import { Request, Response } from 'express';
import { updateLocation, findNearbyProfiles } from '../models/profile.model';
import { validate, nearbySearchSchema } from '../utils/validation';
import { logger } from '../utils/logger';

export async function updateUserLocation(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude required',
      });
    }

    await updateLocation(userId, latitude, longitude);

    res.json({
      success: true,
      message: 'Location updated',
    });
  } catch (error: any) {
    logger.error('Location update failed', { error });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

export async function searchNearby(req: Request, res: Response) {
  try {
    const params = validate(nearbySearchSchema, req.query);

    const profiles = await findNearbyProfiles(params);

    res.json({
      success: true,
      profiles,
      count: profiles.length,
    });
  } catch (error: any) {
    logger.error('Nearby search failed', { error });
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
