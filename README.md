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
| Dashboard KPI cards | ✅ | ❌ redirected to /makes |
| Vehicle types chart | ✅ | ❌ |
| Makes table + modal | ✅ | ✅ |

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
/                        → redirects to /dashboard (admin) or /makes (viewer) or /login
/login                   → public  (auth) route group
/dashboard               → admin-only  (dashboard) route group
/makes                → all authenticated users  (dashboard) route group
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

**Server state** (remote data) lives entirely in TanStack Query using a stale-while-revalidate strategy (`staleTime: 0`, `gcTime: 5min`) — cached data is shown immediately on every mount while a background refetch silently updates the UI with fresh data. TanStack Query deduplicates concurrent requests, so the makes list fetched by the table is reused by the KPI cards without a second network call.

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
│   ├── dashboard/KpiCards.tsx           — 4 live KPI cards (useQueries)
│   ├── layout/
│   │   ├── DashboardShell.tsx           — client shell owning sidebar open state
│   │   ├── Sidebar.tsx                  — nav links (role-filtered) + user info + sign out
│   │   └── Navbar.tsx                   — breadcrumb + mobile hamburger
│   ├── table/
│   │   ├── MakesTable.tsx               — TanStack Table (sort/search/page)
│   │   └── MakesToolbar.tsx             — search input with 300ms debounce
│   ├── ui/                              — Button, Input, Select, Badge, Card, Alert, Spinner, Modal, ErrorDisplay
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

## Architecture & Trade-offs

### Data Fetching — TanStack Query

All server state lives in TanStack Query, not React state or Zustand. Queries are declared close to where they're consumed (`KpiCards`, `VehicleTypeChart`, `MakesTable`) rather than in a global store. TanStack Query deduplicates — if two components request the same query key, only one network request fires.

**`staleTime: 0` + `gcTime: 5min`** implements stale-while-revalidate:
- `staleTime: 0` — data is always considered stale, so every mount triggers a background refetch. `isLoading` is only `true` when there is *no* cache at all, so cached data is shown immediately while a silent refetch runs in the background.
- `gcTime: 5min` — unused cache entries live in memory for 5 minutes after unmount. Navigating away and back never re-shows the loading skeleton within that window.

**Fallback on error** — TanStack Query preserves `data` from the last successful fetch even when `isError: true`. Components check `isError && data !== undefined` to distinguish "failed with stale data" (show amber warning, keep data visible) from "failed with no cache" (show full error UI).

**Trade-off:** `staleTime: 0` means more API calls — one refetch per mount. Acceptable here because NHTSA is a free public API and TanStack Query deduplicates concurrent requests. For a paid API with rate limits, raise `staleTime` to reduce call volume.

---

### UI State — Zustand

Ephemeral UI state that needs to cross component boundaries lives in Zustand, not prop drilling or React Context.

Three state slices:
- `searchQuery` — written by `MakesToolbar`, read by `MakesTable`
- `selectedMake` — written by `MakesTable`, read by `MakeDetailModal`
- `activeVehicleTypes` (Set) — owned and used by `VehicleTypeChart`

**Why not React Context?** Context re-renders every subscriber on every change. Zustand's selector-based subscriptions only re-render the components that use the changed slice.

**Trade-off:** Zustand state persists across navigations (no automatic cleanup). `searchQuery` stays set when you leave the makes page and return — intentional, most users expect their filter to survive a navigation. The `isMounted` ref in `MakesToolbar` prevents the debounce from overwriting a persisted query on remount.

---

### Component Architecture — 3 Layers

```
Page (server) → Feature components (client) → UI primitives (client)
```

**Server components** (`DashboardPage`, `VehiclesPage`) handle session checks and decide what to render. They ship zero client-side JavaScript.

**Feature components** (`KpiCards`, `MakesTable`, `MakeDetailModal`, etc.) own their data fetching and business logic.

**UI primitives** (`Button`, `Input`, `Select`, `Badge`, `Card`, `Alert`, `Spinner`) are `forwardRef` wrappers with variant maps. They hold no state and no business logic — pure presentation.

**Trade-off:** The primitive layer adds indirection. The benefit is a single place to change focus styles, dark mode tokens, or ARIA attributes across the entire app. Worth it at this scale; for a one-page prototype it would be over-engineering.

---

### Layout — DashboardShell

`layout.tsx` is a server component (zero client JS), but it needs to own `sidebarOpen` state for the mobile drawer, which requires a client component. Solution: `layout.tsx` renders `<DashboardShell>{children}</DashboardShell>` — the entry point stays server-rendered while the shell handles all interactivity.

**Trade-off:** An extra indirection file. The alternative — making `layout.tsx` itself a client component — would prevent server-side data fetching in the layout. Not needed now, but matters if auth-dependent nav items ever need to be server-rendered.

---

### Filtering & Pagination — Client-side

Search, sort, and pagination happen in the browser via TanStack Table, not via API calls. The NHTSA `/GetAllMakes` endpoint returns ~12,000 makes in one response with no server-side search API. TanStack Table's `globalFilterFn: "includesString"` filters the full dataset in memory.

**Trade-off:** The first load fetches the full ~12K-row dataset (~1.5 MB JSON). Subsequent loads are instant (from cache). For a larger or changing dataset, server-side pagination with cursor-based queries would be more appropriate — but that requires an API that supports it.

**Debounce in `MakesToolbar`** — The search input debounces 300ms before writing to Zustand. Without this, every keystroke re-runs TanStack Table's filter across 12K rows synchronously, causing input lag.

---

### Authorization — Two Layers

Role enforcement happens at two independent layers:

1. **Edge (proxy.ts)** — `withAuth` from next-auth runs before any page renders. Unauthenticated users are redirected to `/login`; authenticated viewers hitting `/dashboard` are redirected to `/makes`. Cannot be bypassed by disabling JavaScript.

2. **Server components** — `getServerSession(authOptions)` checks the role in `DashboardPage` and conditionally renders the chart. Even if the Edge redirect were bypassed, the restricted UI wouldn't render.

3. **UI (Sidebar)** — Dashboard nav link is hidden for viewers. This is a UX convenience, not a security boundary — the above two layers are what actually enforce access.

---

### Error Strategy

Two distinct failure modes are handled differently:

- **No cache + API failure** → full error UI (pink alert)
- **Cache exists + refetch failure** → stale data shown with amber warning

`AbortSignal.timeout(10_000)` prevents hung requests from keeping the app in a perpetual fetching state. Without it, a stalled API call never resolves or rejects, so `isFetching` stays `true` indefinitely and the refreshing indicator never clears.

---

## Engineering Notes

**Query keys** — Centralised in `lib/api/nhtsa.ts` as a typed `queryKeys` object. Consistent keys prevent duplicate fetches and make cache invalidation straightforward.

**No prop-drilling** — Zustand stores cross-component state. The search input, table, and modal are siblings; they communicate only through the store.

**Type safety** — `next-auth.d.ts` module augmentation adds `role: UserRole` to `Session["user"]` and `JWT`, eliminating `as any` in every auth-aware component.

**Responsive** — Sidebar hidden below `lg` breakpoint with a mobile hamburger drawer; main content uses adaptive padding (`p-4 sm:p-6`); KPI grid and table reflow on smaller screens.
