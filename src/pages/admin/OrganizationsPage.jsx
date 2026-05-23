import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PageHeader from '../../components/ui/PageHeader';
import { adminLinks } from '../../utils/navLinks';
import { organizationApi } from '../../api';

const orgSchema = Yup.object({
  name: Yup.string().min(2).required('Organization name is required'),
  slug: Yup.string().matches(/^[a-z0-9-]*$/, 'Lowercase letters, numbers, hyphens only'),
  industry: Yup.string(),
  size: Yup.string(),
  website: Yup.string().url('Must be a valid URL').nullable(),
  tagline: Yup.string(),
  primaryColor: Yup.string().matches(/^#[0-9A-Fa-f]{6}$/, 'Use hex color e.g. #3396fc'),
});

const SIZE_OPTIONS = ['1-10', '11-50', '51-200', '201-500', '500+'];

export default function OrganizationsPage() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: organizations, isLoading } = useQuery({
    queryKey: ['admin-organizations'],
    queryFn: () => organizationApi.list().then((r) => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: organizationApi.create,
    onSuccess: () => {
      toast.success('Organization created');
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
      queryClient.invalidateQueries({ queryKey: ['platform-analytics'] });
      setShowForm(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create organization'),
  });

  return (
    <DashboardLayout links={adminLinks}>
      <PageHeader
        title="Organizations"
        subtitle="Create tenants and assign org admins, HR managers, recruiters, and interviewers"
        badge={<span className="badge bg-accent-500/15 text-accent-600 dark:text-accent-400">Super Admin only</span>}
        action={
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Cancel' : '+ New organization'}
          </Button>
        }
      />

      {showForm && (
        <Card title="Create organization" className="mb-8">
          <Formik
            initialValues={{
              name: '',
              slug: '',
              industry: '',
              size: '51-200',
              website: '',
              tagline: '',
              primaryColor: '#3396fc',
            }}
            validationSchema={orgSchema}
            onSubmit={(values) => {
              createMutation.mutate({
                name: values.name,
                slug: values.slug || undefined,
                industry: values.industry || undefined,
                size: values.size || undefined,
                website: values.website || undefined,
                branding: {
                  primaryColor: values.primaryColor,
                  tagline: values.tagline,
                },
              });
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Organization name *"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && errors.name}
                  className="sm:col-span-2"
                />
                <Input
                  label="URL slug (optional)"
                  name="slug"
                  placeholder="auto-generated from name"
                  value={values.slug}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.slug && errors.slug}
                />
                <Input
                  label="Industry"
                  name="industry"
                  value={values.industry}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Company size
                  </label>
                  <select name="size" value={values.size} onChange={handleChange} className="input-field">
                    {SIZE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Website"
                  name="website"
                  type="url"
                  placeholder="https://"
                  value={values.website}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.website && errors.website}
                />
                <Input
                  label="Brand color"
                  name="primaryColor"
                  value={values.primaryColor}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.primaryColor && errors.primaryColor}
                />
                <Input
                  label="Tagline"
                  name="tagline"
                  value={values.tagline}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="sm:col-span-2"
                />
                <div className="sm:col-span-2">
                  <Button type="submit" loading={createMutation.isPending}>
                    Create organization
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      )}

      <Card title={`All organizations (${organizations?.length ?? 0})`}>
        {isLoading ? (
          <p className="py-12 text-center text-slate-500">Loading…</p>
        ) : organizations?.length ? (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700">
                  <th className="py-3 pr-4 font-semibold">Organization</th>
                  <th className="py-3 pr-4 font-semibold">Staff</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((org) => (
                  <tr
                    key={org._id}
                    className="border-b border-slate-100 transition hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-800/40"
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                          style={{ backgroundColor: org.branding?.primaryColor || '#3396fc' }}
                        >
                          {org.name?.charAt(0)}
                        </span>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{org.name}</p>
                          <p className="text-xs text-slate-500">/{org.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">{org.staffCount ?? 0}</td>
                    <td className="py-4 pr-4">
                      <span
                        className={`badge ${org.isActive !== false ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-slate-100 text-slate-600'}`}
                      >
                        {org.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4">
                      <Link
                        to={`/admin/organizations/${org._id}`}
                        className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
                      >
                        Manage team →
                      </Link>
                      <span className="mx-2 text-slate-300">|</span>
                      <Link
                        to={`/careers/${org.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-slate-600 hover:underline dark:text-slate-400"
                      >
                        Portal ↗
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-slate-600 dark:text-slate-400">No organizations yet.</p>
            <Button className="mt-4" onClick={() => setShowForm(true)}>
              Create your first organization
            </Button>
          </div>
        )}
      </Card>

      <div className="mt-6 rounded-xl border border-amber-200/60 bg-amber-50/80 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
        <strong>Role hierarchy per organization:</strong>
        <ul className="mt-2 list-inside list-disc space-y-1 opacity-90">
          <li><strong>Org Admin</strong> — full hiring + org settings for that tenant</li>
          <li><strong>HR Manager</strong> — pipeline, jobs, analytics (no platform access)</li>
          <li><strong>Recruiter</strong> — jobs, talent search, pipeline management</li>
          <li><strong>Interviewer</strong> — view-only pipeline</li>
        </ul>
      </div>
    </DashboardLayout>
  );
}
