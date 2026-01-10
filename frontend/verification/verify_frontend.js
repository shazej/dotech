const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ARGS = process.argv.slice(2);
const PORT = ARGS.find(a => a.startsWith('--port='))?.split('=')[1] || '3001';
const BASE_URL = `http://localhost:${PORT}`;
const REPORT_DIR = path.join(__dirname, 'reports');

// Ensure report directory exists
if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
}

const REPORT_FILE = path.join(REPORT_DIR, 'verification_report.txt');
const LOG_STREAM = fs.createWriteStream(REPORT_FILE, { flags: 'w' });

function log(msg) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${msg}`;
    console.log(line);
    LOG_STREAM.write(line + '\n');
}

async function captureScreenshot(page, name) {
    await page.screenshot({ path: path.join(REPORT_DIR, `${name}.png`) });
    log(`Screenshot saved: ${name}.png`);
}

(async () => {
    log(`Starting Frontend Verification on ${BASE_URL}`);
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Capture network requests
    await page.setRequestInterception(true);
    page.on('request', request => {
        // Continue all requests
        request.continue();
    });

    // Capture console logs
    page.on('console', msg => log(`BROWSER CONSOLE: ${msg.type().toUpperCase()} ${msg.text()}`));

    page.on('response', async response => {
        const url = response.url();
        const headers = response.request().headers();

        // We care about backend API calls
        if (url.includes('localhost:3000')) {
            const method = response.request().method();
            const status = response.status();
            log(`API CALL: ${method} ${url} [${status}]`);

            // Log Authorization header if present
            if (headers['authorization']) {
                log(`  > Authorization Header: Present (Bearer ${headers['authorization'].split(' ')[1].substring(0, 10)}...)`);
            } else {
                log(`  > Authorization Header: MISSING`);
            }

            try {
                if (headers['content-type']?.includes('application/json')) {
                    const postData = response.request().postData();
                    if (postData) log(`  > Payload: ${postData}`);
                }
                if (response.headers()['content-type']?.includes('application/json')) {
                    const json = await response.json();
                    // Avoid logging massive lists, just summary or keys
                    log(`  > Response: ${JSON.stringify(json).substring(0, 500)}`);
                }
            } catch (e) {
                log(`  > Could not parse body: ${e.message}`);
            }
        }
    });

    try {
        // 1. Health Check
        log(`--- PHASE 1: REACHABILITY ---`);
        await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
        const title = await page.title();
        log(`Page Title: ${title}`);
        await captureScreenshot(page, '01_homepage');

        // 2. Auth Flow
        log(`--- PHASE 2: AUTH VERIFICATION ---`);
        await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
        await captureScreenshot(page, '02_login_page');

        // Fill form
        const email = 'admin@dotech.com'; // Try seeded admin first
        const password = 'password123'; // Common seed password
        // Make these robust selectors based on what we saw in the file (id="email", id="password")
        await page.type('#email', email);
        await page.type('#password', password);

        log(`Attempting login with ${email}...`);
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(e => log('No navigation after login click (might be SPA routing)')),
        ]);

        await new Promise(r => setTimeout(r, 2000)); // Wait for SPA processing
        await captureScreenshot(page, '03_after_login');

        // Check LocalStorage for token
        const token = await page.evaluate(() => {
            // Try common storage keys
            return localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('auth-storage');
        });

        if (token) {
            log(`PASS: Token found in LocalStorage: ${token.substring(0, 20)}...`);
        } else {
            log(`FAIL: No token found in LocalStorage keys (token, accessToken, auth-storage). Checking cookies...`);
            const cookies = await page.cookies();
            const authCookie = cookies.find(c => c.name.includes('token') || c.name.includes('auth'));
            if (authCookie) {
                log(`PASS: Token found in Cookie: ${authCookie.name}`);
            } else {
                log(`FAIL: No token found in LocalStorage or Cookies.`);
            }
        }

        // 3. Protected Route
        log(`--- PHASE 3: PROTECTED ROUTE /bookings ---`);
        // Navigate explicitly to bookings to trigger fetch
        await page.goto(`${BASE_URL}/dashboard/bookings`, { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 3000));
        await captureScreenshot(page, '04_bookings_page');

        // Check if we were redirected back to login
        const currentUrl = page.url();
        if (currentUrl.includes('/login')) {
            log(`FAIL: Redirected to login when accessing ${BASE_URL}/dashboard/bookings`);
        } else {
            log(`PASS: Stayed on ${currentUrl}`);
        }

        // 4. Services Listing (Public or Private)
        log(`--- PHASE 4: SERVICES LISTING ---`);
        await page.goto(`${BASE_URL}/dashboard/services`, { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 2000));
        await captureScreenshot(page, '05_services_page');


    } catch (error) {
        log(`ERROR: ${error.message}`);
        process.exit(1);
    } finally {
        log(`Verification Complete. Report saved to ${REPORT_FILE}`);
        LOG_STREAM.end();
        await browser.close();
    }
})();
