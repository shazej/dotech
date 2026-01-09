import { Provider } from '@/lib/api/providers';
import { Star, MapPin, BadgeCheck, Heart } from 'lucide-react';
import Link from 'next/link';

interface ProviderCardProps {
    provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
    return (
        <Link
            href={`/providers/${provider.id}`}
            className="block bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden group"
        >
            <div className="relative h-40 bg-gray-200">
                {/* Placeholder for cover image */}
                <div className="absolute top-3 right-3">
                    <button className="p-2 bg-white/80 rounded-full hover:bg-white text-gray-600 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 flex items-center gap-1">
                            {provider.name}
                            {provider.isVerified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                        </h3>
                        <p className="text-sm text-gray-500">{provider.category}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-xs font-bold text-yellow-700">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        {provider.rating.toFixed(1)} ({provider.reviewCount})
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{provider.location.city} {provider.distance ? `• ${provider.distance.toFixed(1)}km away` : ''}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t mt-2">
                    <span className="font-bold text-gray-900">${provider.hourlyRate}/hr</span>
                    <span className="text-xs text-blue-600 font-medium">View Profile</span>
                </div>
            </div>
        </Link>
    );
}
