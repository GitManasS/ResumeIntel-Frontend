import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import StaffLayout from '../../components/layout/StaffLayout';
import { extractPaginatedList } from '../../utils/apiHelpers';
import { pipelineApi, jobApi } from '../../api';
import PipelineBoard from '../../modules/hiring/PipelineBoard';
import PipelineColumnSkeleton from '../../modules/hiring/PipelineColumnSkeleton';
import { hasPermission } from '../../config/permissions';

export default function PipelinePage() {
  const { user } = useSelector((s) => s.auth);
  const canManage = hasPermission(user, 'pipeline:manage');
  const [jobId, setJobId] = useState('');

  const { data: jobs } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: () => jobApi.myJobs({ limit: 100 }).then(extractPaginatedList),
  });

  const { data: board, isLoading } = useQuery({
    queryKey: ['pipeline-board', jobId],
    queryFn: () => pipelineApi.getBoard({ jobId: jobId || undefined }).then((r) => r.data.data),
  });

  const selectedJob = useMemo(
    () => jobs?.find((j) => j._id === jobId),
    [jobs, jobId]
  );

  const filterAction = (
    <div className="relative w-full sm:w-72">
      <label htmlFor="pipeline-job-filter" className="sr-only">
        Filter by job
      </label>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </span>
      <select
        id="pipeline-job-filter"
        value={jobId}
        onChange={(e) => setJobId(e.target.value)}
        className="input-field w-full appearance-none pl-10 pr-10"
      >
        <option value="">All open positions</option>
        {jobs?.map((j) => (
          <option key={j._id} value={j._id}>
            {j.title}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
  );

  return (
    <StaffLayout
      title="Hiring Pipeline"
      subtitle={
        canManage
          ? 'Drag candidates across stages — changes sync in real time for your team'
          : 'View-only access — contact a recruiter to move candidates'
      }
      action={filterAction}
    >
      {selectedJob && (
        <p className="-mt-4 mb-4 text-sm text-slate-500 dark:text-slate-400">
          Showing pipeline for <span className="font-medium text-slate-700 dark:text-slate-300">{selectedJob.title}</span>
        </p>
      )}

      {isLoading ? (
        <PipelineColumnSkeleton count={6} />
      ) : board?.byStage &&
        Object.values(board.byStage).some((arr) => arr?.length > 0) ? (
        <PipelineBoard board={board} readOnly={!canManage} />
      ) : (
        <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/80 bg-white/50 px-6 py-16 text-center dark:border-slate-600/50 dark:bg-slate-900/30">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
            </svg>
          </div>
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">No candidates in the pipeline yet</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Applications from your career portal and job postings will appear here as cards you can move through stages.
          </p>
        </div>
      )}
    </StaffLayout>
  );
}
