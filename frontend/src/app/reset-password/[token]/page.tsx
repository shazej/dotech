"use client";

import { useState } from 'react';
import { Lock, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function NewPasswordPage() {
    const params = useParams(); // Using dummy params just to satisfy next naming
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        setIsLoading(true);
        // Mock API call
        setTimeout(() => {
            setIsLoading(false);
            router.push('/login?reset=success');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
                    <p className="text-gray-600 mt-2">Create a strong password for your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                required
                                minLength={8}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                required
                                minLength={8}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-70 flex justify-center items-center"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
