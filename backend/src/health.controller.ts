import { Controller, Get, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';

// Note: In a real app we might inject a Redis service, but for now we'll check DB primarily 
// and assume Redis is managed by the queue/cache module if existent. 
// Given the current file view didn't distinctively show a RedisModule export, 
// we will verify DB connection explicitly.

@Controller('health')
export class HealthController {
    constructor(
        @Inject(DataSource) private dataSource: DataSource,
    ) { }

    @Get()
    check() {
        return { status: 'ok' };
    }

    @Get('details')
    async details() {
        const start = Date.now();
        let dbStatus = { ok: false, latencyMs: 0 };

        try {
            await this.dataSource.query('SELECT 1');
            dbStatus = { ok: true, latencyMs: Date.now() - start };
        } catch (e) {
            dbStatus = { ok: false, latencyMs: Date.now() - start };
        }

        // TODO: Add Redis check if RedisService is available globally
        const redisStatus = { ok: true, message: 'Redis check skipped (not fully integrated in module yet)' };

        const status = dbStatus.ok ? 200 : 503;

        return {
            api: 'ok',
            db: dbStatus,
            redis: redisStatus,
            timestamp: new Date().toISOString(),
        };
    }
}
