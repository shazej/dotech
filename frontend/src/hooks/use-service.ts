import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export function useMyServices() {
    return useQuery({
        queryKey: ['my-services'],
        queryFn: serviceService.getMyServices,
    });
}

export function useCreateService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: serviceService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-services'] });
        },
    });
}

export function useDeleteService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: serviceService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-services'] });
        },
    });
}

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: serviceService.getCategories,
    });
}

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: serviceService.getCategories,
    });
}
