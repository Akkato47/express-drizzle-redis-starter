import type { Request } from 'express';

import config from '@/config';

export const extractAccessTokenFromCookie = (request: Request): string | undefined => {
  const token = request.cookies[`${config.app.name}-access-token`];
  return token || undefined;
};
