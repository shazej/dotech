import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { Service } from '../services/entities/service.entity';
import { ProviderProfile } from '../users/entities/provider-profile.entity';
import { User } from '../users/entities/user.entity';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        private dataSource: DataSource,
        private notificationsService: NotificationsService,
    ) { }

    async create(customerId: string, createBookingDto: { providerId: string; serviceId: string; scheduledAt: string }) {
        return this.dataSource.transaction(async (manager) => {
            // 1. Validate Provider
            const provider = await manager.findOne(ProviderProfile, {
                where: { id: createBookingDto.providerId },
                relations: ['user']
            });
            if (!provider || !provider.isVerified) {
                // In a real app we would check verifiedStatus, but assuming isVerified bool for now logic from User module
                throw new BadRequestException('Provider not available or verified');
            }

            // 2. Validate Service
            const service = await manager.findOne(Service, { where: { id: createBookingDto.serviceId } });
            if (!service || service.providerId !== createBookingDto.providerId) {
                throw new BadRequestException('Service not found or does not belong to provider');
            }

            // 3. Create Booking with Snapshot
            const booking = manager.create(Booking, {
                customerId,
                providerId: createBookingDto.providerId,
                scheduledAt: new Date(createBookingDto.scheduledAt),
                status: BookingStatus.PENDING,
                serviceSnapshot: {
                    serviceId: service.id,
                    name: service.name,
                    price: service.price,
                    durationMinutes: service.durationMinutes,
                },
            });

            const savedBooking = await manager.save(booking);

            // Notify Provider
            this.notificationsService.notifyUser(
                provider.userId,
                'New Booking Request',
                `You have a new booking request for ${service.name}`,
                { type: 'BOOKING_CREATED', bookingId: savedBooking.id }
            );

            return savedBooking;
        });
    }

    async accept(bookingId: string, userId: string) {
        return this.dataSource.transaction(async (manager) => {
            const booking = await manager.findOne(Booking, {
                where: { id: bookingId },
                relations: ['provider', 'customer']
            });
            if (!booking) throw new NotFoundException('Booking not found');

            if (booking.provider.userId !== userId) {
                throw new BadRequestException('You are not the provider for this booking');
            }

            if (booking.status !== BookingStatus.PENDING) {
                throw new BadRequestException(`Cannot accept booking in ${booking.status} state`);
            }

            booking.status = BookingStatus.ACCEPTED;
            const savedBooking = await manager.save(booking);

            // Notify Customer
            this.notificationsService.notifyUser(
                booking.customerId,
                'Booking Accepted',
                `Your booking for ${booking.serviceSnapshot.name} has been accepted`,
                { type: 'BOOKING_ACCEPTED', bookingId: savedBooking.id }
            );

            return savedBooking;
        });
    }

    async updateStatus(bookingId: string, userId: string, newStatus: BookingStatus) {
        return this.dataSource.transaction(async (manager) => {
            const booking = await manager.findOne(Booking, {
                where: { id: bookingId },
                relations: ['provider', 'customer']
            });
            if (!booking) throw new NotFoundException('Booking not found');

            // Simple authorization check (should be more robust in real app via Guards)
            // Note: need to check userId against either provider.userId or customerId
            // For now assuming userId passed is the user's ID
            if (booking.provider?.userId !== userId && booking.customerId !== userId) {
                // Check if the user is the provider owner
                if (booking.provider?.userId !== userId)
                    throw new BadRequestException('Not authorized to modify this booking');
            }

            // State Machine Transitions
            const validTransitions: Record<BookingStatus, BookingStatus[]> = {
                [BookingStatus.PENDING]: [BookingStatus.ACCEPTED, BookingStatus.REJECTED, BookingStatus.CANCELLED_BY_CUSTOMER],
                [BookingStatus.ACCEPTED]: [BookingStatus.ARRIVED, BookingStatus.CANCELLED_BY_CUSTOMER, BookingStatus.CANCELLED_BY_PROVIDER],
                [BookingStatus.ARRIVED]: [BookingStatus.STARTED, BookingStatus.CANCELLED_BY_CUSTOMER, BookingStatus.CANCELLED_BY_PROVIDER],
                [BookingStatus.STARTED]: [BookingStatus.COMPLETED],
                [BookingStatus.COMPLETED]: [],
                [BookingStatus.CANCELLED_BY_CUSTOMER]: [],
                [BookingStatus.CANCELLED_BY_PROVIDER]: [],
                [BookingStatus.REJECTED]: [],
                [BookingStatus.TIMEOUT]: [],
            };

            const allowed = validTransitions[booking.status];
            if (!allowed || !allowed.includes(newStatus)) {
                throw new BadRequestException(`Invalid transition from ${booking.status} to ${newStatus}`);
            }

            booking.status = newStatus;

            if (newStatus === BookingStatus.COMPLETED) {
                booking.completedAt = new Date();
                // Notify Customer
                this.notificationsService.notifyUser(
                    booking.customerId,
                    'Booking Completed',
                    `Your booking has been completed`,
                    { type: 'BOOKING_COMPLETED', bookingId: booking.id }
                );
            } else if (newStatus === BookingStatus.REJECTED) {
                this.notificationsService.notifyUser(
                    booking.customerId,
                    'Booking Rejected',
                    `Your booking was rejected by the provider`,
                    { type: 'BOOKING_REJECTED', bookingId: booking.id }
                );
            }

            return manager.save(booking);
        });
    }

    async findAll() {
        return this.bookingsRepository.find({
            relations: ['provider', 'customer'],
        });
    }

    async findOne(id: string) {
        return this.bookingsRepository.findOne({
            where: { id },
            relations: ['provider', 'customer', 'attachments', 'extraCharges'],
        });
    }
}
