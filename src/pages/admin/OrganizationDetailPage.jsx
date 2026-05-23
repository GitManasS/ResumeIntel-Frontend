import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PageHeader from '../../components/ui/PageHeader';
import { ORG_ROLE_LABELS } from '../../utils/roles';
import { adminLinks } from '../../utils/navLinks';
import { organizationApi } from '../../api';
import { setSelectedOrganization } from '../../features/org/orgSlice';
import { useDispatch } from 'react-redux';

const memberSchema = Yup.object({
  name: Yup.string().min(2).required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Min 8 characters').required('Password is required'),
  orgRole: Yup.string().required('Select a role'),
  title: Yup.string(),
});

const ROLE_OPTIONS = [
  { value: 'org_admin', label: 'Organization Admin', desc: 'Full access for this org' },
  { value: 'hr_manager', label: 'HR Manager', desc: 'Hiring + analytics' },
  { value: 'recruiter', label: 'Recruiter', desc: 'Jobs, pipeline, talent search' },
  { value: 'interviewer', label: 'Interviewer', desc: 'View pipeline only' },
];

const roleBadgeClass = {
  org_admin: 'bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-300',
  hr_manager: 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300',
  recruiter: 'bg-brand-100 text-brand-800 dark:bg-brand-500/20 dark:text-brand-300',
  interviewer: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
};

export default function OrganizationDetailPage() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [showAddMember, setShowAddMember] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-organization', orgId],
    queryFn: () => organizationApi.get(orgId).then((r) => r.data.data),
    enabled: Boolean(orgId),
  });

  const addMemberMutation = useMutation({
    mutationFn: (body) => organizationApi.addMember(orgId, body),
    onSuccess: () => {
      toast.success('Team member added');
      queryClient.invalidateQueries({ queryKey: ['admin-organization', orgId] });
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
      setShowAddMember(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add member'),
  });

  const deactivateMutation = useMutation({
    mutationFn: (userId) => organizationApi.updateMember(orgId, userId, { isActive: false }),
    onSuccess: () => {
      toast.success('Member deactivated');
      queryClient.invalidateQueries({ queryKey: ['admin-organization', orgId] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update'),
  });

  const openWorkspace = () => {
    if (!data?.organization) return;
    const org = data.organization;
    dispatch(
      setSelectedOrganization({
        id: org._id,
        name: org.name,
        slug: org.slug,
      })
    );
    navigate('/recruiter');
  };

  if (isLoading) {
    return (
      <DashboardLayout links={adminLinks}>
        <p className="py-20 text-center text-slate-500">Loading organization…</p>
      </DashboardLayout>
    );
  }

  if (!data?.organization) {
    return (
      <DashboardLayout links={adminLinks}>
        <Card>
          <p>Organization not found.</p>
          <Link to="/admin/organizations" className="btn-primary mt-4 inline-flex">
            Back to organizations
          </Link>
        </Card>
      </DashboardLayout>
    );
  }

  const { organization, members } = data;
  const primary = organization.branding?.primaryColor || '#3396fc';

  return (
    <DashboardLayout links={adminLinks}>
      <Link
        to="/admin/organizations"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400"
      >
        ← All organizations
      </Link>

      <PageHeader
        title={organization.name}
        subtitle={organization.branding?.tagline || `Career portal: /careers/${organization.slug}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={openWorkspace}>
              Open hiring workspace
            </Button>
            <Link
              to={`/careers/${organization.slug}`}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              Career portal ↗
            </Link>
          </div>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="!p-4">
          <p className="text-xs font-medium uppercase text-slate-500">Team members</p>
          <p className="mt-1 text-2xl font-bold">{members?.length ?? 0}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs font-medium uppercase text-slate-500">Industry</p>
          <p className="mt-1 font-semibold">{organization.industry || '—'}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs font-medium uppercase text-slate-500">Brand</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-6 w-6 rounded-md border" style={{ backgroundColor: primary }} />
            <span className="text-sm font-mono">{primary}</span>
          </div>
        </Card>
      </div>

      <Card
        title="Team & hierarchy"
        action={
          <Button onClick={() => setShowAddMember((v) => !v)}>
            {showAddMember ? 'Cancel' : '+ Add member'}
          </Button>
        }
      >
        {showAddMember && (
          <div className="mb-8 rounded-xl border border-brand-200/50 bg-brand-50/30 p-4 dark:border-brand-500/20 dark:bg-brand-500/5">
            <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">Add staff user</h4>
            <Formik
              initialValues={{
                name: '',
                email: '',
                password: '',
                orgRole: 'org_admin',
                title: '',
              }}
              validationSchema={memberSchema}
              onSubmit={(values) => addMemberMutation.mutate(values)}
            >
              {({ values, errors, touched, handleChange, handleBlur }) => (
                <Form className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Full name *"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && errors.name}
                  />
                  <Input
                    label="Job title"
                    name="title"
                    placeholder="e.g. Head of Talent"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Input
                    label="Email *"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && errors.email}
                  />
                  <Input
                    label="Temporary password *"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && errors.password}
                  />
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Organization role *
                    </label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {ROLE_OPTIONS.map((role) => (
                        <label
                          key={role.value}
                          className={`flex cursor-pointer flex-col rounded-xl border p-3 transition ${
                            values.orgRole === role.value
                              ? 'border-brand-500 bg-brand-50/50 ring-1 ring-brand-500/30 dark:bg-brand-500/10'
                              : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="orgRole"
                            value={role.value}
                            checked={values.orgRole === role.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <span className="text-sm font-semibold">{role.label}</span>
                          <span className="text-xs text-slate-500">{role.desc}</span>
                        </label>
                      ))}
                    </div>
                    {touched.orgRole && errors.orgRole && (
                      <p className="mt-1 text-sm text-red-600">{errors.orgRole}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Button type="submit" loading={addMemberMutation.isPending}>
                      Create account
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {members?.length ? (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700">
                  <th className="py-3 pr-4 font-semibold">Name</th>
                  <th className="py-3 pr-4 font-semibold">Email</th>
                  <th className="py-3 pr-4 font-semibold">Role</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member._id}
                    className="border-b border-slate-100 dark:border-slate-800"
                  >
                    <td className="py-3 pr-4">
                      <p className="font-medium text-slate-900 dark:text-white">{member.name}</p>
                      {member.title && (
                        <p className="text-xs text-slate-500">{member.title}</p>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">{member.email}</td>
                    <td className="py-3 pr-4">
                      <span className={`badge ${roleBadgeClass[member.orgRole] || ''}`}>
                        {ORG_ROLE_LABELS[member.orgRole] || member.orgRole}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`badge ${member.isActive !== false ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-red-100 text-red-800'}`}
                      >
                        {member.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3">
                      {member.isActive !== false && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Deactivate ${member.name}?`)) {
                              deactivateMutation.mutate(member._id);
                            }
                          }}
                          className="text-sm text-red-600 hover:underline dark:text-red-400"
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-8 text-center text-slate-500">
            No staff yet. Add an <strong>Organization Admin</strong> first so they can manage hiring.
          </p>
        )}
      </Card>
    </DashboardLayout>
  );
}
