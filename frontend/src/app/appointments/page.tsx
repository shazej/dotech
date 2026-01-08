"use client";

import { useQuery } from '@tanstack/react-query';
import { getCustomerAppointments } from '@/lib/api/appointments';
import { AppointmentList } from '@/features/appointments/components/AppointmentList';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CustomerAppointmentsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled' | 'rejected'>('upcoming');
    const { data: appointments, isLoading } = useQuery({
        queryKey: ['customer-appointments'],
        queryFn: getCustomerAppointments,
    });

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    const filteredAppointments = appointments?.filter(apt => {
        if (activeTab === 'upcoming') return apt.status === 'PENDING' || apt.status === 'ACCEPTED';
        if (activeTab === 'completed') return apt.status === 'COMPLETED';
        if (activeTab === 'cancelled') return apt.status === 'CANCELLED';
        if (activeTab === 'rejected') return apt.status === 'REJECTED';
        return false;
    }) || [];

    const handleSelectAppointment = (apt: any) => {
        router.push(`/appointments/${apt.id}`);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">My Appointments</h1>

            <div className="flex border-b overflow-x-auto">
                {['upcoming', 'completed', 'cancelled', 'rejected'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 font-medium capitalize whitespace-nowrap ${activeTab === tab
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <AppointmentList
                appointments={filteredAppointments}
                onSelectEvent={handleSelectAppointment}
            />
        </div>
    );
}
