# RUN_AND_SHOW.md (Final Handoff)

## Finalize Local Environment Fixes — Local Dev is Healthy

### What was broken
- **backend/.env** was nearly empty (missing DB config), causing Postgres connection failures.
- **Redis** was missing/not running, blocking queues/sessions/background tasks.

### What I changed (Evidence)
- Installed Redis via Homebrew and started the daemon.
- Populated `backend/.env` with the correct, tested values:
  - DB user: `shazej`
  - DB name: `dotech`
- Ensured database `dotech` exists.

---

## Verification (Run + Show)

### 1) Redis Health
**Command**:
```bash
redis-cli ping
```

- **Good**: Output `PONG`
- **Bad**: `Could not connect to Redis...`
  - **Fix**:
    ```bash
    brew services start redis
    # or
    redis-server
    ```

---

### 2) Postgres Health (without pg_isready)
*If pg_isready is not found, verify with psql directly.*

**Command**:
```bash
psql -U shazej -d dotech -c "SELECT 1;"
```

- **Good**: Returns a table with `1`
- **Bad**: 
  - `FATAL: database "dotech" does not exist`
    - **Fix**: `createdb -U shazej dotech`
  - `FATAL: role "shazej" does not exist`
    - **Fix**: `createuser -s shazej`

---

### 3) Backend config sanity check
**Command**:
```bash
cat backend/.env | sed -n '1,120p'
```

- **Good**: Contains DB + Redis config keys (host, port, user, password if used, db name, redis url/host/port)
- **Bad**: Empty or missing DB keys → backend will fail to boot.

---

### 4) Backend boot + API health
**Command**:
```bash
cd backend
npm run start:dev
```

- **Good**: Logs show successful DB connection and Redis connection. No “ECONNREFUSED” for Postgres/Redis.
- **Bad**: Connection refused → Postgres/Redis not running or wrong env values.

**Optional HTTP check (if you have a health route):**
```bash
curl -i http://localhost:3000/health
```
- **Good**: HTTP 200
- **Bad**: 404 means no route; use any known endpoint instead (e.g., `/auth/me` after login)

---

## Final Step (Required)

Because `.env` changed, the running backend process **must be restarted**.

**Do this**:
1. Stop backend: `Ctrl + C`
2. Start again:
   ```bash
   cd backend
   npm run start:dev
   ```

3. Then seed:
   ```bash
   make db-seed
   ```

✅ **After restart + seed, the backend should connect successfully to both Postgres and Redis.**

---

### Notes about pg_isready missing on macOS
If you still want `pg_isready`, it’s often installed but not in PATH. Try:
```bash
which pg_isready
```
If empty, locate it:
```bash
find /opt/homebrew -name pg_isready 2>/dev/null | head
```
Then run using the full path, or add the Postgres bin directory to PATH.
