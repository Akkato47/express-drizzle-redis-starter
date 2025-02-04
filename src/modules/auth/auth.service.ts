import axios from 'axios';
import { compare } from 'bcrypt';

import config from '@/config';
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

// TODO: Add MaxRetry(jail feat)

export const login = async (userData: LoginUserDto) => {
  try {
    const user = await validateUser(userData);
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
      await axios.post<IOAuthTokenResponse>(
        `${config[result.value].tokenUrl}/revoke_token`,
        {
          access_token: token,
          client_id: config[result.value].clientID,
          client_secret: config[result.value].clientSecret
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
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

const validateUser = async (userData: LoginUserDto) => {
  try {
    const user = await userService.getUserByLoginData(userData);

    if (!user || user.password == null) {
      throw new CustomError(HttpStatus.BAD_REQUEST, ErrorMessage.ERROR_AUTHORIZATION);
    }
    const passwordEquals = await compare(userData.password, user.password);

    if (user && passwordEquals) {
      const { password, ...result } = user;
      return result;
    }
    throw new CustomError(HttpStatus.BAD_REQUEST);
  } catch (error) {
    throw error;
  }
};

export const oAuth = async (code: string, type: OAuthEnum) => {
  try {
    const tokens = await axios.post<IOAuthTokenResponse>(
      `${config[type].tokenUrl}/token`,
      {
        grant_type: 'authorization_code',
        code,
        client_id: config[type].clientID,
        client_secret: config[type].clientSecret
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    const userData = await axios.get<IOAuthDataResponse>(config[type].loginUrl, {
      params: {
        format: 'json',
        jwt_secret: config.yandexApi.clientSecret,
        with_openid_identity: 1,
        oauth_token: tokens.data.access_token
      }
    });
    await jwtService.removeAllTokensByOAuthId(userData.data.id);
    await jwtService.storeOAuthToken({
      oAuthId: userData.data.id,
      token: tokens.data.access_token,
      type
    });

    const tryFindUser = await userService.getUserByOAuthId(userData.data.id);
    if (!tryFindUser) {
      const data = await register({
        oAuthId: userData.data.id,
        firstName: userData.data.first_name,
        secondName: userData.data.last_name,
        mail: userData.data.default_email,
        phone: userData.data.default_phone.number,
        role: 'USER'
      });
      return data;
    }
    const payload: TokenDto = {
      role: tryFindUser.role,
      uid: tryFindUser.uid,
      oAuthId: userData.data.id
    };
    const data = { role: tryFindUser.role };
    return { ...(await jwtService.createTokenAsync(payload)), data };
  } catch (error) {
    throw error;
  }
};
