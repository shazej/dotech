import { apiClient } from './client';

export interface Provider {
    id: string;
    name: string;
    avatarUrl?: string;
    category: string;
    rating: number;
    reviewCount: number;
    hourlyRate: number;
    location: {
        lat: number;
        lng: number;
        address: string;
        city: string;
    };
    tags: string[];
    isVerified: boolean;
    distance?: number; // Calculated by backend if coordinates provided
    bio?: string;
    phone?: string;
    email?: string;
}

export interface ProviderSearchParams {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    lat?: number;
    lng?: number;
    radius?: number; // in km
    sortBy?: 'rating' | 'price_asc' | 'price_desc' | 'distance';
    page?: number;
}

export const searchProviders = async (params: ProviderSearchParams): Promise<{ data: Provider[], total: number }> => {
    const response = await apiClient.get<{ data: Provider[], total: number }>('/providers', { params });
    return response.data;
};

export const getProviderById = async (id: string): Promise<Provider> => {
    const response = await apiClient.get<Provider>(`/providers/${id}`);
    return response.data;
};

export const getFeaturedProviders = async (): Promise<Provider[]> => {
    const response = await apiClient.get<Provider[]>('/providers/featured');
    return response.data;
};
