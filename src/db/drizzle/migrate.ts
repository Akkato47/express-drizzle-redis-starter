import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'node:path';
import postgres from 'postgres';

import config from '../../config';

const db_migrate = async () => {
  const migrationClient = postgres(config.database.postgres.url, { max: 1 });

  const migrationsFolder =
    config.app.isProduction && config.app.isLocale
      ? path.join(__dirname, '../../../dist/db/drizzle/migrations')
      : path.join(__dirname, '../../../src/db/drizzle/migrations');

  await migrate(drizzle(migrationClient), {
    migrationsFolder
  });

  await migrationClient.end();

  process.exit(0);
};

db_migrate();
