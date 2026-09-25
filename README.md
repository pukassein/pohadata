# PohãData

PohãData is a static-first prototype for exploring medicinal plants traditionally used in Paraguay and the different kinds of evidence documented about them.

## Run locally

The project includes a small Node.js backend that serves the frontend and keeps PostgreSQL access server-side. Put DATABASE_URL in the local environment file with your SSH-tunnel connection string.

Install dependencies and start the app:

npm install
npm run dev

Then open http://localhost:5173.

To verify the SSH tunnel and PostgreSQL connection, request http://localhost:5173/api/health/db with curl. It returns a simple status ok response when PostgreSQL is reachable, or status error with HTTP 503 otherwise. Database credentials are never sent to the browser, and .env.local is excluded from Git.

The existing frontend remains static-first and uses local mock plant data. No application tables, authentication, or migrations were added.
