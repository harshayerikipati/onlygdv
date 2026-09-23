# OnlyGDV — Monorepo

Multi-vendor Ecommerce + Food + Grocery delivery platform.

```
onlygdv/
├── backend/            Node.js + Express + Prisma + PostgreSQL API (used by all apps)
├── apps/
│   ├── customer-app/   React Native (Expo) — end customers
│   ├── vendor-app/     React Native (Expo) — shop/restaurant owners
│   └── delivery-app/   React Native (Expo) — delivery riders
└── web-admin/          React + Vite — admin panel (browser)
```

## Quick start

### 1. Backend
```bash
cd backend
cp .env.example .env        # fill in your own PostgreSQL connection string + JWT secret
npm install
npx prisma migrate dev --name init
npm run dev                 # runs on http://localhost:4000
```

### 2. Web Admin
```bash
cd web-admin
npm install
npm run dev                 # runs on http://localhost:5173
```
Set `VITE_API_URL` in `web-admin/.env` to your backend URL (default http://localhost:4000).

### 3. Mobile apps (Customer / Vendor / Delivery)
Each mobile app is a standalone Expo project.
```bash
cd apps/customer-app        # or vendor-app / delivery-app
npm install
npx expo start
```
Update `API_URL` in `src/api/client.js` in each app to point at your backend
(use your machine's LAN IP, not `localhost`, when testing on a physical phone).

## What's scaffolded vs. what's a stub

This is a **working foundation**, not a finished product:
- ✅ Backend: real Postgres schema (Prisma), JWT auth (signup/login for all roles), CRUD for
  categories/products, order creation + status updates, role-based route protection.
- ✅ Each app: real navigation, real login screen wired to the API, one or two core screens
  fetching live data from the backend.
- 🚧 Payments, push notifications, live map tracking, image upload, admin approval workflows
  are stubbed or left as clearly marked TODOs — these need business decisions (which payment
  gateway, which SMS/OTP provider, etc.) before wiring in.

## Publishing to Play Store later

Each app under `apps/` has its own `app.json` (Expo config) with a placeholder package name
(`com.onlygdv.customer`, `com.onlygdv.vendor`, `com.onlygdv.delivery`). Change these to your
own reverse-domain before building. Use `eas build` (Expo Application Services) to produce
the `.aab` files Play Console needs.

## Next steps
1. Set up a real PostgreSQL database (see PROJECT PLAN doc for hosting options) and update `.env`.
2. Run the backend, confirm `/health` responds.
3. Flesh out remaining screens per app using the existing ones as a pattern.
4. Wire a payment gateway (Razorpay/Stripe) into `backend/src/routes/order.routes.js`.
