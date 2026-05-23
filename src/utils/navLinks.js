import { hasPermission } from '../config/permissions';
import { isSuperAdmin } from './roles';

export const candidateLinks = [
  { to: '/candidate', label: 'Overview', icon: 'layout' },
  { to: '/candidate/jobs', label: 'Jobs', icon: 'briefcase' },
  { to: '/candidate/applications', label: 'My Applications', icon: 'applications' },
  { to: '/candidate/resumes', label: 'Resumes', icon: 'file' },
  { to: '/candidate/jd-match', label: 'JD Matcher', icon: 'target' },
  { to: '/candidate/interview', label: 'Interview Prep', icon: 'chat' },
  { to: '/candidate/analytics', label: 'Analytics', icon: 'chart' },
];

export const adminLinks = [
  { to: '/admin', label: 'Platform Overview', icon: 'globe' },
  { to: '/admin/organizations', label: 'Organizations', icon: 'building' },
];

const staffLinkDefs = [
  { to: '/recruiter', label: 'Command Center', icon: 'layout', permission: 'pipeline:view' },
  { to: '/recruiter/pipeline', label: 'Hiring Pipeline', icon: 'kanban', permission: 'pipeline:view' },
  { to: '/recruiter/jobs', label: 'Job Postings', icon: 'briefcase', permission: 'jobs:view' },
  { to: '/recruiter/candidates', label: 'Talent Search', icon: 'search', permission: 'candidates:search' },
  { to: '/recruiter/analytics', label: 'Hiring Analytics', icon: 'chart', permission: 'analytics:org' },
];

export function getStaffNavLinks(user) {
  if (!user) return [];
  return staffLinkDefs
    .filter((item) => hasPermission(user, item.permission))
    .map(({ permission, ...link }) => link);
}

export function getNavLinksForUser(user) {
  if (!user) return [];
  if (isSuperAdmin(user)) return adminLinks;
  if (user.orgRole || user.role === 'recruiter') return getStaffNavLinks(user);
  return candidateLinks;
}
