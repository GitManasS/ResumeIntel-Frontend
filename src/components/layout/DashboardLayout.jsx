import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';

export default function DashboardLayout({ links, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen mesh-bg">
      <Navbar
        showMenu={Boolean(links?.length)}
        onMenuClick={() => setMobileOpen(true)}
      />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar links={links} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <main className="min-w-0 flex-1 p-4 pb-24 sm:p-6 lg:pb-8 lg:p-8">
          <div className="page-enter">{children}</div>
        </main>
      </div>
      <MobileBottomNav links={links} />
    </div>
  );
}
