export type Role = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    createdAt: string;
    avatarUrl?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}
