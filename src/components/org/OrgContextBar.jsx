import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { isSuperAdmin, getOrganizationId } from '../../utils/roles';

export default function OrgContextBar() {
  const { user } = useSelector((s) => s.auth);
  const org = useSelector((s) => s.org);

  if (!user) return null;

  const orgName =
    org.selectedOrganizationName || user.organization?.name || 'No organization selected';
  const orgSlug = org.selectedOrganizationSlug || user.organization?.slug;

  if (isSuperAdmin(user)) {
    return (
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300/50 bg-gradient-to-r from-amber-50 to-orange-50/80 px-4 py-4 shadow-sm dark:border-amber-500/30 dark:from-amber-500/10 dark:to-orange-500/5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-amber-800 dark:text-amber-300">
              Platform admin view
            </p>
            <p className="font-semibold text-amber-950 dark:text-amber-100">
              {org.selectedOrganizationId ? orgName : 'Select an organization to manage hiring'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin" className="btn-secondary text-sm dark:border-amber-500/30">
            All organizations
          </Link>
          {!org.selectedOrganizationId && (
            <Link to="/admin" className="btn-primary bg-amber-700 from-amber-700 to-amber-600 text-sm hover:from-amber-800 hover:to-amber-700">
              Choose org
            </Link>
          )}
        </div>
      </div>
    );
  }

  const orgId = getOrganizationId(user);
  if (!orgId) {
    return (
      <div className="mb-6 rounded-2xl border border-red-300/50 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
        Your account is not linked to an organization. Contact your administrator.
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-200/50 bg-gradient-to-r from-brand-50/80 to-white px-4 py-4 shadow-sm dark:border-brand-500/20 dark:from-brand-500/10 dark:to-slate-900/50">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Organization</p>
          <p className="font-semibold text-slate-900 dark:text-white">{orgName}</p>
        </div>
      </div>
      {orgSlug && (
        <Link
          to={`/careers/${orgSlug}`}
          className="btn-secondary text-sm"
          target="_blank"
          rel="noreferrer"
        >
          Career portal ↗
        </Link>
      )}
    </div>
  );
}
