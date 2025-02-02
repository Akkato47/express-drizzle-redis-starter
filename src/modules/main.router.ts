import { Router } from 'express';

import authRouter from './auth/auth.routes';
import uploadRouter from './uploads/uploads.routes';
import userRouter from './user/user.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/uploads', uploadRouter);

export default router;
