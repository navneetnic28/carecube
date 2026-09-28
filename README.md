# CareCube

Multi-role clinic/hospital appointment & queue management system.

Roles: Patient, Doctor, Centre Owner, Admin.

## Structure

- `server/` — Node + Express + MongoDB backend (REST API, JWT auth, role-based access)
- `client/` — React (Vite) frontend

## Quick Start

### 1. Backend

```bash
cd server
cp .env.example .env    # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev
```

Server runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Roles & Flow

```
Patient   -> explore/search doctors & centres, book appointment, get token, live queue view, payment status
Doctor    -> dashboard, today's queue, call next, complete consultation, schedule, live availability status, public profile
Centre    -> dashboard, manage doctors, walk-in patients (with cash/online payment), centre-wide queue, schedule,
             set live availability per doctor, public page + QR code
Admin     -> verify doctors/centres, manage users, monitor appointments, platform stats
```

## What's new in this update

- **Explore & Search** (`/explore`) — public search across doctors and centres, filterable by
  specialization and city/location, not just name.
- **Public profile pages** — `/doctor/:id` and `/centre/:id` show a doctor's or centre's real-time
  availability, schedule and let a patient book directly, without a login-first detour to browse.
- **Live availability status** (🟢 Available / 🟡 Delayed / 🔴 Unavailable / Holiday) — both the doctor
  and the centre owner can update it per chamber, per day, from their dashboards. Patients see it
  instantly on Explore, the doctor profile and the centre profile — no more phone calls to ask
  "is the doctor in today?".
- **QR booking** — every centre's public profile page has a "Show QR Code" button (client-side,
  via `qrcode.react`, no external service) that encodes a link straight to that centre's CareCube
  page, so a walk-in patient can scan it and book on the spot.
- **Payment status** — appointments (both online and walk-in) now carry `paymentStatus` /
  `paymentMethod` / `amount`. Walk-in bookings collect cash/online/none up front; the centre queue
  view can mark a booking "Paid" with one click; patients see their payment status on
  "My Appointments".
- **Richer profiles at registration** — doctors can add specialization, qualification and
  experience; centres can add address, city, type and opening hours right from the register form,
  which also powers the new location-based search.

## Creating the first Admin account

Public registration only allows `patient`, `doctor`, and `centre_owner` roles (admin should never be self-service). Create the first admin from the server folder:

```bash
cd server
node seed.js admin@carecube.com yourpassword "Admin Name"
```

Then log in from `/login` with that email/password — you'll land on the Admin dashboard.

## Auth

- JWT-based authentication (`Authorization: Bearer <token>`)
- Passwords hashed with bcrypt
- Role-based route protection both on frontend (`ProtectedRoute`) and backend (`protect` + `authorize` middleware)

## API additions in this update

```
GET   /api/centres                  Explore/search participating centres (?query=&city=)
GET   /api/centres/:id              Public centre profile (doctors, schedule, live status) — QR target
GET   /api/doctors/:id              Public doctor profile (chambers, schedule, live status)
GET   /api/doctors/search           Now also accepts ?city= for location-based search

GET   /api/doctor/status            Doctor's own live availability across chambers, today by default
PATCH /api/doctor/status            Doctor sets availability at one chamber (status/delayMinutes/note)

GET   /api/centre/status            Centre's doctors' live availability, today by default
PATCH /api/centre/status            Centre owner sets a doctor's availability
PATCH /api/centre/appointments/:id/payment   Mark a booking's payment status
```

`POST /api/appointments/book` and `POST /api/centre/walk-in` now also accept `paymentMethod` and `amount`.

## Notes

This started as an MVP scaffold generated from the CareCube development plan (Day 1, Day 12, Day 13,
Day 14 modules). Auth, models, core appointment APIs, Explore/search, public profile pages, QR
booking, live availability and a first pass at payment status have all been filled in so the whole
thing runs end-to-end. Notifications (WhatsApp/SMS/push), online payment gateway integration,
prescription management and production hardening (rate limiting, refresh tokens, file storage for
photos) are still future work per the brief's "Future Features" section.
