'use client';

import { useBookings } from '@/hooks/use-booking';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CustomerDashboard() {
    const { data: bookings } = useBookings('customer');
    const activeBookings = bookings?.filter(b => ['ACCEPTED', 'IN_PROGRESS'].includes(b.status)) || [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Hello!</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6 border border-blue-100 dark:border-blue-900">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Need a service?</h3>
                    <p className="text-blue-700 dark:text-blue-300 mb-4">Find reliable professionals for your next project.</p>
                    <Button asChild>
                        <Link href="/services">Browse Services</Link>
                    </Button>
                </div>
            </div>

            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Active Bookings</h2>
                    <Link href="/bookings" className="text-sm text-blue-600 hover:underline">View all</Link>
                </div>

                {activeBookings.length > 0 ? (
                    <div className="space-y-4">
                        {/* List active bookings here */}
                        <p>You have {activeBookings.length} active bookings.</p>
                    </div>
                ) : (
                    <div className="text-sm text-slate-500">No active bookings at the moment.</div>
                )}
            </div>
        </div>
    );
}
