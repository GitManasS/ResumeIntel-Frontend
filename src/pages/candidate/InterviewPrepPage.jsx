import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { candidateLinks } from '../../utils/navLinks';
import { interviewApi, resumeApi } from '../../api';
import toast from 'react-hot-toast';

const schema = Yup.object({
  targetRole: Yup.string().required('Target role required'),
  resumeId: Yup.string(),
});

const difficultyColors = { easy: 'bg-green-100 text-green-700', medium: 'bg-amber-100 text-amber-700', hard: 'bg-red-100 text-red-700' };
const categoryLabels = { hr: 'HR', technical: 'Technical', 'project-based': 'Project', behavioral: 'Behavioral' };

export default function InterviewPrepPage() {
  const [questions, setQuestions] = useState(null);

  const { data: resumes } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => resumeApi.list().then((r) => r.data.data),
  });

  const generateMutation = useMutation({
    mutationFn: interviewApi.generate,
    onSuccess: ({ data }) => {
      setQuestions(data.data.questions);
      toast.success('Questions generated!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Generation failed'),
  });

  return (
    <DashboardLayout links={candidateLinks}>
      <h1 className="mb-6 text-2xl font-bold">Interview Preparation</h1>

      <Card title="Generate Questions" className="mb-8 max-w-xl">
        <Formik
          initialValues={{ targetRole: '', resumeId: '' }}
          validationSchema={schema}
          onSubmit={(values) => generateMutation.mutate(values)}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form className="space-y-4">
              <Input label="Target Role" name="targetRole" value={values.targetRole} onChange={handleChange} onBlur={handleBlur} error={touched.targetRole && errors.targetRole} placeholder="e.g. Senior Frontend Engineer" />
              <div>
                <label className="mb-1.5 block text-sm font-medium">Resume (optional)</label>
                <select name="resumeId" value={values.resumeId} onChange={handleChange} className="input-field">
                  <option value="">None</option>
                  {resumes?.filter((r) => r.status === 'ready').map((r) => (
                    <option key={r._id} value={r._id}>{r.fileName}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" loading={generateMutation.isPending}>Generate Questions</Button>
            </Form>
          )}
        </Formik>
      </Card>

      {questions && (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <Card key={i}>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                  {categoryLabels[q.category] || q.category}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[q.difficulty]}`}>
                  {q.difficulty}
                </span>
              </div>
              <p className="font-medium text-slate-900">{q.text}</p>
              {q.tips?.length > 0 && (
                <ul className="mt-2 text-sm text-slate-500">
                  {q.tips.map((t, j) => <li key={j}>• {t}</li>)}
                </ul>
              )}
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
