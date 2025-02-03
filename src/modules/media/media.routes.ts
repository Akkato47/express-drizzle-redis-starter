import { Router } from 'express';
import multer from 'multer';

import { isAuthenticated } from '@/middleware/auth.middleware';

import * as uploadController from './media.controller';

const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});
const router = Router();

router.post('/file', uploadMiddleware.single('file'), isAuthenticated, uploadController.uploadFile);

export default router;
