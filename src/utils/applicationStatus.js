import { getStageMeta } from '../config/pipelineStages';

/** Visual tokens per stage for candidate job portal */
export function getApplicationStatusStyle(stage) {
  const meta = getStageMeta(stage);
  return {
    badge: meta.badge,
    dot: meta.dot,
    ring: meta.badge.replace('bg-', 'ring-').split(' ')[0] || 'ring-slate-300',
  };
}

export function formatAppliedDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
