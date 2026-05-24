# PetPass

Live demo: https://petpass2026-frontend.onrender.com

PetPass is a full-stack web app for managing pet owners, pet passport details, and vaccination records.

This project started as a shared final project built by a team of four developers. This repository is my continued version of the project, where I keep improving the app while being clear that the original idea and first implementation were team work.

My contribution included both frontend and backend tasks. I worked across the stack because I enjoy understanding how the user interface, API, authentication, and database fit together as one product.

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
