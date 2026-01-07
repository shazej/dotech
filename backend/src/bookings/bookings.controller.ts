import { Controller, Post, Get, Body, Param, Patch, Request, UseGuards, ParseEnumPipe } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingStatus } from './entities/booking.entity';

// Mock AuthGuard for now, simply extraction userId from body or header is risky without real auth, 
// using a placeholder decorator or assuming middleware adds 'user' to request.
// In a real app we would use @UseGuards(JwtAuthGuard)
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class MockAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        // Simulate auth: pass 'x-user-id' header
        request.user = { id: request.headers['x-user-id'] };
        // return !!request.user.id;
        return true; // Open for now to ease testing
    }
}

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post()
    async create(@Request() req: any, @Body() createBookingDto: any) {
        // Assume req.user.id is populated by AuthGuard
        const userId = req.headers['x-user-id'] || 'test-customer-id';
        return this.bookingsService.create(userId, createBookingDto);
    }

    @Patch(':id/accept')
    async accept(@Request() req: any, @Param('id') id: string) {
        const userId = req.headers['x-user-id'] || 'test-provider-id';
        return this.bookingsService.accept(id, userId);
    }

    @Patch(':id/status')
    async updateStatus(
        @Request() req: any,
        @Param('id') id: string,
        @Body('status', new ParseEnumPipe(BookingStatus)) status: BookingStatus
    ) {
        const userId = req.headers['x-user-id'] || 'test-user-id';
        return this.bookingsService.updateStatus(id, userId, status);
    }
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(id);
    }
}
