import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth-service';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';

export function useLogin() {
    const login = useAuthStore((state) => state.login);
    const router = useRouter();

    return useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            login(data.user, data.accessToken);
            router.push('/dashboard'); // Default redirect
        },
    });
}

export function useRegister() {
    const login = useAuthStore((state) => state.login);
    const router = useRouter();

    return useMutation({
        mutationFn: authService.register,
        onSuccess: (data) => {
            login(data.user, data.accessToken);
            router.push('/dashboard');
        },
    });
}

export function useUser() {
    const { user, isAuthenticated, login, logout } = useAuthStore();

    // Example of syncing server state with client store
    return useQuery({
        queryKey: ['me'],
        queryFn: authService.getMe,
        enabled: !!isAuthenticated && !user, // Only fetch if authenticated but user data missing (e.g. refresh)
        retry: false,
    });
}
