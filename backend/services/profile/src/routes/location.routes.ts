import { Router } from 'express';
import { updateUserLocation, searchNearby } from '../controllers/location.controller';

const router = Router();

router.put('/:userId/location', updateUserLocation);
router.get('/nearby', searchNearby);

export default router;
