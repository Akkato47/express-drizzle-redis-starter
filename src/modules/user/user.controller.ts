import type { NextFunction, Request, Response } from 'express';

import { sendResponse } from '@/lib/reponse';
import { HttpStatus } from '@/utils/enums/http-status';

import * as UserService from './user.service';

export async function getUserProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await UserService.getUserProfile(req.user.uid);
    sendResponse(res, HttpStatus.OK, result);
  } catch (error) {
    next(error);
  }
}
