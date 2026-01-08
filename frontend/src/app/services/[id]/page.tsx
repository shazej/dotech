'use client';

import { useParams } from 'next/navigation';
import { useService } from '@/hooks/use-service';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/layout/footer';
import { Star, Clock, DollarSign, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ServiceDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { data: service, isLoading, error } = useService(id);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">Loading...</div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <p className="text-red-500">Service not found</p>
                    <Button asChild variant="outline"><Link href="/services">Back to Services</Link></Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            <Header />

            <main className="container mx-auto px-4 py-8 flex-1">
                <Link href="/services" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 mb-6">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to services
                </Link>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden">
                            {service.imageUrl && (
                                <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                            )}
                        </div>

                        <div>
                            <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 mb-2">
                                <span className="font-semibold">{service.category.name}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">{service.title}</h1>

                            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">Description</h3>
                                <p>{service.description}</p>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">About the Provider</h3>
                            <div className="flex items-start space-x-4">
                                <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-slate-900 dark:text-slate-50">{service.provider.user.firstName} {service.provider.user.lastName}</h4>
                                    <div className="flex items-center text-sm text-yellow-500 mt-1">
                                        <Star className="h-4 w-4 fill-current mr-1" />
                                        <span>{service.provider.profile.rating.toFixed(1)}</span>
                                        <span className="text-slate-400 ml-1">({service.provider.profile.reviewCount} reviews)</span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{service.provider.profile.bio}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="relative">
                        <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="mb-6">
                                <span className="text-3xl font-bold text-slate-900 dark:text-slate-50">${service.price}</span>
                                <span className="text-slate-500 ml-2">per booking</span>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span>Duration: {service.duration} mins</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    <span>Secure payment</span>
                                </div>
                            </div>

                            <Button size="lg" className="w-full" asChild>
                                <Link href={`/bookings/create?serviceId=${service.id}`}>Book This Service</Link>
                            </Button>

                            <p className="text-xs text-center text-slate-400 mt-4">
                                You won&apos;t be charged yet
                            </p>
                        </div>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
