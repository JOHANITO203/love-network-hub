import { Router } from 'express';
import { getProfile, createUserProfile, updateUserProfile } from '../controllers/profile.controller';

const router = Router();

router.get('/:userId', getProfile);
router.post('/', createUserProfile);
router.put('/:userId', updateUserProfile);

export default router;
