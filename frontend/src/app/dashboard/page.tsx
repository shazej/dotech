'use client';

import { useAuthStore } from '@/store/auth-store';
import ProviderDashboard from '@/components/features/provider-dashboard';
import CustomerDashboard from '@/components/features/customer-dashboard';

export default function DashboardPage() {
    const { user } = useAuthStore();

    if (!user) return null;

    if (user.role === 'PROVIDER') {
        return <ProviderDashboard />;
    }

    return <CustomerDashboard />;
}
