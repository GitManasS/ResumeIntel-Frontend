import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import ThemeToggle from '../components/ui/ThemeToggle';

const features = [
  {
    title: 'Hiring Pipeline',
    desc: 'Kanban workflow from Applied to Hired with drag-and-drop and audit history.',
    icon: 'kanban',
    gradient: 'from-brand-500 to-cyan-400',
  },
  {
    title: 'Multi-Tenant SaaS',
    desc: 'Isolated organizations, roles, career portals, and team permissions.',
    icon: 'globe',
    gradient: 'from-accent-500 to-brand-500',
  },
  {
    title: 'Real-Time Collaboration',
    desc: 'Live pipeline updates, notes, and team notifications.',
    icon: 'chat',
    gradient: 'from-violet-500 to-accent-500',
  },
  {
    title: 'AI Candidate Tools',
    desc: 'ATS analysis, JD matching, and interview prep for applicants.',
    icon: 'target',
    gradient: 'from-emerald-500 to-teal-400',
  },
];

const featureIcons = {
  kanban: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
  ),
  globe: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
  ),
  chat: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  ),
  target: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  ),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen mesh-bg">
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-6 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-50" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center page-enter">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200/60 bg-brand-50/80 px-4 py-1.5 text-sm font-medium text-brand-800 backdrop-blur dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            AI-assisted recruitment platform
          </div>

          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
            Hire smarter with a{' '}
            <span className="bg-gradient-to-r from-brand-600 via-accent-500 to-brand-500 bg-clip-text text-transparent">
              modern Hiring OS
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Kanban pipelines, multi-tenant organizations, career portals, and real-time analytics —
            plus AI tools that help candidates shine.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="btn-primary px-8 py-3 text-base shadow-glow">
              Start free
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-3 text-base">
              Sign in
            </Link>
          </div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4 rounded-2xl border border-slate-200/60 bg-white/50 p-6 backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/50 sm:gap-8">
            {[
              { value: '2+', label: 'Demo orgs' },
              { value: '8', label: 'Pipeline stages' },
              { value: '24/7', label: 'Real-time sync' },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold text-brand-600 dark:text-brand-400 sm:text-3xl">
                  {s.value}
                </p>
                <p className="text-xs text-slate-500 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Built for teams & candidates
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
            Everything you need to run hiring at scale — beautifully on desktop and mobile.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card-interactive group page-enter"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} text-white shadow-lg transition group-hover:scale-110`}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {featureIcons[f.icon]}
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200/60 py-10 text-center dark:border-slate-800">
        <div className="flex items-center justify-center gap-3">
          <ThemeToggle />
          <p className="text-sm text-slate-500">
            ResumeIntel &copy; {new Date().getFullYear()} — Hiring OS
          </p>
        </div>
      </footer>
    </div>
  );
}
