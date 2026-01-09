'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, DollarSign, CalendarCheck, CheckCircle, Star } from 'lucide-react';
import { useProviderStats } from '@/hooks/use-provider';

export default function ProviderDashboard() {
    const { data: stats, isLoading, isError } = useProviderStats();

    // Default values if loading or error (could improve with skeleton loaders)
    const displayStats = stats || {
        totalRevenue: 0,
        activeBookings: 0,
        completedJobs: 0,
        rating: 0,
        totalReviews: 0
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Provider Overview</h1>
                <Button asChild>
                    <Link href="/dashboard/services/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Service
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? '...' : `$${displayStats.totalRevenue.toFixed(2)}`}
                        </div>
                        <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? '...' : displayStats.activeBookings}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? '...' : displayStats.completedJobs}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? '...' : displayStats.rating.toFixed(1)}
                        </div>
                        <p className="text-xs text-muted-foreground">Based on {displayStats.totalReviews} reviews</p>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center text-muted-foreground">
                    No recent activity to show.
                </div>
            </div>
        </div>
    );
}
