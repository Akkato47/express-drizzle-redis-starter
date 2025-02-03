import type { NextFunction, Request, Response } from 'express';

import config from '@/config';
import { refresh } from '@/modules/auth/auth.service';
import token from '@/modules/auth/lib/token';
import { CustomError } from '@/utils/custom_error';
import { ErrorMessage } from '@/utils/enums/errors';
import { HttpStatus } from '@/utils/enums/http-status';

import { extractAccessTokenFromCookie } from './lib/extractAccessTokenFromCookie';
import { extractRefreshTokenFromCookie } from './lib/extractRefreshTokenFromCookie';

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  try {
    const extractedToken = extractAccessTokenFromCookie(req);
    let user;

    if (extractedToken) {
      user = token.verify({
        token: extractedToken,
        tokenType: 'access'
      });

      if (user) {
        req.user = user;
        return next();
      }
    }

    const refreshToken = extractRefreshTokenFromCookie(req);
    if (!refreshToken) {
      return next(new CustomError(HttpStatus.UNAUTHORIZED, ErrorMessage.ERROR_AUTHORIZATION));
    }

    const refreshedTokens = await refresh(refreshToken);
    if (!refreshedTokens) {
      return next(new CustomError(HttpStatus.UNAUTHORIZED, ErrorMessage.ERROR_AUTHORIZATION));
    }

    user = token.verify({
      token: refreshedTokens.token,
      tokenType: 'access'
    });

    res.cookie(`${config.app.name}-access-token`, refreshedTokens.token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true
    });
    res.cookie(`${config.app.name}-refresh-token`, refreshedTokens.refresh, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true
    });

    req.user = user;
    return next();
  } catch {
    next(new CustomError(HttpStatus.UNAUTHORIZED, ErrorMessage.ERROR_AUTHORIZATION));
  }
}
