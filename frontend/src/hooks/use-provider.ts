import { useQuery } from '@tanstack/react-query';
import { providerService } from '@/services/provider-service';

export function useProviderStats() {
    return useQuery({
        queryKey: ['provider', 'stats'],
        queryFn: providerService.getStats,
    });
}
