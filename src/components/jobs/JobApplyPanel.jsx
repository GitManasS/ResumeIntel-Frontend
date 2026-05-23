import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import Button from '../ui/Button';
import ApplicationStatusPanel from './ApplicationStatusPanel';
import { jobApi, resumeApi } from '../../api';
import { isCandidate } from '../../utils/roles';
import { loginUrl, registerUrl } from '../../utils/authRedirect';
import toast from 'react-hot-toast';

export default function JobApplyPanel({
  jobId,
  jobTitle,
  redirectPath,
  primaryColor,
  application,
}) {
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const queryClient = useQueryClient();
  const [resumeId, setResumeId] = useState('');
  const candidate = isAuthenticated && isCandidate(user);
  const hasApplied = Boolean(application);

  const { data: resumes = [], isLoading: resumesLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => resumeApi.list().then((r) => r.data.data),
    enabled: candidate && !hasApplied,
  });

  const readyResumes = resumes.filter((r) => r.status === 'ready');

  const applyMutation = useMutation({
    mutationFn: () => jobApi.apply(jobId, resumeId),
    onSuccess: () => {
      toast.success(`Application submitted for ${jobTitle || 'this role'}!`);
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
      queryClient.invalidateQueries({ queryKey: ['candidate-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Could not submit application';
      toast.error(msg);
    },
  });

  const gradientStyle = primaryColor
    ? { background: `linear-gradient(135deg, ${primaryColor}, #7c3aed)` }
    : undefined;

  if (hasApplied) {
    return <ApplicationStatusPanel application={application} primaryColor={primaryColor} />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sign in as a candidate to apply with your resume
        </p>
        <div className="flex gap-3">
          <Link to={loginUrl(redirectPath)} className="btn-secondary flex-1 sm:flex-none">
            Sign in
          </Link>
          <Link
            to={registerUrl(redirectPath)}
            className="btn-primary flex-1 sm:flex-none"
            style={gradientStyle}
          >
            Create account & apply
          </Link>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Only candidate accounts can apply.{' '}
        <Link to="/candidate/jobs" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
          Browse jobs as a candidate
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {resumesLoading ? (
        <p className="text-sm text-slate-500">Loading your resumes…</p>
      ) : readyResumes.length === 0 ? (
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <p className="text-sm text-amber-900 dark:text-amber-200">
            Upload and parse a resume before applying.
          </p>
          <Link
            to="/candidate/resumes"
            className="mt-3 inline-flex text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            Go to Resumes →
          </Link>
        </div>
      ) : (
        <>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Select resume
            </label>
            <select
              value={resumeId}
              onChange={(e) => setResumeId(e.target.value)}
              className="input-field w-full"
            >
              <option value="">Choose a resume…</option>
              {readyResumes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.fileName || r.title || 'Resume'}
                  {r.isPrimary ? ' (primary)' : ''}
                  {r.atsAnalysis?.score != null ? ` — ATS ${r.atsAnalysis.score}%` : ''}
                </option>
              ))}
            </select>
          </div>
          <Button
            className="w-full sm:w-auto"
            style={gradientStyle}
            disabled={!resumeId || applyMutation.isPending}
            loading={applyMutation.isPending}
            onClick={() => applyMutation.mutate()}
          >
            Submit application
          </Button>
        </>
      )}
    </div>
  );
}
