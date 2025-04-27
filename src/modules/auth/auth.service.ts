import { compare } from 'bcrypt';

import config from '@/config';
import { ipRateLimiter } from '@/lib/ip-rate-limiter';
import { CustomError } from '@/utils/custom_error';
import { ErrorMessage } from '@/utils/enums/errors';
import { HttpStatus } from '@/utils/enums/http-status';

import type { CreateUserDto } from '../user/dto/create-user.dto';
import type { TokenDto } from './dto/create-token.dto';
import type { LoginUserDto } from './dto/login.dto';
import type { OAuthEnum } from './enums/oauth.enum';
import type { IOAuthDataResponse, IOAuthTokenResponse } from './types/oauth.interface';

import * as userService from '../user/user.service';
import * as jwtService from './jwt.service';

export const login = async (userData: LoginUserDto, ip: string) => {
  try {
    const user = await validateUser(userData, ip);
    const payload: TokenDto = {
      role: user.role,
      uid: user.uid,
      oAuthId: user.oAuthId ? user.oAuthId : ''
    };
    const data = { role: user.role };
    return { ...(await jwtService.createTokenAsync(payload)), data };
  } catch (error) {
    throw error;
  }
};

export const register = async (userData: CreateUserDto) => {
  try {
    const user = await userService.createUser(userData);
    const payload: TokenDto = {
      role: user.role,
      uid: user.uid,
      oAuthId: userData.oAuthId ? userData.oAuthId : ''
    };
    const data = { role: user.role };
    return { ...(await jwtService.createTokenAsync(payload)), data };
  } catch (error) {
    throw error;
  }
};

export const logout = async (uid: string, oAuthId?: string) => {
  try {
    await jwtService.removeAllTokensByUid(uid);
    if (oAuthId) {
      const result = await jwtService.getTokenOAuthId(oAuthId);
      if (!result) {
        throw new CustomError(HttpStatus.UNAUTHORIZED, ErrorMessage.ERROR_AUTHORIZATION);
      }

      const [_, token] = result.res[0].split(':');
      await jwtService.removeAllTokensByOAuthId(oAuthId);
      await fetch(`${config[result.value].tokenUrl}/revoke_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          access_token: token,
          client_id: config[result.value].clientID,
          client_secret: config[result.value].clientSecret
        })
      });
    }
    return true;
  } catch (error) {
    throw error;
  }
};

export const refresh = async (refreshToken: string) => {
  try {
    const result = await jwtService.getToken(refreshToken);
    if (!result) {
      throw new CustomError(HttpStatus.UNAUTHORIZED);
    }
    const [userUid] = result[0].split(':');
    const user = await userService.getUserByUID(userUid);
    const tokens = await jwtService.createTokenAsync({
      uid: userUid,
      role: user.role
    });
    await jwtService.removeToken(result[0]);
    return tokens;
  } catch (error) {
    if (error.statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw error;
  }
};

const validateUser = async (userData: LoginUserDto, ip: string) => {
  try {
    const user = await userService.getUserByLoginData(userData);

    if (!user || user.password == null) {
      throw new CustomError(HttpStatus.BAD_REQUEST, ErrorMessage.ERROR_AUTHORIZATION);
    }
    const passwordEquals = await compare(userData.password, user.password);

    if (user && passwordEquals) {
      const { password, ...result } = user;
      await jwtService.removeToken(`rate-limiter:login-${ip}`);
      return result;
    } else if (user && !passwordEquals) {
      const rateLimiter = await ipRateLimiter(
        'rate-limiter:login',
        ip,
        config.app.rateLimiterSettings.loginAttempts,
        config.app.rateLimiterSettings.loginTimer
      );
      if (rateLimiter.result) {
        const errorMessage =
          ErrorMessage.ERROR_LOGIN_VALIDATION.toString() + rateLimiter.attemptsLeft;
        throw new CustomError(HttpStatus.FORBIDDEN, errorMessage);
      }
    }
    throw new CustomError(HttpStatus.BAD_REQUEST);
  } catch (error) {
    throw error;
  }
};

export const oAuth = async (code: string, type: OAuthEnum) => {
  try {
    const tokenResponse = await fetch(`${config[type].tokenUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: config[type].clientID,
        client_secret: config[type].clientSecret
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to fetch OAuth token');
    }

    const tokens: IOAuthTokenResponse = await tokenResponse.json();

    const userDataResponse = await fetch(
      `${config[type].loginUrl}?format=json&jwt_secret=${config.yandexApi.clientSecret}&with_openid_identity=1&oauth_token=${tokens.access_token}`
    );

    if (!userDataResponse.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData: IOAuthDataResponse = await userDataResponse.json();

    await jwtService.removeAllTokensByOAuthId(userData.id);
    await jwtService.storeOAuthToken({
      oAuthId: userData.id,
      token: tokens.access_token,
      type
    });

    const tryFindUser = await userService.getUserByOAuthId(userData.id);
    if (!tryFindUser) {
      const data = await register({
        oAuthId: userData.id,
        firstName: userData.first_name,
        secondName: userData.last_name,
        mail: userData.default_email,
        phone: userData.default_phone.number,
        role: 'USER'
      });
      return data;
    }

    const payload: TokenDto = {
      role: tryFindUser.role,
      uid: tryFindUser.uid,
      oAuthId: userData.id
    };

    const data = { role: tryFindUser.role };
    return { ...(await jwtService.createTokenAsync(payload)), data };
  } catch (error) {
    throw error;
  }
};
