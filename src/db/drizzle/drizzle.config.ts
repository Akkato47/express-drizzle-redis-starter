import type { Config } from 'drizzle-kit';
import config from '../../config';

export default {
  schema: './src/db/drizzle/schema/**/schema.ts',
  out: './src/db/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.database.postgres.url,
  },
  migrations: {
    schema: 'public',
    table: 'migrations',
  },
} satisfies Config;
