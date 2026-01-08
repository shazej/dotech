import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/auth';
import Cookies from 'js-cookie';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: (user, token) => {
                // Set cookie for middleware/server-side access if needed
                Cookies.set('token', token, { expires: 7 });
                set({ user, token, isAuthenticated: true });
            },
            logout: () => {
                Cookies.remove('token');
                set({ user: null, token: null, isAuthenticated: false });
            },
            updateUser: (user) => set({ user }),
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
            partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
        }
    )
);
