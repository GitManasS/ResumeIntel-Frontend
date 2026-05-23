import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import { NavIcon } from '../../components/ui/icons';
import { analyticsApi } from '../../api';
import { adminLinks } from '../../utils/navLinks';
import { setSelectedOrganization } from '../../features/org/orgSlice';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['platform-analytics'],
    queryFn: () => analyticsApi.admin().then((r) => r.data.data),
  });

  const openOrg = (org) => {
    const id = org.id || org._id;
    dispatch(
      setSelectedOrganization({
        id: String(id),
        name: org.name,
        slug: org.slug,
      })
    );
    navigate('/recruiter');
  };

  return (
    <DashboardLayout links={adminLinks}>
      <PageHeader
        title="Platform administration"
        subtitle="Cross-organization overview. Open an organization to manage its hiring workspace."
        badge={<span className="badge bg-accent-500/15 text-accent-600 dark:text-accent-400">Super Admin</span>}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Organizations"
          value={isLoading ? '—' : data?.summary?.organizationCount ?? 0}
          accent="brand"
          icon={<NavIcon name="globe" />}
        />
        <StatCard
          label="Total staff"
          value={isLoading ? '—' : data?.summary?.totalStaff ?? 0}
          accent="accent"
          icon={<NavIcon name="briefcase" />}
        />
        <StatCard
          label="Candidates"
          value={isLoading ? '—' : data?.summary?.totalCandidates ?? 0}
          accent="emerald"
          icon={<NavIcon name="search" />}
        />
        <StatCard
          label="Applications"
          value={isLoading ? '—' : data?.summary?.totalApplications ?? 0}
          accent="amber"
          icon={<NavIcon name="chart" />}
        />
      </div>

      <Card title="Organizations" className="mb-8">
        {isLoading ? (
          <p className="py-12 text-center text-slate-500">Loading organizations…</p>
        ) : (
          <div className="overflow-x-auto scrollbar-thin -mx-2 px-2">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700">
                  <th className="py-3 pr-4 font-semibold">Organization</th>
                  <th className="py-3 pr-4 font-semibold">Staff</th>
                  <th className="py-3 pr-4 font-semibold">Jobs</th>
                  <th className="py-3 pr-4 font-semibold">Applications</th>
                  <th className="py-3 pr-4 font-semibold">Hired</th>
                  <th className="py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.organizations?.map((org) => (
                  <tr
                    key={org.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-800/50"
                  >
                    <td className="py-4 pr-4">
                      <p className="font-medium text-slate-900 dark:text-white">{org.name}</p>
                      <p className="text-xs text-slate-500">{org.slug}</p>
                    </td>
                    <td className="py-4 pr-4">{org.staffCount}</td>
                    <td className="py-4 pr-4">
                      <span className="text-emerald-600 dark:text-emerald-400">{org.activeJobs}</span>
                      <span className="text-slate-400"> / {org.jobCount}</span>
                    </td>
                    <td className="py-4 pr-4">{org.applicationCount}</td>
                    <td className="py-4 pr-4">{org.hiredCount}</td>
                    <td className="py-4">
                      <Link
                        to={`/admin/organizations/${org.id}`}
                        className="btn-primary text-xs py-2"
                      >
                        Manage
                      </Link>
                      <button
                        type="button"
                        onClick={() => openOrg(org)}
                        className="btn-secondary text-xs py-2 ml-2"
                      >
                        Workspace
                      </button>
                      <Link
                        to={`/careers/${org.slug}`}
                        className="ml-2 text-xs font-medium text-slate-600 hover:underline dark:text-slate-400"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Portal ↗
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Staff roles (all organizations)">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {data?.usersByOrgRole?.map((r) => (
            <div
              key={r.role}
              className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {r.role?.replace('_', ' ')}
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white">{r.count}</p>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}
