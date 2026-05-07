import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as dotenv from "dotenv";
import * as schema from "./schema.js";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("⚠️ DATABASE_URL is not defined in environment variables.");
}

// Client for Supabase / PostgreSQL using postgres.js
const client = postgres(databaseUrl || "", { prepare: false });
export const db = drizzle(client, { schema });

