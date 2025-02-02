import type { Request } from 'express';

import config from '@/config';

export const extractRefreshTokenFromCookie = (request: Request): string | undefined => {
  const token = request.cookies[`${config.app.name}-refresh-token`];
  return token || undefined;
};
