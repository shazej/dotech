export type Role = 'customer' | 'provider' | 'admin' | 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

export interface User {
    id: string;
    email?: string;
    phone?: string;
    firstName?: string; // Optional as backend might not return it yet
    lastName?: string;
    role: Role;
    createdAt?: string;
    avatarUrl?: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string; // Backend returns accessToken
}
