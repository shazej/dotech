import { api } from '@/lib/axios';
import { ProviderStats } from '@/types/provider';

export const providerService = {
    getStats: async (): Promise<ProviderStats> => {
        // This endpoint needs to be implemented on backend. 
        // For now we might not have it, so we can mock it here if backend isn't ready,
        // but assuming the plan is to connect to real API:
        const { data } = await api.get<ProviderStats>('/provider/stats');
        return data;
    }
};
