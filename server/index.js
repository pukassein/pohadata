const path = require('node:path');
const crypto = require('node:crypto');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const { checkDatabaseConnection } = require('./db');
const { getPlants, getPlant, savePlant, deletePlant } = require('./repository');

const app = express();
const port = Number(process.env.PORT) || 5173;
const publicRoot = path.resolve(__dirname, '..');
const sessions = new Map();
const sessionMaxAge = 1000 * 60 * 60 * 8;
const allowedFrontendOrigins = new Set(String(process.env.FRONTEND_ORIGIN || "").split(",").map((origin) => origin.trim().replace(new RegExp("/+$"), "")).filter(Boolean));
const sessionSameSite = allowedFrontendOrigins.size ? "None" : "Lax";
const sessionSecure = sessionSameSite === "None" || process.env.NODE_ENV === "production";

function sessionCookieAttributes(maxAge) { return "HttpOnly; SameSite=" + sessionSameSite + "; Path=/; Max-Age=" + maxAge + (sessionSecure ? "; Secure" : ""); }

function applyCors(request, response, next) {
  const origin = request.headers.origin;
  if (!origin) return next();
  if (!allowedFrontendOrigins.has(origin)) {
    if (request.method === "OPTIONS") return response.status(403).end();
    return next();
  }
  response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  response.setHeader("Access-Control-Max-Age", "600");
  response.setHeader("Vary", "Origin");
  if (request.method === "OPTIONS") return response.status(204).end();
  next();
}


app.use(applyCors);
app.use(express.json({ limit: '1mb' }));

function parseCookies(request) {
  return Object.fromEntries((request.headers.cookie || '').split(';').filter(Boolean).map((part) => {
    const index = part.indexOf('=');
    return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())];
  }));
}

function isAdmin(request) {
  const token = parseCookies(request).pohadata_admin;
  const expires = token && sessions.get(token);
  if (!expires) return false;
  if (expires < Date.now()) { sessions.delete(token); return false; }
  return true;
}

function requireAdmin(request, response, next) {
  if (!isAdmin(request)) return response.status(401).json({ error: 'Sesión de administración requerida.' });
  next();
}

function safePasswordEqual(value, expected) {
  if (!value || !expected) return false;
  const input = Buffer.from(String(value));
  const target = Buffer.from(String(expected));
  return input.length === target.length && crypto.timingSafeEqual(input, target);
}

app.get('/api/health/db', async (_request, response) => {
  try { await checkDatabaseConnection(); response.json({ status: 'ok' }); }
  catch (error) { console.error('Database health check failed:', error.message); response.status(503).json({ status: 'error' }); }
});

app.get('/api/session', (request, response) => response.json({ authenticated: isAdmin(request) }));

app.post('/api/admin/login', (request, response) => {
  if (!safePasswordEqual(request.body?.password, process.env.ADMIN_PASSWORD)) return response.status(401).json({ error: 'Contraseña incorrecta.' });
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, Date.now() + sessionMaxAge);
  response.setHeader("Set-Cookie", `pohadata_admin=${token}; ${sessionCookieAttributes(sessionMaxAge / 1000)}`);
  response.json({ authenticated: true });
});

app.post('/api/admin/logout', (request, response) => {
  const token = parseCookies(request).pohadata_admin;
  if (token) sessions.delete(token);
  response.setHeader("Set-Cookie", "pohadata_admin=; " + sessionCookieAttributes(0));
  response.json({ authenticated: false });
});

app.get('/api/plants', async (_request, response, next) => {
  try { response.json(await getPlants()); } catch (error) { next(error); }
});

app.get('/api/plants/:id', async (request, response, next) => {
  try {
    const plant = await getPlant(request.params.id);
    if (!plant) return response.status(404).json({ error: 'Planta no encontrada.' });
    response.json(plant);
  } catch (error) { next(error); }
});

app.post('/api/plants', requireAdmin, async (request, response, next) => {
  try { response.status(201).json(await savePlant(request.body)); } catch (error) { next(error); }
});

app.put('/api/plants/:id', requireAdmin, async (request, response, next) => {
  try { response.json(await savePlant(request.body, request.params.id)); } catch (error) { next(error); }
});

app.delete('/api/plants/:id', requireAdmin, async (request, response, next) => {
  try {
    if (!await deletePlant(request.params.id)) return response.status(404).json({ error: 'Planta no encontrada.' });
    response.status(204).end();
  } catch (error) { next(error); }
});

app.use(express.static(publicRoot));
app.use((request, response, next) => {
  if (request.method === "GET" && !request.path.startsWith("/api/") && !path.extname(request.path) && request.accepts("html")) return response.sendFile(path.join(publicRoot, "index.html"));
  next();
});
app.use((error, _request, response, _next) => {
  console.error(error);
  const status = /obligatorios|existe|no existe|identificador/.test(error.message) ? 400 : 500;
  response.status(status).json({ error: status === 500 ? 'No se pudo completar la operación.' : error.message });
});

app.listen(port, () => console.log(`PohãData server running at http://localhost:${port}`));
