import { z } from "zod";

import "dotenv/config";

const envSchema = z.object({
    PORT: z.string().optional(),
    NODE_ENV: z.string().optional(),
    CLIENT_BASE_URL: z.string().url(),
    DATABASE_HOST: z.string(),
    DATABASE_PORT: z.string(),
    DATABASE_USER: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_NAME: z.string(),
    DATABASE_URL: z.string().startsWith("postgresql://"),
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_PASSWORD_RESET_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRES_IN: z.string().optional(),
    REFRESH_TOKEN_EXPIRES_IN: z.string().optional(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.string(),
    REDIS_PASSWORD: z.string(),
    BUCKET_KEY: z.string(),
    BUCKET_SECRET: z.string(),
    BUCKET_ENDPOINT: z.string(),
    BUCKET_NAME: z.string(),
    MAIL_HOST: z.string(),
    MAIL_USER: z.string(),
    MAIL_PASSWORD: z.string(),
    MAIL_FROM: z.string(),
    MAIL_PORT: z.string(),
});

export const env = envSchema.parse(process.env);
