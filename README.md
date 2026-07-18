# Terrifying Tees

A full-stack e-commerce storefront for a streetwear t-shirt brand — near-black horror aesthetic, blood-red accents, film grain. Built to feel premium and a little unsettling, and to sell tees while doing it.

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | Next.js (Pages Router) · React · Tailwind CSS |
| Motion | Framer Motion · GSAP ScrollTrigger · Lenis smooth scroll |
| 3D | three.js · React Three Fiber · Drei |
| Backend | NestJS · Prisma ORM |
| Database | PostgreSQL |
| Infra | Docker Compose · Nginx reverse proxy |

## Features

**Storefront**
- Product catalog, product detail pages, cart, and checkout wired to the NestJS API
- Guest cart in localStorage that merges into the backend cart on login
- JWT auth (access + refresh) with profile, addresses, and password reset flows
- Slide-out cart drawer with quantity steppers, animated subtotal, and focus trapping
- Quick-add on product cards: inline size chips, no page navigation

**Design & motion**
- Dark design system: `#0A0A0A` base, off-white ink, blood-red `#B91C1C` accent used with restraint (CTAs, badges, tags, marquee, selected states)
- Distressed display type (Rubik Dirt) over a clean Inter body, hairline borders, film grain + vignette overlay sitewide
- Draggable 3D shirt hero under a single moody spotlight with drifting smoke motes
- GSAP-pinned scroll stories: a 3-stage camera fly-through of the shirt, and a horizontal "New drops" rail (scroll-snap fallback on mobile)
- Masked line-by-line headline reveals with an optional dying-bulb flicker variant
- TV-static page transitions, glitch image swaps on product cards, magnetic CTAs, marquee strip
- Reduced-motion support across every animation; offscreen WebGL canvases pause rendering

## Project structure

```
terrifying-tees/
├── frontend/          # Next.js app (src/pages, src/components, src/context)
├── backend/           # NestJS API + Prisma schema (prisma/)
├── nginx/             # Reverse proxy config for the Docker stack
└── docker-compose.yml # nginx + frontend + backend with healthchecks
```

## Getting started

### Prerequisites

- Node.js 20+
- A running PostgreSQL instance
- Docker (only for the containerized setup)

### 1. Configure environment

```bash
# backend/.env  (see backend/.env.example)
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/terrifying_tees
JWT_SECRET=...
JWT_EXPIRES_IN=...
JWT_REFRESH_SECRET=...

# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### 2. Install and run (development)

```bash
npm run install:all   # installs backend, frontend, and root deps
npx prisma migrate dev --schema backend/prisma/schema.prisma
npm run dev           # runs backend and frontend concurrently
```

Frontend: http://localhost:3000 · API: http://localhost:3001/api/v1

### 3. Or run the full stack with Docker

```bash
docker compose up --build
```

Nginx serves everything on http://localhost (port 80), proxying to the frontend and backend containers. All three services expose healthchecks.

## Scripts

| Command | Where | What it does |
| --- | --- | --- |
| `npm run dev` | root | Backend + frontend concurrently |
| `npm run install:all` | root | Install all workspace dependencies |
| `npm run dev` | frontend/ | Next.js dev server |
| `npm run build` | frontend/ | Production build |
| `npm run dev` | backend/ | NestJS in watch mode |
| `npm run start:prod` | backend/ | Run compiled API from `dist/` |

## Notes

- The 3D hero renders a placeholder shirt mesh until a real model is provided — drop a `.glb` at `frontend/public/models/shirt.glb` and pass `modelUrl` to the hero/scroll components.
- Product card hover swaps (glitch transition) activate once products carry a second `hoverImageUrl` image.
- The cart's `size` is stored client-side per product until a `size` column is added to the backend `CartItem` model (see the note in `frontend/src/context/CartContext.js`).
