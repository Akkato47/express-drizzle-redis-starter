import type { Config } from "drizzle-kit";
import config from "./src/config";

export default {
    schema: "./src/db/postgres/schema/**/*.schema.ts",
    out: "./drizzle",
    driver: "pg",
    dbCredentials: {
        host: config.database.postgres.host,
        port: +config.database.postgres.port,
        user: config.database.postgres.user,
        password: config.database.postgres.password,
        database: config.database.postgres.database,
    },
} satisfies Config;
