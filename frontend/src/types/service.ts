import { User } from './auth';

export interface Category {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
}

export interface Service {
    id: string;
    title: string;
    description: string;
    price: number;
    duration: number; // in minutes
    category: Category;
    provider: {
        id: string;
        profile: {
            bio: string;
            rating: number;
            reviewCount: number;
        };
        user: User;
    };
    imageUrl?: string;
}

export interface ServiceFilters {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
}
