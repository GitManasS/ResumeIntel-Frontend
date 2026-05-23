import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import ScoreRing from '../../components/ui/ScoreRing';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { candidateLinks } from '../../utils/navLinks';
import { NavIcon } from '../../components/ui/icons';
import { analyticsApi, resumeApi, notificationApi } from '../../api';

const quickActions = [
  { to: '/candidate/jobs', label: 'Browse Jobs', desc: 'Apply to open roles', icon: 'briefcase', color: 'brand' },
  { to: '/candidate/applications', label: 'My Applications', desc: 'Track pipeline status', icon: 'applications', color: 'accent' },
  { to: '/candidate/resumes', label: 'Upload Resume', desc: 'Parse & score with ATS', icon: 'file', color: 'emerald' },
  { to: '/candidate/jd-match', label: 'JD Matcher', desc: 'Compare skills to roles', icon: 'target', color: 'amber' },
  { to: '/candidate/interview', label: 'Interview Prep', desc: 'AI-generated questions', icon: 'chat', color: 'violet' },
];

export default function CandidateDashboard() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['candidate-analytics'],
    queryFn: () => analyticsApi.candidate().then((r) => r.data.data),
  });

  const { data: resumes } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => resumeApi.list().then((r) => r.data.data),
  });

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.list({ limit: 5 }).then((r) => r.data),
  });

  const primaryResume = resumes?.find((r) => r.isPrimary) || resumes?.[0];
  const atsScore = analytics?.summary?.avgAtsScore || primaryResume?.atsAnalysis?.score || 0;

  return (
    <DashboardLayout links={candidateLinks}>
      <PageHeader
        title="Your career hub"
        subtitle="Track resume performance, match jobs, and prepare for interviews"
      />

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="ATS Score"
            value={`${atsScore}%`}
            subtext="Average across resumes"
            accent="brand"
            icon={<NavIcon name="target" />}
          />
          <StatCard label="Resumes" value={analytics?.summary?.totalResumes || 0} accent="accent" icon={<NavIcon name="file" />} />
          <StatCard label="JD Matches" value={analytics?.summary?.totalJdMatches || 0} accent="emerald" icon={<NavIcon name="chart" />} />
          <StatCard
            label="Avg match"
            value={`${analytics?.summary?.avgJdMatch || 0}%`}
            accent="amber"
            icon={<NavIcon name="layout" />}
          />
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card title="ATS overview" className="flex flex-col items-center justify-center lg:col-span-1">
          <ScoreRing score={atsScore} label="Your score" />
        </Card>

        <Card title="Quick actions" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="glass-card-interactive flex flex-col gap-2 p-4 !shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <NavIcon name={action.icon} />
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">{action.label}</span>
                <span className="text-xs text-slate-500">{action.desc}</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {notifications?.data?.length > 0 && (
        <Card title="Recent notifications" className="mt-6">
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.data.map((n) => (
              <li key={n._id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{n.title}</p>
                  <p className="text-sm text-slate-500">{n.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </DashboardLayout>
  );
}
