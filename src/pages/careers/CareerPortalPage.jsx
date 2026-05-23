import { useMemo, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { registerUrl, loginUrl } from '../../utils/authRedirect';
import { useQuery } from '@tanstack/react-query';
import { useMyApplications } from '../../hooks/useMyApplications';
import { careerApi } from '../../api';
import CareerPortalShell from '../../components/careers/CareerPortalShell';
import JobListingCard from '../../components/careers/JobListingCard';

const FILTERS = [
  { id: 'all', label: 'All roles' },
  { id: 'full-time', label: 'Full-time' },
  { id: 'remote', label: 'Remote' },
  { id: 'contract', label: 'Contract' },
  { id: 'internship', label: 'Internship' },
];

function CareerHero({ organization }) {
  const primary = organization.branding?.primaryColor || '#3396fc';

  return (
    <section className="relative overflow-hidden border-b border-slate-200/60 dark:border-slate-800">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: `radial-gradient(ellipse 70% 80% at 50% -30%, rgb(var(--career-primary-rgb) / 0.25), transparent 70%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-40" />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <p
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1"
          style={{
            color: primary,
            backgroundColor: `rgb(var(--career-primary-rgb) / 0.1)`,
            borderColor: `rgb(var(--career-primary-rgb) / 0.25)`,
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: primary }} />
          We&apos;re hiring
        </p>

        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          {organization.branding?.tagline || `Build your career at ${organization.name}`}
        </h1>

        {organization.branding?.about && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            {organization.branding.about}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
          {organization.industry && (
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {organization.industry}
            </span>
          )}
          {organization.size && (
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {organization.size} employees
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800/80" />
        ))}
      </div>
    </div>
  );
}

export default function CareerPortalPage() {
  const { slug } = useParams();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const signInPath = loginUrl(location.pathname);
  const registerPath = registerUrl(location.pathname);

  const { getStatusForJob } = useMyApplications();

  const { data, isLoading, error } = useQuery({
    queryKey: ['careers', slug],
    queryFn: () => careerApi.getJobs(slug).then((r) => r.data.data),
    enabled: Boolean(slug),
  });

  const filteredJobs = useMemo(() => {
    if (!data?.jobs) return [];
    const q = search.trim().toLowerCase();
    return data.jobs.filter((job) => {
      const matchesType = typeFilter === 'all' || job.employmentType === typeFilter;
      const matchesSearch =
        !q ||
        job.title?.toLowerCase().includes(q) ||
        job.location?.toLowerCase().includes(q) ||
        job.skills?.some((s) => s.toLowerCase().includes(q));
      return matchesType && matchesSearch;
    });
  }, [data?.jobs, search, typeFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen mesh-bg">
        <LoadingState />
      </div>
    );
  }

  if (error || !data?.organization) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center mesh-bg px-4 text-center">
        <div className="glass-card max-w-md">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Portal not found</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            This career page doesn&apos;t exist or isn&apos;t available.
          </p>
          <Link to="/" className="btn-primary mt-6 inline-flex">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const { organization, jobs } = data;
  const primary = organization.branding?.primaryColor;

  return (
    <CareerPortalShell organization={organization}>
      <CareerHero organization={organization} />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Search & filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Open positions</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {filteredJobs.length} of {jobs?.length || 0} roles
            </p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Search roles, skills, location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setTypeFilter(f.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                typeFilter === f.id
                  ? 'text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
              style={
                typeFilter === f.id
                  ? { background: `linear-gradient(135deg, ${primary || '#3396fc'}, #8b5cf6)` }
                  : undefined
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Job grid */}
        {filteredJobs.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {filteredJobs.map((job, i) => (
              <div key={job._id} className="page-enter" style={{ animationDelay: `${i * 50}ms` }}>
                <JobListingCard
                  job={job}
                  slug={slug}
                  primaryColor={primary}
                  application={getStatusForJob(job._id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-slate-300/80 bg-white/40 px-6 py-16 text-center dark:border-slate-600/50 dark:bg-slate-900/30">
            <p className="font-medium text-slate-700 dark:text-slate-300">No roles match your filters</p>
            <p className="mt-1 text-sm text-slate-500">Try clearing search or choosing another type</p>
            <button type="button" onClick={() => { setSearch(''); setTypeFilter('all'); }} className="btn-secondary mt-4 text-sm">
              Reset filters
            </button>
          </div>
        )}

        {/* CTA band */}
        <section
          className="mt-16 overflow-hidden rounded-2xl border p-8 text-center sm:p-12"
          style={{
            borderColor: `rgb(var(--career-primary-rgb) / 0.3)`,
            background: `linear-gradient(135deg, rgb(var(--career-primary-rgb) / 0.12), rgb(139 92 246 / 0.08))`,
          }}
        >
          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Ready to join {organization.name}?
          </h3>
          <p className="mx-auto mt-2 max-w-md text-slate-600 dark:text-slate-400">
            Create a free candidate account to upload your resume, apply to roles, and get AI-powered interview prep.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to={registerPath} className="btn-primary px-8" style={{ background: `linear-gradient(135deg, ${primary || '#3396fc'}, #7c3aed)` }}>
              Create account
            </Link>
            <Link to={signInPath} className="btn-secondary">
              Sign in to apply
            </Link>
          </div>
        </section>
      </main>
    </CareerPortalShell>
  );
}
