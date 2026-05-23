import { PIPELINE_STAGES } from '../../config/pipelineStages';

export default function PipelineColumnSkeleton({ count = 5 }) {
  const stages = PIPELINE_STAGES.filter((s) => s.id !== 'rejected').slice(0, count);

  return (
    <div className="flex gap-4 overflow-hidden px-2">
      {stages.map((stage) => (
        <div
          key={stage.id}
          className={`w-[280px] shrink-0 animate-pulse rounded-2xl border p-3 ${stage.column}`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="h-4 w-24 rounded-lg bg-slate-200/80 dark:bg-slate-700/80" />
            <div className="h-6 w-6 rounded-full bg-slate-200/80 dark:bg-slate-700/80" />
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-xl bg-white/50 dark:bg-slate-800/50" />
            <div className="h-24 rounded-xl bg-white/50 dark:bg-slate-800/50" />
          </div>
        </div>
      ))}
    </div>
  );
}
