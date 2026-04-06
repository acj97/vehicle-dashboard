# VehicleOS — Vehicle Data Dashboard

A vehicle intelligence dashboard built as a front-end take-home assessment for M+ Software. Consumes the public [NHTSA vPIC API](https://vpic.nhtsa.dot.gov/api/) to display vehicle make and model data with role-based access, interactive charts, and a paginated/searchable data table.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 16 (App Router, `src/` dir) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | next-auth v4 (Credentials provider, JWT) |
| Server state | TanStack Query v5 |
| UI state | Zustand v5 |
| Table | TanStack Table v8 |
| Charts | Recharts v3 |
| Icons | lucide-react |
| Utilities | clsx, tailwind-merge |

---

## Features

### Authentication
- Credentials-based login with two hardcoded roles
- JWT session strategy via next-auth
- Route protection via Next.js 16 `proxy.ts` (replaces deprecated `middleware.ts`)

### Role-Based Access

| Feature | Admin | Viewer |
|---|---|---|
| Dashboard KPI cards | ✅ | ✅ |
| Vehicle types chart | ✅ | 🔒 |
| Vehicles table + modal | ✅ | ✅ |

### Dashboard
- 4 KPI cards with live NHTSA data (Total Makes, Passenger Cars, Motorcycles, Trucks)
- Parallel data fetching via `useQueries`
- Interactive bar chart — vehicle type distribution with multi-select filter
- Chart filter state persists across navigation (Zustand)

### Vehicles Table
- ~10,000 makes from NHTSA, paginated client-side (TanStack Table)
- Column sorting (Make ID, Make Name)
- Global search — filters as you type, resets pagination
- Page size selector (10 / 15 / 25 / 50)
- Smart pagination with ellipsis

### Detail Modal
- Click any row to open — fetches models for that make on demand
- TanStack Query caches each make's models separately
- Escape / backdrop click to close, body scroll locked while open

### Error Handling
- Route-level `error.tsx` catches unhandled errors across the dashboard segment
- Neon-styled error fallback UI with retry action
- API error state can be triggered by opening the detail modal for **Make ID 4877** — the NHTSA endpoint returns an error for this entry, demonstrating the modal's error fallback UI

#### Testing the Route-Level Error Page Manually

To trigger the full-page error boundary, temporarily add a throw to any dashboard server component:

```ts
// src/app/(dashboard)/dashboard/page.tsx
export default async function DashboardPage() {
  throw new Error("Test error"); // ← add this line
  ...
}
```

Navigate to `/dashboard` — the neon error fallback renders. Click **Retry** to re-mount the segment. Remove the line when done.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install

```bash
npm install
```

### Environment

A `.env` file is included for local development. For production, regenerate the secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

```env
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=http://localhost:3000
```

### Run

```bash
npm run dev     # development  →  http://localhost:3000
npm run build   # production build
npm start       # serve production build
```

### Demo Credentials

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | Admin — full access |
| `viewer` | `viewer123` | Viewer — read-only, no chart |

---

## Architecture

### Routing

```
/                        → redirects to /login
/login                   → public  (auth) route group
/dashboard               → protected  (dashboard) route group
/vehicles                → protected  (dashboard) route group
/api/auth/[...nextauth]  → next-auth handler
```

Route groups `(auth)` and `(dashboard)` organise layouts without affecting URLs. The `(dashboard)` group shares a sidebar + navbar layout; `(auth)` gets a bare full-screen layout.

### Data Flow

```
NHTSA Public API
       ↓
lib/api/nhtsa.ts       — typed fetch helpers + stable query keys
       ↓
TanStack Query         — caching, deduplication, loading/error states
       ↓
React components       — KpiCards, VehicleTypeChart, MakesTable, MakeDetailModal
```

**Server state** (remote data) lives entirely in TanStack Query with a 5-minute `staleTime` — the full makes list (~10k records) is fetched once and reused across table and KPI cards without redundant network calls.

**UI state** (search query, selected make, chart filters) lives in Zustand. This separation keeps components clean — no prop-drilling, no mixing of concerns.

### Auth Flow

```
/login  →  signIn("credentials")  →  NextAuth authorize()
    →  JWT token: { id, name, email, role }
    →  session.user.role available in all components
```

Server components call `getServerSession(authOptions)` directly. Client components use `useSession()` from the `SessionProvider` wrapper. The `proxy.ts` file (Next.js 16's replacement for `middleware.ts`) handles unauthenticated redirects at the edge before any page renders.

### Error Boundaries

Route-level `(dashboard)/error.tsx` catches any unhandled error in the dashboard segment and renders a neon-styled fallback full-screen with a retry action.

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/page.tsx            — login form
│   ├── (dashboard)/
│   │   ├── layout.tsx                   — sidebar + navbar shell
│   │   ├── error.tsx                    — route-level error boundary
│   │   ├── dashboard/page.tsx           — KPI cards + chart (server component)
│   │   └── vehicles/page.tsx            — table + modal entry point
│   ├── api/auth/[...nextauth]/route.ts  — next-auth GET/POST handler
│   ├── layout.tsx                       — root layout, fonts, Providers
│   └── page.tsx                         — redirect → /login
│
├── components/
│   ├── charts/VehicleTypeChart.tsx      — recharts bar chart + type filter
│   ├── dashboard/
│   │   ├── KpiCards.tsx                 — 4 live KPI cards (useQueries)
│   │   └── ErrorSimulator.tsx           — admin-only error trigger
│   ├── layout/
│   │   ├── Sidebar.tsx                  — nav links + user info + sign out
│   │   ├── Navbar.tsx                   — breadcrumb + live indicator
│   │   └── ErrorBoundary.tsx            — unstable_catchError wrapper
│   ├── table/MakesTable.tsx             — TanStack Table (sort/search/page)
│   ├── ui/
│   │   ├── Modal.tsx                    — reusable modal primitive
│   │   └── ErrorDisplay.tsx             — neon error fallback UI (shared)
│   ├── vehicles/MakeDetailModal.tsx     — make → models detail modal
│   └── Providers.tsx                    — QueryClient + SessionProvider tree
│
├── lib/
│   ├── api/nhtsa.ts                     — typed NHTSA fetchers + query keys
│   ├── auth/config.ts                   — NextAuth options + hardcoded users
│   ├── store/vehicleStore.ts            — Zustand store (search, modal, filters)
│   └── utils.ts                         — cn() helper (clsx + tailwind-merge)
│
├── types/
│   ├── index.ts                         — NHTSA + app TypeScript types
│   └── next-auth.d.ts                   — session type augmentation (role)
│
└── proxy.ts                             — route protection (Next.js 16)
```

---

## Design

**Dark neon** aesthetic — near-black backgrounds with cyan (`#00e5ff`), purple (`#c060ff`), green (`#00ff87`), and amber (`#ffb800`) neon accents.

Fonts: **Orbitron** (headings, labels, display text) + **Space Mono** (body, data, monospace contexts) via `next/font/google`.

All neon colors are Tailwind v4 `@theme` tokens that generate standard utility classes. Glow effects are plain CSS classes (`.glow-cyan`, `.glow-box-purple`) composed in components as needed. No CSS-in-JS, no runtime style injection.

---

## Engineering Notes

**Caching** — `staleTime: 5 * 60 * 1000` means NHTSA data is treated as fresh for 5 minutes. The makes list is fetched once and shared across all consumers (table, KPI cards) through the query cache.

**Query keys** — Centralised in `lib/api/nhtsa.ts` as a typed `queryKeys` object. Consistent keys prevent duplicate fetches and make invalidation straightforward.

**No prop-drilling** — Zustand stores cross-component state. The search input, table, and modal are siblings; they communicate only through the store.

**Type safety** — `next-auth.d.ts` module augmentation adds `role: UserRole` to `Session["user"]` and `JWT`, eliminating `as any` in every auth-aware component.

**Responsive** — Sidebar hidden below `lg` breakpoint; main content uses adaptive padding (`p-4 sm:p-6`); KPI grid and table reflow on smaller screens.
