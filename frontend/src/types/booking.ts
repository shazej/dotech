import { Service } from './service';
import { User } from './auth';

export type BookingStatus = 'REQUESTED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';

export interface Booking {
    id: string;
    serviceId: string;
    service: Service;
    customerId: string;
    customer: User;
    providerId: string;
    provider: User;
    status: BookingStatus;
    scheduledDate: string; // ISO Status
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBookingDto {
    serviceId: string;
    scheduledDate: string;
    notes?: string;
}
