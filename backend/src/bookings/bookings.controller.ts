import { Controller, Post, Get, Body, Param, Patch, Request, UseGuards, ParseEnumPipe } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingStatus } from './entities/booking.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAll(@Request() req: any) {
        return this.bookingsService.findAll();
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(@Request() req: any, @Body() createBookingDto: any) {
        return this.bookingsService.create(req.user.id, createBookingDto);
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
