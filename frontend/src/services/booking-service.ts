import { api } from '@/lib/axios';
import { Booking, CreateBookingDto, BookingStatus } from '@/types/booking';

export const bookingService = {
    create: async (data: CreateBookingDto): Promise<Booking> => {
        const { data: booking } = await api.post<Booking>('/bookings', data);
        return booking;
    },

    getAll: async (role: 'customer' | 'provider'): Promise<Booking[]> => {
        // Backend likely filters by logged in user, but role param might be needed depending on API design
        const { data } = await api.get<Booking[]>('/bookings');
        return data;
    },

    getById: async (id: string): Promise<Booking> => {
        const { data } = await api.get<Booking>(`/bookings/${id}`);
        return data;
    },

    updateStatus: async (id: string, status: BookingStatus): Promise<Booking> => {
        const { data } = await api.patch<Booking>(`/bookings/${id}/status`, { status });
        return data;
    }
};
