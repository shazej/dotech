# Dotech Frontend

## Project Overview
Dotech is a professional service marketplace application connecting customers with service providers. 
This repository contains the frontend application built with Next.js 14 and TailwindCSS.

## Folder Structure
- `src/app`: Next.js App Router pages and layouts.
  - `(auth)`: Grouped authentication routes (Login, Register).
  - `dashboard`: Protected dashboard routes for Customers and Providers.
  - `bookings`: Booking management flow.
  - `services`: Public service listings.
  - `page.tsx`: Landing page.
- `src/components`: Reusable UI components.
  - `ui`: Primitive components (Buttons, Inputs, Cards).
  - `features`: Feature-specific components (ServiceCards, Dashboard widgets).
  - `layout`: Global layout components (Header, Footer).
- `src/lib`: Utilities, API clients, and constants.
  - `axios.ts`: Configured Axios client with interceptors.
  - `react-query-provider.tsx`: TanStack Query configuration.
- `src/hooks`: Custom React hooks for data fetching (useAuth, useService, useBooking).
- `src/services`: API service layers for creating HTTP requests.
- `src/store`: Global state management (Zustand) for Authentication.
- `src/types`: TypeScript interfaces for domain objects (User, Service, Booking).

## Authentication Flow
1. **Login/Register**: Forms submit to backend via `auth-service.ts`.
2. **Token Storage**: JWT token is stored in Cookies/LocalStorage via Zustand `auth-store`.
3. **Middleware**: `middleware.ts` intercepts requests at the edge. If a token is missing for a protected route (`/dashboard`), it redirects to `/login`.
4. **Role Based Access**: `useAuthStore` holds the `User` object including `role` ('CUSTOMER' or 'PROVIDER'). UI adapts based on this role (e.g. Header links, Dashboard view).

## Role-Based Routing
- `/dashboard`: Routes to `ProviderDashboard` or `CustomerDashboard` based on the user's role.
- `/dashboard/services`: Accessible only to Providers (UI strictly enforces this, backend should too).

## Booking Lifecycle
Strict adherence to the following state machine:
`REQUESTED` -> `ACCEPTED` -> `IN_PROGRESS` -> `COMPLETED`
or `REQUESTED` -> `REJECTED` / `CANCELLED`

- **Customer**: Can `CANCEL` a booking if it is `REQUESTED` or `ACCEPTED`.
- **Provider**: Can `ACCEPT` or `REJECT` a `REQUESTED` booking. Can `Start` (`IN_PROGRESS`) and `Complete` (`COMPLETED`) a booking.
This logic is encapsulated in `BookingDetailsPage` (`src/app/bookings/[id]/page.tsx`).

## Connecting to Backend
The application expects a REST API running at `http://localhost:3000` (configurable via `.env.local`).
The `src/lib/axios.ts` client automatically attaches the `Authorization: Bearer <token>` header to all requests if a user is logged in.

## Environment Variables
Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Deployment Steps
1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

## Development
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or port 3001 if backend is on 3000) to view it in the browser.
