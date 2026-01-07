import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { Service } from '../services/entities/service.entity';
import { ProviderProfile } from '../users/entities/provider-profile.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        private dataSource: DataSource,
    ) { }

    async create(customerId: string, createBookingDto: { providerId: string; serviceId: string; scheduledAt: string }) {
        return this.dataSource.transaction(async (manager) => {
            // 1. Validate Provider
            const provider = await manager.findOne(Provider, {
                where: { userId: createBookingDto.providerId },
                relations: ['user']
            });
            if (!provider || provider.verifiedStatus !== ProviderStatus.VERIFIED) {
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

            return manager.save(booking);
        });
    }

    async accept(bookingId: string, providerId: string) {
        return this.dataSource.transaction(async (manager) => {
            const booking = await manager.findOne(Booking, { where: { id: bookingId } });
            if (!booking) throw new NotFoundException('Booking not found');

            if (booking.providerId !== providerId) {
                throw new BadRequestException('You are not the provider for this booking');
            }

            if (booking.status !== BookingStatus.PENDING) {
                throw new BadRequestException(`Cannot accept booking in ${booking.status} state`);
            }

            booking.status = BookingStatus.ACCEPTED;
            return manager.save(booking);
        });
    }

    async updateStatus(bookingId: string, userId: string, newStatus: BookingStatus) {
        return this.dataSource.transaction(async (manager) => {
            const booking = await manager.findOne(Booking, { where: { id: bookingId } });
            if (!booking) throw new NotFoundException('Booking not found');

            // Simple authorization check (should be more robust in real app via Guards)
            if (booking.providerId !== userId && booking.customerId !== userId) {
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
            }

            return manager.save(booking);
        });
    }
}
