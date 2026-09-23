# OnlyGDV — Monorepo

Multi-vendor Ecommerce + Food + Grocery delivery platform.

```
onlygdv/
├── backend/            Node.js + Express + Prisma + PostgreSQL API (used by everything below)
├── apps/
│   ├── app/             ⭐ THE SINGLE APP TO PUBLISH — role picker (Customer/Vendor/Delivery) in one Play Store listing
│   ├── customer-app/    Legacy standalone app — kept for reference, no longer the recommended path
│   ├── vendor-app/      Legacy standalone app — kept for reference, no longer the recommended path
│   └── delivery-app/    Legacy standalone app — kept for reference, no longer the recommended path
└── web-admin/          React + Vite — admin panel (browser), controls vendors, riders, and orders
```

## The single app (`apps/app`)

This is what you publish to Play Store — **one app, one listing**. On first launch, the user
sees a role picker: "I'm a Customer" / "I'm a Shop or Restaurant Owner" / "I'm a Delivery Rider".
Whichever they tap takes them into a login/signup flow for that role, and from then on the app
remembers their session and drops them straight into that role's screens on future launches —
no picker shown again unless they log out.

Under the hood, this still uses the exact same backend and the exact same `role` field on the
`User` table (`CUSTOMER` / `VENDOR` / `DELIVERY`) as before — the change is entirely in the
mobile app's UI/navigation, not the data model. If someone tries to log into the "Customer"
option with an account that's actually registered as a Vendor, the app tells them and sends
them back to pick the right option.

The `customer-app`, `vendor-app`, and `delivery-app` folders are left in place in case you want
to reference their original code, but `apps/app` is the one to build and publish going forward.

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
