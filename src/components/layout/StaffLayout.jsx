import { useSelector } from 'react-redux';
import DashboardLayout from './DashboardLayout';
import OrgContextBar from '../org/OrgContextBar';
import PageHeader from '../ui/PageHeader';
import { getStaffNavLinks } from '../../utils/navLinks';
import { ORG_ROLE_LABELS, resolveEffectiveRole } from '../../utils/roles';

export default function StaffLayout({ children, title, subtitle, action }) {
  const { user } = useSelector((s) => s.auth);
  const links = getStaffNavLinks(user);
  const role = resolveEffectiveRole(user);
  const roleLabel = ORG_ROLE_LABELS[role] || role;

  return (
    <DashboardLayout links={links}>
      <OrgContextBar />
      {title && (
        <PageHeader
          title={title}
          subtitle={subtitle}
          action={action}
          badge={
            user?.orgRole ? (
              <span className="badge-brand">{roleLabel}</span>
            ) : null
          }
        />
      )}
      {children}
    </DashboardLayout>
  );
}
