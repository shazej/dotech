'use client';

import { useBookings } from '@/hooks/use-booking';
import { format } from 'date-fns';
import Link from 'next/link';
import { Loader2, Calendar, Clock, User, DollarSign } from 'lucide-react';
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

export default function DashboardBookingsPage() {
    const { data: bookings, isLoading } = useBookings('provider');

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Manage Bookings</h1>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
            ) : bookings?.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50">No bookings yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">Your appointments will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings?.map((booking) => (
                        <Link
                            key={booking.id}
                            href={`/dashboard/bookings/${booking.id}`}
                            className="block bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold shrink-0">
                                        {booking.service.title[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-50">{booking.service.title}</h3>
                                        <div className="flex flex-col space-y-1 mt-1">
                                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {format(new Date(booking.scheduledDate), 'MMM d, yyyy')}
                                                <Clock className="h-3 w-3 ml-3 mr-1" />
                                                {format(new Date(booking.scheduledDate), 'h:mm a')}
                                            </div>
                                            <div className="flex items-center text-sm text-slate-500">
                                                <User className="h-3 w-3 mr-1" />
                                                Customer: {booking.customer.firstName} {booking.customer.lastName}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between space-y-2">
                                    <span className={clsx("text-xs font-semibold px-2 py-1 rounded-full", statusColors[booking.status])}>
                                        {booking.status.replace('_', ' ')}
                                    </span>
                                    <div className="flex items-center font-medium text-slate-900 dark:text-slate-50">
                                        <DollarSign className="h-3 w-3 mr-1" />
                                        {booking.service.price}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
