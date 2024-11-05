import { Request, Response, NextFunction } from 'express';

import * as UserService from './user.service';

export async function getUserProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await UserService.getUserProfile(req.user.uid);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
