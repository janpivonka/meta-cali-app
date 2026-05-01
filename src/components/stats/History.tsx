import React from 'react';
import { Share2, MessageSquare, Video, Activity } from 'lucide-react';
import { Workout, ExerciseMedia } from '../../types';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';
import { getSetMetadata, isHoldExercise, getColorFromMeta } from '../../lib/utils';
import { VolumeBadge } from '../ui/VolumeBadge';
import { MediaRenderer } from '../MediaRenderer';

interface HistoryProps {
  workouts: Workout[];
  onMediaClick: (media: ExerciseMedia[], index: number) => void;
}

export const History: React.FC<HistoryProps> = ({ workouts, onMediaClick }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Operation History</h2>
      <div className="grid gap-4">
        {workouts.length > 0 ? (
          [...workouts].reverse().map((workout) => (
            <div key={workout.id} className="glass-card p-0 border-white/5 bg-white/5 group hover:border-cyan-500/20 transition-all overflow-hidden rounded-[32px]">
              <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-black font-black italic">W</div>
                  <div>
                    <p className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-[0.25em]">{new Date(workout.timestamp).toLocaleString()}</p>
                    <p className="text-xs font-black text-white uppercase tracking-widest mt-0.5">{(workout.exercises || []).length} EXERCISES • {(workout.exercises || []).reduce((acc, ex) => acc + (ex.sets || []).length, 0)} SETS</p>
                  </div>
                </div>
                <Share2 size={16} className="text-slate-500 hover:text-cyan-400 cursor-pointer transition-colors" />
              </div>
              <div className="p-6 space-y-6">
                {(workout.exercises || []).map((log) => {
                  return (
                    <div key={log.id} className="flex flex-col gap-6 pb-12 border-b border-white/5 last:border-0 last:pb-0">
                      <div>
                         <span className="text-[12px] font-black text-white/20 uppercase tracking-widest italic mb-4 block">
                           Mission Execution Fragment
                         </span>

                         <div className="flex overflow-x-auto gap-4 pb-6 snap-x no-scrollbar">
                           {(() => {
                             const sets = log.sets || [];
                             const groups: any[] = [];
                             sets.forEach(s => {
                               const meta = getSetMetadata(s, log);
                               const metaKey = JSON.stringify({
                                 l: meta.currentLoadLabel,
                                 o: meta.orangeLine,
                                 g: meta.gripLine,
                                 e: meta.equipLine,
                                 a: meta.armLine,
                                 c: meta.coreLine,
                                 le: meta.legLine
                               });
                               const lastGroup = groups.length > 0 ? groups[groups.length - 1] : null;
                               if (lastGroup && lastGroup.key === metaKey) {
                                 lastGroup.items.push(s);
                                 if (s.media) lastGroup.media.push(...s.media);
                               } else {
                                 groups.push({ key: metaKey, metadata: meta, items: [s], media: s.media ? [...s.media] : [] });
                               }
                             });

                             return groups.map((group, gi) => {
                               const { metadata, items, media } = group;
                               const {
                                 currentLoadLabel,
                                 orangeLine,
                                 gripLine,
                                 armLine,
                                 coreLine,
                                 legLine,
                               } = metadata;
                               const unit =
                                 isHoldExercise(log.exerciseId)
                                   ? "s"
                                   : "R";

                               const subGroups: { v: number; c: number }[] =
                                 [];
                               items.forEach((s: any) => {
                                 const v = s.reps || s.time || 0;
                                 if (
                                   subGroups.length > 0 &&
                                   subGroups[subGroups.length - 1].v === v
                                 ) {
                                   subGroups[subGroups.length - 1].c++;
                                 } else {
                                   subGroups.push({ v, c: 1 });
                                 }
                               });

                               const exName =
                                 EXERCISE_LIBRARY.find(
                                   (e) => e.id === log.exerciseId,
                                 )?.name || log.type;
                               const groupColor = getColorFromMeta(
                                 group.key,
                               );

                               const hasGroupNotes = items[0]?.groupNotes;
                               const groupMedia = items[0]?.groupMedia || [];

                               return (
                                 <div
                                   key={gi}
                                   className="min-w-[240px] sm:min-w-[280px] p-4 rounded-2xl border bg-black/40 border-white/10 text-white flex flex-col gap-1.5 relative overflow-hidden shadow-lg snap-center"
                                   style={{
                                     borderColor: groupColor + "60",
                                     boxShadow: `0 10px 15px -3px ${groupColor}20`,
                                   }}
                                 >
                                   <div className="flex flex-row justify-between items-start gap-2 mb-2">
                                     <div className="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
                                       <span className="text-[10px] font-black italic uppercase tracking-tighter text-white shrink-0">
                                         {exName}
                                       </span>
                                       <span className="text-[8px] font-bold text-white/10 shrink-0">
                                         /
                                       </span>
                                       <div
                                         className="text-[7px] font-bold uppercase tracking-tight px-1 py-0.5 rounded-[3px] border bg-black/40 border-white/5 text-white/40 shrink-0 shadow-sm"
                                         style={{
                                           color: groupColor,
                                           borderColor: groupColor + "40",
                                         }}
                                       >
                                         {currentLoadLabel}
                                       </div>
                                     </div>

                                     <div className="px-1.5 py-1 bg-white/[0.03] rounded-lg border border-white/5 flex items-center shadow-2xl shrink-0 max-w-[60%] mr-[26px]">
                                       <VolumeBadge
                                         subSummaries={subGroups}
                                         unit={unit}
                                         isHighlighted={false}
                                       />
                                     </div>
                                   </div>

                                   <div className="flex flex-col gap-y-0.5 pr-2 select-none">
                                     <div className="flex flex-col gap-0.5 mb-1">
                                       {orangeLine.length > 0 && (
                                         <div className="flex items-baseline gap-x-1">
                                           <span className="text-[7px] font-black uppercase tracking-tighter text-orange-400 opacity-40 shrink-0">
                                             ASSIST:
                                           </span>
                                           <div className="flex flex-wrap items-baseline gap-x-1">
                                             {orangeLine.map(
                                               (p: any, pidx: number) => (
                                                 <span
                                                   key={pidx}
                                                   className="text-[7px] font-black uppercase italic text-orange-400 whitespace-nowrap"
                                                 >
                                                   {pidx > 0 && "• "}
                                                   {p}
                                                 </span>
                                               ),
                                             )}
                                           </div>
                                         </div>
                                       )}

                                       {gripLine.length > 0 && (
                                         <div className="flex items-baseline gap-x-1">
                                           <span className="text-[7px] font-black uppercase tracking-tighter text-slate-500 opacity-40 shrink-0">
                                             GRIP:
                                           </span>
                                           <div className="flex flex-wrap items-baseline gap-x-1">
                                             {gripLine.map(
                                               (p: any, pidx: number) => (
                                                 <span
                                                   key={pidx}
                                                   className="text-[7px] font-bold uppercase text-slate-500 whitespace-nowrap"
                                                 >
                                                   {pidx > 0 && "• "}
                                                   {p}
                                                 </span>
                                               ),
                                             )}
                                           </div>
                                         </div>
                                       )}

                                       {armLine.length > 0 && (
                                         <div className="flex items-baseline gap-x-1">
                                           <span className="text-[7px] font-black uppercase tracking-tighter text-[#a855f7] opacity-40 shrink-0">
                                             ARMS:
                                           </span>
                                           <div className="flex flex-wrap items-baseline gap-x-1">
                                             {armLine.map(
                                               (p: any, pidx: number) => (
                                                 <span
                                                   key={pidx}
                                                   className="text-[7px] font-black uppercase italic text-[#a855f7] whitespace-nowrap"
                                                 >
                                                   {pidx > 0 && "• "}
                                                   {p}
                                                 </span>
                                               ),
                                             )}
                                           </div>
                                         </div>
                                       )}

                                       {coreLine.length > 0 && (
                                         <div className="flex items-baseline gap-x-1">
                                           <span className="text-[7px] font-black uppercase tracking-tighter text-[#a855f7] opacity-40 shrink-0">
                                             CORE:
                                           </span>
                                           <div className="flex flex-wrap items-baseline gap-x-1">
                                             {coreLine.map(
                                               (p: any, pidx: number) => (
                                                 <span
                                                   key={pidx}
                                                   className="text-[7px] font-black uppercase italic text-[#a855f7] whitespace-nowrap"
                                                 >
                                                   {pidx > 0 && "• "}
                                                   {p}
                                                 </span>
                                               ),
                                             )}
                                           </div>
                                         </div>
                                       )}

                                       {legLine.length > 0 && (
                                         <div className="flex items-baseline gap-x-1">
                                           <span className="text-[7px] font-black uppercase tracking-tighter text-[#a855f7] opacity-40 shrink-0">
                                             LEGS:
                                           </span>
                                           <div className="flex flex-wrap items-baseline gap-x-1">
                                             {legLine.map(
                                               (p: any, pidx: number) => (
                                                 <span
                                                   key={pidx}
                                                   className="text-[7px] font-black uppercase italic text-[#a855f7] whitespace-nowrap"
                                                 >
                                                   {pidx > 0 && "• "}
                                                   {p}
                                                 </span>
                                               ),
                                             )}
                                           </div>
                                         </div>
                                       )}
                                     </div>

                                     {(hasGroupNotes ||
                                       items.some((s: any) => s.notes)) && (
                                       <div className="mt-1 flex flex-col gap-1">
                                         {hasGroupNotes && (
                                           <p className="text-[9px] italic font-black text-cyan-400 border-l border-cyan-400/30 pl-2">
                                             "{hasGroupNotes}"
                                           </p>
                                         )}
                                         {items.map(
                                           (s: any, idx: number) =>
                                             s.notes && (
                                               <p
                                                 key={idx}
                                                 className="text-[8px] italic font-medium text-slate-500 pl-2"
                                               >
                                                 Series #{gi + 1}.
                                                 {idx + 1}: "{s.notes}"
                                               </p>
                                             ),
                                         )}
                                       </div>
                                     )}
                                   </div>

                                   {(groupMedia.length > 0 ||
                                     media.length > 0) && (
                                     <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-white/5">
                                       {groupMedia.length > 0 && (
                                         <div className="flex gap-1 overflow-x-auto no-scrollbar">
                                           {groupMedia.map(
                                             (m: any, midx: number) => (
                                               <div
                                                 key={`gm-${midx}`}
                                                 className="w-8 h-8 rounded-lg overflow-hidden bg-black/40 border border-cyan-500/30 shrink-0 relative"
                                                 onClick={() =>
                                                   onMediaClick(
                                                     groupMedia,
                                                     midx,
                                                   )
                                                 }
                                               >
                                                 <MediaRenderer
                                                   url={m.url}
                                                   type={
                                                     m.type || "image"
                                                   }
                                                   className="w-full h-full object-cover"
                                                 />
                                               </div>
                                             ),
                                           )}
                                         </div>
                                       )}
                                       {media.length > 0 && (
                                         <div className="flex gap-1 overflow-x-auto no-scrollbar">
                                           {media.map(
                                             (m: any, midx: number) => (
                                               <div
                                                 key={midx}
                                                 className="w-6 h-6 rounded-md overflow-hidden bg-black/40 border border-white/5 shrink-0"
                                                 onClick={() =>
                                                   onMediaClick(
                                                     media,
                                                     midx,
                                                   )
                                                 }
                                               >
                                                 <MediaRenderer
                                                   url={m.url}
                                                   type={
                                                     m.type || "image"
                                                   }
                                                   className="w-full h-full object-cover"
                                                 />
                                               </div>
                                             ),
                                           )}
                                         </div>
                                       )}
                                     </div>
                                   )}
                                 </div>
                               );
                             });
                           })()}
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
                                  <div 
                                    key={midx} 
                                    className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-black/40 shrink-0 cursor-pointer hover:border-cyan-500/50 transition-all"
                                    onClick={() => onMediaClick(log.media!, midx)}
                                  >
                                    {m?.type === 'image' ? (
                                      <MediaRenderer url={m.url} type="image" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                      <div className="w-full h-full relative">
                                        {m?.thumbnail ? (
                                          <img src={m.thumbnail} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="" />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-cyan-500"><Video size={20} /></div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                          <Activity size={14} className="text-cyan-500 animate-pulse" />
                                        </div>
                                      </div>
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
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
            <p className="text-slate-500 font-black uppercase tracking-widest italic">System archive is empty</p>
          </div>
        )}
      </div>
    </div>
  );
};
