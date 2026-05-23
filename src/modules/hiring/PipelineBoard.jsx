import { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pipelineApi } from '../../api';
import { PIPELINE_STAGES } from '../../config/pipelineStages';
import toast from 'react-hot-toast';
import { useSocket } from '../../sockets/SocketProvider';

function getInitials(name) {
  return (
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?'
  );
}

function MatchBar({ score }) {
  const value = Math.min(100, Math.max(0, score || 0));
  return (
    <div className="mt-2.5">
      <div className="mb-1 flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <span>Match</span>
        <span className="text-slate-700 dark:text-slate-200">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/80">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-600 to-accent-500 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function CandidateCard({ application, stage, readOnly, isDragging }) {
  const candidate = application.candidate;
  const ats = application.resume?.atsAnalysis?.score;

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-slate-200/70 bg-white/95 p-3.5 shadow-sm backdrop-blur-md transition-all dark:border-slate-600/50 dark:bg-slate-800/95 ${
        readOnly ? '' : 'cursor-grab hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-500/10 active:cursor-grabbing'
      } ${isDragging ? 'rotate-1 scale-[1.02] shadow-lg ring-2 ring-brand-400/40' : ''} border-l-[3px] ${stage.accent}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500/90 to-accent-500/80 text-xs font-bold text-white shadow-sm`}
        >
          {getInitials(candidate?.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {candidate?.name || 'Unknown'}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
            {application.job?.title || '—'}
          </p>
        </div>
      </div>

      <MatchBar score={application.matchScore} />

      {ats != null && (
        <div className="mt-2 flex items-center justify-between rounded-lg bg-slate-50/90 px-2 py-1 text-[10px] dark:bg-slate-900/60">
          <span className="font-medium text-slate-500 dark:text-slate-400">ATS</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">{ats}</span>
        </div>
      )}
    </div>
  );
}

function EmptyColumn({ label }) {
  return (
    <div className="flex min-h-[140px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300/60 px-4 py-8 text-center dark:border-slate-600/50">
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/80 dark:bg-slate-800/80">
        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Drop candidates here</p>
      <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">{label}</p>
    </div>
  );
}

function PipelineColumn({ stage, items, readOnly }) {
  const count = items.length;

  return (
    <div
      className={`flex w-[min(300px,88vw)] shrink-0 flex-col rounded-2xl border p-0 shadow-sm backdrop-blur-md sm:w-[280px] ${stage.column}`}
    >
      {/* Column header */}
      <div className="border-b border-inherit px-3.5 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${stage.dot} shadow-sm ring-2 ring-white/80 dark:ring-slate-900/80`} />
            <h3 className={`truncate text-sm font-bold ${stage.header}`}>{stage.label}</h3>
          </div>
          <span
            className={`inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-2 text-xs font-bold ring-1 ${stage.badge}`}
          >
            {count}
          </span>
        </div>
      </div>

      {/* Drop zone */}
      <Droppable droppableId={stage.id} isDropDisabled={readOnly}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-1 flex-col p-2.5 transition-all duration-200 ${
              snapshot.isDraggingOver
                ? `rounded-b-2xl ring-2 ring-inset ${stage.dropZone}`
                : ''
            }`}
          >
            <div className="min-h-[calc(70vh-8rem)] space-y-2.5">
              {count === 0 && !snapshot.isDraggingOver ? (
                <EmptyColumn label={stage.shortLabel} />
              ) : (
                items.map((app, index) => (
                  <Draggable
                    key={app._id}
                    draggableId={String(app._id)}
                    index={index}
                    isDragDisabled={readOnly}
                  >
                    {(dragProvided, dragSnapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        style={dragProvided.draggableProps.style}
                        className={dragSnapshot.isDragging ? 'z-50' : ''}
                      >
                        <CandidateCard
                          application={app}
                          stage={stage}
                          readOnly={readOnly}
                          isDragging={dragSnapshot.isDragging}
                        />
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default function PipelineBoard({ board, readOnly = false }) {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const [columns, setColumns] = useState(board?.byStage || {});

  useEffect(() => {
    if (board?.byStage) setColumns(board.byStage);
  }, [board]);

  const moveMutation = useMutation({
    mutationFn: ({ id, toStage }) => pipelineApi.moveStage(id, { toStage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline-board'] });
      toast.success('Candidate moved');
    },
    onError: () => toast.error('Failed to move candidate'),
  });

  useEffect(() => {
    if (!socket) return;
    const handler = () => queryClient.invalidateQueries({ queryKey: ['pipeline-board'] });
    socket.on('pipeline:updated', handler);
    return () => socket.off('pipeline:updated', handler);
  }, [socket, queryClient]);

  const onDragEnd = (result) => {
    if (readOnly) return;
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const toStage = destination.droppableId;
    const fromStage = source.droppableId;

    const next = { ...columns };
    const sourceItems = [...(next[fromStage] || [])];
    const [moved] = sourceItems.splice(source.index, 1);
    const destItems = [...(next[toStage] || [])];
    destItems.splice(destination.index, 0, moved);
    next[fromStage] = sourceItems;
    next[toStage] = destItems;
    setColumns(next);

    moveMutation.mutate({ id: draggableId, toStage });
  };

  const displayStages = PIPELINE_STAGES.filter((s) => s.id !== 'rejected' || columns.rejected?.length);

  const totalCandidates = useMemo(
    () => Object.values(columns).reduce((sum, arr) => sum + (arr?.length || 0), 0),
    [columns]
  );

  return (
    <div className="space-y-4">
      {/* Summary strip */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-3 backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/15 text-brand-600 dark:text-brand-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">In pipeline</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{totalCandidates}</p>
          </div>
        </div>
        <div className="hidden h-8 w-px bg-slate-200 dark:bg-slate-700 sm:block" />
        <div className="flex flex-wrap gap-2">
          {displayStages.slice(0, 6).map((stage) => {
            const n = (columns[stage.id] || []).length;
            if (!n) return null;
            return (
              <span
                key={stage.id}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${stage.badge}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${stage.dot}`} />
                {stage.shortLabel}: {n}
              </span>
            );
          })}
        </div>
        {readOnly && (
          <span className="ml-auto rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-500/20 dark:text-amber-200">
            View only
          </span>
        )}
        {!readOnly && (
          <span className="ml-auto hidden text-xs text-slate-500 sm:inline dark:text-slate-400">
            Drag cards between columns to update stage
          </span>
        )}
      </div>

      {/* Kanban board with scroll fade */}
      <div className="relative -mx-1">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-6 bg-gradient-to-r from-slate-50/95 via-slate-50/50 to-transparent sm:w-10 dark:from-slate-950/95 dark:via-slate-950/50" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-6 bg-gradient-to-l from-slate-50/95 via-slate-50/50 to-transparent sm:w-10 dark:from-slate-950/95 dark:via-slate-950/50" />

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-6 pt-1 scrollbar-thin snap-x snap-mandatory px-2">
            {displayStages.map((stage) => (
              <div key={stage.id} className="snap-center">
                <PipelineColumn
                  stage={stage}
                  items={columns[stage.id] || []}
                  readOnly={readOnly}
                />
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
