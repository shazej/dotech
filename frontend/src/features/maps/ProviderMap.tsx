"use client";

import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Provider } from '@/lib/api/providers';
import { useState } from 'react';
import { ProviderCard } from '../providers/components/ProviderCard';
import { Loader2 } from 'lucide-react';

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: 40.7128,
    lng: -74.0060,
};

interface ProviderMapProps {
    providers: Provider[];
}

export function ProviderMap({ providers }: ProviderMapProps) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    });

    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div>;

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={12}
            center={center}
        >
            {providers.map((provider) => (
                <Marker
                    key={provider.id}
                    position={provider.location}
                    onClick={() => setSelectedProvider(provider)}
                />
            ))}

            {selectedProvider && (
                <InfoWindow
                    position={selectedProvider.location}
                    onCloseClick={() => setSelectedProvider(null)}
                >
                    <div className="w-64">
                        <ProviderCard provider={selectedProvider} />
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
}
