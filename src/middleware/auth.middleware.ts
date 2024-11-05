import { CustomError } from '@/utils/custom_error';
import { Request, Response, NextFunction } from 'express';
import token from '@/modules/auth/lib/token';
import { refresh } from '@/modules/auth/auth.service';
import { extractAccessTokenFromCookie } from './lib/extractAccessTokenFromCookie';
import { extractRefreshTokenFromCookie } from './lib/extractRefreshTokenFromCookie';

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const extractedToken = extractAccessTokenFromCookie(req);
    let user;

    if (extractedToken) {
      user = token.verify({
        token: extractedToken,
        tokenType: 'access',
      });

      if (user) {
        req.user = user;
        return next();
      }
    }

    const refreshToken = extractRefreshTokenFromCookie(req);
    if (!refreshToken) {
      return next(new CustomError(401, 'Unauthorized'));
    }

    const refreshedTokens = await refresh(refreshToken);
    if (!refreshedTokens) {
      return next(new CustomError(401, 'Unauthorized')); // Если обновление не удалось
    }

    user = token.verify({
      token: refreshedTokens.token,
      tokenType: 'access',
    });

    res.cookie('starter-access-token', refreshedTokens.token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
    res.cookie('starter-refresh-token', refreshedTokens.refresh, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    req.user = user;
    return next();
  } catch (error) {
    next(new CustomError(401, 'Unauthorized'));
  }
}
