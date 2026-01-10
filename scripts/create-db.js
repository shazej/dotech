const { Client } = require('pg');

async function createDb() {
    console.log('🐘 Connecting to Postgres default DB...');
    const client = new Client({
        user: 'shazej',
        host: 'localhost',
        database: 'postgres', // Connect to default
        password: 'shazej',
        port: 5432,
    });

    try {
        await client.connect();

        // Check availability
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname='dotech'");
        if (res.rowCount > 0) {
            console.log('✅ Database "dotech" already exists.');
        } else {
            console.log('Creating database "dotech"...');
            await client.query('CREATE DATABASE dotech');
            console.log('✅ Database "dotech" created!');
        }
    } catch (err) {
        console.error('❌ Error creating DB:', err.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

createDb();
