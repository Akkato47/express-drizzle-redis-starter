import type { NextFunction, Request, Response } from 'express';

import config from '@/config';

import type { CreateUserDto } from '../user/dto/create-user.dto';
import type { LoginUserDto } from './dto/login.dto';
import type { OAuthEnum } from './enums/oauth.enum';

import * as authService from './auth.service';

export async function register(
  req: Request<object, object, CreateUserDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await authService.register(req.body);

    res.cookie(`${config.app.name}-access-token`, data.token, {
      expires: new Date(new Date().getTime() + 5 * 60 * 1000),
      httpOnly: true
    });

    res.cookie(`${config.app.name}-refresh-token`, data.refresh, {
      expires: new Date(new Date().getTime() + 30 * 60 * 60 * 1000),
      httpOnly: true
    });

    res.send(data.data).status(200);
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request<object, object, LoginUserDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await authService.login(req.body);

    res.cookie(`${config.app.name}-access-token`, data.token, {
      expires: new Date(new Date().getTime() + 5 * 60 * 1000),
      httpOnly: true
    });

    res.cookie(`${config.app.name}-refresh-token`, data.refresh, {
      expires: new Date(new Date().getTime() + 30 * 60 * 60 * 1000),
      httpOnly: true
    });

    res.send(data.data).status(200);
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.cookie(`${config.app.name}-access-token`, '', {
      expires: new Date(0),
      httpOnly: true
    });
    res.cookie(`${config.app.name}-refresh-token`, '', {
      expires: new Date(0),
      httpOnly: true
    });

    if (!req.user) {
      res.status(500).json({ message: 'Something went wrong' });
      return;
    }

    await authService.logout(req.user.uid, req.user?.oAuthId);

    res.status(200).json({ message: 'ok' });
  } catch (error) {
    next(error);
  }
}

export async function oAuth(
  req: Request<object, object, { code: string; type: OAuthEnum }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await authService.oAuth(req.body.code, req.body.type);

    res.cookie(`${config.app.name}-access-token`, data.token, {
      expires: new Date(new Date().getTime() + 5 * 60 * 1000),
      httpOnly: true
    });

    res.cookie(`${config.app.name}-refresh-token`, data.refresh, {
      expires: new Date(new Date().getTime() + 30 * 60 * 60 * 1000),
      httpOnly: true
    });

    res.send(data.data).status(200);
  } catch (error) {
    next(error);
  }
}
