import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { BookingAttachment } from './entities/booking-attachment.entity';
import { BookingExtraCharge } from './entities/booking-extra-charge.entity';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Booking, BookingAttachment, BookingExtraCharge]),
        NotificationsModule,
    ],
    controllers: [BookingsController],
    providers: [BookingsService],
    exports: [TypeOrmModule],
})
export class BookingsModule { }
