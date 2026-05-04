import React from "react";
import { Plus, Minus } from "lucide-react";

interface RepsTimeInputProps {
  exerciseId: string;
  reps: number;
  time: number;
  isHoldExercise: (id: string) => boolean;
  updateSet: (field: "reps" | "time", val: number) => void;
}

export const RepsTimeInput: React.FC<RepsTimeInputProps> = ({ exerciseId, reps, time, isHoldExercise, updateSet }) => {
  const isHold = isHoldExercise(exerciseId);
  const currentVal = isHold ? time : reps;
  const field = isHold ? "time" : "reps";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); updateSet(field, Math.max(0, currentVal - 1)); }}
          className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
        >
          <Minus size={14} />
        </button>
        <input
          type="number"
          value={currentVal}
          onChange={(e) => updateSet(field, parseInt(e.target.value) || 0)}
          onClick={(e) => e.stopPropagation()}
          className="bg-transparent text-2xl font-black text-white w-14 text-center focus:outline-none font-mono tracking-tighter"
        />
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); updateSet(field, currentVal + 1); }}
          className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
        >
          <Plus size={14} />
        </button>
      </div>
      <span className="text-[7px] font-black uppercase tracking-widest text-slate-600 italic leading-none">
        {isHold ? "TIME (seconds)" : "REPS"}
      </span>
    </div>
  );
};
