const { exec } = require('child_process');

const COLORS = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

function log(msg, color = COLORS.reset) {
    console.log(`${color}${msg}${COLORS.reset}`);
}

function check(name, command, expectedOutputRegex = null) {
    return new Promise((resolve) => {
        process.stdout.write(`Checking ${name}... `);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                log('❌ FAILED', COLORS.red);
                resolve(false);
                return;
            }
            if (expectedOutputRegex && !expectedOutputRegex.test(stdout)) {
                log('❌ FAILED (Output mismatch)', COLORS.red);
                resolve(false);
                return;
            }
            log('✅ OK', COLORS.green);
            resolve(true);
        });
    });
}

function checkPort(port) {
    return new Promise((resolve) => {
        process.stdout.write(`Checking Port ${port}... `);
        exec(`lsof -i :${port}`, (error) => {
            if (!error) {
                log('✅ Active', COLORS.green);
                resolve(true);
            } else {
                log('❌ Not Listening', COLORS.red);
                resolve(false);
            }
        });
    });
}

async function run() {
    log('--- Dotech Environment Doctor ---\n', COLORS.cyan);

    const redisPort = await checkPort(6379);
    const dbPort = await checkPort(5432);

    // Detailed Health Check
    process.stdout.write(`Checking Backend Health Details... `);
    exec('curl -s http://localhost:3000/health/details', (error, stdout) => {
        if (error) {
            log('❌ FAILED (Network)', COLORS.red);
            logSummary(redisPort, dbPort, false);
            return;
        }

        try {
            const health = JSON.parse(stdout);
            if (health.api === 'ok' && health.db?.ok) {
                log('✅ ALL SYSTEMS GO', COLORS.green);
                console.log(JSON.stringify(health, null, 2));
                logSummary(redisPort, dbPort, true);
            } else {
                log('❌ FAILED (Application Error)', COLORS.red);
                console.log(JSON.stringify(health, null, 2));
                logSummary(redisPort, dbPort, false);
            }
        } catch (e) {
            log('❌ FAILED (Invalid JSON - Backend booting?)', COLORS.red);
            logSummary(redisPort, dbPort, false);
        }
    });

}

function logSummary(redisPort, dbPort, backendHealthy) {
    console.log('\n--- Mobile Platform URLs ---');
    console.log(`
| Platform          | Base URL                  |
|:----------------- |:------------------------- |
| iOS Simulator     | http://localhost:3000     |
| Android Emulator  | http://10.0.2.2:3000      |
| Physical Device   | http://<LAN_IP>:3000      |
    `);

    log('\n--- Summary ---', COLORS.cyan);
    if (redisPort && dbPort && backendHealthy) {
        log('🎉 System appears healthy!', COLORS.green);
        process.exit(0);
    } else {
        log('⚠️ System has issues. Check the failure logs above.', COLORS.yellow);
        if (!redisPort) log('  - Redis is down. Run: make up or brew services start redis');
        if (!dbPort) log('  - Postgres is down. Run: make up or brew services start postgresql');
        if (!backendHealthy) log('  - Backend not responding or DB check failed. Run: make dev-backend');
        process.exit(1);
    }
}

run();
