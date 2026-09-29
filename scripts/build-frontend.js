const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const apiBaseUrl = String(process.env.API_BASE_URL || '').trim().replace(/\/+$/, '');
if (apiBaseUrl && !/^https?:\/\//i.test(apiBaseUrl)) {
  throw new Error('API_BASE_URL must be an absolute http(s) URL.');
}

const output = `// Generated at build time. Do not put secrets in this file.\nglobalThis.__POHADATA_CONFIG__ = ${JSON.stringify({ apiBaseUrl })};\n`;
fs.writeFileSync(path.resolve(process.cwd(), 'src/runtime-config.js'), output);
console.log(`Frontend API base URL: ${apiBaseUrl || '(same origin)'}`);
