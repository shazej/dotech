'use client';

import { useParams, useRouter } from 'next/navigation';
import { useBooking, useUpdateBookingStatus } from '@/hooks/use-booking';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Loader2, Calendar, Clock, MapPin, User as UserIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { BookingStatus } from '@/types/booking';

const statusSteps: BookingStatus[] = ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'];

export default function ProviderBookingDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: booking, isLoading } = useBooking(id);
    const { mutate: updateStatus, isPending: isUpdating } = useUpdateBookingStatus();

    if (isLoading) return <div className="h-full flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>;
    if (!booking) return <div className="h-full flex justify-center items-center">Booking not found</div>;

    // Actions specific to provider
    const renderActions = () => {
        if (booking.status === 'REQUESTED') {
            return (
                <div className="space-x-4">
                    <Button variant="destructive" onClick={() => updateStatus({ id, status: 'REJECTED' })} disabled={isUpdating}>Reject</Button>
                    <Button onClick={() => updateStatus({ id, status: 'ACCEPTED' })} disabled={isUpdating}>Accept Booking</Button>
                </div>
            );
        }
        if (booking.status === 'ACCEPTED') {
            return <Button onClick={() => updateStatus({ id, status: 'IN_PROGRESS' })} disabled={isUpdating}>Start Service</Button>;
        }
        if (booking.status === 'IN_PROGRESS') {
            return <Button onClick={() => updateStatus({ id, status: 'COMPLETED' })} disabled={isUpdating}>Complete Service</Button>;
        }
        return null;
    };

    const getStepStatus = (step: BookingStatus) => {
        const currentIndex = statusSteps.indexOf(booking.status as BookingStatus);
        const stepIndex = statusSteps.indexOf(step);

        if (booking.status === 'CANCELLED' || booking.status === 'REJECTED') return 'bg-gray-200 text-gray-400';
        if (stepIndex < currentIndex) return 'bg-green-500 text-white';
        if (stepIndex === currentIndex) return 'bg-blue-600 text-white ring-4 ring-blue-100';
        return 'bg-slate-200 dark:bg-slate-700 text-slate-400';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/bookings">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Booking Details</h1>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white border border-slate-200 shadow-sm ml-auto">{booking.status}</span>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Booking Info Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                        <h2 className="text-xl font-bold mb-4">{booking.service.title}</h2>

                        <div className="grid sm:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                                <div className="flex items-center text-slate-600 dark:text-slate-300">
                                    <Calendar className="h-5 w-5 mr-3 text-slate-400" />
                                    <span>{format(new Date(booking.scheduledDate), 'EEEE, MMM d, yyyy')}</span>
                                </div>
                                <div className="flex items-center text-slate-600 dark:text-slate-300">
                                    <Clock className="h-5 w-5 mr-3 text-slate-400" />
                                    <span>{format(new Date(booking.scheduledDate), 'h:mm a')}</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center text-slate-600 dark:text-slate-300">
                                    <UserIcon className="h-5 w-5 mr-3 text-slate-400" />
                                    <span>Customer: {booking.customer.firstName} {booking.customer.lastName}</span>
                                </div>
                                <div className="flex items-center text-slate-600 dark:text-slate-300">
                                    <MapPin className="h-5 w-5 mr-3 text-slate-400" />
                                    <span>Remote / On-site</span>
                                </div>
                            </div>
                        </div>

                        {booking.notes && (
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-50 mb-1">Notes</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300">{booking.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Lifecycle Tracker */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 hidden md:block">
                        <h3 className="font-semibold mb-6">Booking Status</h3>
                        <div className="relative flex justify-between">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 -z-0" />
                            {statusSteps.map((step, idx) => (
                                <div key={step} className="relative z-10 flex flex-col items-center bg-white dark:bg-slate-900 px-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${getStepStatus(step)}`}>
                                        {idx + 1}
                                    </div>
                                    <span className="text-xs font-medium mt-2 text-slate-600 dark:text-slate-400">{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Actions Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="font-semibold mb-4">Actions</h3>
                        <div className="flex flex-col gap-3">
                            {renderActions()}
                            {!renderActions() && <p className="text-sm text-slate-500">No actions available at this stage.</p>}
                        </div>
                    </div>

                    {/* Price Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="font-semibold mb-4">Payment Summary</h3>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-600">Service total</span>
                            <span className="font-medium">${booking.service.price}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4 text-sm text-slate-500">
                            <span>Taxes & Fees</span>
                            <span>$5.00</span>
                        </div>
                        <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
                            <span>Total</span>
                            <span>${booking.service.price + 5}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
