export function Footer() {
    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 py-8 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
                &copy; {new Date().getFullYear()} Dotech. All rights reserved.
            </div>
        </footer>
    );
}
