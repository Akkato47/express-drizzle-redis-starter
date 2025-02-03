import { Router } from 'express';

import authRouter from './auth/auth.routes';
import uploadRouter from './media/media.routes';
import userRouter from './user/user.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/uploads', uploadRouter);

export default router;
