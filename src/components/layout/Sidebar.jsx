import { NavLink } from 'react-router-dom';
import { NavIcon } from '../ui/icons';

export default function Sidebar({ links, mobileOpen, onClose }) {
  const content = (
    <nav className="flex flex-col gap-1 p-4">
      <p className="mb-2 hidden px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 lg:block">
        Navigation
      </p>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/candidate' || link.to === '/recruiter' || link.to === '/admin'}
          onClick={onClose}
          className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : 'hover:bg-slate-100 dark:hover:bg-slate-800/80'}`}
        >
          <NavIcon name={link.icon} />
          {link.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-20 m-4 mr-0 rounded-2xl glass-panel">{content}</div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close menu"
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(280px,85vw)] flex-col glass-panel shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-200/80 p-4 dark:border-slate-700">
              <span className="font-display text-lg font-bold text-brand-600 dark:text-brand-400">Menu</span>
              <button type="button" onClick={onClose} className="btn-ghost h-9 w-9 rounded-lg p-0">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin">{content}</div>
          </aside>
        </div>
      )}
    </>
  );
}
