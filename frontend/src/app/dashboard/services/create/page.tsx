'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { serviceService } from '@/services/service-service';
import { useCategories } from '@/hooks/use-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';

interface CreateServiceForm {
    title: string;
    description: string;
    price: number;
    duration: number;
    categoryId: string; // Simplified, assuming list or ID
}

export default function CreateServicePage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const { data: categories, isLoading: isLoadingCategories } = useCategories();

    const { register, handleSubmit, formState: { errors } } = useForm<CreateServiceForm>();

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateServiceForm) => {
            // Mock converting to expected payload. 
            // In real app, IDs would be managed properly.
            // Here we might need to mock the category object or send ID
            return serviceService.create({
                ...data,
                // We might need to inject provider info if backend doesn't take it from token
                // but usually backend takes it from token.
            } as unknown as any);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            router.push('/dashboard/services');
        }
    });

    const onSubmit = (data: CreateServiceForm) => {
        // Convert strings to numbers
        mutate({
            ...data,
            price: Number(data.price),
            duration: Number(data.duration)
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/dashboard/services" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-6">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to My Services
            </Link>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-50">Create New Service</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Service Title</Label>
                        <Input id="title" placeholder="e.g. Detailed Home Cleaning" {...register('title', { required: 'Title is required' })} />
                        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                            id="category"
                            className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent dark:border-slate-700 dark:text-slate-50"
                            {...register('categoryId', { required: 'Category is required' })}
                        >
                            <option value="">Select a category</option>
                            {categories?.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            className="flex min-h-[100px] w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent dark:border-slate-700 dark:text-slate-50"
                            placeholder="Describe what's included..."
                            {...register('description', { required: 'Description is required' })}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input id="price" type="number" step="0.01" {...register('price', { required: 'Price is required', min: 0 })} />
                            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input id="duration" type="number" {...register('duration', { required: 'Duration is required', min: 1 })} />
                            {errors.duration && <p className="text-sm text-red-500">{errors.duration.message}</p>}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" disabled={isPending} className="w-full md:w-auto">
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : 'Publish Service'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
