export default function Card({ title, children, action, className = '', variant = 'default' }) {
  const variants = {
    default: 'card',
    interactive: 'glass-card-interactive',
    flat: 'rounded-2xl border border-slate-200/80 bg-surface p-6 dark:border-slate-700/50',
  };

  return (
    <div className={`${variants[variant] || variants.default} ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {title && (
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
