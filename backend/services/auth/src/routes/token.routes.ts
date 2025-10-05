import { Router } from 'express';
import { refreshToken, logout } from '../controllers/token.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/refresh', refreshToken);
router.post('/logout', authMiddleware, logout);

export default router;
