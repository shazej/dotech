import { apiClient } from './client';
import { BusinessHours } from './contracts/types';

export const getBusinessHours = async (): Promise<BusinessHours> => {
    const response = await apiClient.get<BusinessHours>('/business-hours');
    return response.data;
};

export const updateBusinessHours = async (data: Partial<BusinessHours>): Promise<BusinessHours> => {
    const response = await apiClient.post<BusinessHours>('/business-hours', data);
    return response.data;
};
