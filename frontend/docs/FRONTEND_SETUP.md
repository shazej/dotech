# Frontend Setup & Verification

## Quick Start
1. **Install Dependencies**: `npm install`
2. **Setup Env**: Copy `.env.example` to `.env.local`
3. **Run**: `npm run dev` (Runs on http://localhost:3001 if 3000 is taken by backend)

## Environment Variables
Required in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_USE_MOCKS=false
```

## Backend Integration Rules (CRITICAL)
- **Auth**: Uses JWT Bearer tokens attached to `Authorization` header.
- **CORS via Axios**: Do **NOT** enable `withCredentials: true` in `src/lib/axios.ts`. 
  - The backend uses a wildcard `*` origin for development convenience.
  - Setting `withCredentials: true` will cause CORS Preflight failures.
  - Authentication relies on the `Authorization` header, not browser cookies.

## Verification
A Puppeteer-based verification script is available to test the integration (Login -> Token -> Protected Route).

**Run Verification:**
```bash
# Install Puppeteer (if not present)
npm install -D puppeteer

# Run Script (auto-detects port or defaults to 3001)
node verification/verify_frontend.js --port=3001
```

**Success Criteria:**
- Script exits with `0`.
- Report in `verification/reports/verification_report.txt` shows `PASS` for Auth and Protected Routes.
