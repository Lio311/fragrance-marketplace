import { Pool, neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL || 'postgres://dummy:dummy@dummy/dummy');

let pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://dummy:dummy@dummy/dummy',
    ssl: { rejectUnauthorized: false },
  });
} else {
  if (!global.pool) {
    global.pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgres://dummy:dummy@dummy/dummy',
      ssl: { rejectUnauthorized: false },
    });
  }
  pool = global.pool;
}

export async function withClient(callback) {
  const client = await pool.connect();
  try {
    return await callback(client);
  } finally {
    client.release();
  }
}

export async function query(text, params) {
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
}

export default pool;
