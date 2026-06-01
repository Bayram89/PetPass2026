# PetPass

Live demo: https://petpass2026-frontend.onrender.com
Demo admin login: demo@petpass.com / Demo123

PetPass is a full-stack web app that my team and I built to make life easier for pet owners by keeping passport details, vaccination records, and pet information in one place.

The project started as a final capstone with three of my classmates during our one-year development bootcamp at HackYourFuture. We built the first version together, and in this repository I keep improving both the frontend and backend so it feels closer to a real product.

## Features

- Google OAuth login
- Public demo admin login for recruiters and hiring managers
- Admin dashboard for users and pets
- Pet profile pages with passport and microchip details
- Vaccination records
- PostgreSQL database
- Next.js frontend and Express backend

## Demo Access

- Live demo: https://petpass2026-frontend.onrender.com
- Demo admin login: demo@petpass.com / Demo123

This demo account is public on purpose so recruiters can test the real admin side of the product without contacting me first.

## What To Try

- Create a new pet record
- Add, edit, and delete vaccinations
- Update pet details and owner details
- Open the all-pets and all-users admin views

## Demo Notes

- The demo account is only for public testing
- It uses sample data only
- Please do not store private personal information in it

## Tech Stack

- Frontend: Next.js, React, CSS Modules
- Backend: Node.js, Express
- Database: PostgreSQL
- Authentication: Google OAuth plus a public demo admin login
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
