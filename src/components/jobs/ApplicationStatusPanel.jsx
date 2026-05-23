import { getApplicationStatusStyle, formatAppliedDate } from '../../utils/applicationStatus';
import { STAGE_PROGRESS } from '../../utils/applicationProgress';

export default function ApplicationStatusPanel({ application, primaryColor = '#3396fc' }) {
  if (!application) return null;

  const { stage, statusTitle, statusSubtitle, matchScore, appliedAt, updatedAt } = application;
  const style = getApplicationStatusStyle(stage);
  const progress = STAGE_PROGRESS[stage] ?? 20;
  const isRejected = stage === 'rejected';
  const isHired = stage === 'hired';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 ${
        isRejected
          ? 'border-rose-200/80 bg-gradient-to-br from-rose-50/95 to-slate-50/80 dark:border-rose-500/30 dark:from-rose-950/40 dark:to-slate-900/60'
          : isHired
            ? 'border-emerald-200/80 bg-gradient-to-br from-emerald-50/95 to-teal-50/50 dark:border-emerald-500/30 dark:from-emerald-950/40 dark:to-slate-900/60'
            : 'border-slate-200/80 bg-gradient-to-br from-white to-slate-50/90 dark:border-slate-700/60 dark:from-slate-900/90 dark:to-slate-950/80'
      }`}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-2xl"
        style={{ background: primaryColor }}
      />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-200">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Already applied
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {isRejected ? 'Application closed' : 'Current hiring stage'}
          </p>
          <h3 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            {statusTitle}
          </h3>
          {statusSubtitle && (
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {statusSubtitle}
            </p>
          )}
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset ${style.badge}`}
        >
          <span className={`h-2 w-2 rounded-full ${style.dot} ${!isRejected && !isHired ? 'animate-pulse' : ''}`} />
          {application.stageLabel}
        </span>
      </div>

      {!isRejected && (
        <div className="relative mt-5">
          <div className="mb-2 flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Hiring progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: isHired
                  ? 'linear-gradient(90deg, #10b981, #14b8a6)'
                  : `linear-gradient(90deg, ${primaryColor}, #8b5cf6)`,
              }}
            />
          </div>
        </div>
      )}

      <div className="relative mt-4 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
        {appliedAt && <span>Applied {formatAppliedDate(appliedAt)}</span>}
        {updatedAt && appliedAt !== updatedAt && (
          <span>Updated {formatAppliedDate(updatedAt)}</span>
        )}
        {matchScore != null && (
          <span className="font-medium text-brand-600 dark:text-brand-400">
            Match score {Math.round(matchScore)}%
          </span>
        )}
      </div>
    </div>
  );
}
