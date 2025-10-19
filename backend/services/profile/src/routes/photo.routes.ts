import { Router } from 'express';
import multer from 'multer';
import { uploadProfilePhoto, deleteProfilePhoto } from '../controllers/photo.controller';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/:userId/photos', upload.single('photo'), uploadProfilePhoto);
router.delete('/:userId/photos/:photoId', deleteProfilePhoto);

export default router;
