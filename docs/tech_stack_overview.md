# Dotech Project – Complete Tech Stack Overview

| Layer | Technology | Role / Why It’s Used |
|-------|------------|----------------------|
| **Backend API** | **NestJS (Node.js + TypeScript)** | Structured, modular server‑side framework with built‑in dependency injection, decorators, and powerful validation. TypeScript gives static typing and IDE support. |
| | **SQLite (via TypeORM)** | Lightweight, file‑based relational DB that works out‑of‑the‑box for local development and simple deployments. |
| | **JWT (JSON Web Tokens)** | Stateless authentication for the mobile and web clients. Tokens are signed with a secret and sent in the `Authorization: Bearer <token>` header. |
| | **dotenv** | Loads environment variables from `.env` (e.g., DB path, JWT secret, API keys). |
| | **ESLint + Prettier** | Enforces code style and catches common bugs early. |
| | **Nest CLI & Scripts** | `npm run start:dev`, `npm run build`, etc., for development, production builds, and migrations. |
| **Admin Panel (Web UI)** | **React + Vite** | Fast, modern front‑end framework with hot‑module replacement. Vite provides an ultra‑quick dev server and optimized builds. |
| | **Tailwind CSS** | Utility‑first CSS for rapid, consistent styling without writing custom CSS files. |
| | **Axios** | HTTP client for calling the NestJS API, with an interceptor that injects the JWT token. |
| | **React Query (TanStack Query)** | Handles data fetching, caching, and background refetching in a declarative way. |
| | **React Hook Form + Zod** | Form state management with schema validation (Zod) for type‑safe, performant forms. |
| | **React Router** | Client‑side routing for the admin dashboard pages. |
| **Customer Mobile App** | **Flutter (Dart)** | Cross‑platform native UI for iOS & Android, sharing a single codebase. |
| | **Provider App (also Flutter)** | Same stack as the customer app, but with role‑specific screens and flows. |
| | **Firebase (Auth, Firestore, Cloud Messaging)** | Handles push notifications, optional real‑time data sync, and easy auth integration for OTP / phone login. |
| | **Dio (Dart HTTP client)** | Mirrors Axios on the web side; interceptors add the JWT token to every request. |
| **Shared UI/UX Design** | **Google Fonts (Inter, Roboto, Outfit)** | Modern, readable typefaces used across web and mobile. |
| | **Glassmorphism / Dark‑mode theming** | Visual polish – gradients, translucency, and dark‑mode support for a premium look. |
| **Containerization / DevOps** | **Docker Compose** | Spins up the NestJS API, SQLite volume, and any auxiliary services (e.g., Redis, if added later) with a single command. |
| | **Makefile** | Convenience shortcuts for common tasks (`make dev`, `make lint`, `make test`, `make seed`). |
| | **Git** | Source control with conventional‑commit style history. |
| **Testing** | **Jest (backend)** | Unit & integration tests for NestJS services, controllers, and guards. |
| | **Flutter test / integration_test** | Automated UI and unit tests for the mobile apps. |
| **Documentation** | **Markdown files (README, SETUP_GUIDE, RUNBOOK, DEMO, SECURITY)** | Human‑readable docs for onboarding, security policies, and demo scripts. |
| | **GitHub Actions** (optional) | Would run lint, test, build, and optionally push Docker images on each PR. |

### How the Pieces Fit Together

1. **API ↔️ Clients** – The NestJS API exposes REST endpoints (`/auth`, `/bookings`, `/services`, etc.). Both the React admin panel and the Flutter mobile apps call these endpoints via Axios/Dio, automatically attaching the JWT token for authentication.
2. **State Management** –
   *Web*: React Query caches API responses, providing stale‑while‑revalidate behavior and automatic refetch on focus.
   *Mobile*: Provider‑level state is kept in Riverpod/Provider (Flutter) with similar caching patterns.
3. **Styling & UX** – Tailwind CSS powers the web UI, while Flutter’s built‑in theming (with custom `ThemeData`) mirrors the same color palette, fonts, and glass‑morphism effects, ensuring a consistent brand experience across platforms.
4. **Development Workflow** – `docker-compose up` starts the backend (NestJS) and mounts the SQLite DB. Running `npm run dev` launches the Vite dev server for the admin UI. `flutter run` launches the mobile apps on a connected device or emulator. The Makefile aggregates these commands for a one‑liner (`make start-all`).
5. **Security** – Sensitive values live in `.env` (excluded from Git via `.gitignore`). JWT secrets are rotated via environment variables. The `SECURITY.md` outlines best practices (CORS, rate limiting, input validation).
6. **Extensibility** – Because NestJS uses modules, adding new features (e.g., payments, analytics) is as simple as creating a new module and exposing its services. The same pattern is mirrored in the React and Flutter codebases, making the stack highly maintainable.

---

**In short:** the project combines a **TypeScript‑centric backend (NestJS + SQLite + JWT)**, a **React‑Vite web admin panel styled with Tailwind**, and **Flutter mobile apps (customer & provider) using Firebase for push & OTP**, all orchestrated via **Docker Compose** and managed with **Makefile scripts**. This stack delivers a modern, performant, and visually polished full‑stack solution that can be developed quickly on macOS and deployed to any cloud environment.
