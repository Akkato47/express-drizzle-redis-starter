import type { NextFunction, Request, Response } from 'express';

import { sendResponse } from '@/lib/reponse';
import { HttpStatus } from '@/utils/enums/http-status';

import * as uploadService from './media.service';

export async function uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: 'Файл не найден' });
    }

    const uploadedFile = await uploadService.uploadFile(file, req.user.uid);
    sendResponse(res, HttpStatus.CREATED, uploadedFile);
  } catch (error) {
    next(error);
  }
}
