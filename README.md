# Job Tracker

COMP229 – Web Application Development · Project Part 1 · **Team Next Step**

A web app for tracking job applications: where each one stands (Wishlist → Applied → Interview → Offer / Rejected), when to follow up, and upcoming interviews.

**Live site:** https://job-tracker-wheat-eight.vercel.app

## Tech stack

| Layer | Technology |
|---|---|
| Front end (View) | React 18 + Vite, React Router |
| Back end | Node.js + Express (MVC) |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (Bearer token) + bcrypt password hashing |
| Hosting | Vercel (static front end + serverless API) |

## Project structure (MVC)

```
api/index.js            Vercel serverless entry → server/app.js
server/
  app.js                Express app: middleware, routes, error handler
  db.js                 MongoDB connection (cached for serverless)
  dev.js                Local dev server
  models/               M — Mongoose schemas (User, Job)
  controllers/          C — request logic (auth, jobs, users)
  routes/               URL → controller mapping
  middleware/auth.js    JWT sign + requireAuth guard
src/                    V — React front end (pages, components, context)
docs/                   Postman collection for API testing
```

## Getting started

```bash
npm install
cp .env.example .env     # then fill in MONGODB_URI and JWT_SECRET
npm run dev              # API on http://localhost:5001, web on Vite's port
```

## API

All routes except `signup`, `signin` and `health` need the header `Authorization: Bearer <token>`.

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create an account → `{ token, user }` |
| POST | `/api/auth/signin` | Sign in → `{ token, user }` |
| GET | `/api/auth/me` | Current signed-in user |

### Users (CRUD on your own account)
| Method | Route | Description |
|---|---|---|
| GET | `/api/users/me` | Read profile |
| PUT | `/api/users/me` | Update `name`, `email`, `password` (email/password changes need `currentPassword`) |
| DELETE | `/api/users/me` | Delete account and all its applications (needs `currentPassword`) |

### Jobs (CRUD on job applications)
| Method | Route | Description |
|---|---|---|
| GET | `/api/jobs` | List your applications |
| GET | `/api/jobs/:id` | Read one application |
| POST | `/api/jobs` | Create an application |
| PUT | `/api/jobs/:id` | Update an application |
| DELETE | `/api/jobs/:id` | Delete an application |

### Authorization
- Requests without a valid token get **401**.
- Every job query is filtered by the signed-in user's id, so a user can never read, edit or delete another user's applications (they get **404**).

## Testing the API

Import `docs/JobTracker.postman_collection.json` into Postman. Set the `baseUrl` variable (live site or `http://localhost:5001`), then run **Sign up** or **Sign in**: the token is saved automatically and used by all other requests.

## Team Next Step

| Name | Student ID | Role |
|---|---|---|
| | | |
| | | |
| | | |
| | | |
