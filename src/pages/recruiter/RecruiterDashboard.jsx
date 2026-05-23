import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StaffLayout from '../../components/layout/StaffLayout';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { NavIcon } from '../../components/ui/icons';
import { extractPaginatedList } from '../../utils/apiHelpers';
import { hiringApi, jobApi } from '../../api';
import { hasPermission } from '../../config/permissions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RecruiterDashboard() {
  const { user } = useSelector((s) => s.auth);
  const org = useSelector((s) => s.org);
  const careerSlug = org.selectedOrganizationSlug || user?.organization?.slug;

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['hiring-analytics'],
    queryFn: () => hiringApi.analytics().then((r) => r.data.data),
    enabled: hasPermission(user, 'analytics:org'),
  });

  const { data: jobs } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: () => jobApi.myJobs({ limit: 5 }).then(extractPaginatedList),
    enabled: hasPermission(user, 'jobs:view'),
  });

  return (
    <StaffLayout
      title="Recruitment Command Center"
      subtitle="Organization hiring overview — pipeline, jobs, and analytics"
    >
      {hasPermission(user, 'analytics:org') &&
        (isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Applications"
              value={analytics?.summary?.totalApplications ?? 0}
              accent="brand"
              icon={<NavIcon name="layout" />}
            />
            <StatCard
              label="Active jobs"
              value={analytics?.summary?.activeJobs ?? 0}
              accent="accent"
              icon={<NavIcon name="briefcase" />}
            />
            <StatCard
              label="Hired"
              value={analytics?.summary?.hired ?? 0}
              accent="emerald"
              icon={<NavIcon name="chart" />}
            />
            <StatCard
              label="Conversion"
              value={`${analytics?.summary?.conversionRate || 0}%`}
              accent="amber"
              icon={<NavIcon name="target" />}
            />
          </div>
        ))}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {hasPermission(user, 'jobs:view') && (
          <Card
            title="Recent jobs"
            action={
              <Link to="/recruiter/jobs" className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
                View all
              </Link>
            }
          >
            {jobs?.length ? (
              jobs.map((j) => (
                <div
                  key={j._id}
                  className="flex justify-between gap-4 border-b border-slate-100 py-3 last:border-0 dark:border-slate-800"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900 dark:text-white">{j.title}</p>
                    <p className="text-sm text-slate-500">{j.company}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                    {j.applicants?.length || 0} applicants
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No jobs yet.</p>
            )}
          </Card>
        )}

        {hasPermission(user, 'analytics:org') && (
          <Card title="Hiring funnel">
            {analytics?.funnel?.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={analytics.funnel}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid rgb(226 232 240)',
                    }}
                  />
                  <Bar dataKey="count" fill="#3396fc" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-sm text-slate-500">No pipeline data yet</p>
            )}
          </Card>
        )}

        <Card title="Quick actions" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-3">
            {hasPermission(user, 'pipeline:view') && (
              <Link to="/recruiter/pipeline" className="glass-card-interactive flex items-center gap-3 p-4 !shadow-sm">
                <NavIcon name="kanban" />
                <span className="font-medium">Hiring pipeline</span>
              </Link>
            )}
            {hasPermission(user, 'jobs:view') && (
              <Link to="/recruiter/jobs" className="glass-card-interactive flex items-center gap-3 p-4 !shadow-sm">
                <NavIcon name="briefcase" />
                <span className="font-medium">Job postings</span>
              </Link>
            )}
            {careerSlug && (
              <Link
                to={`/careers/${careerSlug}`}
                target="_blank"
                rel="noreferrer"
                className="glass-card-interactive flex items-center gap-3 p-4 !shadow-sm"
              >
                <NavIcon name="globe" />
                <span className="font-medium">Career portal ↗</span>
              </Link>
            )}
          </div>
        </Card>
      </div>
    </StaffLayout>
  );
}
