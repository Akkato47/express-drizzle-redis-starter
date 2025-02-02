import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import config from '@/config';

const pool = new Pool({
  host: config.database.postgres.host,
  port: +config.database.postgres.port,
  user: config.database.postgres.user,
  password: config.database.postgres.password,
  database: config.database.postgres.database
});

export const db: NodePgDatabase = drizzle(pool);
