import { apiClient } from './client';
import { Appointment } from './contracts/types';

export const getProviderAppointments = async (): Promise<Appointment[]> => {
    const response = await apiClient.get<Appointment[]>('/appointments/provider');
    return response.data;
};

export const getCustomerAppointments = async (): Promise<Appointment[]> => {
    const response = await apiClient.get<Appointment[]>('/appointments');
    return response.data;
};

export const getAppointmentById = async (id: string): Promise<Appointment> => {
    const response = await apiClient.get<Appointment>(`/appointments/${id}`);
    return response.data;
};

export const updateAppointmentStatus = async (id: string, status: Appointment['status'], reason?: string): Promise<Appointment> => {
    const payload: any = { status };
    if (status === 'REJECTED') payload.rejectionReason = reason;
    if (status === 'CANCELLED') payload.cancellationReason = reason;

    const response = await apiClient.patch<Appointment>(`/appointments/${id}/status`, payload);
    return response.data;
};
