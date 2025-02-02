import { Router } from 'express';

import { isAuthenticated } from '@/middleware/auth.middleware';

import * as authController from './auth.controller';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', isAuthenticated, authController.logout);
router.post('/oAuth', authController.oAuth);

export default router;
