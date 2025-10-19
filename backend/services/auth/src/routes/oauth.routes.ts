import { Router } from 'express';
import { initiateVKAuth, handleVKCallback } from '../controllers/oauth.controller';

const router = Router();

router.get('/vk', initiateVKAuth);
router.get('/vk/callback', handleVKCallback);

export default router;
