"use client";

import { useQuery } from '@tanstack/react-query';
import { getProviderAppointments } from '@/lib/api/appointments';
import { AppointmentCalendar } from '@/features/appointments/components/AppointmentCalendar';
import { AppointmentList } from '@/features/appointments/components/AppointmentList';
import { useState } from 'react';
import { LayoutList, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProviderAppointmentsPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

    const { data: appointments, isLoading } = useQuery({
        queryKey: ['provider-appointments'],
        queryFn: getProviderAppointments,
    });

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    const handleSelectAppointment = (apt: any) => {
        router.push(`/provider/appointments/${apt.id}`);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Appointments</h1>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`p-2 rounded-md flex items-center gap-2 ${viewMode === 'calendar' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                    >
                        <CalendarIcon className="w-4 h-4" />
                        Calendar
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md flex items-center gap-2 ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                    >
                        <LayoutList className="w-4 h-4" />
                        List
                    </button>
                </div>
            </div>

            {viewMode === 'calendar' ? (
                <AppointmentCalendar
                    appointments={appointments || []}
                    onSelectEvent={handleSelectAppointment}
                />
            ) : (
                <AppointmentList
                    appointments={appointments || []}
                    onSelectEvent={handleSelectAppointment}
                />
            )}
        </div>
    );
}
