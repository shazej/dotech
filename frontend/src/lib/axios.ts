import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false, // headers-based auth does not need this, and it breaks CORS with wildcard origin
});

api.interceptors.request.use(
    (config) => {
        // Attempt to get token from cookies or localStorage
        // Adjust key name based on your auth implementation
        const token = Cookies.get('token') || localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Global error handling, e.g. redirect on 401
        if (error.response?.status === 401) {
            // Clear auth state if needed
            // window.location.href = '/login'; 
            // Better to handle this in auth hook/store to prevent loops
        }
        return Promise.reject(error);
    }
);
