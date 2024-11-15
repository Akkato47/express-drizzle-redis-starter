import config from '@/config';
import { Request } from 'express';

export const extractRefreshTokenFromCookie = (
  request: Request
): string | undefined => {
  const token = request.cookies[`${config.app.name}-refresh-token`];
  return token ? token : undefined;
};
