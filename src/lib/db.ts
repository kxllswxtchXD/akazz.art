// lib/db.ts
import { Pool } from 'pg';

// Check if DATABASE_URL is defined and not empty
if (!process.env.DATABASE_URL) {
  throw new Error('Please define the DATABASE_URL environment variable.');
}

// Create a pool instance to manage database connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: process.env.NODE_ENV === 'production' ? true : false, // Set SSL behavior based on environment
  },
});

// Execute a database query
export const query = async (text: string, params?: unknown[]) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error; // Re-throw the error for further handling
  } finally {
    client.release(); // Ensure the client is released back to the pool
  }
};
