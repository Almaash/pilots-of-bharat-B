import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../drizzle/schema.js';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

try {
  // Attempt to connect to the database
  await pool.connect();
  console.log('✅ PostgreSQL connected successfully');
} catch (error) {
  console.error('❌ PostgreSQL connection failed:', error.message);
  process.exit(1); // exit the process if DB connection fails
}

export const db = drizzle(pool, { schema });
