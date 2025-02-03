import { Router } from 'express';

import { isAuthenticated } from '@/middleware/auth.middleware';

import * as UserController from './user.controller';

const router = Router();

router.get('/profile', isAuthenticated, UserController.getUserProfile);

export default router;
