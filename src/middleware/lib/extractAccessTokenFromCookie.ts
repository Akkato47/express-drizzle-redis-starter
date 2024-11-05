import { Request } from 'express';

export const extractAccessTokenFromCookie = (
  request: Request
): string | undefined => {
  const token = request.cookies['starter-access-token'];
  return token ? token : undefined;
};
