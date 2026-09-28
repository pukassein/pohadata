const fs = require('node:fs/promises');
const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const { pool } = require('../server/db');

(async () => {
  const sql = await fs.readFile(path.resolve(__dirname, '..', 'db', 'schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('Esquema de PohãData creado o actualizado.');
  await pool.end();
})().catch(async (error) => { console.error(error.message); await pool.end(); process.exitCode = 1; });
