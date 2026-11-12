# SkyBook — Full-Stack Airplane Ticket Booking Platform

Modern, responsive, production-ready airplane ticket booking website built with the latest technologies.

## ✨ Features

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS 4**
- Beautiful modern UI with **Shadcn-style** components + **Lucide React** + **react-icons**
- **Light / Dark** theme system (`next-themes`)
- Fully responsive (mobile, tablet, desktop)
- **NextAuth.js** authentication (Credentials + Google OAuth)
- **JWT** session strategy + role-based access
- Multiple roles: `USER` · `ADMIN` · `AIRLINE` · `STAFF`
- Dynamic role-based dashboards
- **Redux Toolkit** for booking state
- **TanStack Query (React Query)** for server state
- **GSAP + ScrollTrigger** for reduced-motion-aware scroll reveals
- **Prisma ORM** + **PostgreSQL (Neon)**
- **Stripe Checkout** with server-verified payment confirmation and seat reservations
- **react-hot-toast** payment feedback
- Booking confirmation / cancellation emails via **Brevo API**
- Flight search, booking flow, seat selection ready architecture
- Recharts analytics on Admin dashboard

## 📁 Project Structure

```
src/
├── app/                    # App Router pages & API routes
│   ├── api/
│   │   ├── auth/           # NextAuth + register
│   │   ├── bookings/
│   │   ├── flights/
│   │   └── email/
│   ├── services
│   ├── contact
│   ├── login / register
│   ├── flights
│   ├── booking
│   ├── dashboard/
│   │   ├── user/
│   │   ├── admin/
│   │   └── airline/
│   └── ...
├── components/
│   ├── ui/                 # Button, Card, Input, etc.
│   ├── layout/             # Navbar, Footer
│   ├── theme/
│   └── ...
├── lib/                    # prisma, auth, utils
├── store/                  # Redux Toolkit slices
├── services/               # Email (Brevo)
├── hooks/
└── types/
prisma/
└── schema.prisma           # Full data model
```

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` → `.env` and fill in:

```env
DATABASE_URL="postgresql://...@neon.tech/..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-long-random-string"
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
BREVO_API_KEY=...
BREVO_SENDER_EMAIL=...
IMGBB_API_KEY=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

`IMGBB_API_KEY` is optional and is only needed to enable profile photo uploads
from the traveler dashboard. The key is used by the server and should not use a
`NEXT_PUBLIC_` prefix.

Set `NEXT_PUBLIC_CONTACT_EMAIL` to your support inbox for the Contact page. The
form prepares an email in the visitor's default email app; it does not send
messages directly from the website.

Stripe Checkout uses the server-only `STRIPE_SECRET_KEY`. Configure a webhook
signing secret in `STRIPE_WEBHOOK_SECRET` for the
`/api/webhooks/stripe` endpoint. During local development, forward Stripe test
events with
`stripe listen --events checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.expired --forward-to localhost:3000/api/webhooks/stripe`.
Run `npm run db:push` and `npm run db:generate` against the intended database
before starting checkout. Seed demo flights with `npm run db:seed` if the
database does not yet contain flight inventory.

For Google sign-in, create a **Web application** OAuth client in Google Cloud Console.
Add the origin from `NEXTAUTH_URL` as an authorized JavaScript origin, and add this exact
authorized redirect URI:

```text
<NEXTAUTH_URL>/api/auth/callback/google
```

For local development, this is `http://localhost:3000/api/auth/callback/google`.
In production, use the deployed site's exact HTTPS origin. Keep the Google client secret
and `.env` out of Git.

### 3. Database

```bash
npx prisma generate
npx prisma db push
# optional seed
npm run db:seed
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔐 Roles & Dashboards

| Role    | Path                  | Capabilities                          |
|---------|-----------------------|---------------------------------------|
| USER    | `/dashboard/user`     | Overview, own bookings, profile       |
| AIRLINE | `/dashboard/airline`  | Manage flights, schedules, seats      |
| ADMIN   | `/dashboard/admin`    | Full platform analytics & management  |

## 📧 Email (Brevo)

Booking confirmation and cancellation templates are ready in `src/services/email.ts`.  
When `BREVO_API_KEY` is missing the system logs the email instead of sending (safe for local dev).

## 🎨 Theme

Toggle light / dark mode from the navbar. Uses `next-themes` with system preference support.

## 📦 Important Packages

- next, react 19, typescript
- tailwindcss, class-variance-authority, clsx, tailwind-merge
- @radix-ui/* (Shadcn foundation)
- lucide-react, react-icons
- next-auth, @auth/prisma-adapter
- stripe, react-hot-toast
- @prisma/client, prisma
- @reduxjs/toolkit, react-redux
- @tanstack/react-query
- gsap
- next-themes, framer-motion, recharts
- zod, react-hook-form, bcryptjs, jsonwebtoken, nodemailer

## 📝 Notes

- Demo flight data is used on `/flights` until you connect real Prisma queries.
- Google login requires valid OAuth credentials from Google Cloud Console (or Firebase).
- For production, set strong secrets and enable Neon connection pooling.

## License

MIT — feel free to use and extend.
