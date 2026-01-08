'use client';

import { useAuthStore } from '@/store/auth-store';
import { Header } from '@/components/layout/header';
import Link from 'next/link';
import { LayoutDashboard, Calendar, Briefcase, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuthStore();
    const pathname = usePathname();

    if (!user) return null; // Middleware handles validation, but for typing

    const isProvider = user.role === 'PROVIDER';

    const customerLinks = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/bookings', label: 'My Bookings', icon: Calendar },
        { href: '/profile', label: 'Settings', icon: Settings },
    ];

    const providerLinks = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
        { href: '/dashboard/services', label: 'My Services', icon: Briefcase },
        { href: '/profile', label: 'Settings', icon: Settings },
    ];

    const links = isProvider ? providerLinks : customerLinks;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            <Header />

            <div className="flex-1 container mx-auto px-4 py-8 flex gap-8">
                <aside className="w-64 hidden lg:block space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                                )}
                            >
                                <Icon className="h-4 w-4 mr-3" />
                                {link.label}
                            </Link>
                        );
                    })}
                </aside>

                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
