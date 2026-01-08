import { api } from '@/lib/axios';
import { AuthResponse, User } from '@/types/auth';

export const authService = {
    login: async (credentials: any): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/auth/login', credentials);
        return data;
    },

    register: async (details: any): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/auth/register', details);
        return data;
    },

    getMe: async (): Promise<User> => {
        const { data } = await api.get<User>('/auth/me');
        return data;
    },

    logout: async () => {
        // Optional: Call functionality on backend to invalidate token
        // await api.post('/auth/logout');
    },
};
