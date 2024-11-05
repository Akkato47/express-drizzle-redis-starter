import { isAuthenticated } from '@/middleware/auth.middleware';
import { Router } from 'express';
import * as uploadController from './uploads.controller';
import multer from 'multer';

const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});
const router = Router();

router.post(
  '/file',
  uploadMiddleware.single('file'),
  isAuthenticated,
  uploadController.uploadFile
);

export default router;
