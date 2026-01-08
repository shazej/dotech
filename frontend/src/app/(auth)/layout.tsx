import Link from 'next/link';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="text-center">
                    <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        Dotech
                    </Link>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Service Marketplace
                    </p>
                </div>
                {children}
            </div>
        </div>
    );
}
