import type { NextFunction, Request, Response } from 'express';

import * as UserService from './user.service';

export async function getUserProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await UserService.getUserProfile(req.user.uid);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
