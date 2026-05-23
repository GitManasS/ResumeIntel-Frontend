import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import StaffLayout from '../../components/layout/StaffLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { hasPermission } from '../../config/permissions';
import { getOrganizationSlug } from '../../utils/roles';
import { extractPaginatedList } from '../../utils/apiHelpers';
import { jobApi } from '../../api';
import toast from 'react-hot-toast';

const schema = Yup.object({
  title: Yup.string().required(),
  company: Yup.string().required(),
  description: Yup.string().required(),
  location: Yup.string(),
  skills: Yup.string(),
});

export default function JobPostingsPage() {
  const { user } = useSelector((s) => s.auth);
  const org = useSelector((s) => s.org);
  const canManage = hasPermission(user, 'jobs:manage');
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const careerSlug = org.selectedOrganizationSlug || getOrganizationSlug(user);
  const defaultCompany =
    org.selectedOrganizationName || user?.organization?.name || '';

  const { data: jobs = [], isLoading, isError, error } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: () => jobApi.myJobs({ limit: 100 }).then(extractPaginatedList),
  });

  const createMutation = useMutation({
    mutationFn: jobApi.create,
    onSuccess: () => {
      toast.success('Job created!');
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      setShowForm(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  return (
    <StaffLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Job Postings</h1>
        {canManage && (
          <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'New Job'}</Button>
        )}
      </div>

      {canManage && showForm && (
        <Card title="Create Job" className="mb-8">
          <Formik
            initialValues={{
              title: '',
              company: defaultCompany,
              location: '',
              description: '',
              skills: '',
              employmentType: 'full-time',
            }}
            enableReinitialize
            validationSchema={schema}
            onSubmit={(values) => {
              createMutation.mutate({
                ...values,
                skills: values.skills ? values.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
                status: 'active',
                employmentType: values.employmentType || 'full-time',
              });
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form className="grid gap-4 sm:grid-cols-2">
                <Input label="Title" name="title" value={values.title} onChange={handleChange} onBlur={handleBlur} error={touched.title && errors.title} />
                <Input label="Company" name="company" value={values.company} onChange={handleChange} onBlur={handleBlur} error={touched.company && errors.company} />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Employment type
                  </label>
                  <select name="employmentType" value={values.employmentType} onChange={handleChange} className="input-field">
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="remote">Remote</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <Input label="Location" name="location" value={values.location} onChange={handleChange} onBlur={handleBlur} className="sm:col-span-2" />
                <Input label="Skills (comma-separated)" name="skills" value={values.skills} onChange={handleChange} onBlur={handleBlur} className="sm:col-span-2" />
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium">Description</label>
                  <textarea name="description" rows={6} value={values.description} onChange={handleChange} onBlur={handleBlur} className="input-field" />
                </div>
                <Button type="submit" loading={createMutation.isPending}>Publish Job</Button>
              </Form>
            )}
          </Formik>
        </Card>
      )}

      {careerSlug && jobs.length > 0 && (
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Active jobs appear on your{' '}
          <Link to={`/careers/${careerSlug}`} target="_blank" rel="noreferrer" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
            career portal ↗
          </Link>
        </p>
      )}

      <div className="space-y-4">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800/80" />
            ))}
          </div>
        )}
        {isError && (
          <Card>
            <p className="text-red-600 dark:text-red-400">
              {error?.response?.data?.message || 'Could not load jobs. Check organization context.'}
            </p>
          </Card>
        )}
        {!isLoading && !isError && jobs.length === 0 && (
          <Card>
            <p className="text-center text-slate-600 dark:text-slate-400">
              No job postings yet. Create your first job to show it here and on the career portal.
            </p>
          </Card>
        )}
        {!isLoading &&
          !isError &&
          jobs.map((job) => (
            <Card key={job._id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{job.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {job.company} · {job.location || 'Remote'} · {job.employmentType || 'full-time'}
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      job.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                    {job.applicants?.length || 0}
                  </p>
                  <p className="text-sm text-slate-500">applicants</p>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </StaffLayout>
  );
}
