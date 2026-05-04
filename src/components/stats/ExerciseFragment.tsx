import React from 'react';
import { MessageSquare, Video, Activity } from 'lucide-react';
import { ExerciseLog, ExerciseMedia } from '../../types';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';
import { getSetMetadata, isHoldExercise, getColorFromMeta, isMediaVideo } from '../../lib/utils';
import { VolumeBadge } from '../ui/VolumeBadge';
import { MediaRenderer } from '../MediaRenderer';

interface ExerciseFragmentProps {
  log: ExerciseLog;
  onMediaClick: (media: ExerciseMedia[], index: number) => void;
}

export const ExerciseFragment: React.FC<ExerciseFragmentProps> = ({ log, onMediaClick }) => {
  const sets = log.sets || [];
  const groups: any[] = [];
  sets.forEach(s => {
    const meta = getSetMetadata(s, log);
    const metaKey = JSON.stringify({
      l: meta.currentLoadLabel, o: meta.orangeLine, g: meta.gripLine,
      e: meta.equipLine, a: meta.armLine, c: meta.coreLine, le: meta.legLine
    });
    const lastGroup = groups.length > 0 ? groups[groups.length - 1] : null;
    if (lastGroup && lastGroup.key === metaKey) {
      lastGroup.items.push(s);
      if (s.media) lastGroup.media.push(...s.media);
    } else {
      groups.push({ key: metaKey, metadata: meta, items: [s], media: s.media ? [...s.media] : [] });
    }
  });

  const exName = EXERCISE_LIBRARY.find((e) => e.id === log.exerciseId)?.name || log.type;

  return (
    <div className="flex flex-col gap-6 pb-12 border-b border-white/5 last:border-0 last:pb-0">
      <div>
        <span className="text-[12px] font-black text-white/20 uppercase tracking-widest italic mb-4 block">Mission Execution Fragment</span>
        <div className="flex overflow-x-auto gap-4 pb-6 snap-x no-scrollbar">
          {groups.map((group, gi) => {
            const { metadata, items, media } = group;
            const unit = isHoldExercise(log.exerciseId) ? "s" : "R";
            const subGroups: { v: number; c: number }[] = [];
            items.forEach((s: any) => {
              const v = s.reps || s.time || 0;
              if (subGroups.length > 0 && subGroups[subGroups.length - 1].v === v) {
                subGroups[subGroups.length - 1].c++;
              } else {
                subGroups.push({ v, c: 1 });
              }
            });
            const groupColor = getColorFromMeta(group.key);
            const hasGroupNotes = items[0]?.groupNotes;
            const groupMedia = items[0]?.groupMedia || [];

            return (
              <div
                key={gi}
                className="min-w-[240px] sm:min-w-[280px] p-4 rounded-2xl border bg-black/40 border-white/10 text-white flex flex-col gap-1.5 relative overflow-hidden shadow-lg snap-center"
                style={{ borderColor: groupColor + "60", boxShadow: `0 10px 15px -3px ${groupColor}20` }}
              >
                <div className="flex flex-row justify-between items-start gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
                    <span className="text-[10px] font-black italic uppercase tracking-tighter text-white shrink-0">{exName}</span>
                    <span className="text-[8px] font-bold text-white/10 shrink-0">/</span>
                    <div className="text-[7px] font-bold uppercase tracking-tight px-1 py-0.5 rounded-[3px] border bg-black/40 border-white/5 text-white/40 shrink-0 shadow-sm" style={{ color: groupColor, borderColor: groupColor + "40" }}>
                      {metadata.currentLoadLabel}
                    </div>
                  </div>
                  <div className="px-1.5 py-1 bg-white/[0.03] rounded-lg border border-white/5 flex items-center shadow-2xl shrink-0 max-w-[60%] mr-[26px]">
                    <VolumeBadge subSummaries={subGroups} unit={unit} isHighlighted={false} />
                  </div>
                </div>
                <div className="text-[7px] font-bold space-y-0.5 mt-1 opacity-80">
                   {metadata.orangeLine.length > 0 && <div><span className="text-orange-400 opacity-40 uppercase tracking-tighter">ASSIST: </span>{metadata.orangeLine.join(' • ')}</div>}
                   {metadata.gripLine.length > 0 && <div><span className="text-slate-500 opacity-40 uppercase tracking-tighter">GRIP: </span>{metadata.gripLine.join(' • ')}</div>}
                   {metadata.armLine.length > 0 && <div><span className="text-purple-400 opacity-40 uppercase tracking-tighter">ARMS: </span>{metadata.armLine.join(' • ')}</div>}
                   {metadata.coreLine.length > 0 && <div><span className="text-purple-400 opacity-40 uppercase tracking-tighter">CORE: </span>{metadata.coreLine.join(' • ')}</div>}
                   {metadata.legLine.length > 0 && <div><span className="text-purple-400 opacity-40 uppercase tracking-tighter">LEGS: </span>{metadata.legLine.join(' • ')}</div>}
                </div>

                {(hasGroupNotes || items.some((s: any) => s.notes)) && (
                  <div className="mt-2 text-[8px] italic text-slate-500 border-l border-white/10 pl-2">
                    {hasGroupNotes && <p>"{hasGroupNotes}"</p>}
                  </div>
                )}

                {(groupMedia.length > 0 || media.length > 0) && (
                  <div className="flex gap-1 mt-2 pt-2 border-t border-white/5 overflow-x-auto no-scrollbar">
                    {groupMedia.map((m: any, midx: number) => (
                      <div key={midx} className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-cyan-500/30 relative group/fragment-thumb cursor-pointer hover:border-cyan-500 transition-all shadow-md" onClick={() => onMediaClick(groupMedia, midx)}>
                        {isMediaVideo(m) ? (
                          <div className="w-full h-full relative">
                            {m.thumbnail ? (
                              <img src={m.thumbnail} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-cyan-500 bg-cyan-500/5">
                                <Video size={14} />
                              </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/fragment-thumb:bg-black/0 transition-all">
                              <Activity size={10} className="text-cyan-500 animate-pulse" />
                            </div>
                          </div>
                        ) : (
                          <MediaRenderer url={m.url} type={m.type} className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                    {media.map((m: any, midx: number) => (
                      <div key={midx} className="w-6 h-6 rounded-md overflow-hidden shrink-0 border border-white/10 relative group/fragment-thumb cursor-pointer hover:border-cyan-500/50 transition-all" onClick={() => onMediaClick(media, midx)}>
                        {isMediaVideo(m) ? (
                          <div className="w-full h-full relative">
                            {m.thumbnail ? (
                              <img src={m.thumbnail} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-cyan-500 bg-cyan-500/5">
                                <Video size={10} />
                              </div>
                            )}
                          </div>
                        ) : (
                          <MediaRenderer url={m.url} type={m.type} className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {(log.notes || (log.media && log.media.length > 0)) && (
          <div className="mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
            {log.notes && (
              <div className="flex items-start gap-2">
                <MessageSquare size={12} className="text-cyan-500 shrink-0 mt-0.5" />
                <p className="text-[10px] font-medium text-slate-400 italic leading-relaxed">{log.notes}</p>
              </div>
            )}
            {log.media && log.media.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {log.media.map((m: any, midx: number) => (
                  <div key={midx} className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-black/40 cursor-pointer relative group/fragment-thumb hover:border-cyan-500/50 transition-all" onClick={() => onMediaClick(log.media!, midx)}>
                    {isMediaVideo(m) ? (
                      <div className="w-full h-full relative">
                        {m.thumbnail ? (
                          <img src={m.thumbnail} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-cyan-500">
                            <Video size={32} />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/fragment-thumb:bg-black/0 transition-all">
                          <Activity size={16} className="text-cyan-500 animate-pulse" />
                        </div>
                      </div>
                    ) : (
                      <MediaRenderer url={m.url} type={m.type} className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
