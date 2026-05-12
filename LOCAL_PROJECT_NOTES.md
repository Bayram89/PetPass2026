# PetPass Local Project Notes

## Date

2026-05-09

## Purpose Of This File

This file is the single local handoff note for this project.
Use it in future sessions to quickly understand:
- what was changed locally,
- what is currently running,
- what is intentionally different from Vadim's shared setup,
- and what to do next.

## What We Changed Today

1. Confirmed that the local project in `C:\Users\Bayram\Projects\PetPass` is working independently on this machine.
2. Started the local PostgreSQL database with Docker using `db/docker-compose.yml`.
3. Confirmed the API in `api/` connects to the local database through `api/.env`.
4. Confirmed the frontend in `app-next/` connects to the local API through `app-next/.env.local`.
5. Verified that `http://localhost:8000` is the backend API only, not the UI.
6. Verified that the actual frontend app runs at `http://localhost:3000`.
7. Replaced the old shared seed data in `db/init/002_seed.sql` with a local-only seed owned by Bayram.
8. Recreated the Docker Postgres volume so the old shared records were removed from the live database.
9. Verified local login and role behavior through the API after reseeding.

## Current Local Setup

- Project path: `C:\Users\Bayram\Projects\PetPass`
- Frontend URL: `http://localhost:3000`
- Backend URL: `http://localhost:8000`
- Local Postgres URL: `postgresql://petpass:petpass@localhost:5433/petpass`
- Docker container: `petpass-postgres`

## Current Database State

The local database is now intentionally minimal and under Bayram's control.

### Users

- `Bayram Erdem`
- email: `bayram9erdem@gmail.com`
- role: `admin`

### Pets

- `Nora`

### Vaccinations

- `Rabies` record for `Nora`

## Important Decisions

1. Do not send these local database changes to Vadim's repo.
2. Keep this work local-only unless Bayram explicitly asks otherwise.
3. Bayram wants full local control over:
- database content,
- admin/user ownership,
- and future role management.

## Conversation And Correspondence Summary

### What Bayram Requested

1. Recreate and use a database locally so the project does not depend on Vadim's database.
2. Make sure Bayram has control over who is an admin and who is a normal user.
3. Keep all of these changes only on Bayram's local machine.
4. Do not send, push, or sync these changes to Vadim's repo unless Bayram explicitly asks in the future.
5. Keep a single Markdown file that records what was done and what should happen next in future sessions.

### What We Clarified During The Session

1. `http://localhost:8000` is only the backend API, so it will not look like the full PetPass site.
2. `http://localhost:3000` is the actual frontend app that matches the project UI.
3. The local app can run independently with:
- local Docker Postgres,
- local API,
- and local frontend configuration.

### What I Suggested

1. Replace the old shared seed data with Bayram's own local seed data.
2. Make Bayram the default admin in the local database.
3. Remove old shared demo users from the local database by recreating the Docker volume.
4. Optionally add a local admin-management flow later so Bayram can promote or demote users without editing the database manually.
5. Keep one reusable handoff file in the repo root so future sessions can quickly continue from the latest state.

### Final Agreed Direction

1. This PetPass setup should be usable locally without needing Vadim's approval or database access.
2. Bayram should own the local database state and local admin control.
3. The current work should remain local-only.

## Files Changed For The Local Database Setup

- `db/docker-compose.yml`
- `db/init/001_schema.sql`
- `db/init/002_seed.sql`
- `api/.env`
- `app-next/.env.local`

## Notes About The Running App

- Opening `http://localhost:8000` shows the API response only.
- Opening `http://localhost:3000` shows the real PetPass frontend.
- The frontend uses the local API, not the hosted shared backend.

## Verified Today

1. Docker Postgres started successfully.
2. API responded successfully on port `8000`.
3. Frontend responded successfully on port `3000`.
4. Dev login worked for `bayram9erdem@gmail.com`.
5. The API returned Bayram as `admin`.
6. Pet and vaccination data came from the local database.

## Next Things To Do

1. Add a simple local admin-management flow so Bayram can promote or demote users without manual database edits.
2. Add a local UI or admin page for managing users and roles.
3. Decide whether to keep sample seed data or switch to a completely empty local database after development is stable.
4. Clean up local log artifacts like `api-dev.log`, `api-dev.err.log`, `app-dev.log`, and `app-dev.err.log` if they are not needed.
5. Optionally document a simple startup checklist for future sessions:
- start Docker,
- run the DB,
- run the API,
- run the frontend.

## Suggested Startup Checklist For Next Time

1. Start Docker Desktop.
2. Run the database:
   `docker compose -f db/docker-compose.yml up -d`
3. Run the API from `api/`:
   `npm run dev`
4. Run the frontend from `app-next/`:
   `npm run dev`
5. Open:
   `http://localhost:3000`

## Suggested First Prompt For A Future Session

"Open `LOCAL_PROJECT_NOTES.md` in `C:\Users\Bayram\Projects\PetPass` and continue from the latest local PetPass setup. Do not push anything anywhere unless I explicitly ask."
