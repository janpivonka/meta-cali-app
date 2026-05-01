import React from 'react';
import { useDragControls, Reorder } from 'framer-motion';
import { Edit3, Video, MessageSquare, Activity } from 'lucide-react';
import { cn, getSetMetadata } from '../../lib/utils';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';
import { SetReorderItem } from './SetReorderItem';
import { MediaRenderer } from '../MediaRenderer';
import { ExerciseMedia, ExerciseLog } from '../../types';

interface ExerciseReorderItemProps {
  ex: ExerciseLog;
  i: number;
  editingIndex: number | null;
  editingSetIndex: number | null;
  handleEditExercise: (index: number) => void;
  handleEditSet: (exIndex: number, setIndex: number, e: React.MouseEvent) => void;
  handleReorderSets: (exerciseId: string, newSets: any[]) => void;
  onMediaClick: (media: ExerciseMedia[], index: number) => void;
}

export const ExerciseReorderItem: React.FC<ExerciseReorderItemProps> = ({ 
  ex, 
  i, 
  editingIndex, 
  editingSetIndex, 
  handleEditExercise, 
  handleEditSet, 
  handleReorderSets,
  onMediaClick
}) => {
  const exerciseControls = useDragControls();

  const groups: any[] = [];
  (ex.sets || []).forEach((s: any, si: number) => {
    const meta = getSetMetadata(s, ex);
    const metaKey = JSON.stringify({
      l: meta.currentLoadLabel,
      o: meta.orangeLine,
      g: meta.gripLine,
      e: meta.equipLine,
      a: meta.armLine,
      c: meta.coreLine,
      le: meta.legLine
    });

    if (groups.length > 0 && groups[groups.length - 1].metaKey === metaKey) {
      groups[groups.length - 1].sets.push(s);
      groups[groups.length - 1].originalIndices.push(si);
    } else {
      groups.push({
        id: `group-${ex.id}-${s.id}`,
        metaKey,
        meta,
        sets: [s],
        originalIndices: [si]
      });
    }
  });
  
  return (
    <Reorder.Item 
      value={ex} 
      dragListener={false}
      dragControls={exerciseControls}
      className="relative overflow-visible"
    >
      <div 
        className={cn(
          "w-full text-left p-6 rounded-[32px] border transition-all group flex flex-col gap-6",
          (editingIndex === i && editingSetIndex === null)
            ? "bg-cyan-500/10 border-cyan-500/30 shadow-2xl shadow-cyan-500/10" 
            : "bg-black/40 border-white/5 hover:border-white/10"
        )}
      >
        <div className="flex flex-col gap-6 w-full">
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-4 flex-1" onClick={() => handleEditExercise(i)}>
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black italic shrink-0",
                editingIndex === i ? "bg-cyan-500 text-black" : "bg-white/5 text-slate-400 group-hover:text-white transition-colors"
              )}>
                {i + 1}
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic leading-none mb-2">
                  Session Fragment
                </span>
                {ex.media && ex.media.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pointer-events-auto">
                    {ex.media.map((m: any, midx: number) => (
                        <div 
                          key={midx} 
                          className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-black/40 cursor-pointer hover:border-cyan-500/50 transition-all relative"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMediaClick(ex.media!, midx);
                          }}
                        >
                          {m?.type === 'image' ? (
                            <MediaRenderer url={m.url} type="image" className="w-full h-full object-cover pointer-events-none" />
                          ) : (
                            <div className="w-full h-full relative pointer-events-none">
                              {m?.thumbnail ? (
                                <img src={m.thumbnail} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-cyan-500">
                                  <Video size={14} />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => handleEditExercise(i)}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  editingIndex === i ? "bg-cyan-500 text-black scale-110" : "bg-white/5 text-slate-700 hover:text-white"
                )}
              >
                <Edit3 size={16} />
              </button>
              
              <div 
                onPointerDown={(e) => exerciseControls.start(e)}
                className="w-10 h-10 rounded-xl bg-white/5 flex flex-col justify-center gap-1 items-center cursor-grab active:cursor-grabbing hover:bg-white/10 transition-all shadow-inner"
                style={{ touchAction: 'none' }}
              >
                 <div className="w-[3px] h-[3px] rounded-full bg-slate-600 transition-colors group-hover:bg-cyan-500" />
                 <div className="w-[3px] h-[3px] rounded-full bg-slate-600 transition-colors group-hover:bg-cyan-500" />
                 <div className="w-[3px] h-[3px] rounded-full bg-slate-600 transition-colors group-hover:bg-cyan-500" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Reorder.Group 
              axis="y" 
              values={groups} 
              onReorder={(newGroups) => {
                const flattened = newGroups.flatMap(g => g.sets);
                handleReorderSets(ex.id, flattened);
              }}
              className="flex flex-col w-full"
            >
              {groups.map((group) => (
                <SetReorderItem 
                  key={group.id}
                  group={group}
                  i={i}
                  ex={ex}
                  editingIndex={editingIndex}
                  editingSetIndex={editingSetIndex}
                  handleEditSet={handleEditSet}
                  onMediaClick={onMediaClick}
                />
              ))}
            </Reorder.Group>
          </div>

          {ex.notes && (
            <div className="mt-2 flex items-start gap-2 bg-white/5 p-3 rounded-2xl border border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
              <MessageSquare size={12} className="text-cyan-500 shrink-0 mt-0.5" />
              <p className="text-[10px] font-medium text-slate-300 italic whitespace-normal leading-relaxed">{ex.notes}</p>
            </div>
          )}
        </div>
      </div>
    </Reorder.Item>
  );
};
