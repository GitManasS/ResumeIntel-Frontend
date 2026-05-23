import { hasPermission, resolveEffectiveRole, ORG_ROLE_LABELS } from '../config/permissions';

export { hasPermission, resolveEffectiveRole, ORG_ROLE_LABELS };

export const isSuperAdmin = (user) =>
  user?.role === 'super_admin' || user?.platformRole === 'super_admin';

export const isCandidate = (user) => user?.role === 'candidate' && !user?.orgRole;

export const isOrgStaff = (user) =>
  Boolean(user?.orgRole) ||
  (user?.role === 'recruiter' && Boolean(user?.organization));

export const isRecruiterStaff = (user) => isOrgStaff(user);

export const isPlatformAdmin = (user) => isSuperAdmin(user);

export const getOrganizationId = (user) => {
  const org = user?.organization;
  if (!org) return null;
  return typeof org === 'object' ? org._id : org;
};

export const getOrganizationSlug = (user) => {
  const org = user?.organization;
  if (!org) return null;
  return typeof org === 'object' ? org.slug : null;
};

export const getHomePath = (user) => {
  if (!user) return '/login';
  if (isSuperAdmin(user)) return '/admin';
  if (isOrgStaff(user)) return '/recruiter';
  return '/candidate';
};

export const canAccessStaffPortal = (user) =>
  isOrgStaff(user) || (isSuperAdmin(user) && Boolean(localStorage.getItem('selectedOrganizationId')));
