import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { jobApi } from '../api';
import { isCandidate } from '../utils/roles';

export function useMyApplications() {
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const enabled = isAuthenticated && isCandidate(user);

  const query = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => jobApi.myApplications().then((r) => r.data.data),
    enabled,
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });

  const byJobId = useMemo(() => {
    const map = {};
    (query.data || []).forEach((app) => {
      const id = app.jobId?._id || app.jobId || app.job?._id;
      if (id) map[id] = app;
    });
    return map;
  }, [query.data]);

  const getStatusForJob = (jobId) => {
    if (!jobId) return null;
    const id = jobId._id || jobId;
    return byJobId[id] || null;
  };

  return {
    ...query,
    byJobId,
    getStatusForJob,
    enabled,
  };
}
