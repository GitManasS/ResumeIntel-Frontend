import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasPermission } from '../config/permissions';
import {
  getHomePath,
  isRecruiterStaff,
  isSuperAdmin,
  isCandidate,
  canAccessStaffPortal,
} from '../utils/roles';

export default function ProtectedRoute({
  children,
  roles,
  staffOnly,
  candidateOnly,
  platformAdminOnly,
  permission,
}) {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!isAuthenticated && !localStorage.getItem('accessToken')) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) return children;

  if (platformAdminOnly && !isSuperAdmin(user)) {
    return <Navigate to={getHomePath(user)} replace />;
  }

  if (candidateOnly && !isCandidate(user)) {
    return <Navigate to={getHomePath(user)} replace />;
  }

  if (staffOnly) {
    if (isSuperAdmin(user)) {
      if (!canAccessStaffPortal(user)) {
        return <Navigate to="/admin" replace />;
      }
    } else if (!isRecruiterStaff(user)) {
      return <Navigate to={getHomePath(user)} replace />;
    }
  }

  if (roles?.length && !roles.includes(user.role)) {
    const orgRoleMatch = user.orgRole && roles.includes(user.orgRole);
    if (!orgRoleMatch) {
      return <Navigate to={getHomePath(user)} replace />;
    }
  }

  if (permission && !hasPermission(user, permission)) {
    return <Navigate to={getHomePath(user)} replace />;
  }

  return children;
}
