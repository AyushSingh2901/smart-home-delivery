# Smart Home Service Booking Platform

A modern MERN platform for booking local home services such as plumbing, electrical repairs, carpentry, AC repair, cleaning, and painting. The app includes customer, service provider, and admin workflows with JWT authentication, role-based access, Socket.IO updates, Google Maps-ready location fields, and Razorpay demo payment hooks.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Context API, Axios, Socket.IO client, Recharts, React Hot Toast
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Socket.IO
- Payments: Razorpay mock/demo order and verification endpoints
- Maps: Google Maps API-ready UI and coordinate storage

## Quick Start

MongoDB must be running before the backend can connect. The current local env files use:

```bash
server/.env
MONGO_URI=mongodb://127.0.0.1:27017/smart_home_services

client/.env
VITE_API_URL=http://localhost:5050/api
VITE_SOCKET_URL=http://localhost:5050
```

### Without Docker

Install MongoDB Community with Homebrew:

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

Confirm MongoDB is listening:

```bash
lsof -nP -iTCP:27017 -sTCP:LISTEN
```

Then start the app:

```bash
npm run install:all
npm run seed # optional: creates/updates only service categories
npm run dev
```

If you already have MongoDB installed locally, start it first:

```bash
brew services start mongodb-community
```

### With Docker MongoDB

```bash
npm run mongo:start
```

Then start the app:

```bash
npm run install:all
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run seed # optional: creates/updates only service categories
npm run dev
```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:5050`.

You can also start MongoDB and the dev servers together:

```bash
npm run dev:full
```

## Docker

The easiest Docker path starts MongoDB, backend, and frontend together:

```bash
docker compose up --build
```

Frontend runs on `http://localhost:8080`, backend on `http://localhost:5050`, and MongoDB on `localhost:27017`.

Separate Dockerfiles are also included for each app:

```bash
docker build -t smartserve-api ./server
docker run --env-file ./server/.env -p 5050:5050 smartserve-api
```

```bash
docker build \
  --build-arg VITE_API_URL=http://localhost:5050/api \
  --build-arg VITE_SOCKET_URL=http://localhost:5050 \
  -t smartserve-web ./client
docker run -p 8080:80 smartserve-web
```

For production, set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, Razorpay keys, and frontend `VITE_*` build args for your deployed domains.

## Service Catalog

`npm run seed` is optional and idempotent. It only creates or updates the service catalog entries such as Plumbing Repair, Electrical Fix, AC Repair, Cleaning, and Painting. It does not delete or create users, providers, bookings, payments, reviews, notifications, or chat messages.

Create customer, provider, and admin accounts through the registration page. Provider registration asks which MongoDB service categories the provider offers.

## Key Features

- JWT authentication and role-based dashboards
- MongoDB-backed UI data only: services, providers, bookings, users, payments, reviews, and chat messages are fetched from APIs rather than hardcoded page records
- Customer booking flow with urgent service support
- Provider availability, pricing, booking status updates, and earnings
- Admin analytics, provider verification, bookings, payments, and reports
- Real-time booking notifications and chat via Socket.IO
- AI-inspired recommended providers based on rating, distance, verification, and service fit
- Responsive dark/light UI with dashboard charts, toasts, loaders, validations, and 404 page
