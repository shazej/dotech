'use client';

import { useMyServices, useDeleteService } from '@/hooks/use-service';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function MyServicesPage() {
    const { data: myServices = [], isLoading } = useMyServices();
    const { mutate: deleteService } = useDeleteService();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">My Services</h1>
                    <p className="text-slate-500">Manage the services you offer to customers.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/services/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Service
                    </Link>
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-slate-500">Loading services...</div>
                ) : myServices.length === 0 ? (
                    <div className="p-12 text-center">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50">No services created yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">Start earning by creating your first service listing.</p>
                        <Button asChild>
                            <Link href="/dashboard/services/create">Create Service</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-3">Service Title</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Duration</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myServices.map((service) => (
                                    <tr key={service.id} className="bg-white border-b dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-50">
                                            {service.title}
                                        </td>
                                        <td className="px-6 py-4">
                                            {service.category.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            ${service.price}
                                        </td>
                                        <td className="px-6 py-4">
                                            {service.duration} mins
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4 text-slate-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this service?')) {
                                                        deleteService(service.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
