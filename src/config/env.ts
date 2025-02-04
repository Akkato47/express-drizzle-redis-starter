import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  APPNAME: z.string(),
  PORT: z.string(),
  NODE_ENV: z.string(),
  LOCALE: z.string(),
  LOGIN_RATE_LIMITER_ATTEMPTS: z.string(),
  LOGIN_RATE_LIMITER_TIMER_M: z.string(),
  PRODUCTION_URL: z.string(),
  CLIENT_BASE_URL: z.string().url(),
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.string(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_URL: z.string().startsWith('postgresql://'),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_PASSWORD: z.string(),
  BUCKET_KEY: z.string().nullable(),
  BUCKET_SECRET: z.string().nullable(),
  BUCKET_ENDPOINT: z.string().nullable(),
  BUCKET_NAME: z.string().nullable(),
  MAIL_HOST: z.string().nullable(),
  MAIL_USER: z.string().nullable(),
  MAIL_PASSWORD: z.string().nullable(),
  MAIL_FROM: z.string().nullable(),
  MAIL_PORT: z.string().nullable(),
  YANDEX_CLIENT_ID: z.string().nullable(),
  YANDEX_CLIENT_SECRET: z.string().nullable(),
  YANDEX_BASE_URL: z.string().nullable(),
  YANDEX_LOGIN_URL: z.string().nullable()
});

export const env = envSchema.parse(process.env);
