'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-auth'; // check existing session
import { useState, useEffect } from 'react';

export function Header() {
    const { user, logout, isAuthenticated } = useAuthStore();
    const { isPending } = useUser(); // Try to fetch user on mount
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Prevent hydration mismatch

    return (
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    Dotech
                </Link>

                <nav className="flex items-center gap-6">
                    <Link href="/services" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
                        Services
                    </Link>
                    {/* Add more links based on role later */}
                </nav>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <span className="text-sm text-slate-600 dark:text-slate-400 hidden md:inline-block">
                                Hello, {user?.firstName}
                            </span>
                            <Button variant="ghost" size="sm" onClick={() => logout()}>
                                Logout
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/login">Sign In</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/register">Get Started</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
