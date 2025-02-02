import jwt from 'jsonwebtoken';

import config from '@/config';

import type { TDecodedToken } from '../types/decodedToken.interface';

interface TGenerateOptions {
  payload: object | string | Buffer;
  tokenType: 'access' | 'passwordReset' | 'refresh';
}

interface TVerifyOptions {
  token: string;
  tokenType: TGenerateOptions['tokenType'];
}

function selectFunc(tokenType: TGenerateOptions['tokenType']) {
  if (tokenType === 'refresh') {
    return {
      secret: config.jwt.refresh.secret,
      expiresIn: config.jwt.refresh.expiresIn || '30d'
    };
  }
  return {
    secret: config.jwt.access.secret,
    expiresIn: config.jwt.access.expiresIn || '5m'
  };
}

function generate({ payload, tokenType }: TGenerateOptions): string {
  const { expiresIn, secret } = selectFunc(tokenType);

  return jwt.sign(payload, secret, {
    expiresIn,
    algorithm: 'HS256',
    subject: tokenType
  });
}

function verify({ token, tokenType }: TVerifyOptions) {
  const { secret } = selectFunc(tokenType);

  try {
    return jwt.verify(token, secret, {
      algorithms: ['HS256'],
      subject: tokenType
    }) as TDecodedToken;
  } catch (error) {
    if (tokenType === 'access') {
      return null;
    }
    return error;
  }
}

export default {
  verify,
  generate
};
