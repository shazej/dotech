# Mac Local Development Setup Guide - Dotech

This guide provides a complete, copy-paste setup for running the Dotech platform (NestJS Codebase + Next.js Frontend) locally on macOS.

---

## 1. Prerequisites & Tools Installation

### 1.1 Homebrew (Package Manager)
Check if installed:
```bash
brew --version
```
If not installed, run:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 1.2 Node.js & Package Manager
We use `nvm` (Node Version Manager) to pin the Node version.
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell config
source ~/.zshrc

# Install Node LTS (v20 recommended for NestJS 11/Next 14+)
nvm install 20
nvm use 20
nvm alias default 20

# Install pnpm (Preferred)
npm install -g pnpm
```

### 1.3 Docker Desktop
Required for running Postgres and Redis easily.
1. Download for Mac (Apple Silicon or Intel) from [Docker Hub](https://www.docker.com/products/docker-desktop/).
2. Install and Start Docker Desktop.
3. specific Verification: `docker info`

---

## 2. Project Setup (One-Time)

### 2.1 Clone & Dependencies
(Assuming repo is cloned to `~/Documents/alwaleed/dotech`)

```bash
cd ~/Documents/alwaleed/dotech

# Use the provided Makefile to setup all dependencies and env files
make setup
```
*This command runs `npm install` in backend/frontend and creates `.env` files from templates.*

### 2.2 Configure Environment Variables
You must edit the generated `.env` files with real keys.

**Backend (`backend/.env`):**
- `JWT_SECRET`: Set to a secure random string for local dev.
- `DB_...`: Defaults are set for Docker (user: postgres, pass: postgres).

**Frontend (`frontend/.env.local`):**
- **CRITICAL**: You need Firebase keys (`NEXT_PUBLIC_FIREBASE_API_KEY`, etc.). Obtain these from the Firebase Console -> Project Settings.

### 2.3 **CRITICAL**: Enable Postgres in Backend
The current codebase defaults to SQLite. To use Dockerized Postgres, you must modify `backend/src/app.module.ts`.

1. Open `backend/src/app.module.ts`.
2. Find line ~23: `const useSqlite = true;`
3. Change it to:
   ```typescript
   // const useSqlite = true; 
   const useSqlite = process.env.DB_TYPE === 'sqlite'; // driven by .env
   ```
4. Ensure your `backend/.env` has `DB_TYPE=postgres`.

---

## 3. Daily Development Workflow

### 3.1 Start Infrastructure (Database & Redis)
Start the backing services using Docker Compose:
```bash
make up
```
*Verifies ports 5432 (Postgres) and 6379 (Redis) are ready.*

### 3.2 Start Applications
Open two new terminal tabs.

**Tab 1: Backend**
```bash
make dev-backend
```
*Output should show: `Nest application successfully started` on port 3000.*

**Tab 2: Frontend**
```bash
make dev-frontend
```
*Runs Next.js on port 3000 (proxy) or 3001. Check output.*

### 3.3 Database Seeding (Optional)
Once the backend is running and the database is connected, you can seed initial data (Categories, etc.):
```bash
make db-seed
```
*Note: This script requires the backend to be running on http://localhost:3000.*

### 3.4 Mobile Apps Setup (Flutter)
The repository includes `customer_app` and `provider_app`.

1. **Install Dependencies**:
   ```bash
   make mobile-setup
   ```

2. **Configure API Endpoint (Important)**:
   The apps currently point to a hardcoded IP. You MUST update this to match your local setup.
   
   **File paths to edit**:
   - `customer_app/lib/injection_container/injection_container.dart` (line ~68)
   - `provider_app/lib/injection_container/injection_container.dart` (line ~72)

   **What to set `baseUrl` to**:
   - **iOS Simulator**: `http://localhost:3000`
   - **Android Emulator**: `http://10.0.2.2:3000`
   - **Physical Device**: `http://YOUR_MAC_LAN_IP:3000` (e.g., `http://192.168.1.5:3000`)

3. **Run**:
   ```bash
   cd customer_app
   flutter run
   ```

---

## 4. Verification Checklist

1. **Services Check**:
   ```bash
   docker ps
   # Should see dotech-postgres and dotech-redis (Health: healthy)
   ```

2. **Backend Health**:
   ```bash
   curl http://localhost:3000/
   # Should return Hello World or similar (if configured)
   ```

3. **Database Connection**:
   Check logs in Backend tab. If you see `[TypeOrmModule] dependencies initialized`, DB is connected.

---

## 5. Troubleshooting

### "Address already in use" (Port 3000/5432)
Check what's using the port:
```bash
make check-ports
```
Kill the process (e.g., PID 1234):
```bash
kill -9 1234
```

### Database Connection Failed
- Ensure `make up` was run.
- Check `backend/.env` matches `docker-compose.yml` credentials.
- **Apple Silicon**: If Docker fails, try enabling "Use Rosetta for x86/amd64 emulation" in Docker Settings, though `postgres:15-alpine` supports ARM native.

### "No such file or directory" for .env
Run `make setup` again to recreate them from examples.

### Frontend "Firebase error"
Ensure `frontend/.env.local` has valid keys. The app will panic if these are missing.
