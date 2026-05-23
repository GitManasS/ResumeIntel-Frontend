import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import ApplicationTrackerCard from '../../components/jobs/ApplicationTrackerCard';
import { useMyApplications } from '../../hooks/useMyApplications';
import { candidateLinks } from '../../utils/navLinks';
import { PIPELINE_STAGES } from '../../config/pipelineStages';
import { isInProgress, INTERVIEW_STAGES } from '../../utils/applicationProgress';

const SORT_OPTIONS = [
  { id: 'updated', label: 'Recently updated' },
  { id: 'applied', label: 'Date applied' },
  { id: 'match', label: 'Match score' },
];

const QUICK_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'interview', label: 'Interviews' },
  { id: 'offer', label: 'Offer' },
  { id: 'hired', label: 'Hired' },
  { id: 'rejected', label: 'Closed' },
];

function StatPill({ label, value, accent }) {
  const accents = {
    brand: 'from-brand-500/15 to-violet-500/10 border-brand-500/20 text-brand-700 dark:text-brand-300',
    sky: 'from-sky-500/15 to-cyan-500/10 border-sky-500/20 text-sky-800 dark:text-sky-200',
    emerald: 'from-emerald-500/15 to-teal-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-200',
    slate: 'from-slate-500/10 to-slate-500/5 border-slate-300/50 text-slate-700 dark:text-slate-300',
  };
  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br px-4 py-3 ${accents[accent] || accents.brand}`}
    >
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs font-medium opacity-90">{label}</p>
    </div>
  );
}

export default function MyApplicationsPage() {
  const { data: applications = [], isLoading, isError, refetch, isFetching } = useMyApplications();

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [quickFilter, setQuickFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated');

  const companies = useMemo(() => {
    const set = new Map();
    applications.forEach((app) => {
      const org = app.job?.organization;
      const key = org?._id || app.job?.company || 'unknown';
      const label = org?.name || app.job?.company || 'Unknown';
      if (!set.has(key)) set.set(key, label);
    });
    return Array.from(set.entries()).map(([id, name]) => ({ id, name }));
  }, [applications]);

  const stats = useMemo(() => {
    const total = applications.length;
    const inProgress = applications.filter((a) => isInProgress(a.stage)).length;
    const interviews = applications.filter((a) => INTERVIEW_STAGES.includes(a.stage)).length;
    const outcomes = applications.filter((a) => a.stage === 'hired' || a.stage === 'offer').length;
    return { total, inProgress, interviews, outcomes };
  }, [applications]);

  const filtered = useMemo(() => {
    let list = [...applications];
    const q = search.trim().toLowerCase();

    if (q) {
      list = list.filter(
        (a) =>
          a.job?.title?.toLowerCase().includes(q) ||
          a.job?.company?.toLowerCase().includes(q) ||
          a.job?.organization?.name?.toLowerCase().includes(q) ||
          a.statusTitle?.toLowerCase().includes(q)
      );
    }

    if (companyFilter !== 'all') {
      list = list.filter((a) => {
        const key = a.job?.organization?._id || a.job?.company;
        return String(key) === companyFilter;
      });
    }

    if (stageFilter !== 'all') {
      list = list.filter((a) => a.stage === stageFilter);
    }

    if (quickFilter !== 'all') {
      list = list.filter((a) => {
        switch (quickFilter) {
          case 'in_progress':
            return isInProgress(a.stage);
          case 'interview':
            return INTERVIEW_STAGES.includes(a.stage);
          case 'offer':
            return a.stage === 'offer';
          case 'hired':
            return a.stage === 'hired';
          case 'rejected':
            return a.stage === 'rejected';
          default:
            return true;
        }
      });
    }

    list.sort((a, b) => {
      if (sortBy === 'match') {
        return (b.matchScore ?? 0) - (a.matchScore ?? 0);
      }
      if (sortBy === 'applied') {
        return new Date(b.appliedAt || 0) - new Date(a.appliedAt || 0);
      }
      return new Date(b.updatedAt || b.appliedAt || 0) - new Date(a.updatedAt || a.appliedAt || 0);
    });

    return list;
  }, [applications, search, stageFilter, quickFilter, companyFilter, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setStageFilter('all');
    setQuickFilter('all');
    setCompanyFilter('all');
    setSortBy('updated');
  };

  const hasActiveFilters =
    search || stageFilter !== 'all' || quickFilter !== 'all' || companyFilter !== 'all';

  return (
    <DashboardLayout links={candidateLinks}>
      <PageHeader
        title="My applications"
        subtitle="Track every role you applied for — status updates sync from each company's hiring pipeline"
        action={
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="btn-secondary text-sm"
          >
            {isFetching ? 'Refreshing…' : 'Refresh status'}
          </button>
        }
      />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatPill label="Total applied" value={stats.total} accent="brand" />
        <StatPill label="In progress" value={stats.inProgress} accent="sky" />
        <StatPill label="Interviews" value={stats.interviews} accent="emerald" />
        <StatPill label="Offer / hired" value={stats.outcomes} accent="slate" />
      </div>

      {/* Filters */}
      <div className="glass-card mb-6 space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
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
              placeholder="Search job, company, or status…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="input-field w-full sm:w-44"
            aria-label="Filter by company"
          >
            <option value="all">All companies</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-full sm:w-44"
            aria-label="Sort applications"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setQuickFilter(f.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                quickFilter === f.id
                  ? 'bg-brand-600 text-white shadow-md dark:bg-brand-500'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => setStageFilter('all')}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${
              stageFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
            }`}
          >
            All stages
          </button>
          {PIPELINE_STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStageFilter(s.id)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 ring-inset transition ${
                stageFilter === s.id ? s.badge : 'bg-slate-50 text-slate-500 ring-slate-200 dark:bg-slate-800/50'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button type="button" onClick={clearFilters} className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
            Clear all filters
          </button>
        )}
      </div>

      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Showing {filtered.length} of {applications.length} applications
      </p>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800/80" />
          ))}
        </div>
      )}

      {isError && (
        <div className="glass-card p-8 text-center">
          <p className="text-red-600 dark:text-red-400">Could not load your applications.</p>
          <button type="button" onClick={() => refetch()} className="btn-primary mt-4">
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && applications.length === 0 && (
        <div className="glass-card flex flex-col items-center px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="mt-4 font-display text-xl font-bold text-slate-900 dark:text-white">
            No applications yet
          </h2>
          <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400">
            Browse open roles and apply with your resume. Your status will appear here as recruiters
            move you through their pipeline.
          </p>
          <Link to="/candidate/jobs" className="btn-primary mt-6">
            Browse jobs
          </Link>
        </div>
      )}

      {!isLoading && !isError && applications.length > 0 && filtered.length === 0 && (
        <div className="glass-card p-8 text-center">
          <p className="font-medium text-slate-700 dark:text-slate-300">No applications match your filters</p>
          <button type="button" onClick={clearFilters} className="btn-secondary mt-4">
            Reset filters
          </button>
        </div>
      )}

      <div className="space-y-4">
        {!isLoading &&
          !isError &&
          filtered.map((app) => <ApplicationTrackerCard key={app.applicationId || app.jobId} application={app} />)}
      </div>
    </DashboardLayout>
  );
}
