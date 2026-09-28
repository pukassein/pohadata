# PohãData

PohãData es una aplicación orientada a la investigación sobre plantas tradicionalmente utilizadas en Paraguay. La aplicación pública y el panel de administración leen y escriben perfiles en PostgreSQL.

## Desarrollo local

Configura `.env.local` (no se versiona):

```env
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=tu-contraseña-local
```

Después ejecuta:

```bash
npm install
npm run db:setup
npm run db:seed
npm run dev
```

Abre <http://localhost:5173>. El enlace discreto “Administración” del pie de página abre el panel. La contraseña solo se valida en el servidor y la sesión usa una cookie HttpOnly.

## Base de datos

`db/schema.sql` documenta el modelo relacional: plantas, partes, sinónimos, preparaciones, usos tradicionales, compuestos, valores cuantitativos, actividades, registros de evidencia y referencias. `npm run db:seed` importa los diez perfiles que antes estaban en `src/data.js`; el archivo se conserva como referencia histórica, pero no es la fuente de datos de la aplicación.

La importación es idempotente para los identificadores iniciales y reemplaza únicamente los registros relacionados de esos mismos perfiles. No inventa valores cuantitativos: los campos quedan vacíos hasta que se ingrese un dato respaldado por una fuente.

## API

- `GET /api/plants` y `GET /api/plants/:id` — lectura pública.
- `POST /api/plants`, `PUT /api/plants/:id`, `DELETE /api/plants/:id` — requieren sesión de administración.
- `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/session` — sesión del panel.
- `GET /api/health/db` — estado de la conexión.
