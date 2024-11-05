import * as jwtService from './jwt.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';
import * as userService from '../user/user.service';
import { CustomError } from '@/utils/custom_error';
import { compare } from 'bcrypt';
import { TokenDto } from './dto/create-token.dto';
import { HttpStatus } from '@/utils/enums/http-status';
import axios from 'axios';
import config from '@/config';
import {
  IOAuthDataResponse,
  IOAuthTokenResponse,
} from './types/oauth.interface';
import { OAuthEnum } from './enums/oauth.enum';

export const login = async (userData: LoginUserDto) => {
  try {
    const user = await validateUser(userData);
    const payload: TokenDto = {
      role: user.role,
      uid: user.uid,
      oAuthId: user.oAuthId ? user.oAuthId : '',
    };
    const data = { role: user.role, image: user.image };
    return { ...(await jwtService.createTokenAsync(payload)), data };
  } catch (error) {
    if (error.statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw error;
  }
};

export const register = async (userData: CreateUserDto) => {
  try {
    const user = await userService.createUser(userData);
    const payload: TokenDto = {
      role: user.role,
      uid: user.uid,
      oAuthId: userData.oAuthId ? userData.oAuthId : '',
    };
    const data = { role: user.role, image: user.image };
    return { ...(await jwtService.createTokenAsync(payload)), data };
  } catch (error) {
    if (error.statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw error;
  }
};

export const logout = async (uid: string, oAuthId?: string) => {
  try {
    await jwtService.removeAllTokensByUid(uid);
    if (oAuthId) {
      const result = await jwtService.getTokenOAuthId(oAuthId);
      if (!result) {
        throw new CustomError(HttpStatus.UNAUTHORIZED);
      }

      const [oAuth, token] = result.res[0].split(':');
      await jwtService.removeAllTokensByOAuthId(oAuthId);
      await axios.post<IOAuthTokenResponse>(
        `${config[result.value].tokenUrl}/revoke_token`,
        {
          access_token: token,
          client_id: config[result.value].clientID,
          client_secret: config[result.value].clientSecret,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    }
    return true;
  } catch (error) {
    console.log(error);
    if (error.statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
      role: user.role,
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

    if (!user) {
      throw new CustomError(HttpStatus.BAD_REQUEST);
    }
    const passwordEquals = await compare(userData.password, user.password);

    if (user && passwordEquals) {
      const { password, ...result } = user;
      return result;
    }
    throw new CustomError(HttpStatus.BAD_REQUEST);
  } catch (error) {
    if (error.statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw error;
  }
};

export const oAuth = async (code: string, type: OAuthEnum) => {
  try {
    const tokens = await axios.post<IOAuthTokenResponse>(
      `${config[type].tokenUrl}/token`,
      {
        grant_type: 'authorization_code',
        code: code,
        client_id: config[type].clientID,
        client_secret: config[type].clientSecret,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const userData = await axios.get<IOAuthDataResponse>(
      config[type].loginUrl,
      {
        params: {
          format: 'json',
          jwt_secret: config.yandexApi.clientSecret,
          with_openid_identity: 1,
          oauth_token: tokens.data.access_token,
        },
      }
    );
    await jwtService.removeAllTokensByOAuthId(userData.data.id);
    await jwtService.storeOAuthToken({
      oAuthId: userData.data.id,
      token: tokens.data.access_token,
      type,
    });

    const tryFindUser = await userService.getUserByOAuthId(userData.data.id);
    // TODO: Change when the bug solved https://github.com/drizzle-team/drizzle-orm/issues/2694
    if (!tryFindUser) {
      const data = await register({
        oAuthId: userData.data.id,
        firstName: userData.data.first_name,
        secondName: userData.data.last_name,
        mail: userData.data.default_email,
        phone: userData.data.default_phone.number,
        role: 'USER',
        password: 'tempNeedtochange12139=09[o-9ko[p',
      });
      return data;
    }
    const payload: TokenDto = {
      role: tryFindUser.role,
      uid: tryFindUser.uid,
      oAuthId: userData.data.id,
    };
    const data = { role: tryFindUser.role, image: tryFindUser.image };
    return { ...(await jwtService.createTokenAsync(payload)), data };
  } catch (error) {
    console.log(error);
    if (error.statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw error;
  }
};
