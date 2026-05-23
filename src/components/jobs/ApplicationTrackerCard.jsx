import { Link } from 'react-router-dom';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import { getApplicationStatusStyle, formatAppliedDate } from '../../utils/applicationStatus';
import { STAGE_PROGRESS } from '../../utils/applicationProgress';

export default function ApplicationTrackerCard({ application }) {
  const { job, stage, statusTitle, statusSubtitle, matchScore, appliedAt, updatedAt } = application;
  const jobId = application.jobId?._id || application.jobId || job?._id;
  const style = getApplicationStatusStyle(stage);
  const progress = STAGE_PROGRESS[stage] ?? 15;
  const isRejected = stage === 'rejected';
  const isHired = stage === 'hired';
  const orgName = job?.organization?.name;
  const orgSlug = job?.organization?.slug;

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-white/90 shadow-sm backdrop-blur-md transition hover:shadow-lg dark:bg-slate-900/90 ${
        isRejected
          ? 'border-rose-200/60 dark:border-rose-500/25'
          : isHired
            ? 'border-emerald-200/60 dark:border-emerald-500/25'
            : 'border-slate-200/80 hover:border-brand-500/30 dark:border-slate-700/60'
      }`}
    >
      <div className={`absolute inset-y-0 left-0 w-1 ${style.dot}`} aria-hidden />

      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 pl-1">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Already applied
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              {job?.title || 'Role'}
            </h3>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
              {job?.company}
              {orgName ? (
                <>
                  {' '}
                  <span className="text-slate-400">·</span> {orgName}
                </>
              ) : null}
            </p>
          </div>
          <ApplicationStatusBadge application={application} />
        </div>

        <div className="mt-4 rounded-xl bg-slate-50/90 p-3 dark:bg-slate-800/50">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{statusTitle}</p>
          {statusSubtitle && (
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {statusSubtitle}
            </p>
          )}
        </div>

        {!isRejected && (
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-[11px] font-medium text-slate-500">
              <span>Pipeline progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isHired ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-brand-500 to-violet-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          {appliedAt && <span>Applied {formatAppliedDate(appliedAt)}</span>}
          {updatedAt && <span>Updated {formatAppliedDate(updatedAt)}</span>}
          {matchScore != null && (
            <span className="font-semibold text-brand-600 dark:text-brand-400">
              {Math.round(matchScore)}% match
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:gap-3">
          {jobId && (
            <Link
              to={`/candidate/jobs/${jobId}`}
              className="btn-primary flex-1 text-center text-sm !py-2.5"
            >
              View application
            </Link>
          )}
          {orgSlug && (
            <Link
              to={`/careers/${orgSlug}`}
              className="btn-secondary flex-1 text-center text-sm !py-2.5"
            >
              Company careers
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
