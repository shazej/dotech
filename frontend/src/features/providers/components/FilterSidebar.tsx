"use client";

import { X } from 'lucide-react';

interface FilterSidebarProps {
    filters: any;
    setFilters: (filters: any) => void;
    isOpen?: boolean;
    onClose?: () => void;
}

export function FilterSidebar({ filters, setFilters, isOpen, onClose }: FilterSidebarProps) {
    const handleChange = (key: string, value: any) => {
        setFilters((prev: any) => ({ ...prev, [key]: value }));
    };

    return (
        <div className={`
      fixed inset-y-0 right-0 w-80 bg-white shadow-xl transform transition-transform z-50 overflow-y-auto
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      md:relative md:translate-x-0 md:w-64 md:shadow-none md:border-r md:h-[calc(100vh-80px)] md:block
    `}>
            <div className="p-4 border-b flex justify-between items-center md:hidden">
                <h2 className="font-bold">Filters</h2>
                <button onClick={onClose}><X className="w-5 h-5" /></button>
            </div>

            <div className="p-4 space-y-6">
                <div>
                    <h3 className="font-semibold mb-2 text-sm">Category</h3>
                    <select
                        className="w-full border rounded p-2 text-sm"
                        value={filters.category || ''}
                        onChange={(e) => handleChange('category', e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Plumber">Plumber</option>
                        <option value="Electrician">Electrician</option>
                        <option value="Cleaner">Cleaner</option>
                    </select>
                </div>

                <div>
                    <h3 className="font-semibold mb-2 text-sm">Price Range ($/hr)</h3>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            className="w-full border rounded p-2 text-sm"
                            value={filters.minPrice || ''}
                            onChange={(e) => handleChange('minPrice', e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            className="w-full border rounded p-2 text-sm"
                            value={filters.maxPrice || ''}
                            onChange={(e) => handleChange('maxPrice', e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-2 text-sm">Rating</h3>
                    <div className="space-y-1">
                        {[4, 3, 2].map((rating) => (
                            <label key={rating} className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="radio"
                                    name="rating"
                                    value={rating}
                                    checked={filters.minRating == rating}
                                    onChange={() => handleChange('minRating', rating)}
                                />
                                <span>{rating}+ Stars</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-2 text-sm">Distance (km)</h3>
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={filters.radius || 10}
                        onChange={(e) => handleChange('radius', Number(e.target.value))}
                        className="w-full"
                    />
                    <div className="text-xs text-gray-500 text-right">{filters.radius || 10} km</div>
                </div>

                <button
                    onClick={() => setFilters({})}
                    className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    Clear All
                </button>
            </div>
        </div>
    );
}
