'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/hooks/use-auth';
import { LoginFormData, loginSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function LoginPage() {
    const { mutate: login, isPending, error } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormData) => {
        login(data);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Enter your email to sign in to your account
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        placeholder="m@example.com"
                        type="email"
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        {...register('password')}
                    />
                    {errors.password && (
                        <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-md">
                        Invalid email or password
                    </div>
                )}

                <Button className="w-full" type="submit" disabled={isPending}>
                    {isPending ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                    Don&apos;t have an account?{' '}
                </span>
                <Link
                    href="/register"
                    className="font-medium underline underline-offset-4 hover:text-slate-900 dark:hover:text-slate-50"
                >
                    Sign up
                </Link>
            </div>
        </div>
    );
}
