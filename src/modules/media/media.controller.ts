import type { NextFunction, Request, Response } from 'express';

import * as uploadService from './media.service';

export async function uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: 'Файл не найден' });
    }

    const uploadedFile = await uploadService.uploadFile(file, req.user.uid);
    res.status(201).json(uploadedFile);
  } catch (error) {
    next(error);
  }
}
