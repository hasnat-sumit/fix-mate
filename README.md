# FixMate: Smart Device & Home Appliance Repair Platform

FixMate is a full-stack, role-based platform for booking device and home-appliance repairs. Verified technicians list their repair services; customers find a service, send a repair request, follow the job step by step, and **pay online only after the work is completed**. Admins approve services, manage users and monitor every job and transaction.

**Why:** people rarely know what happens to a device after handing it to a technician, and often pay before any work is done. FixMate gives every job a clear, trackable status and moves payment to the end.

| | |
| --- | --- |
| **Live site** | https://fix-mate-peach.vercel.app |
| **API** | https://fix-mate-server-nine.vercel.app (health check: [/api/health](https://fix-mate-server-nine.vercel.app/api/health)) |
| **Client repo** | https://github.com/hasnat-sumit/fix-mate |
| **Server repo** | https://github.com/hasnat-sumit/fix-mate-server |

## Test accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `khsumit28@gmail.com` | `_Qwerty142528@` |
| Technician | `rafiq.technician@example.com` | `_Qwerty142528@` |
| Customer | `arif.customer@example.com` | `_Qwerty142528@` |

More seeded accounts (same password): technicians `nusrat.technician@example.com`, `tanvir.technician@example.com`; customer `sadia.customer@example.com`. Rafiq has a job in every status; Arif has a completed job waiting for payment.

**Stripe test card:** `4242 4242 4242 4242`, any future date, any CVC.

## Key features

**Customers**
- Browse approved services with **server-side** search (title or category), category and service-mode filters, sorting (newest, price low→high, high→low) and pagination, all kept in the URL, so they survive a reload (e.g. `/services?category=AC`).
- Send a repair request (phone, address, preferred date, problem description). Duplicate active requests for the same service are blocked.
- **My Bookings:** status and payment badges, cancel while *Requested* (with confirmation), **Pay Now** with Stripe once *Completed*, and a **job timeline tracker** (Requested → Accepted → In Progress → Completed → Paid).
- Payment history, plus an overview with stats and a chart.

**Technicians**
- Add services with an **ImgBB image upload**; new and edited services wait for admin approval.
- My Services: edit (modal), delete (confirmation) and an availability switch that hides a service from public pages.
- Manage Requests: Accept / Reject → Start Work → Mark Completed (with the final amount), filtered by status.

**Admins**
- Overview with stats, a revenue chart (last 6 months) and bookings by status.
- Manage users: change roles (never their own), suspend / reactivate.
- Approve or reject services (pending first); read-only all bookings; transactions with total revenue.

**Platform**
- Better Auth email/password sign-up with role choice (Customer / Technician; admin is never selectable), password rules enforced on client and server.
- JWT-protected Express API with `verifyToken`, `verifyCustomer`, `verifyTechnician`, `verifyAdmin` (401 / 403), and users only ever reach their own data.
- Server-enforced job status pipeline and payment gate; Stripe Checkout + signed webhook, with each payment saved exactly once.
- Role-based dashboard with a collapsible sidebar; protected routes survive reloads; a 403 panel for other roles' pages.
- Sticky navbar with an avatar dropdown, toasts for every action, skeleton loaders, empty states, confirmation modals, custom 404 and error pages, dark / light theme, fully responsive.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · Better Auth · Express 5 · MongoDB / Mongoose · JWT (Better Auth JWT plugin + jose) · Stripe · ImgBB

### npm packages (client)

| Package | Used for |
| --- | --- |
| `next`, `react`, `react-dom` | App Router framework and UI |
| `better-auth` | Sign-up / sign-in, session and JWT client |
| `radix-ui`, `shadcn`, `class-variance-authority`, `cn`, `tw-animate-css` | shadcn/ui components (dialogs, dropdown, buttons) and animations |
| `lucide-react` | Icons |
| `sonner` | Toast notifications |
| `tailwindcss`, `@tailwindcss/turbopack` | Styling |
| `typescript`, `eslint`, `eslint-config-next`, `babel-plugin-react-compiler`, `@types/*` | Tooling |

Server packages (`express`, `mongoose`, `better-auth`, `jose`, `stripe`, `zod`, `helmet`, `cors`) are listed in the [server README](https://github.com/hasnat-sumit/fix-mate-server).

## Run locally

Requirements: Node.js 22.12+, npm, and the API (fix-mate-server) running.

```bash
npm install
cp .env.example .env.local   # set API_URL (default http://localhost:5000)
npm run dev                  # http://localhost:3000
```

| Variable | Description | Default |
| --- | --- | --- |
| `API_URL` | Origin of the Express API. `/api/*` is proxied there so auth cookies stay first-party. Read at build time; the API must be reachable when building. | `http://localhost:5000` |

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Deployment (Vercel)

1. Import the repository in Vercel (framework: Next.js).
2. Set `API_URL` to the deployed API origin (here `https://fix-mate-server-nine.vercel.app`). Deploy the API first; the build fetches services from it.
3. Set the server's `BETTER_AUTH_URL` and `CLIENT_ORIGINS` to this site's domain (here `https://fix-mate-peach.vercel.app`); see the server README.
