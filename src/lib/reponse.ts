import type { Response } from 'express';

import type { HttpStatus } from '@/utils/enums/http-status';

export const sendResponse = (res: Response, statusCode: HttpStatus, message: any) => {
  res.status(statusCode).json({ statusCode, message });
};
