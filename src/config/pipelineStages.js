/** Pipeline stage visual tokens — light & dark */
export const PIPELINE_STAGES = [
  {
    id: 'applied',
    label: 'Applied',
    shortLabel: 'Applied',
    dot: 'bg-slate-400',
    accent: 'border-l-slate-400',
    column:
      'border-slate-200/70 bg-gradient-to-b from-slate-50/95 to-slate-100/50 dark:border-slate-600/40 dark:from-slate-800/60 dark:to-slate-900/40',
    header: 'text-slate-700 dark:text-slate-200',
    badge: 'bg-slate-200/90 text-slate-700 ring-slate-300/50 dark:bg-slate-700/90 dark:text-slate-100 dark:ring-slate-500/30',
    dropZone: 'bg-slate-300/25 ring-slate-400/30 dark:bg-slate-500/15 dark:ring-slate-400/20',
  },
  {
    id: 'screening',
    label: 'Screening',
    shortLabel: 'Screen',
    dot: 'bg-sky-500',
    accent: 'border-l-sky-500',
    column:
      'border-sky-200/70 bg-gradient-to-b from-sky-50/95 to-sky-100/40 dark:border-sky-500/25 dark:from-sky-950/50 dark:to-slate-900/40',
    header: 'text-sky-800 dark:text-sky-200',
    badge: 'bg-sky-100 text-sky-800 ring-sky-200/60 dark:bg-sky-500/20 dark:text-sky-200 dark:ring-sky-500/30',
    dropZone: 'bg-sky-200/35 ring-sky-400/35 dark:bg-sky-500/15 dark:ring-sky-400/25',
  },
  {
    id: 'shortlisted',
    label: 'Shortlisted',
    shortLabel: 'Shortlist',
    dot: 'bg-indigo-500',
    accent: 'border-l-indigo-500',
    column:
      'border-indigo-200/70 bg-gradient-to-b from-indigo-50/95 to-indigo-100/40 dark:border-indigo-500/25 dark:from-indigo-950/50 dark:to-slate-900/40',
    header: 'text-indigo-800 dark:text-indigo-200',
    badge: 'bg-indigo-100 text-indigo-800 ring-indigo-200/60 dark:bg-indigo-500/20 dark:text-indigo-200 dark:ring-indigo-500/30',
    dropZone: 'bg-indigo-200/35 ring-indigo-400/35 dark:bg-indigo-500/15 dark:ring-indigo-400/25',
  },
  {
    id: 'technical_interview',
    label: 'Technical Interview',
    shortLabel: 'Tech',
    dot: 'bg-violet-500',
    accent: 'border-l-violet-500',
    column:
      'border-violet-200/70 bg-gradient-to-b from-violet-50/95 to-violet-100/40 dark:border-violet-500/25 dark:from-violet-950/50 dark:to-slate-900/40',
    header: 'text-violet-800 dark:text-violet-200',
    badge: 'bg-violet-100 text-violet-800 ring-violet-200/60 dark:bg-violet-500/20 dark:text-violet-200 dark:ring-violet-500/30',
    dropZone: 'bg-violet-200/35 ring-violet-400/35 dark:bg-violet-500/15 dark:ring-violet-400/25',
  },
  {
    id: 'hr_interview',
    label: 'HR Interview',
    shortLabel: 'HR',
    dot: 'bg-purple-500',
    accent: 'border-l-purple-500',
    column:
      'border-purple-200/70 bg-gradient-to-b from-purple-50/95 to-purple-100/40 dark:border-purple-500/25 dark:from-purple-950/50 dark:to-slate-900/40',
    header: 'text-purple-800 dark:text-purple-200',
    badge: 'bg-purple-100 text-purple-800 ring-purple-200/60 dark:bg-purple-500/20 dark:text-purple-200 dark:ring-purple-500/30',
    dropZone: 'bg-purple-200/35 ring-purple-400/35 dark:bg-purple-500/15 dark:ring-purple-400/25',
  },
  {
    id: 'offer',
    label: 'Offer',
    shortLabel: 'Offer',
    dot: 'bg-amber-500',
    accent: 'border-l-amber-500',
    column:
      'border-amber-200/70 bg-gradient-to-b from-amber-50/95 to-amber-100/40 dark:border-amber-500/25 dark:from-amber-950/40 dark:to-slate-900/40',
    header: 'text-amber-800 dark:text-amber-200',
    badge: 'bg-amber-100 text-amber-900 ring-amber-200/60 dark:bg-amber-500/20 dark:text-amber-200 dark:ring-amber-500/30',
    dropZone: 'bg-amber-200/35 ring-amber-400/35 dark:bg-amber-500/15 dark:ring-amber-400/25',
  },
  {
    id: 'hired',
    label: 'Hired',
    shortLabel: 'Hired',
    dot: 'bg-emerald-500',
    accent: 'border-l-emerald-500',
    column:
      'border-emerald-200/70 bg-gradient-to-b from-emerald-50/95 to-emerald-100/40 dark:border-emerald-500/25 dark:from-emerald-950/50 dark:to-slate-900/40',
    header: 'text-emerald-800 dark:text-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800 ring-emerald-200/60 dark:bg-emerald-500/20 dark:text-emerald-200 dark:ring-emerald-500/30',
    dropZone: 'bg-emerald-200/35 ring-emerald-400/35 dark:bg-emerald-500/15 dark:ring-emerald-400/25',
  },
  {
    id: 'rejected',
    label: 'Rejected',
    shortLabel: 'Rejected',
    dot: 'bg-rose-500',
    accent: 'border-l-rose-500',
    column:
      'border-rose-200/70 bg-gradient-to-b from-rose-50/95 to-rose-100/40 dark:border-rose-500/25 dark:from-rose-950/50 dark:to-slate-900/40',
    header: 'text-rose-800 dark:text-rose-200',
    badge: 'bg-rose-100 text-rose-800 ring-rose-200/60 dark:bg-rose-500/20 dark:text-rose-200 dark:ring-rose-500/30',
    dropZone: 'bg-rose-200/35 ring-rose-400/35 dark:bg-rose-500/15 dark:ring-rose-400/25',
  },
];

export const getStageMeta = (stageId) =>
  PIPELINE_STAGES.find((s) => s.id === stageId) || PIPELINE_STAGES[0];
