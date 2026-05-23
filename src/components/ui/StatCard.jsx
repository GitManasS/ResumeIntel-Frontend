export default function StatCard({ label, value, subtext, icon, trend, accent = 'brand' }) {
  const accents = {
    brand: 'from-brand-500/20 to-brand-600/5 text-brand-600 dark:text-brand-400',
    accent: 'from-accent-500/20 to-accent-600/5 text-accent-600 dark:text-accent-400',
    emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-600 dark:text-emerald-400',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-600 dark:text-amber-400',
  };

  return (
    <div className="stat-card group page-enter">
      <div
        className={`pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition group-hover:opacity-80 ${accents[accent]}`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value ?? '—'}
          </p>
          {subtext && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtext}</p>}
          {trend != null && (
            <span
              className={`mt-2 inline-flex badge ${trend >= 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300'}`}
            >
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        {icon && (
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${accents[accent]}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
