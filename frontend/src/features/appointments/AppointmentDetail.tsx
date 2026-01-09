"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAppointmentById, updateAppointmentStatus } from '@/lib/api/appointments';
import { AppointmentTimeline } from './components/AppointmentTimeline';
import { Loader2, MapPin, Calendar, Check, X, Ban, RefreshCw, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AppointmentDetailPageProps {
    id: string;
    isProvider: boolean;
}

export default function AppointmentDetailPage({ id, isProvider }: AppointmentDetailPageProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [rejectReason, setRejectReason] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);

    const { data: appointment, isLoading } = useQuery({
        queryKey: ['appointment', id],
        queryFn: () => getAppointmentById(id),
    });

    const statusMutation = useMutation({
        mutationFn: (vars: { status: any, reason?: string }) => updateAppointmentStatus(id, vars.status, vars.reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointment', id] });
            setIsRejecting(false);
        },
    });

    if (isLoading || !appointment) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Appointment #{appointment.id}</h1>
                    <div className="flex items-center gap-4 text-gray-600">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {appointment.date} at {appointment.time}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase
              ${appointment.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : ''}
              ${appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
              ${appointment.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
              ${appointment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : ''}
            `}>
                            {appointment.status}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                        <h3 className="font-semibold text-lg">Details</h3>

                        {appointment.location && (
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                                <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                                <div>
                                    <div className="font-medium">Location</div>
                                    <div className="text-gray-600 text-sm">{appointment.location.address}</div>
                                </div>
                            </div>
                        )}

                        {appointment.notes && (
                            <div className="p-3 bg-blue-50 text-blue-900 rounded text-sm">
                                <strong>Notes:</strong> {appointment.notes}
                            </div>
                        )}

                        {appointment.rejectionReason && (
                            <div className="p-3 bg-red-50 text-red-900 rounded text-sm">
                                <strong>Rejection Reason:</strong> {appointment.rejectionReason}
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <AppointmentTimeline
                            status={appointment.status}
                            createdAt={appointment.createdAt}
                            updatedAt={appointment.updatedAt}
                        />
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-4">
                    {/* Actions for Provider */}
                    {isProvider && appointment.status === 'PENDING' && (
                        <div className="bg-white p-4 rounded-lg shadow-sm border space-y-3">
                            <h3 className="font-semibold">Actions</h3>

                            {!isRejecting ? (
                                <>
                                    <button
                                        onClick={() => statusMutation.mutate({ status: 'ACCEPTED' })}
                                        disabled={statusMutation.isPending}
                                        className="w-full flex justify-center items-center gap-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
                                    >
                                        <Check className="w-4 h-4" /> Accept
                                    </button>
                                    <button
                                        onClick={() => setIsRejecting(true)}
                                        className="w-full flex justify-center items-center gap-2 bg-red-100 text-red-700 py-2 rounded hover:bg-red-200"
                                    >
                                        <X className="w-4 h-4" /> Reject
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-2 animate-in fade-in">
                                    <textarea
                                        className="w-full border rounded p-2 text-sm"
                                        placeholder="Reason for rejection..."
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIsRejecting(false)}
                                            className="flex-1 bg-gray-200 text-gray-700 py-1 rounded text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => statusMutation.mutate({ status: 'REJECTED', reason: rejectReason })}
                                            disabled={!rejectReason}
                                            className="flex-1 bg-red-600 text-white py-1 rounded text-sm disabled:opacity-50"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions for Customer */}
                    {!isProvider && appointment.status === 'PENDING' && (
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <button
                                onClick={() => statusMutation.mutate({ status: 'CANCELLED', reason: 'Customer requested cancellation' })}
                                className="w-full flex justify-center items-center gap-2 border border-red-300 text-red-700 py-2 rounded hover:bg-red-50"
                            >
                                <Ban className="w-4 h-4" /> Cancel Request
                            </button>
                        </div>
                    )}

                    {/* General Actions */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border space-y-2">
                        <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded text-sm text-gray-700">
                            <Phone className="w-4 h-4" /> Call {isProvider ? 'Customer' : 'Provider'}
                        </button>
                        <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded text-sm text-gray-700">
                            <Mail className="w-4 h-4" /> Email {isProvider ? 'Customer' : 'Provider'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
