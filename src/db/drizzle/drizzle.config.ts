import type { Config } from 'drizzle-kit';

import path from 'node:path';

import config from '../../config';

export default {
  schema: path.join(__dirname, 'schema', '**', 'schema.ts'),
  out: path.join(__dirname, 'migrations'),
  dialect: 'postgresql',
  dbCredentials: {
    url: config.database.postgres.url
  },
  migrations: {
    schema: 'public',
    table: 'migrations'
  }
} satisfies Config;
