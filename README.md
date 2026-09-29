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

## Despliegue con frontend y API separados

El frontend usa la variable publica `API_BASE_URL` en tiempo de build. En Vercel configura exactamente:

```env
API_BASE_URL=https://api.tu-dominio-publico.com
```

El valor debe ser el origen HTTPS publico donde escucha Express en el VPS, sin `/api` al final y sin una barra final. Por ejemplo, si la API responde en `https://api.pohadata.example.com/api/plants`, configura `API_BASE_URL=https://api.pohadata.example.com`. No pongas aqui `DATABASE_URL`, `ADMIN_PASSWORD` ni credenciales de PostgreSQL.

En el VPS configura el origen exacto del frontend de Vercel:

```env
FRONTEND_ORIGIN=https://tu-proyecto.vercel.app
NODE_ENV=production
```

Si tambien usas un dominio propio o previews concretas, incluye los origenes permitidos separados por comas. Reinicia el backend despues de cambiar estas variables. El backend conserva `DATABASE_URL` y `ADMIN_PASSWORD` solo en el VPS.

Sin `API_BASE_URL`, el desarrollo local sigue usando el mismo origen (`http://localhost:5173`) y `npm run dev` mantiene la configuracion actual.
