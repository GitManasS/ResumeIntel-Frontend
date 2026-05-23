import { Link, useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout';
import JobDetailContent from '../../components/jobs/JobDetailContent';
import JobApplyPanel from '../../components/jobs/JobApplyPanel';
import { candidateLinks } from '../../utils/navLinks';
import { jobApi } from '../../api';

export default function CandidateJobDetailPage() {
  const { jobId } = useParams();
  const location = useLocation();
  const redirectPath = location.pathname;

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobApi.get(jobId).then((r) => r.data.data),
    enabled: Boolean(jobId),
  });

  const primary = job?.organization?.branding?.primaryColor || '#3396fc';
  const hasApplied = job?.hasApplied || job?.application;

  return (
    <DashboardLayout links={candidateLinks}>
      <Link
        to="/candidate/jobs"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400"
      >
        ← All jobs
      </Link>

      {isLoading && (
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800/80" />
      )}

      {error && (
        <div className="glass-card mt-8 p-8 text-center">
          <p className="text-red-600 dark:text-red-400">Job not found or no longer available.</p>
          <Link to="/candidate/jobs" className="btn-primary mt-4 inline-flex">
            Back to jobs
          </Link>
        </div>
      )}

      {job && (
        <article className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-card dark:border-slate-700/60 dark:bg-slate-900/90">
          <div
            className="border-b border-slate-100 p-6 sm:p-8 dark:border-slate-800"
            style={{ borderTop: `4px solid ${primary}` }}
          >
            <JobDetailContent job={job} primaryColor={primary} />
          </div>

          <div className="border-t border-slate-100 bg-slate-50/95 p-6 dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              {hasApplied ? 'Your application' : 'Apply for this role'}
            </h2>
            <JobApplyPanel
              jobId={job._id}
              jobTitle={job.title}
              redirectPath={redirectPath}
              primaryColor={primary}
              application={job.application}
            />
          </div>
        </article>
      )}
    </DashboardLayout>
  );
}
