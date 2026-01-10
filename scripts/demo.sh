#!/bin/bash
set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Starting Demo Run..."

# 1. Start Infrastructure
echo "\n📦 Starting Infrastructure (make up)..."
make up

# 2. Start Backend in Background
echo "\n🔌 Starting Backend..."
cd backend
npm run start:dev > backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo "   Backend PID: $BACKEND_PID"
echo "   Waiting for Backend to be healthy..."

# Wait loop
MAX_RETRIES=30
for i in $(seq 1 $MAX_RETRIES); do
    if curl -s http://localhost:3000/health/details | grep "ok" > /dev/null; then
        echo -e "${GREEN}✅ Backend is UP!${NC}"
        break
    fi
    if [ $i -eq $MAX_RETRIES ]; then
        echo -e "${RED}❌ Backend failed to start in time.${NC}"
        kill $BACKEND_PID || true
        exit 1
    fi
    printf "."
    sleep 2
done

# 3. Seed Data
echo "\n🌱 Seeding Data..."
if make db-seed; then
    echo -e "${GREEN}✅ Data Seeded${NC}"
else
    echo -e "${RED}❌ Seeding Failed${NC}"
    kill $BACKEND_PID || true
    exit 1
fi

# 4. Smoke Tests
echo "\n💨 Running Smoke Tests..."
if make test-smoke; then
    echo -e "${GREEN}✅ Smoke Tests Passed${NC}"
else
    echo -e "${RED}❌ Smoke Tests Failed${NC}"
    kill $BACKEND_PID || true
    exit 1
fi

echo "\n✨ DEMO RUN SUCCESSFUL"
echo "   Backend is still running (PID $BACKEND_PID)."
echo "   Press Ctrl+C to stop it, or run 'kill $BACKEND_PID' manually."

# Keep alive or exit?
# For CI/Verification, we might want to exit. 
# For "Run & Show", keeping it alive is nice.
# But since this is a script, if I exit, the PID might persist (good) or I should wait.
wait $BACKEND_PID
