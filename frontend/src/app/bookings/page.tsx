'use client';

import { useBookings } from '@/hooks/use-booking';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { format } from 'date-fns';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { BookingStatus } from '@/types/booking';

const statusColors: Record<BookingStatus, string> = {
    REQUESTED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    ACCEPTED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    IN_PROGRESS: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function BookingsPage() {
    const { data: bookings, isLoading } = useBookings('customer'); // Default to customer role for now

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-6">My Bookings</h1>

                {isLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>
                ) : bookings?.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50">No bookings yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">Book your first service today</p>
                        <Link href="/services" className="text-blue-600 hover:underline">Browse Services</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings?.map((booking) => (
                            <Link
                                key={booking.id}
                                href={`/bookings/${booking.id}`}
                                className="block bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                                            {booking.service.title[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-slate-50">{booking.service.title}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {format(new Date(booking.scheduledDate), 'MMM d, yyyy h:mm a')}
                                            </p>
                                            <p className="text-sm text-slate-500 mt-1">Provider: {booking.provider.firstName}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <span className={clsx("text-xs font-semibold px-2 py-1 rounded-full", statusColors[booking.status])}>
                                            {booking.status.replace('_', ' ')}
                                        </span>
                                        <span className="font-medium text-slate-900 dark:text-slate-50">${booking.service.price}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
