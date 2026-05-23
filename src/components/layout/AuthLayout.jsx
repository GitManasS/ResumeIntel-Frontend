import { Link } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="relative flex min-h-screen flex-col mesh-bg">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl animate-pulse-soft" />
        <div className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-accent-500/15 blur-3xl animate-float" />
      </div>

      <header className="relative z-10 flex items-center justify-between p-4 sm:p-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 font-bold text-white shadow-lg shadow-brand-500/30">
            R
          </span>
          <span className="font-display text-xl font-bold text-slate-900 dark:text-white">ResumeIntel</span>
        </Link>
        <ThemeToggle />
      </header>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          <div className="glass-card page-enter shadow-glow">
            <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
            {subtitle && <p className="mt-2 text-slate-600 dark:text-slate-400">{subtitle}</p>}
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
