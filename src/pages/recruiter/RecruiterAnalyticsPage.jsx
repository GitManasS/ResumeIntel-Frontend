import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StaffLayout from '../../components/layout/StaffLayout';
import Card from '../../components/ui/Card';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { hiringApi } from '../../api';

const COLORS = ['#0c87e8', '#36a5f8', '#7cc4fc', '#b9dffd'];

export default function RecruiterAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['hiring-analytics'],
    queryFn: () => hiringApi.analytics().then((r) => r.data.data),
  });

  return (
    <StaffLayout>
      <h1 className="mb-6 text-2xl font-bold">Hiring Analytics</h1>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2"><CardSkeleton /><CardSkeleton /></div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Job Performance">
            {data?.jobsPerformance?.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.jobsPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applicants" fill="#0c87e8" name="Applicants" />
                  <Bar dataKey="hired" fill="#22c55e" name="Hired" />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="py-12 text-center text-sm text-slate-500">No job data</p>}
          </Card>

          <Card title="Pipeline Distribution">
            {data?.pipelineDistribution?.some((s) => s.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={data.pipelineDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {data.pipelineDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="py-12 text-center text-sm text-slate-500">No pipeline data</p>}
          </Card>
        </div>
      )}
    </StaffLayout>
  );
}
