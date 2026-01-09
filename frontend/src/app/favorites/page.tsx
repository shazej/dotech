import { Star } from 'lucide-react';
import Link from 'next/link';
import { Provider } from '@/lib/api/providers';

interface FavoritesPageProps {
    // Mock favorites
}

export default function FavoritesPage() {
    // Ideally fetch favorites from API
    // Using empty state for now or mock
    const favorites: Provider[] = [];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">My Favorites</h1>

            {favorites.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed text-gray-500">
                    <HeartBroken className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No favorites yet</p>
                    <p className="text-sm">Save providers you like to find them easily later.</p>
                    <Link href="/providers" className="inline-block mt-4 text-blue-600 hover:underline">Browse Providers</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Render Card */}
                </div>
            )}
        </div>
    );
}

function HeartBroken({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M19 14c1.49-1.28 3.6-2.35 4.54-2.7C23.98 11.23 24 11.13 24 11a12 12 0 0 0-12-12 12 12 0 0 0-12 12c0 .13.02.23.46.3 1.94 1.35 4.05 2.42 5.54 3.7l9-9Z" opacity="0" />
            <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 6.6 7.75 10 11.5 3.4-3.75 10-7.72 10-11.5C22 5.42 19.58 3 16.5 3Z" />
            <line x1="2" y1="2" x2="22" y2="22" />
            {/* Simplified Heart Break icon replacement since lucide doesn't have it explicitly or use HeartOff */}
        </svg>
    );
}
