# PetPass

Check it out live: https://petpass2026-frontend.onrender.com

PetPass is a full-stack web app that my team and I built to make life easier for pet owners, helping them track passport details and vaccination records all in one place.

The project started as a final capstone with three of my classmates during our one-year development bootcamp at HackYourFuture. We built the first version together, and in this repository I’m continuing to build out new features and use it as my personal full-stack sandbox.

Now I’m working on both the frontend and backend, and I really enjoy moving across the whole stack. I find it satisfying to see how the user interface, API, authentication, and database connect to form one working product.

## Features

- Google OAuth login
- Admin dashboard for users and pets
- Pet profile pages with passport and microchip details
- Vaccination records
- PostgreSQL database
- Next.js frontend and Express backend

## Tech Stack

- Frontend: Next.js, React, CSS Modules
- Backend: Node.js, Express
- Database: PostgreSQL
- Authentication: Google OAuth, Passport.js
- Deployment: Render

## Local Development

Backend:

```bash
cd api
npm install
npm run dev
```

Frontend:

```bash
cd app-next
npm install
npm run dev
```

Environment variables are required for the database connection and Google OAuth credentials.
