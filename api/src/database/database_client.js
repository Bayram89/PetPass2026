import dotenv from "dotenv";
import knex from "knex";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const isLocalDatabase =
  connectionString?.includes("@localhost:") ||
  connectionString?.includes("@127.0.0.1:") ||
  connectionString?.includes("@host.docker.internal:");

const dbClient = knex({
  client: "pg",
  connection: {
    connectionString,
    ...(isLocalDatabase ? {} : { ssl: { rejectUnauthorized: false } }),
  },
});

export default dbClient;
