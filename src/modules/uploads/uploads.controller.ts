import type { Request, Response, NextFunction } from 'express';
import * as uploadService from './uploads.service';

export async function uploadFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Файл не найден' });
    }

    const uploadedFile = await uploadService.uploadFile(file, req.user.uid);
    return res.status(201).json(uploadedFile);
  } catch (error) {
    next(error);
  }
}
