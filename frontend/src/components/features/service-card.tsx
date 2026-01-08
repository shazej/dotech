import Link from 'next/link';
import { Service } from '@/types/service';
import { Button } from '@/components/ui/button';
import { Star, Clock, DollarSign } from 'lucide-react';

export function ServiceCard({ service }: { service: Service }) {
    return (
        <div className="group rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 relative">
                {/* Placeholder for image */}
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    {service.imageUrl ? (
                        <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                    ) : (
                        <span>No Image</span>
                    )}
                </div>
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {service.category.name}
                    </span>
                    <div className="flex items-center text-sm text-yellow-500">
                        <Star className="h-4 w-4 fill-current mr-1" />
                        <span>{service.provider.profile.rating.toFixed(1)}</span>
                        <span className="text-slate-400 ml-1">({service.provider.profile.reviewCount})</span>
                    </div>
                </div>

                <h3 className="font-semibold text-lg mb-2 truncate" title={service.title}>{service.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 h-10">
                    {service.description}
                </p>

                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-4 space-x-4">
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration} mins
                    </div>
                    <div className="flex items-center font-medium text-slate-900 dark:text-slate-50">
                        <DollarSign className="h-4 w-4" />
                        {service.price}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700" />
                        <span className="text-sm truncate max-w-[100px]">{service.provider.user.firstName}</span>
                    </div>
                    <Button size="sm" asChild>
                        <Link href={`/services/${service.id}`}>Book Now</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
