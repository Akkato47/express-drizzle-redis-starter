import { v4 } from 'uuid';
import * as jwt from 'jsonwebtoken';
import type { TokenDto } from './dto/create-token.dto';
import config from '@/config';
import redisClient from '@/db/redis';
import { OAuthEnum } from './enums/oauth.enum';

interface IStoreToken {
  userUid: string;
  token: string;
}

interface IStoreOAuthToken {
  oAuthId: string;
  token: string;
  type: OAuthEnum;
}

export const createTokenAsync = async (tokenDto: TokenDto) => {
  const refresh = v4();
  const res = {
    token: jwt.sign(tokenDto, config.jwt.access.secret, {
      expiresIn: config.jwt.access.expiresIn,
      subject: 'access',
    }),
    refresh,
  };

  await storeToken({ token: refresh, userUid: tokenDto.uid });
  return res;
};

const storeToken = async (data: IStoreToken) => {
  const key = `${data.userUid}:${data.token}`;
  const expiration = 24 * 60 * 60;
  await redisClient.SET(key, 'true', { EX: expiration });
};

export const storeOAuthToken = async (data: IStoreOAuthToken) => {
  const key = `${data.oAuthId}:${data.token}`;
  const expiration = 24 * 60 * 60;
  await redisClient.SET(key, data.type, { EX: expiration });
};

export const getToken = async (token: string) => {
  const res = await redisClient.KEYS(`*:${token}`);
  if (res.length != 1) {
    return null;
  }
  return res;
};

export const getTokenOAuthId = async (oAuthId: string) => {
  const res = await redisClient.KEYS(`${oAuthId}:*`);
  if (res.length != 1) {
    return null;
  }
  const value = await redisClient.get(res[0]);
  return { res, value };
};

export const removeToken = async (key: string): Promise<boolean> => {
  const res = await redisClient.DEL([key]);
  if (!res) {
    return false;
  }
  return true;
};

export const removeAllTokensByUid = async (uid: string) => {
  const keys = await redisClient.KEYS(`${uid}:*`);

  if (keys.length === 0) {
    return true;
  }

  const multi = redisClient.multi();
  keys.forEach((key) => {
    multi.DEL(key);
  });

  await multi.exec();
};

export const removeAllTokensByOAuthId = async (oAuthId: string) => {
  const keys = await redisClient.KEYS(`${oAuthId}:*`);

  if (keys.length === 0) {
    return true;
  }

  const multi = redisClient.multi();
  keys.forEach((key) => {
    multi.DEL(key);
  });

  await multi.exec();
};
