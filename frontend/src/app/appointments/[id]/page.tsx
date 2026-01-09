"use client";
import AppointmentDetailPage from '@/features/appointments/AppointmentDetail';
import { useParams } from 'next/navigation';

export default function Page() {
    const params = useParams();
    return <AppointmentDetailPage id={params.id as string} isProvider={false} />;
}
