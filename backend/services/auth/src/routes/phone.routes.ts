import { Router } from 'express';
import { sendOTP, verifyOTPAndLogin } from '../controllers/phone.controller';

const router = Router();

router.post('/send-otp', sendOTP);
router.post('/verify', verifyOTPAndLogin);

export default router;
