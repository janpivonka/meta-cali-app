import React from "react";
import { Plus } from "lucide-react";
import { motion, Reorder } from "framer-motion";
import { cn, getSetMetadata, getColorFromMeta } from "../../../lib/utils";
import { WorkoutSet, LoadType } from "../../../types";

interface SetsStripProps {
  sets: WorkoutSet[];
  setSets: React.Dispatch<React.SetStateAction<WorkoutSet[]>>;
  activeSetId: string | null;
  setActiveSetId: (id: string | null) => void;
  exerciseId: string;
  loadType: LoadType;
  executionStyle: string;
  legProgression: string;
  isHoldExercise: (id: string) => boolean;
  addSet: () => void;
  setsScrollRef: React.RefObject<HTMLDivElement>;
}

export const SetsStrip: React.FC<SetsStripProps> = ({
  sets, setSets, activeSetId, setActiveSetId, exerciseId, loadType,
  executionStyle, legProgression, isHoldExercise, addSet, setsScrollRef
}) => {
  return (
    <div className="mb-6">
      <Reorder.Group
        ref={setsScrollRef}
        axis="x"
        values={sets}
        onReorder={setSets}
        className="flex gap-2 overflow-x-auto py-3 px-2 no-scrollbar snap-x snap-mandatory"
      >
        {sets.map((s, i) => {
          const meta = getSetMetadata(s, { exerciseId, loadType, executionStyle, legProgression });
          const groupColor = getColorFromMeta(JSON.stringify({
            l: meta.currentLoadLabel, o: meta.orangeLine, g: meta.gripLine,
            e: meta.equipLine, a: meta.armLine, c: meta.coreLine, le: meta.legLine,
          }));

          return (
            <Reorder.Item
              key={s.id}
              id={`nav-set-${s.id}`}
              value={s}
              dragListener={activeSetId === s.id}
              className="shrink-0 snap-center"
              whileDrag={{ scale: 1.1, zIndex: 50 }}
            >
              <motion.div
                role="button"
                tabIndex={0}
                onTap={() => setActiveSetId(activeSetId === s.id ? null : s.id)}
                className={cn(
                  "flex flex-col items-center gap-1 min-w-[50px] p-2 rounded-2xl border cursor-grab active:cursor-grabbing transition-colors duration-200 focus:outline-none",
                  activeSetId === s.id
                    ? "bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                    : "bg-black/20 border-white/5 opacity-60 hover:opacity-100 hover:border-white/10",
                )}
                style={{ borderColor: activeSetId === s.id ? undefined : groupColor + "40" }}
              >
                <span className={cn("text-[8px] font-black uppercase tracking-tighter pointer-events-none", activeSetId === s.id ? "text-cyan-400" : "opacity-60")} style={{ color: activeSetId === s.id ? undefined : groupColor }}>
                  SET {i + 1}
                </span>
                <div className="flex items-baseline gap-1 pointer-events-none">
                  <span className={cn("text-sm font-black text-white", activeSetId === s.id ? "text-white" : "opacity-80")}>
                    {isHoldExercise(exerciseId) ? s.time || 0 : s.reps || 0}
                  </span>
                  <span className="text-[7px] font-black text-slate-600 uppercase italic">{isHoldExercise(exerciseId) ? "s" : "r"}</span>
                </div>
                <div className="flex gap-1 mt-1 justify-center pointer-events-none">
                  {(s.notes || (s.media && s.media.length > 0)) && <div className="w-1.5 h-1.5 bg-orange-500 rounded-full border border-black/50" />}
                  {(s.groupNotes || (s.groupMedia && s.groupMedia.length > 0)) && <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full border border-black/50" />}
                </div>
              </motion.div>
            </Reorder.Item>
          );
        })}
        <button type="button" onClick={addSet} className="flex items-center justify-center min-w-[50px] h-[58px] rounded-2xl border-2 border-dashed border-white/10 text-slate-600 hover:border-cyan-500/30 hover:text-cyan-500 transition-all group shrink-0">
          <Plus className="group-hover:rotate-90 transition-transform" />
        </button>
      </Reorder.Group>
    </div>
  );
};
