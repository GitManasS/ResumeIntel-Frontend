import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import ScoreRing from '../../components/ui/ScoreRing';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { NavIcon } from '../../components/ui/icons';
import AnalyticsTooltip from '../../components/charts/AnalyticsTooltip';
import { useChartTheme, formatChartDate } from '../../components/charts/chartTheme';
import { candidateLinks } from '../../utils/navLinks';
import { analyticsApi } from '../../api';

const SKILL_COLORS = ['#3396fc', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

function EmptyChart({ title, description, actionLabel, actionTo }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300/80 bg-slate-50/50 px-6 py-10 text-center dark:border-slate-600/50 dark:bg-slate-800/30">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
        <NavIcon name="chart" />
      </div>
      <p className="font-medium text-slate-800 dark:text-slate-200">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {actionTo && (
        <Link to={actionTo} className="btn-primary mt-4 text-sm">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

function InsightItem({ icon, title, body, tone = 'brand' }) {
  const tones = {
    brand: 'bg-brand-500/10 text-brand-700 dark:text-brand-300',
    emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    amber: 'bg-amber-500/10 text-amber-800 dark:text-amber-300',
  };

  return (
    <div className="flex gap-3 rounded-xl border border-slate-200/60 bg-white/60 p-3 dark:border-slate-700/50 dark:bg-slate-800/40">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm ${tones[tone]}`}>
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{body}</p>
      </div>
    </div>
  );
}

export default function CandidateAnalyticsPage() {
  const themeMode = useSelector((s) => s.theme?.mode || 'light');
  const isDark = themeMode === 'dark';
  const chartTheme = useChartTheme(isDark);

  const { data, isLoading } = useQuery({
    queryKey: ['candidate-analytics'],
    queryFn: () => analyticsApi.candidate().then((r) => r.data.data),
  });

  const atsChartData = useMemo(
    () =>
      (data?.atsTrend || []).map((point) => ({
        ...point,
        dateLabel: formatChartDate(point.date),
      })),
    [data?.atsTrend]
  );

  const insights = useMemo(() => {
    const avg = data?.summary?.avgAtsScore || 0;
    const items = [];
    if (avg >= 80) {
      items.push({
        icon: '★',
        title: 'Strong ATS profile',
        body: 'Your resumes are well structured for applicant tracking systems. Keep tailoring per role.',
        tone: 'emerald',
      });
    } else if (avg > 0 && avg < 60) {
      items.push({
        icon: '!',
        title: 'Room to improve',
        body: 'Use standard headings, add role keywords, and quantify achievements to boost your score.',
        tone: 'amber',
      });
    }
    if ((data?.summary?.totalJdMatches || 0) > 0) {
      items.push({
        icon: '◎',
        title: 'JD matching active',
        body: `You've run ${data.summary.totalJdMatches} job description match${data.summary.totalJdMatches > 1 ? 'es' : ''}. Aim for 75%+ on target roles.`,
        tone: 'brand',
      });
    }
    if ((data?.skillDistribution?.length || 0) < 5) {
      items.push({
        icon: '+',
        title: 'Expand your skill map',
        body: 'Upload an updated resume or add projects so your skill distribution reflects your full stack.',
        tone: 'brand',
      });
    }
    return items.slice(0, 3);
  }, [data]);

  const latestAts = atsChartData.length ? atsChartData[atsChartData.length - 1].score : data?.summary?.avgAtsScore || 0;

  return (
    <DashboardLayout links={candidateLinks}>
      <PageHeader
        title="Your analytics"
        subtitle="Track ATS performance, skills, and job match history over time"
        action={
          <Link to="/candidate/resumes" className="btn-secondary text-sm">
            Upload resume
          </Link>
        }
      />

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Avg ATS score"
              value={`${data?.summary?.avgAtsScore ?? 0}%`}
              subtext="Across analyzed resumes"
              accent="brand"
              icon={<NavIcon name="target" />}
            />
            <StatCard
              label="Resumes ready"
              value={data?.summary?.totalResumes ?? 0}
              accent="accent"
              icon={<NavIcon name="file" />}
            />
            <StatCard
              label="JD matches"
              value={data?.summary?.totalJdMatches ?? 0}
              accent="emerald"
              icon={<NavIcon name="chart" />}
            />
            <StatCard
              label="Avg JD match"
              value={`${data?.summary?.avgJdMatch ?? 0}%`}
              accent="amber"
              icon={<NavIcon name="layout" />}
            />
          </div>

          {/* Hero: score + insights */}
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <Card className="flex flex-col items-center justify-center py-8 lg:col-span-1">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Latest ATS</p>
              <ScoreRing score={latestAts} size={140} label="Compatibility" />
              <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                {atsChartData.length > 1
                  ? `${atsChartData.length} analyses tracked`
                  : 'Upload a resume to get your first score'}
              </p>
            </Card>

            <Card title="Insights for you" className="lg:col-span-2">
              {insights.length > 0 ? (
                <div className="space-y-3">
                  {insights.map((item) => (
                    <InsightItem key={item.title} {...item} />
                  ))}
                </div>
              ) : (
                <EmptyChart
                  title="No insights yet"
                  description="Upload and analyze a resume to unlock personalized tips."
                  actionLabel="Go to resumes"
                  actionTo="/candidate/resumes"
                />
              )}
            </Card>
          </div>

          {/* Charts */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card title="ATS score trend">
              {atsChartData.length > 0 ? (
                <div className="h-[min(280px,50vw)] w-full min-h-[220px] sm:h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={atsChartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                      <defs>
                        <linearGradient id="atsLineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={chartTheme.primary} />
                          <stop offset="100%" stopColor={chartTheme.accent} />
                        </linearGradient>
                        <linearGradient id="atsAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartTheme.primary} stopOpacity={0.25} />
                          <stop offset="100%" stopColor={chartTheme.primary} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                      <XAxis
                        dataKey="dateLabel"
                        tick={{ fill: chartTheme.axis, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: chartTheme.axis, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={32}
                      />
                      <Tooltip
                        content={
                          <AnalyticsTooltip theme={chartTheme} valueLabel="ATS score" />
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="url(#atsLineGradient)"
                        strokeWidth={3}
                        dot={{ r: 4, fill: chartTheme.primary, strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: chartTheme.accent }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyChart
                  title="No ATS history"
                  description="Each time you upload or re-analyze a resume, your score trend appears here."
                  actionLabel="Upload resume"
                  actionTo="/candidate/resumes"
                />
              )}
            </Card>

            <Card title="Top skills">
              {data?.skillDistribution?.length > 0 ? (
                <div className="h-[min(280px,50vw)] w-full min-h-[220px] sm:h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.skillDistribution.slice(0, 8)}
                      layout="vertical"
                      margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} horizontal={false} />
                      <XAxis
                        type="number"
                        tick={{ fill: chartTheme.axis, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={72}
                        tick={{ fill: chartTheme.axis, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        content={
                          <AnalyticsTooltip theme={chartTheme} valueLabel="Mentions" />
                        }
                      />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={22}>
                        {data.skillDistribution.slice(0, 8).map((_, i) => (
                          <Cell key={i} fill={SKILL_COLORS[i % SKILL_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyChart
                  title="No skills detected"
                  description="Skills are extracted when your resume is parsed. Try uploading a PDF with a clear skills section."
                  actionLabel="Upload resume"
                  actionTo="/candidate/resumes"
                />
              )}
            </Card>
          </div>

          {/* Recent JD matches */}
          {data?.recentJdMatches?.length > 0 && (
            <Card title="Recent JD matches" className="mt-8">
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.recentJdMatches.map((match) => (
                  <li
                    key={match._id}
                    className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900 dark:text-white">
                        {match.label || match.metadata?.jobTitle || 'Job match'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatChartDate(match.recordedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 sm:w-32">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-brand-500"
                          style={{ width: `${Math.min(100, match.value || 0)}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-sm font-bold text-slate-900 dark:text-white">
                        {match.value}%
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                to="/candidate/jd-match"
                className="mt-4 inline-flex text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
              >
                Run another JD match →
              </Link>
            </Card>
          )}

          {/* CTA */}
          <section className="mt-8 overflow-hidden rounded-2xl border border-brand-200/50 bg-gradient-to-br from-brand-500/10 via-transparent to-accent-500/10 p-6 text-center sm:p-8 dark:border-brand-500/20">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              Improve your next score
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
              Re-analyze with a target role, match against a job description, or practice interview questions.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link to="/candidate/resumes" className="btn-primary text-sm">
                Manage resumes
              </Link>
              <Link to="/candidate/jd-match" className="btn-secondary text-sm">
                JD matcher
              </Link>
              <Link to="/candidate/interview" className="btn-secondary text-sm">
                Interview prep
              </Link>
            </div>
          </section>
        </>
      )}
    </DashboardLayout>
  );
}
