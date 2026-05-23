import { Link } from 'react-router-dom';
import ApplicationStatusBadge from '../jobs/ApplicationStatusBadge';
import AppliedJobNotice from '../jobs/AppliedJobNotice';

const TYPE_LABELS = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  remote: 'Remote',
};

export function formatSalary(salary) {
  if (!salary?.min) return null;
  const fmt = (n) => n?.toLocaleString('en-US');
  const cur = salary.currency === 'USD' ? '$' : `${salary.currency || ''} `;
  if (salary.max) return `${cur}${fmt(salary.min)} – ${cur}${fmt(salary.max)}`;
  return `${cur}${fmt(salary.min)}+`;
}

export default function JobListingCard({ job, slug, primaryColor, application }) {
  const salary = formatSalary(job.salary);
  const typeLabel = TYPE_LABELS[job.employmentType] || job.employmentType;
  const applied = Boolean(application);

  return (
    <Link
      to={`/careers/${slug}/jobs/${job._id}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--career-primary)]/40 hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-900/90 dark:hover:border-[color:var(--career-primary)]/50 ${
        applied ? 'ring-1 ring-[color:var(--career-primary)]/30' : ''
      }`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[color:var(--career-primary)] to-accent-500 transition-transform duration-300 ${
          applied ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
        style={{ background: primaryColor ? `linear-gradient(90deg, ${primaryColor}, #8b5cf6)` : undefined }}
      />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-bold text-slate-900 transition group-hover:text-[color:var(--career-primary)] dark:text-white">
            {job.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{job.company}</p>
        </div>
        {application ? (
          <ApplicationStatusBadge application={application} compact />
        ) : (
          <span className="career-badge shrink-0">{typeLabel}</span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400">
        {job.location && (
          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </span>
        )}
        {salary && (
          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 font-medium text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
            {salary}
          </span>
        )}
      </div>

      {job.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="text-[11px] text-slate-400">+{job.skills.length - 4}</span>
          )}
        </div>
      )}

      <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {job.description}
      </p>

      {applied && (
        <AppliedJobNotice application={application} className="mt-4" />
      )}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <span className="text-xs text-slate-400">
          Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'recently'}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--career-primary)]">
          {applied ? 'View status' : 'View role'}
          <svg className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
