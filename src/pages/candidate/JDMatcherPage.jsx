import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ScoreRing from '../../components/ui/ScoreRing';
import { candidateLinks } from '../../utils/navLinks';
import { jdMatchApi, resumeApi } from '../../api';
import toast from 'react-hot-toast';

const schema = Yup.object({
  resumeId: Yup.string().required('Select a resume'),
  jobTitle: Yup.string(),
  jobDescription: Yup.string().min(50).required('Job description required'),
});

export default function JDMatcherPage() {
  const [result, setResult] = useState(null);

  const { data: resumes } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => resumeApi.list().then((r) => r.data.data),
  });

  const { data: history } = useQuery({
    queryKey: ['jd-matches'],
    queryFn: () => jdMatchApi.list().then((r) => r.data.data),
  });

  const matchMutation = useMutation({
    mutationFn: jdMatchApi.create,
    onSuccess: ({ data }) => {
      setResult(data.data);
      toast.success('Match analysis complete!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Match failed'),
  });

  const readyResumes = resumes?.filter((r) => r.status === 'ready') || [];

  return (
    <DashboardLayout links={candidateLinks}>
      <h1 className="mb-6 text-2xl font-bold">Job Description Matcher</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card title="Compare Resume to JD">
          <Formik
            initialValues={{ resumeId: '', jobTitle: '', jobDescription: '' }}
            validationSchema={schema}
            onSubmit={(values) => matchMutation.mutate(values)}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Resume</label>
                  <select name="resumeId" value={values.resumeId} onChange={handleChange} className="input-field">
                    <option value="">Select resume</option>
                    {readyResumes.map((r) => (
                      <option key={r._id} value={r._id}>{r.fileName || r.title}</option>
                    ))}
                  </select>
                  {touched.resumeId && errors.resumeId && <p className="mt-1 text-sm text-red-600">{errors.resumeId}</p>}
                </div>
                <Input label="Job Title" name="jobTitle" value={values.jobTitle} onChange={handleChange} onBlur={handleBlur} />
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Job Description</label>
                  <textarea name="jobDescription" rows={8} value={values.jobDescription} onChange={handleChange} onBlur={handleBlur} className="input-field" placeholder="Paste the full job description..." />
                  {touched.jobDescription && errors.jobDescription && <p className="mt-1 text-sm text-red-600">{errors.jobDescription}</p>}
                </div>
                <Button type="submit" loading={matchMutation.isPending}>Analyze Match</Button>
              </Form>
            )}
          </Formik>
        </Card>

        {result && (
          <Card title="Match Results">
            <div className="flex justify-center mb-6">
              <ScoreRing score={result.matchPercentage} label="Match" />
            </div>
            {result.missingSkills?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-red-600 mb-2">Missing Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {result.missingSkills.map((s) => (
                    <span key={s} className="rounded bg-red-50 px-2 py-0.5 text-xs text-red-700">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {result.recommendations?.map((r, i) => (
              <p key={i} className="text-sm text-slate-600 mb-1">• {r}</p>
            ))}
          </Card>
        )}
      </div>

      {history?.length > 0 && (
        <Card title="Match History" className="mt-8">
          <div className="space-y-2">
            {history.map((m) => (
              <div key={m._id} className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
                <span>{m.jobTitle || 'Untitled'}</span>
                <span className="font-semibold text-brand-600">{m.matchPercentage}%</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}
