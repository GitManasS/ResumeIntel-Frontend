import { useParams, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { careerApi, jobApi } from '../../api';
import CareerPortalShell from '../../components/careers/CareerPortalShell';
import JobDetailContent from '../../components/jobs/JobDetailContent';
import JobApplyPanel from '../../components/jobs/JobApplyPanel';
import { isCandidate } from '../../utils/roles';

export default function CareerJobDetailPage() {
  const { slug, jobId } = useParams();
  const location = useLocation();
  const redirectPath = location.pathname;
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const asCandidate = isAuthenticated && isCandidate(user);

  const { data, isLoading, error } = useQuery({
    queryKey: ['career-job', slug, jobId],
    queryFn: () => careerApi.getJob(slug, jobId).then((r) => r.data.data),
    enabled: Boolean(slug && jobId),
  });

  const { data: candidateView } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobApi.get(jobId).then((r) => r.data.data),
    enabled: asCandidate && Boolean(jobId),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center mesh-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !data?.job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center mesh-bg px-4 text-center">
        <div className="glass-card max-w-md">
          <h1 className="font-display text-2xl font-bold">Job not found</h1>
          <Link to={`/careers/${slug}`} className="btn-primary mt-6 inline-flex">
            Back to careers
          </Link>
        </div>
      </div>
    );
  }

  const { organization, job } = data;
  const primary = organization.branding?.primaryColor || '#3396fc';
  const application = candidateView?.application;
  const hasApplied = candidateView?.hasApplied || Boolean(application);

  return (
    <CareerPortalShell organization={organization}>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          to={`/careers/${slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-[color:var(--career-primary)] dark:text-slate-400"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All positions
        </Link>

        <article className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-card backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/90">
          <div
            className="border-b border-slate-100 p-6 sm:p-8 dark:border-slate-800"
            style={{ borderTop: `4px solid ${primary}` }}
          >
            <JobDetailContent job={job} primaryColor={primary} />
          </div>

          <div className="sticky bottom-0 border-t border-slate-100 bg-slate-50/95 p-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:static sm:rounded-b-2xl">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              {hasApplied ? 'Your application' : 'Apply for this role'}
            </h2>
            <JobApplyPanel
              jobId={job._id}
              jobTitle={job.title}
              redirectPath={redirectPath}
              primaryColor={primary}
              application={application}
            />
            {asCandidate && (
              <p className="mt-4 text-center text-sm text-slate-500">
                Or browse all roles in{' '}
                <Link to="/candidate/jobs" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
                  your job board
                </Link>
              </p>
            )}
          </div>
        </article>
      </div>
    </CareerPortalShell>
  );
}
