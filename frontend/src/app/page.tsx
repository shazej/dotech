import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mb-6">
              Find the perfect service <br className="hidden md:block" /> for your needs
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
              Connect with top-rated professionals for home services, maintenance, personal care, and more. Trusted by thousands.
            </p>

            <div className="max-w-xl mx-auto relative flex items-center">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  className="w-full pl-10 h-12 text-lg bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-sm rounded-full"
                  placeholder="What service are you looking for?"
                />
              </div>
              <Button size="lg" className="ml-2 rounded-full h-12 px-8">
                Search
              </Button>
            </div>
          </div>
        </section>

        {/* Categories Section (Placeholder data for now) */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-10 text-center">
              Popular Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {['Home Cleaning', 'Plumbing', 'Electrical', 'Painting', 'Moving', 'Beauty'].map((category) => (
                <Link
                  key={category}
                  href={`/services?category=${category}`}
                  className="group flex flex-col items-center justify-center p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all"
                >
                  <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 mb-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{category}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="h-16 w-16 mx-auto bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-50">Verified Professionals</h3>
              <p className="text-slate-600 dark:text-slate-400">All service providers are vetted and background-checked for your safety.</p>
            </div>
            <div>
              <div className="h-16 w-16 mx-auto bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-50">On-Time Service</h3>
              <p className="text-slate-600 dark:text-slate-400">Our pros value your time. Guaranteed punctuality or your money back.</p>
            </div>
            <div>
              <div className="h-16 w-16 mx-auto bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-50">Transparent Pricing</h3>
              <p className="text-slate-600 dark:text-slate-400">Upfront quotes. No hidden fees. Pay securely through the platform.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
