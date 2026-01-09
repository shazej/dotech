"use client";

import { useState } from 'react';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <h1 className="text-2xl font-bold text-gray-900">Check Your Email</h1>
                    <p className="text-gray-600">
                        If an account exists for <strong>{email}</strong>, we have sent password reset instructions.
                    </p>
                    <Link href="/login" className="block text-blue-600 font-medium hover:underline mt-4">
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                    <p className="text-gray-600 mt-2">Enter your email to receive reset instructions</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-70 flex justify-center items-center"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Send Reset Link'}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <Link href="/login" className="text-gray-600 hover:text-blue-600">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}
