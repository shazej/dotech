const { Client } = require('pg');

async function resetDb() {
    console.log('🧹 Resetting Database...');
    const client = new Client({
        user: 'shazej',
        host: 'localhost',
        database: 'dotech',
        password: 'shazej',
        port: 5432,
    });

    try {
        await client.connect();
        // Truncate all tables with cascade
        await client.query(`
            DO $$ DECLARE
                r RECORD;
            BEGIN
                FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                    EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
                END LOOP;
            END $$;
        `);
        console.log('✅ Database Cleared!');
    } catch (err) {
        console.error('❌ Error resetting DB:', err.message);
    } finally {
        await client.end();
    }
}

resetDb();
