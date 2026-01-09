"use client";

import { useQuery } from '@tanstack/react-query';
import { searchProviders } from '@/lib/api/providers';
import { ProviderCard } from '@/features/providers/components/ProviderCard';
import { Search, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';

import { FilterSidebar } from '@/features/providers/components/FilterSidebar';
import { ProviderMap } from '@/features/maps/ProviderMap';
import { Filter, Map as MapIcon, List } from 'lucide-react';

export default function ProvidersPage() {
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState<any>({});
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [debouncedQuery] = useDebounce(query, 500);

    const { data, isLoading } = useQuery({
        queryKey: ['providers', debouncedQuery, filters],
        queryFn: () => searchProviders({ query: debouncedQuery, ...filters }),
    });

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Sidebar for Desktop */}
            <div className="hidden md:block h-full overflow-y-auto border-r custom-scrollbar">
                <FilterSidebar filters={filters} setFilters={setFilters} />
            </div>

            {/* Mobile Sidebar */}
            <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full bg-gray-50">
                <div className="p-4 bg-white border-b space-y-4 shadow-sm z-10">
                    <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                        <h1 className="text-2xl font-bold">Find Professionals</h1>

                        <div className="flex gap-2">
                            <button
                                className="md:hidden p-2 border rounded hover:bg-gray-50 bg-white"
                                onClick={() => setIsFilterOpen(true)}
                            >
                                <Filter className="w-5 h-5 text-gray-600" />
                            </button>

                            <div className="flex border rounded-lg overflow-hidden bg-white">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 flex items-center gap-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <List className="w-4 h-4" /> <span className="hidden sm:inline">List</span>
                                </button>
                                <div className="w-px bg-gray-200" />
                                <button
                                    onClick={() => setViewMode('map')}
                                    className={`p-2 flex items-center gap-2 ${viewMode === 'map' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <MapIcon className="w-4 h-4" /> <span className="hidden sm:inline">Map</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for services, names, or keywords..."
                            className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 relative">
                    {isLoading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-blue-500" /></div>
                    ) : viewMode === 'map' ? (
                        <div className="absolute inset-0">
                            <ProviderMap providers={data?.data || []} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {data?.data.map((provider) => (
                                <ProviderCard key={provider.id} provider={provider} />
                            ))}
                            {data?.data.length === 0 && (
                                <div className="col-span-full text-center py-20 text-gray-500">
                                    No providers found matching your criteria.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
