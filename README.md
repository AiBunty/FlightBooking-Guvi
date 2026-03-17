# SkyLedger Flights

Production-style full-stack flight booking application built with Next.js App Router, TypeScript, Prisma/PostgreSQL, NextAuth credentials auth, and Stripe checkout/webhooks.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL
- NextAuth (credentials/JWT sessions)
- Stripe Checkout + webhook handling
- Zod validation
- React Query
- Zustand (available for lightweight client state extension)
- Nodemailer / Resend email abstraction
- Vitest + Playwright test scaffolding

## Features Implemented

- Public pages: homepage, flight search, results, flight details, about, contact
- Auth flows: sign up, sign in, forgot password, reset password
- Booking flow: select a flight, enter passenger/contact details, create pending booking, start Stripe checkout
- Payment flow: webhook verification, booking confirmation, payment success/failure state updates
- User dashboard: profile, booking history, booking detail
- Admin dashboard: metrics + flights/bookings/users/payments management views and APIs
- Route protection: middleware for authenticated routes and admin role checks
- Validation: Zod request schemas for auth, flight search, booking, payment
- Basic rate limiting on auth, booking, and payment endpoints
- Seed data for airports, airlines, aircraft, flights, users, booking, payment, ticket

## Folder Structure

- app: App Router pages and API route handlers
- components: shared UI and layout components
- features: feature-level UI modules (auth/flights/bookings/admin)
- lib: cross-cutting helpers (auth/db/email/stripe/validators)
- server/repositories: DB query layer
- server/services: business logic, audit logging, rate limiting
- prisma: schema, migrations, seed script
- tests: unit/integration/e2e

## Environment Variables

Copy `.env.example` to `.env` and fill values:

- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- EMAIL_FROM
- EMAIL_SERVER or RESEND_API_KEY
- REDIS_URL (optional)

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Set up PostgreSQL and `.env`.

3. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Seed demo data:

```bash
npm run prisma:seed
```

5. Run dev server:

```bash
npm run dev
```

## Demo Accounts (from seed)

- Admin: `admin@flightbooking.local` / `Admin@1234`
- Customer: `customer@flightbooking.local` / `User@1234`

## Scripts

- `npm run dev` - start app
- `npm run build` - production build
- `npm run lint` - lint
- `npm run typecheck` - TypeScript check
- `npm run prisma:migrate` - create/apply migration
- `npm run prisma:seed` - seed database
- `npm run test` - unit/integration tests (Vitest)
- `npm run test:e2e` - e2e smoke tests (Playwright)

## Stripe Webhook (local)

Use Stripe CLI to forward webhook events:

```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

Set resulting signing secret in `STRIPE_WEBHOOK_SECRET`.

## Notes

- Flight inventory is seeded and queried directly from PostgreSQL.
- Architecture is prepared for future third-party flight provider adapters by keeping search and booking logic in service/repository layers.
- Booking cancellation API is implemented; booking detail page currently shows a placeholder cancellation action button for MVP UI.
