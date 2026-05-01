import React from 'react';
import { useDragControls, Reorder } from 'framer-motion';
import { GripVertical, MessageSquare } from 'lucide-react';
import { cn, isHoldExercise, getSetColor, getColorFromMeta } from '../../lib/utils';
import { ExerciseMedia } from '../../types';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';
import { MediaRenderer } from '../MediaRenderer';
import { VolumeBadge } from '../ui/VolumeBadge';

interface SetReorderItemProps {
  group: {
    id: string;
    metaKey: string;
    meta: any;
    sets: any[];
    originalIndices: number[];
  };
  i: number;
  ex: any;
  editingIndex: number | null;
  editingSetIndex: number | null;
  handleEditSet: (exIndex: number, setIndex: number, e: React.MouseEvent) => void;
  onMediaClick: (media: ExerciseMedia[], index: number) => void;
}

export const SetReorderItem: React.FC<SetReorderItemProps> = ({ 
  group, 
  i, 
  ex, 
  editingIndex, 
  editingSetIndex, 
  handleEditSet, 
  onMediaClick
}) => {
  const controls = useDragControls();
  const { sets, meta } = group;
  const lastIndex = group.originalIndices[group.originalIndices.length - 1];
  
  const isHighlighted = editingIndex === i && editingSetIndex !== null && group.originalIndices.includes(editingSetIndex);
  const exName = EXERCISE_LIBRARY.find(e => e.id === ex.exerciseId)?.name || ex.type;
                                     
  const { currentLoadLabel, orangeLine, gripLine, armLine, coreLine, legLine } = meta;
  const unit = isHoldExercise(ex.exerciseId) ? 's' : 'R';
  
  const groupColor = getColorFromMeta(group.metaKey);

  const subSummaries: {v: number, c: number, color?: string}[] = [];
  sets.forEach((s, idx) => {
    const v = s.reps || s.time || 0;
    const hasNoteOrMedia = s.notes || (s.media && s.media.length > 0);
    const absIdx = group.originalIndices[idx];
    const color = hasNoteOrMedia ? getSetColor(absIdx) : undefined;

    if (subSummaries.length > 0 && !hasNoteOrMedia && !subSummaries[subSummaries.length - 1].color && subSummaries[subSummaries.length - 1].v === v) {
      subSummaries[subSummaries.length - 1].c++;
    } else {
      subSummaries.push({ v, c: 1, color });
    }
  });

  return (
    <Reorder.Item 
      value={group} 
      id={group.id}
      dragListener={false}
      dragControls={controls}
      className="relative w-full group-reorder mb-2"
    >
      <div className="flex items-stretch gap-2">
        <button 
          onClick={(e) => handleEditSet(i, lastIndex, e)}
          className={cn(
            "flex-1 p-4 pb-3 border transition-all text-left flex flex-col gap-1.5 relative group/set overflow-hidden rounded-2xl",
            isHighlighted
              ? "bg-cyan-500 border-cyan-400 shadow-xl z-20"
              : "bg-black/80 border-white/10 text-white hover:border-white/20 shadow-lg"
          )}
          style={{ 
            borderColor: isHighlighted ? undefined : groupColor + '60',
            boxShadow: isHighlighted ? undefined : `0 10px 15px -3px ${groupColor}20`
          }}
        >
          {isHighlighted && (
            <div className="absolute inset-0 bg-cyan-500 opacity-10 animate-pulse pointer-events-none" />
          )}

          <div className="flex flex-row justify-between items-start gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
              <span className={cn(
                "text-[10px] font-black italic uppercase tracking-tighter shrink-0",
                isHighlighted ? "text-black" : "text-white"
              )}>
                {exName}
              </span>
              <span className={cn(
                "text-[8px] font-bold opacity-10 shrink-0",
                isHighlighted ? "text-black" : "text-white"
              )}>/</span>
              <div 
                className={cn(
                  "text-[7px] font-bold uppercase tracking-tight px-1.5 py-0.5 rounded-[4px] border shrink-0",
                  isHighlighted ? "bg-black/10 border-black/10 text-black/60" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                )}
                style={{ color: isHighlighted ? undefined : groupColor, borderColor: isHighlighted ? undefined : groupColor + '40' }}
              >
                {currentLoadLabel}
              </div>
            </div>

            <div className={cn(
              "px-2 py-1 rounded-xl border flex items-center shadow-lg transition-all duration-300 shrink-0 max-w-[60%] mr-10",
              isHighlighted ? "bg-white/10 border-white/20 shadow-none text-black" : "bg-white/10 border-white/10 text-white"
            )}>
              <VolumeBadge subSummaries={subSummaries} unit={unit} isHighlighted={isHighlighted} />
            </div>
          </div>

          <div className="flex flex-col gap-y-0.5 pr-2 select-none">
            <div className="flex flex-col gap-0.5 mb-1">
              {orangeLine.length > 0 && (
                <div className="flex items-baseline gap-x-1">
                  <span className={cn("text-[7px] font-black uppercase tracking-tighter opacity-40 shrink-0", isHighlighted ? "text-black" : "text-orange-400")}>ASSIST:</span>
                  <div className="flex flex-wrap items-baseline gap-x-1">
                    {orangeLine.map((p: any, pidx: number) => (
                      <span key={pidx} className={cn(
                        "text-[7px] font-black uppercase italic whitespace-nowrap",
                        isHighlighted ? "text-black/70" : "text-orange-400"
                      )}>
                        {pidx > 0 && "• "}{p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {gripLine.length > 0 && (
                <div className="flex items-baseline gap-x-1">
                  <span className={cn("text-[7px] font-black uppercase tracking-tighter opacity-40 shrink-0", isHighlighted ? "text-black" : "text-slate-500")}>GRIP:</span>
                  <div className="flex flex-wrap items-baseline gap-x-1">
                    {gripLine.map((p: any, pidx: number) => (
                      <span key={pidx} className={cn(
                        "text-[7px] font-bold uppercase whitespace-nowrap",
                        isHighlighted ? "text-black/60" : "text-slate-500"
                      )}>
                        {pidx > 0 && "• "}{p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {armLine.length > 0 && (
                <div className="flex items-baseline gap-x-1">
                  <span className={cn("text-[7px] font-black uppercase tracking-tighter opacity-40 shrink-0", isHighlighted ? "text-black" : "text-[#a855f7]")}>ARMS:</span>
                  <div className="flex flex-wrap items-baseline gap-x-1">
                    {armLine.map((p: any, pidx: number) => (
                      <span key={pidx} className={cn("text-[7px] font-black italic uppercase", isHighlighted ? "text-black/60" : "text-[#a855f7]")}>
                        {pidx > 0 && "• "}{p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {coreLine.length > 0 && (
                <div className="flex items-baseline gap-x-1">
                  <span className={cn("text-[7px] font-black uppercase tracking-tighter opacity-40 shrink-0", isHighlighted ? "text-black" : "text-[#a855f7]")}>CORE:</span>
                  <div className="flex flex-wrap items-baseline gap-x-1">
                    {coreLine.map((p: any, pidx: number) => (
                      <span key={pidx} className={cn("text-[7px] font-black italic uppercase", isHighlighted ? "text-black/60" : "text-[#a855f7]")}>
                        {pidx > 0 && "• "}{p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {legLine.length > 0 && (
                <div className="flex items-baseline gap-x-1">
                  <span className={cn("text-[7px] font-black uppercase tracking-tighter opacity-40 shrink-0", isHighlighted ? "text-black" : "text-[#a855f7]")}>LEGS:</span>
                  <div className="flex flex-wrap items-baseline gap-x-1">
                    {legLine.map((p: any, pidx: number) => (
                      <span key={pidx} className={cn("text-[7px] font-black italic uppercase", isHighlighted ? "text-black/60" : "text-[#a855f7]")}>
                        {pidx > 0 && "• "}{p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {(sets.some((s) => s.notes) || sets.some((s) => s.groupNotes)) && (
              <div className="mt-1 flex flex-col gap-0.5">
                {sets[0]?.groupNotes && (
                  <div className="flex items-start gap-2 bg-cyan-400/[0.03] p-2 rounded-xl border border-cyan-400/10 mb-1">
                    <MessageSquare size={10} className="text-cyan-400 shrink-0 mt-0.5" />
                    <p className={cn("text-[9px] italic font-black leading-tight", isHighlighted ? "text-black" : "text-cyan-400/80")}>
                      "{sets[0].groupNotes}"
                    </p>
                  </div>
                )}
                {sets.map((s, idx) => s.notes && (
                  <p key={idx} className={cn("text-[9px] italic font-medium leading-tight line-clamp-1", isHighlighted ? "text-black/70" : "text-slate-400")}>
                    {sets.length > 1 && (
                      <span className="font-black mr-1 opacity-80" style={{ color: isHighlighted ? undefined : getSetColor(group.originalIndices[idx]) }}>
                        #{group.originalIndices[idx] + 1}
                      </span>
                    )}
                    "{s.notes}"
                  </p>
                ))}
              </div>
            )}
          </div>

          {(sets.some((s) => (s.media && s.media.length > 0) || (s.groupMedia && s.groupMedia.length > 0))) && (
            <div className="flex flex-col gap-2 mt-2">
              {sets[0]?.groupMedia && sets[0].groupMedia.length > 0 && (
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {sets[0].groupMedia.map((m: any, midx: number) => (
                    <div
                      key={`group-${midx}`}
                      className="w-10 h-10 rounded-xl overflow-hidden border bg-black shrink-0 cursor-pointer pointer-events-auto transition-all relative group/media-item"
                      style={{ borderColor: isHighlighted ? "rgba(0,0,0,0.1)" : "rgba(34,211,238,0.3)", boxShadow: `0 0 10px rgba(34,211,238,0.05)` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMediaClick(sets[0].groupMedia, midx);
                      }}
                    >
                      <MediaRenderer url={m.url || m.thumbnail} type={m.type || "image"} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      <div className="absolute top-0 right-0 bg-cyan-400 text-black text-[6px] font-black px-1 rounded-bl-md">GROUP</div>
                    </div>
                  ))}
                </div>
              )}
              {sets.some((s) => s.media && s.media.length > 0) && (
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                  {sets.flatMap((s, sIdx) => (s.media || []).map((m: any, mIdx: number) => ({ ...m, parentSetIdx: group.originalIndices[sIdx], allMediaInSet: s.media, itemIdxInSet: mIdx })))
                    .map((m: any, midx: number) => (
                      <div
                        key={`set-${midx}`}
                        className="w-8 h-8 rounded-lg overflow-hidden border bg-black shrink-0 cursor-pointer pointer-events-auto transition-all"
                        style={{ borderColor: isHighlighted ? "rgba(0,0,0,0.1)" : getSetColor(m.parentSetIdx) }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMediaClick(m.allMediaInSet, m.itemIdxInSet);
                        }}
                      >
                        <MediaRenderer url={m.url || m.thumbnail} type={m.type || "image"} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
          
          <div 
            onPointerDown={(e) => controls.start(e)}
            className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-full max-h-[64px] flex flex-col justify-center gap-1 items-center cursor-grab active:cursor-grabbing hover:bg-white/5 rounded-xl transition-all z-30"
            style={{ touchAction: 'none' }}
          >
             <GripVertical size={16} className={cn(isHighlighted ? "text-black/40" : "text-slate-600")} />
          </div>
        </button>
      </div>
    </Reorder.Item>
  );
};
