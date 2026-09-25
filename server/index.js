const path = require('node:path');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const { checkDatabaseConnection } = require('./db');

const app = express();
const port = Number(process.env.PORT) || 5173;
const publicRoot = path.resolve(__dirname, '..');

app.get('/api/health/db', async (_request, response) => {
  try {
    await checkDatabaseConnection();
    response.json({ status: 'ok' });
  } catch (error) {
    console.error('Database health check failed:', error.message);
    response.status(503).json({ status: 'error' });
  }
});

app.use(express.static(publicRoot));

app.listen(port, () => {
  console.log(`PohãData server running at http://localhost:${port}`);
});
