<pre>
# PetPass

Live demo: https://petpass2026-frontend.onrender.com

PetPass is a full-stack web application that manages users and pets. It includes:
- Backend API for CRUD operations on users and pets .  
- Frontend built with React and Next.js.  
- Google OAuth login for secure authentication.  
- Admin dashboard for managing users, pets, and vaccination records.


## How-to Guide

These steps will get you up and running locally for development and testing.

Requirements:
"next": "15.5.0",
"react": "19.1.0",
"node": "^20.12.1", 

### Clone the Repository

Open your terminal and navigate to a desired folder.

git clone https://github.com/VadimTofan/PetPass.git

cd PetPass ─┬─ cd api —— npm install —— npm run dev
            └─ cd app-next —— npm install —— npm run dev

Get the environmental variables from one of our team members.

Place the .env and .env.local files according to the file structure.

<b>You're set!</b>


Our File Structure:

PetPass/
├─ .git/                               # Git essential files
├─ api/                                # Backend API
│  ├─ .env
│  └─ src                                  
│     ├─ routes/                       # API route handlers
│     │  ├─ pets.js                    # CRUD for pets
│     │  └─ users.js                   # CRUD for users
│     │                                 
│     ├─ database/                     # Database Access
│     │  ├─ pets.js                    # Pets database queries
│     │  └─ users.js                   # Users database queries
│     │    
│     └─ index.js                      # API entry point
│
├─ app-next/                           # Next.js frontend
│  ├─ .env.local
│  ├─ public/                          # Static assets (logos, images, etc.)
│  │  └─ favicon.ico
│  │
│  └─ app/                             # App Router (Next.js 13+)
│     ├─ layout.js
│     ├─ globals.css
│     ├─ page.js                       # Landing page (/)
│     │
│     ├─ about/                        # /about
│     │  ├─ page.js
│     │  └─ about.module.css
│     │
│     ├─ api/                          # /api-auth
│     │  ├─ auth\[...nextauth]
│     │  │  └─ route.js
│     │  └─ users\sync
│     │     └─ route.js
│     │ 
│     ├─ components/                   # Reusable UI components
│     │  ├─ navbar/                    # Navbar
│     │  │  ├─ Navbar.js               
│     │  │  └─ Navbar.module.css
│     │  │
│     │  └─ footer/                    # Footer
│     │     ├─ Footer.js
│     │     └─ Footer.module.css
│     │
│     ├─ contact/                      # /contact
│     │  ├─ page.js
│     │  └─ contact.module.css
│     │
│     ├─ features/                     # /features
│     │  ├─ page.js
│     │  └─ features.module.css
│     │
│     ├─ home/                         # Homepage("/home")
│     │  ├─ category/
│     │  │  ├─ Category.js
│     │  │  └─ Category.module.css
│     │  │
│     │  ├─ hero/
│     │  │  ├─ Hero.js
│     │  │  └─ Hero.module.css
│     │  │
│     │  └─ promotion/
│     │     ├─ Promotion.js
│     │     └─ Promotion.module.css
│     │
│     ├─ profile/                      # /profile
│     │  ├─ page.js
│     │  ├─ profile.module.css
│     │  ├─ components                 # Profile components
│     │  │  ├─ DBFunctions             # DB Access components
│     │  │  ├─ PetsAllView             # Multiple pet view
│     │  │  └─ PetView                 # Single pet view
│     │  │
│     │  ├─ edit                       # /profile/edit
│     │  └─ pets
│     │     └─ [pet]
│
├─ .gitignore
└─ README.md
</pre>
