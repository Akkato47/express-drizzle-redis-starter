import config from "../../config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const db_migrate = async () => {
    const migrationClient = postgres(config.database.postgres.url, { max: 1 });

    await migrate(drizzle(migrationClient), {
        migrationsFolder: "./src/db/drizzle/migrations",
    });

    await migrationClient.end();

    process.exit(0);
};

db_migrate();
