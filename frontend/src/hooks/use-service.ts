import { useQuery } from '@tanstack/react-query';
import { serviceService } from '@/services/service-service';
import { ServiceFilters } from '@/types/service';

export function useServices(filters?: ServiceFilters) {
    return useQuery({
        queryKey: ['services', filters],
        queryFn: () => serviceService.getAll(filters),
    });
}

export function useService(id: string) {
    return useQuery({
        queryKey: ['service', id],
        queryFn: () => serviceService.getById(id),
        enabled: !!id,
    });
}
