# PetPass Local Project Notes

## Date

2026-05-14 (updated later the same day)

## Purpose Of This File

This file is the single local handoff note for this project.
Use it in future sessions to quickly understand:
- what was changed locally,
- what is currently running,
- what is intentionally different from Vadim's shared setup,
- and what to do next.

## What We Changed Across The Recent Sessions

1. Confirmed that the local project in `C:\Users\Bayram\Projects\PetPass` is working independently on this machine.
2. Started the local PostgreSQL database with Docker using `db/docker-compose.yml`.
3. Confirmed the API in `api/` connects to the local database through `api/.env`.
4. Confirmed the frontend in `app-next/` connects to the local API through `app-next/.env.local`.
5. Verified that `http://localhost:8000` is the backend API only, not the UI.
6. Verified that the actual frontend app runs at `http://localhost:3000`.
7. Replaced the old shared seed data in `db/init/002_seed.sql` with a local-only seed owned by Bayram.
8. Recreated the Docker Postgres volume so the old shared records were removed from the live database.
9. Verified local login and role behavior through the API after reseeding.
10. Added an admin-only user list view in the profile page.
11. Added local admin controls to promote users to admin or demote them back to normal users.
12. Added local admin controls to delete users, while blocking deletion of the current signed-in account.
13. Added a localized demo dataset seed file in `db/seed_demo_33.sql`.
14. Confirmed the localized demo dataset commit was already pushed to `origin/main`.
15. Updated this handoff note and pushed it.
16. Added edit-user support in the admin panel for local users.
17. Added user search and role filters in the admin panel.
18. Improved admin feedback notices for create, edit, role, and delete actions.
19. Added stronger delete confirmation for users who own pet records.
20. Adjusted the profile page layout so the top profile sections fit better at normal zoom.
21. Narrowed the top `Owner dashboard` and `Pets` sections without changing the `Admin` section width.
22. Updated profile stat labels from `Ready` to `Active` and from `Primary contact` to `Contact`.
23. Updated the contact display so a phone number shows with a leading `+` when needed.
24. Added a synced horizontal scrollbar at the top of the full pets dashboard table.

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
4. The codebase currently includes local admin tooling in the profile UI, so future sessions should treat user management as part of the active app, not just a database-only task.

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
4. Add a local admin-management flow so Bayram can promote or demote users without editing the database manually.
5. Keep one reusable handoff file in the repo root so future sessions can quickly continue from the latest state.

### Final Agreed Direction

1. This PetPass setup should be usable locally without needing Vadim's approval or database access.
2. Bayram should own the local database state and local admin control.
3. The current work should remain local-only.
4. The current local app should support practical day-to-day user administration through the UI where possible.

## Files Changed For The Local Database Setup

- `db/docker-compose.yml`
- `db/init/001_schema.sql`
- `db/init/002_seed.sql`
- `api/.env`
- `app-next/.env.local`

## Files Changed For Admin Management And Demo Data

- `api/src/database/users.js`
- `api/src/routers/usersRouter.js`
- `app-next/app/profile/components/DBFunctions/FetchAllUsers.js`
- `app-next/app/profile/page.jsx`
- `app-next/app/profile/page.module.css`
- `db/seed_demo_33.sql`

## Files Changed After The Admin Panel Follow-Up Work

- `LOCAL_PROJECT_NOTES.md`
- `app-next/app/profile/page.jsx`
- `app-next/app/profile/page.module.css`
- `app-next/app/profile/components/PetsAllView/PetsAllView.jsx`
- `app-next/app/profile/components/PetsAllView/PetsAllView.module.css`

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
7. The admin profile page now supports listing users.
8. The admin profile page now supports creating local users.
9. The admin profile page now supports changing user roles.
10. The admin profile page now supports deleting other users.
11. The current signed-in admin account cannot demote or delete itself through the UI flow.
12. On 2026-05-14, the local stack was rechecked again and both `http://127.0.0.1:8000` and `http://127.0.0.1:3000` returned `200`.
13. The admin panel now supports editing existing user details inline.
14. The admin panel now supports user search and filtering by role.
15. The profile stats now read more naturally for the current local setup.
16. The full pets dashboard now has a top horizontal scrollbar synced with the bottom scrollbar.

## Next Things To Do

1. Continue refining the admin panel layout, especially around wide tables and action areas, if anything still feels cramped at normal zoom.
2. Decide whether to keep sample seed data or switch to a completely empty local database after development is stable.
3. Clean up any remaining local log artifacts if they show up again during future sessions.
4. Resolve the duplicate lockfile warning from Next.js if it becomes annoying during development.
5. Optionally document a simple startup checklist for future sessions:
- start Docker,
- run the DB,
- run the API,
- run the frontend.

## Recent Commit Trail

- `89853bd` `Update local project notes`
- `78fb881` `Let admins edit user details`
- `cb38ab9` `Add user search and role filters`
- `f09167e` `Make admin feedback clearer`
- `803671f` `Add stronger delete confirmation for pet owners`
- `fd86617` `Keep admin actions visible without zooming out`
- `8fe8ccd` `Bring back the original single-line admin actions`
- `26d872c` `Make the create user fields fit better at normal zoom`
- `593678c` `Make the profile page fit better at normal zoom`
- `7559df9` `Make the top profile sections a bit narrower`
- `2002aed` `Change profile labels`
- `fed8b2c` `Add top scrollbar to pets dashboard`

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
