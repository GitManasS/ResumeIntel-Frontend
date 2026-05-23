import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ThemeToggle from '../ui/ThemeToggle';
import { loginUrl, registerUrl } from '../../utils/authRedirect';
import { isCandidate } from '../../utils/roles';

export default function CareerPortalShell({ organization, children }) {
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const primary = organization?.branding?.primaryColor || '#3396fc';
  const name = organization?.name || 'Careers';
  const signInPath = loginUrl(location.pathname);
  const registerPath = registerUrl(location.pathname);

  return (
    <div
      className="career-portal min-h-screen mesh-bg"
      style={{
        '--career-primary': primary,
        '--career-primary-rgb': hexToRgb(primary),
      }}
    >
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/75 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/75">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to={`/careers/${organization?.slug}`} className="flex min-w-0 items-center gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}
            >
              {name.charAt(0)}
            </span>
            <span className="truncate font-display text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              {name}
            </span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            {isAuthenticated && isCandidate(user) ? (
              <Link to="/candidate/jobs" className="btn-primary text-sm !shadow-[0_4px_14px_rgb(var(--career-primary-rgb)/0.35)]" style={{ background: `linear-gradient(135deg, ${primary}, ${adjustBrightness(primary, -15)})` }}>
                My job board
              </Link>
            ) : (
              <>
                <Link to={signInPath} className="btn-ghost hidden text-sm sm:inline-flex">
                  Sign in
                </Link>
                <Link to={registerPath} className="btn-primary text-sm !shadow-[0_4px_14px_rgb(var(--career-primary-rgb)/0.35)]" style={{ background: `linear-gradient(135deg, ${primary}, ${adjustBrightness(primary, -15)})` }}>
                  Apply now
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {children}

      <footer className="border-t border-slate-200/60 bg-white/50 py-10 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          {organization?.website && (
            <a
              href={organization.website}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium hover:underline"
              style={{ color: primary }}
            >
              Visit {organization.name} ↗
            </a>
          )}
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Powered by{' '}
            <Link to="/" className="font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300">
              ResumeIntel Hiring OS
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return '51 150 252';
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

function adjustBrightness(hex, percent) {
  const h = hex.replace('#', '');
  const num = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  if (Number.isNaN(num)) return hex;
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
