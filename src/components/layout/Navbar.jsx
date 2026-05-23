import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import ThemeToggle from '../ui/ThemeToggle';
import {
  getHomePath,
  isSuperAdmin,
  isOrgStaff,
  ORG_ROLE_LABELS,
  resolveEffectiveRole,
} from '../../utils/roles';

export default function Navbar({ showMenu, onMenuClick }) {
  const { user } = useSelector((s) => s.auth);
  const org = useSelector((s) => s.org);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setUserMenuOpen(false);
  };

  const dashboardPath = user ? getHomePath(user) : '/login';
  const roleLabel = user?.orgRole
    ? ORG_ROLE_LABELS[resolveEffectiveRole(user)]
    : isSuperAdmin(user)
      ? 'Super Admin'
      : null;

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {showMenu && (
            <button
              type="button"
              onClick={onMenuClick}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-surface text-slate-600 lg:hidden dark:border-slate-700 dark:text-slate-300"
              aria-label="Open menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <Link to="/" className="group flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white shadow-md shadow-brand-500/30">
              R
            </span>
            <span className="hidden sm:block">
              <span className="font-display text-xl font-bold text-slate-900 dark:text-white">ResumeIntel</span>
              <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-500">Hiring OS</span>
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {user ? (
            <>
              <Link
                to={dashboardPath}
                className="btn-ghost hidden sm:inline-flex"
              >
                Dashboard
              </Link>
              {isOrgStaff(user) && !isSuperAdmin(user) && (
                <Link to="/recruiter" className="btn-ghost hidden md:inline-flex">
                  Hiring
                </Link>
              )}
              {isSuperAdmin(user) && org.selectedOrganizationId && (
                <Link to="/recruiter" className="btn-ghost hidden md:inline-flex">
                  Workspace
                </Link>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-surface py-1.5 pl-1.5 pr-3 transition hover:border-brand-300 dark:border-slate-600 dark:hover:border-brand-500/50"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-xs font-bold text-white">
                    {initials || '?'}
                  </span>
                  <span className="hidden max-w-[120px] truncate text-left text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">
                    {user.name?.split(' ')[0]}
                  </span>
                </button>

                {userMenuOpen && (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                      aria-label="Close menu"
                    />
                    <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200/80 bg-white p-2 shadow-card-hover dark:border-slate-700 dark:bg-slate-900">
                      <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-700">
                        <p className="truncate font-medium text-slate-900 dark:text-white">{user.name}</p>
                        {roleLabel && <p className="text-xs text-slate-500">{roleLabel}</p>}
                      </div>
                      <Link
                        to={dashboardPath}
                        onClick={() => setUserMenuOpen(false)}
                        className="mt-1 block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        Dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost hidden sm:inline-flex">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
