import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import PageHeader from '../../components/ui/PageHeader';
import ApplicationStatusBadge from '../../components/jobs/ApplicationStatusBadge';
import AppliedJobNotice from '../../components/jobs/AppliedJobNotice';
import { formatSalary } from '../../components/careers/JobListingCard';
import { candidateLinks } from '../../utils/navLinks';
import { extractPaginatedList } from '../../utils/apiHelpers';
import { jobApi } from '../../api';

const TYPE_LABELS = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  remote: 'Remote',
};

export default function CandidateJobsPage() {
  const [search, setSearch] = useState('');

  const { data: jobs = [], isLoading, isError } = useQuery({
    queryKey: ['candidate-jobs'],
    queryFn: () => jobApi.list({ limit: 100, sort: '-createdAt' }).then(extractPaginatedList),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter(
      (j) =>
        j.title?.toLowerCase().includes(q) ||
        j.company?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        j.organization?.name?.toLowerCase().includes(q)
    );
  }, [jobs, search]);

  return (
    <DashboardLayout links={candidateLinks}>
      <PageHeader
        title="Open positions"
        subtitle="Browse roles from all organizations — your application status updates as recruiters move you through hiring"
      />

      <div className="mb-6">
        <input
          type="search"
          placeholder="Search by title, company, or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field max-w-md"
        />
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800/80" />
          ))}
        </div>
      )}

      {isError && (
        <Card>
          <p className="text-red-600 dark:text-red-400">Could not load jobs. Please try again.</p>
        </Card>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <Card>
          <p className="text-center text-slate-600 dark:text-slate-400">
            {jobs.length === 0
              ? 'No open positions right now. Check back soon.'
              : 'No jobs match your search.'}
          </p>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((job) => {
          const salary = formatSalary(job.salary);
          const applied = job.hasApplied || job.application;

          return (
            <Link
              key={job._id}
              to={`/candidate/jobs/${job._id}`}
              className={`glass-card group relative block overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${
                applied ? 'ring-1 ring-brand-500/25' : ''
              }`}
            >
              {applied && (
                <div
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 to-violet-500"
                  aria-hidden
                />
              )}

              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                  {job.title}
                </h3>
                {job.application ? (
                  <ApplicationStatusBadge application={job.application} compact />
                ) : (
                  <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800 dark:bg-brand-500/20 dark:text-brand-300">
                    {TYPE_LABELS[job.employmentType] || job.employmentType}
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {job.company}
                {job.organization?.name ? ` · ${job.organization.name}` : ''}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                {job.location && <span>{job.location}</span>}
                {salary && <span className="text-emerald-600 dark:text-emerald-400">{salary}</span>}
              </div>

              <p className="mt-3 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                {job.description}
              </p>

              {applied && (
                <AppliedJobNotice
                  application={job.application}
                  className="mt-4"
                />
              )}

              <span className="mt-4 inline-flex text-sm font-semibold text-brand-600 dark:text-brand-400">
                {applied ? 'View application status →' : 'View & apply →'}
              </span>
            </Link>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
