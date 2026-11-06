/**
 * Local development database: a real PostgreSQL server (via embedded-postgres)
 * with its data in ./.pgdata. Production uses Neon; this never runs on Vercel.
 *
 *   npm run db:local          # starts Postgres on localhost:5433 and keeps running
 *
 * Then put this in .env.local:
 *   DATABASE_URL="postgresql://postgres:postgres@localhost:5433/passionevents"
 *   DATABASE_URL_UNPOOLED="postgresql://postgres:postgres@localhost:5433/passionevents"
 */
import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";
import path from "node:path";

const dataDir = path.resolve(".pgdata");
const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: "postgres",
  password: "postgres",
  port: 5433,
  persistent: true,
});

const fresh = !existsSync(path.join(dataDir, "PG_VERSION"));
if (fresh) await pg.initialise();
await pg.start();
if (fresh) await pg.createDatabase("passionevents");
console.log("[dev-db] PostgreSQL ready on localhost:5433 (database: passionevents). Ctrl+C to stop.");

const stop = async () => {
  await pg.stop();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
setInterval(() => {}, 1 << 30);
