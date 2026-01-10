const axios = require('axios');

const API_URL = 'http://localhost:3000';
const PASSWORD = 'password123';

// --- Helpers ---

async function safePost(url, data, config = {}) {
    try {
        return await axios.post(url, data, config);
    } catch (e) {
        const status = e?.response?.status;
        const body = e?.response?.data;
        return { error: true, status, body, raw: e };
    }
}

async function safeGet(url, config = {}) {
    try {
        return await axios.get(url, config);
    } catch (e) {
        const status = e?.response?.status;
        const body = e?.response?.data;
        return { error: true, status, body, raw: e };
    }
}

async function createOrLoginUser({ baseUrl, email, password, role, phone }) {
    console.log(`\n👤 Processing User: ${email}...`);
    // 1) try register
    const reg = await safePost(`${baseUrl}/auth/register`, { email, password, role, phone });

    // 2) if success or conflict, try login
    if (!reg.error || reg.status === 409 || reg.status === 400) { // 400 often means validation fail (like exists)
        const login = await safePost(`${baseUrl}/auth/login`, { email, password });
        if (!login.error) {
            console.log(`   ✅ Logged in as ${role}`);
            return login.data; // token, user object...
        }

        console.warn(`   ⚠️ User exists but login failed (wrong password?). Skipping.`);
        return null;
    }

    // 3) unknown failure
    console.error(`   ❌ Register failed for ${email}`, reg.status, reg.body);
    return null;
}

// --- Main Seed Function ---

async function seed() {
    try {
        console.log('🌱 Starting Idempotent Seed...');

        // 1. Admin
        const adminAuth = await createOrLoginUser({
            baseUrl: API_URL,
            email: 'admin@dotech.com',
            password: PASSWORD,
            role: 'admin',
            phone: '+999000000'
        });

        const adminToken = adminAuth?.accessToken || adminAuth?.access_token;
        if (!adminToken) console.log('   ⚠️ Skipping Admin steps (no token)');

        // 2. Categories
        const categories = [
            { name: 'Cleaning', desc: 'Home and Office Cleaning' },
            { name: 'Plumbing', desc: 'Pipe repair and installation' },
            { name: 'Electrical', desc: 'Wiring and appliance repair' },
            { name: 'Painting', desc: 'Interior and Exterior painting' },
            { name: 'Moving', desc: 'Relocation assistance' },
            { name: 'Gardening', desc: 'Lawn care and landscaping' }
        ];

        let allCategories = [];
        if (adminToken) {
            console.log('\n📂 Processing Categories...');
            for (const cat of categories) {
                // Try create
                const created = await safePost(`${API_URL}/categories`,
                    { name: cat.name, description: cat.desc },
                    { headers: { Authorization: `Bearer ${adminToken}` } }
                );

                if (!created.error) {
                    console.log(`   ✅ Created: ${cat.name}`);
                } else if (created.status === 409) {
                    console.log(`   ℹ️  Exists: ${cat.name}`);
                } else {
                    console.log(`   ❌ Failed: ${cat.name} (${created.status})`);
                }
            }
            // Fetch all to get IDs
            const getCats = await safeGet(`${API_URL}/categories`);
            if (!getCats.error) allCategories = getCats.data;
        }

        // 3. Providers
        const providers = [
            { name: 'John Cleaner', email: 'provider1@dotech.com', phone: '+999111111', role: 'provider', cat: 'Cleaning' },
            { name: 'Mike Plumber', email: 'provider2@dotech.com', phone: '+999222222', role: 'provider', cat: 'Plumbing' }
        ];

        for (const p of providers) {
            const auth = await createOrLoginUser({
                baseUrl: API_URL,
                email: p.email,
                password: PASSWORD,
                role: 'provider',
                phone: p.phone
            });

            if (auth) {
                const token = auth.accessToken || auth.access_token;
                // Create Service
                const catId = allCategories.find(c => c.name === p.cat)?.id;
                if (catId) {
                    const svcName = `Standard ${p.cat}`;
                    // Naive check if service exists? Or just try create and ignore error
                    const createdSvc = await safePost(`${API_URL}/services`, {
                        name: svcName,
                        description: `Professional ${p.cat} service`,
                        price: 50,
                        durationMinutes: 60,
                        categoryId: catId
                    }, { headers: { Authorization: `Bearer ${token}` } });

                    if (!createdSvc.error) console.log(`   ➕ Service created: ${svcName}`);
                    else if (createdSvc.status !== 409) console.log(`   ⚠️ Service creation issue: ${createdSvc.status}`);
                }
            }
        }

        // 4. Customer
        const customerAuth = await createOrLoginUser({
            baseUrl: API_URL,
            email: 'customer1@dotech.com',
            password: PASSWORD,
            role: 'customer',
            phone: '+999333333'
        });

        // 5. Booking
        if (customerAuth) {
            const token = customerAuth.accessToken || customerAuth.access_token;
            // Get a service
            const servicesRes = await safeGet(`${API_URL}/services`);
            if (!servicesRes.error && servicesRes.data.length > 0) {
                const svc = servicesRes.data[0];
                console.log(`\n📅 Creating Booking for ${svc.name}...`);
                const booking = await safePost(`${API_URL}/bookings`, {
                    serviceId: svc.id,
                    providerId: svc.providerId,
                    scheduledAt: new Date(Date.now() + 86400000).toISOString()
                }, { headers: { Authorization: `Bearer ${token}` } });

                if (!booking.error) console.log('   ✅ Booking Created (Pending)');
                else console.log(`   ⚠️ Booking creation skipped or failed (${booking.status})`);
            }
        }

        console.log('\n🎉 Idempotent Seed Complete!');
        console.log('Creds: admin@dotech.com, customer1@dotech.com, provider1@dotech.com (All: password123)');

    } catch (e) {
        console.error('❌ FATAL SEED ERROR:', e.message);
        process.exit(1);
    }
}

seed();
