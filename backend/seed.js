const axios = require('axios');

const API_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'admin@dotech.com';
const ADMIN_PASSWORD = 'admin123';

async function seed() {
    try {
        console.log('🌱 Seeding database...');

        // 1. Login as Admin
        let token;
        try {
            console.log('Attempting login...');
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
            });
            // Handle both accessToken and access_token just in case
            token = loginRes.data.accessToken || loginRes.data.access_token;
            console.log('✅ Logged in as Admin');
        } catch (e) {
            console.error('❌ Login failed:', e.response?.data || e.message);
            return;
        }

        if (!token) {
            console.error('❌ Could not get access token from response. Aborting seed.');
            return;
        }

        // 2. Create Categories
        const categories = ['Cleaning', 'Plumbing', 'Electrical', 'Painting', 'Moving'];
        for (const cat of categories) {
            try {
                await axios.post(
                    `${API_URL}/categories`,
                    { name: cat, description: `${cat} services` },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log(`✅ Created category: ${cat}`);
            } catch (e) {
                // If 409 Conflict or similar, it means it already exists, which is fine.
                console.log(`⚠️ Failed to create category ${cat}: ${e.response?.data?.message || e.message}`);
            }
        }

        console.log('✅ Seeding completed!');

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    }
}

seed();
