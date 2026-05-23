import { getApplicationStatusStyle } from '../../utils/applicationStatus';

/**
 * Compact “Already applied” box for job cards (list + career portal).
 */
export default function AppliedJobNotice({ application, className = '' }) {
  if (!application) {
    return (
      <div
        className={`flex items-center gap-2.5 rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-3.5 py-2.5 dark:border-emerald-500/25 dark:bg-emerald-500/10 ${className}`}
      >
        <AppliedCheckIcon />
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Already applied</p>
      </div>
    );
  }

  const style = getApplicationStatusStyle(application.stage);
  const stageLine = application.statusTitle || application.stageLabel || 'In review';

  return (
    <div
      className={`overflow-hidden rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/95 to-white/80 px-3.5 py-3 dark:border-emerald-500/25 dark:from-emerald-950/40 dark:to-slate-900/50 ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/20">
          <AppliedCheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold tracking-tight text-emerald-900 dark:text-emerald-100">
            Already applied
          </p>
          <p className="mt-0.5 text-xs text-emerald-800/90 dark:text-emerald-200/80">
            You cannot apply again for this role
          </p>
        </div>
      </div>
      <div
        className={`mt-2.5 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold ring-1 ring-inset ${style.badge}`}
      >
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
        <span className="truncate">Status: {stageLine}</span>
      </div>
    </div>
  );
}

function AppliedCheckIcon({ className = 'h-5 w-5 text-emerald-600 dark:text-emerald-400' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
