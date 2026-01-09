"use client";

import { useQuery } from '@tanstack/react-query';
import { getProviderById } from '@/lib/api/providers';
import { ProviderReviews } from '@/features/providers/components/ProviderReviews';
import { Loader2, MapPin, Phone, Mail, Clock, ShieldCheck, Heart, Share2, Map as MapIcon, Calendar } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ProviderProfilePage() {
    const { id } = useParams();
    const { data: provider, isLoading } = useQuery({
        queryKey: ['provider', id],
        queryFn: () => getProviderById(id as string),
    });

    if (isLoading || !provider) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

    const mockReviews = [
        { id: '1', author: 'Alice M.', rating: 5, date: '2 weeks ago', content: 'Excellent service! highly recommended.' },
        { id: '2', author: 'Bob D.', rating: 4, date: '1 month ago', content: 'Good work but arrived slightly late.' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Cover */}
            <div className="h-60 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                {/* Share / Favorite */}
                <div className="absolute top-6 right-6 flex gap-3">
                    <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-sm">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-sm">
                        <Heart className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                        {/* Avatar */}
                        <div className="w-32 h-32 bg-gray-200 rounded-xl border-4 border-white shadow-md shrink-0"></div>

                        <div className="flex-1 space-y-2 pt-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-bold text-gray-900">{provider.name}</h1>
                                {provider.isVerified && (
                                    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-bold border border-blue-100">
                                        <ShieldCheck className="w-3 h-3" /> Verified Pro
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-500 font-medium text-lg">{provider.category}</p>
                            <div className="flex items-center gap-4 text-gray-600 text-sm">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {provider.location.city}</span>
                                <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {provider.rating} ({provider.reviewCount} reviews)</span>
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Joined 2023</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                            <div className="text-right hidden md:block mb-2">
                                <span className="text-3xl font-bold text-gray-900">${provider.hourlyRate}</span>
                                <span className="text-gray-500">/hr</span>
                            </div>

                            <button className="w-full md:w-48 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                                <Calendar className="w-5 h-5" /> Book Appointment
                            </button>
                            <div className="flex gap-3">
                                <a href={`tel:${provider.phone}`} className="flex-1 flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 py-2.5 rounded-lg font-medium text-gray-700">
                                    <Phone className="w-4 h-4" /> Call
                                </a>
                                <a href={`mailto:${provider.email}`} className="flex-1 flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 py-2.5 rounded-lg font-medium text-gray-700">
                                    <Mail className="w-4 h-4" /> Email
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 border-t">
                        <div className="md:col-span-2 p-6 md:p-8 space-y-8 border-r">
                            <section>
                                <h2 className="text-xl font-bold mb-4">About</h2>
                                <p className="text-gray-600 leading-relaxed">{provider.bio || "No biography provided yet."}</p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4">Services</h2>
                                <div className="flex flex-wrap gap-2">
                                    {provider.tags.map(tag => (
                                        <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">#{tag}</span>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <ProviderReviews reviews={mockReviews} rating={provider.rating} totalReviews={provider.reviewCount} />
                            </section>
                        </div>

                        <div className="p-6 md:p-8 bg-gray-50/50 space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-900">Location</h3>
                                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative group cursor-pointer">
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/10 transition-colors">
                                        <MapIcon className="w-8 h-8 text-gray-500" />
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-medium text-gray-900">{provider.location.address}</p>
                                        <p className="text-gray-500">{provider.location.city}</p>
                                    </div>
                                </div>
                                <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-50">
                                    Get Directions
                                </button>
                            </div>

                            <div className="space-y-4 pt-6 border-t">
                                <h3 className="font-bold text-gray-900">Availability</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between"><span>Mon - Fri</span> <span>09:00 - 17:00</span></div>
                                    <div className="flex justify-between"><span>Sat</span> <span>10:00 - 14:00</span></div>
                                    <div className="flex justify-between text-red-500"><span>Sun</span> <span>Closed</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
