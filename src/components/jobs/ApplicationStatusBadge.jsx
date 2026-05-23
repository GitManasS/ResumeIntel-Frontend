import { getApplicationStatusStyle } from '../../utils/applicationStatus';

export default function ApplicationStatusBadge({ application, compact = false }) {
  if (!application) return null;

  const { stage, statusTitle, stageLabel } = application;
  const style = getApplicationStatusStyle(stage);
  const label = statusTitle || stageLabel || 'Applied';

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${style.badge}`}
      >
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
        {label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset ${style.badge}`}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot} animate-pulse`} />
      {label}
    </span>
  );
}
