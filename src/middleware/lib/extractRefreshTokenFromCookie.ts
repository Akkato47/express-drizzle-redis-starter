import { Request } from 'express';

export const extractRefreshTokenFromCookie = (
  request: Request
): string | undefined => {
  const token = request.cookies['starter-refresh-token'];
  return token ? token : undefined;
};
