import { NavLink } from 'react-router-dom';
import { NavIcon } from '../ui/icons';

export default function MobileBottomNav({ links }) {
  if (!links?.length) return null;

  const visible = links.slice(0, 5);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-white/90 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl lg:hidden dark:border-slate-700/80 dark:bg-slate-900/90">
      <div className="flex items-center justify-around gap-1">
        {visible.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={
              link.to === '/candidate' ||
              link.to === '/recruiter' ||
              link.to === '/admin' ||
              link.to === '/admin/organizations'
            }
            className={({ isActive }) =>
              `flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-medium transition ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`
            }
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg [&_svg]:h-5 [&_svg]:w-5">
              <NavIcon name={link.icon} />
            </span>
            <span className="w-full truncate text-center">{link.label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
