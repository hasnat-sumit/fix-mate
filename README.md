# FixMate Client

Next.js 16 frontend for FixMate, a platform for booking home and device repair services. Customers browse and book services, technicians manage their services and jobs, and admins manage users, services and bookings.

The backend lives in a separate repository: **fixmate-server** (Express + MongoDB).

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4, shadcn/ui
- Better Auth (client)

## Getting started

Requirements: Node.js 22.12+ and npm. The API (fixmate-server) should be running.

```bash
npm install
cp .env.example .env.local   # then edit the values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable  | Description | Default |
| --------- | ----------- | ------- |
| `API_URL` | Origin of the Express API. Requests to `/api/*` are proxied there, so auth cookies stay first-party. | `http://localhost:5000` |

`API_URL` is read at build time (for the rewrite and for prerendering service pages), so set it in your hosting environment and make sure the API is reachable before running a production build.

## Scripts

| Command         | Description |
| --------------- | ----------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint`  | Run ESLint |
