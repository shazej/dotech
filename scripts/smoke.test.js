const axios = require('axios');

const API_URL = 'http://localhost:3000';
const DEMO_USER = 'customer1@dotech.com';
const DEMO_PASS = 'password123';

const COLORS = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
};

function log(msg, color = COLORS.reset) {
    console.log(`${color}${msg}${COLORS.reset}`);
}

async function runSmokeTest() {
    console.log('💨 Starting Smoke Tests...');
    let failed = false;

    // 1. Health Check
    try {
        const health = await axios.get(`${API_URL}/health/details`);
        if (health.data.api === 'ok') log('✅ Health Check Passed', COLORS.green);
        else throw new Error('Health API not returning OK');
    } catch (e) {
        log(`❌ Health Check Failed: ${e.message}`, COLORS.red);
        failed = true;
    }

    // 2. Auth Flow (Customer)
    let token = '';
    try {
        const res = await axios.post(`${API_URL}/auth/login`, {
            email: DEMO_USER,
            password: DEMO_PASS
        });
        token = res.data.accessToken || res.data.access_token;
        if (token) log('✅ Auth Login Passed', COLORS.green);
        else throw new Error('No token received');
    } catch (e) {
        log(`❌ Auth Login Failed: ${e.message}`, COLORS.red);
        failed = true;
    }

    // 3. Protected Route (Get Profile/Me)
    if (token) {
        try {
            // Adjust endpoint if /users/me or /auth/me
            // Assuming /auth/me or similar based on typical NestJS + Passport
            // If strictly unknown, we'd skip, but let's try /health (public) or /categories (often public)
            // But we want to test AUTO guard.
            // Let's try listing bookings which should be protected.
            await axios.get(`${API_URL}/bookings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            log('✅ Protected Route (Bookings) Passed', COLORS.green);
        } catch (e) {
            log(`❌ Protected Route Failed: ${e.message}`, COLORS.red);
            failed = true;
        }
    }

    if (failed) {
        console.error('💥 Smoke Tests Failed');
        process.exit(1);
    } else {
        console.log('✨ All Smoke Tests Passed');
    }
}

runSmokeTest();
