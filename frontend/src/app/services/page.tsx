'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useServices } from '@/hooks/use-service';
import { ServiceCard } from '@/components/features/service-card';
import { Header } from '@/components/layout/header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Footer } from '@/components/layout/footer';

function ServiceListing() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || undefined;

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const { data: services, isLoading, error } = useServices({
        category: initialCategory,
        search: debouncedSearch,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setDebouncedSearch(search);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            <Header />

            <main className="container mx-auto px-4 py-8 flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                            {initialCategory ? `${initialCategory} Services` : 'All Services'}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Browse and book top-rated professionals
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="flex w-full md:w-auto max-w-sm items-center space-x-2">
                        <Input
                            placeholder="Search services..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white dark:bg-slate-900"
                        />
                        <Button type="submit" size="icon">
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>
                </div>

                {isLoading ? (
                    <div className="text-center py-20">Loading services...</div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">Failed to load services. Please try again later.</div>
                ) : services?.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50">No services found</h3>
                        <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {services?.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default function ServicesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ServiceListing />
        </Suspense>
    );
}
