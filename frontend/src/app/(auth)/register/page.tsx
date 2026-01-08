'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@/hooks/use-auth';
import { RegisterFormData, registerSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function RegisterPage() {
    const { mutate: createUser, isPending, error } = useRegister();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 'CUSTOMER', // Default role
        },
    });

    const onSubmit = (data: RegisterFormData) => {
        createUser(data);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Enter your information to get started
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" {...register('firstName')} />
                        {errors.firstName && (
                            <p className="text-sm text-red-500">{errors.firstName.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" {...register('lastName')} />
                        {errors.lastName && (
                            <p className="text-sm text-red-500">{errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" {...register('password')} />
                    {errors.password && (
                        <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>I want to join as a</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="cursor-pointer">
                            <input
                                type="radio"
                                value="CUSTOMER"
                                className="peer sr-only"
                                {...register('role')}
                            />
                            <div className="rounded-md border-2 border-slate-200 p-4 text-center hover:border-slate-300 peer-checked:border-slate-900 peer-checked:bg-slate-50 dark:border-slate-800 dark:peer-checked:border-slate-50 dark:peer-checked:bg-slate-900">
                                Customer
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input
                                type="radio"
                                value="PROVIDER"
                                className="peer sr-only"
                                {...register('role')}
                            />
                            <div className="rounded-md border-2 border-slate-200 p-4 text-center hover:border-slate-300 peer-checked:border-slate-900 peer-checked:bg-slate-50 dark:border-slate-800 dark:peer-checked:border-slate-50 dark:peer-checked:bg-slate-900">
                                Provider
                            </div>
                        </label>
                    </div>
                    {errors.role && (
                        <p className="text-sm text-red-500">{errors.role.message}</p>
                    )}
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-md">
                        Registration failed. Please try again.
                    </div>
                )}

                <Button className="w-full" type="submit" disabled={isPending}>
                    {isPending ? 'Creating account...' : 'Create Account'}
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                    Already have an account?{' '}
                </span>
                <Link
                    href="/login"
                    className="font-medium underline underline-offset-4 hover:text-slate-900 dark:hover:text-slate-50"
                >
                    Sign in
                </Link>
            </div>
        </div>
    );
}
