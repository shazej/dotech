import axios from 'axios';
import Cookies from 'js-cookie';

const isMocksEnabled = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

if (isMocksEnabled && typeof window !== 'undefined') {
    import('./mocks/adapter').then(({ setupMocks }) => {
        setupMocks(apiClient);
    });
}
