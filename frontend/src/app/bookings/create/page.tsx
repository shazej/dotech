'use client';

import { useSearchParams } from 'next/navigation';
import { useService } from '@/hooks/use-service';
import { useCreateBooking } from '@/hooks/use-booking';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

import { Suspense } from 'react';

function CreateBookingContent() {
    const searchParams = useSearchParams();
    const serviceId = searchParams.get('serviceId');

    const { data: service, isLoading: isLoadingService } = useService(serviceId || '');
    const { mutate: createBooking, isPending } = useCreateBooking();

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');

    if (!serviceId) {
        return <div>Invalid Service ID</div>;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !time) return;

        const scheduledDate = new Date(`${date}T${time}`).toISOString();

        createBooking({
            serviceId,
            scheduledDate,
            notes,
        });
    };

    if (isLoadingService) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    if (!service) return <div>Service not found</div>;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Confirm Booking</h1>
                    </div>

                    <div className="p-6">
                        <div className="flex items-start mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            {service.imageUrl && (
                                <img src={service.imageUrl} alt={service.title} className="w-16 h-16 object-cover rounded-md mr-4" />
                            )}
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-slate-50">{service.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">by {service.provider.user.firstName}</p>
                                <div className="mt-1 font-medium text-slate-900 dark:text-slate-50">${service.price}</div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        required
                                        min={format(new Date(), 'yyyy-MM-dd')}
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time">Time</Label>
                                    <Input
                                        id="time"
                                        type="time"
                                        required
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Additional Notes</Label>
                                <textarea
                                    id="notes"
                                    className="flex min-h-[100px] w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent dark:border-slate-700 dark:text-slate-50"
                                    placeholder="Any specific instructions for the provider..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                <Button variant="ghost" asChild>
                                    <Link href={`/services/${serviceId}`}>Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Booking...
                                        </>
                                    ) : (
                                        'Confirm Booking'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function CreateBookingPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <CreateBookingContent />
        </Suspense>
    );
}
