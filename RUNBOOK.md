# Dotech Technical Runbook

This document details the detected technology stack and the standard commands to run each component.

## 1. Stack Overview

| Component | Technology | Path | Port |
| :--- | :--- | :--- | :--- |
| **Backend** | NestJS (Node.js) + TypeORM | `/backend` | 3000 |
| **Frontend** | Next.js (React) | `/frontend` | 3000/3001 |
| **Database** | PostgreSQL | Docker / Native | 5432 |
| **Cache** | Redis | Docker / Native | 6379 |
| **Mobile (Customer)** | Flutter | `/customer_app` | - |
| **Mobile (Provider)** | Flutter | `/provider_app` | - |
| **Admin Panel** | React (Vite) | `/dotech_admin` | - |

## 2. Run Commands

### Prerequisities
- Node.js v20+
- Docker & Docker Compose OR Native Postgres/Redis
- Flutter SDK (for mobile)

### Quick Start (All-in-One)
```bash
make setup      # Install dependencies & configs
make up         # Start DB & Redis
make db-seed    # Populate demo data
```

### Backend
```bash
cd backend
npm run start:dev
```
*Health Check*: `curl http://localhost:3000/`

### Frontend (Web)
```bash
cd frontend
npm run dev
```

### Mobile Apps (Flutter)
**Important**: Configured to auto-switch URLs based on platform.
- iOS Simulator: `http://localhost:3000`
- Android Emulator: `http://10.0.2.2:3000`

```bash
# Customer App
cd customer_app
flutter pkgs get
flutter run

# Provider App
cd provider_app
flutter pkgs get
flutter run
```

## 3. Environment Configuration
- **Backend**: `.env` (Source: `.env.example`)
- **Frontend**: `.env.local` (Source: `.env.example`)
## 5. CI/CD Assumptions
- **Database**: The existing setup relies on `synchronize: true` in `app.module.ts`. CI environments must wait for the backend to boot (which creates the schema) before running seeds or tests.
- **Service Dependencies**: 
    - Postgres (v15+)
    - Redis (v7+)
- **Environment**: CI jobs should mock `.env` following `.env.example`.
- **Ports**: Tests run against `localhost:3000`.

## 4. Troubleshooting
Run the doctor script to diagnose issues:
```bash
make doctor
```
