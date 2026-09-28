const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not configured. Add it to .env.local.');
}

const pool = new Pool({ connectionString, connectionTimeoutMillis: 5000 });

async function checkDatabaseConnection() {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
  } finally {
    client.release();
  }
}

module.exports = { checkDatabaseConnection, pool };
