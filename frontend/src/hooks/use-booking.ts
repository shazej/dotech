import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/booking-service';
import { CreateBookingDto, BookingStatus } from '@/types/booking';
import { useRouter } from 'next/navigation';

export function useBookings(role: 'customer' | 'provider' = 'customer') {
    return useQuery({
        queryKey: ['bookings', role],
        queryFn: () => bookingService.getAll(role),
    });
}

export function useBooking(id: string) {
    return useQuery({
        queryKey: ['booking', id],
        queryFn: () => bookingService.getById(id),
        enabled: !!id,
    });
}

export function useCreateBooking() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: bookingService.create,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            router.push(`/bookings/${data.id}`);
        },
    });
}

export function useUpdateBookingStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
            bookingService.updateStatus(id, status),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['booking', data.id] });
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
}
