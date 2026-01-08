import { api } from '@/lib/axios';
import { Service, ServiceFilters } from '@/types/service';

export const serviceService = {
    getAll: async (filters?: ServiceFilters): Promise<Service[]> => {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.search) params.append('search', filters.search);

        const { data } = await api.get<Service[]>('/services', { params });
        return data;
    },

    getById: async (id: string): Promise<Service> => {
        const { data } = await api.get<Service>(`/services/${id}`);
        return data;
    },

    create: async (data: Partial<Service>): Promise<Service> => {
        const { data: created } = await api.post<Service>('/services', data);
        return created;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/services/${id}`);
    }
};
