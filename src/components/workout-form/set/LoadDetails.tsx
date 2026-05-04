import React from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "../../../lib/utils";
import { WorkoutSet } from "../../../types";

interface LoadDetailsProps {
  set: WorkoutSet;
  updateSet: (field: keyof WorkoutSet, val: any) => void;
}

export const LoadDetails: React.FC<LoadDetailsProps> = ({ set, updateSet }) => {
  const isWeighted = set.loadType === "weighted" || (set.weight !== undefined && set.weight > 0);
  const isAssisted = set.loadType === "assisted" || !!set.assistanceDetails?.resistance;

  if (!isWeighted && !isAssisted) {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest pt-2">BW</span>
        <span className="text-[7px] font-black uppercase tracking-widest text-slate-600 italic leading-none">LOAD</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        {isWeighted ? (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); updateSet("weight", Math.max(0, (set.weight || 0) - 1)); }}
              className="w-6 h-6 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all active:scale-90"
            >
              <Minus size={10} />
            </button>
            <input
              type="number"
              value={set.weight || 0}
              onChange={(e) => updateSet("weight", parseFloat(e.target.value) || 0)}
              onClick={(e) => e.stopPropagation()}
              className="bg-transparent text-xl font-black text-purple-400 w-12 text-center focus:outline-none font-mono tracking-tighter"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); updateSet("weight", (set.weight || 0) + 1); }}
              className="w-6 h-6 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all active:scale-90"
            >
              <Plus size={10} />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const currentRes = parseFloat(set.assistanceDetails?.resistance || "0");
                updateSet("assistanceDetails", { ...set.assistanceDetails, resistance: Math.max(0, currentRes - 1).toString() });
              }}
              className="w-6 h-6 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all active:scale-90"
            >
              <Minus size={10} />
            </button>
            <input
              type="number"
              value={set.assistanceDetails?.resistance || ""}
              onChange={(e) => updateSet("assistanceDetails", { ...set.assistanceDetails, resistance: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              placeholder="0"
              className="bg-transparent text-xl font-black text-orange-400 w-12 text-center focus:outline-none font-mono tracking-tighter"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const currentRes = parseFloat(set.assistanceDetails?.resistance || "0");
                updateSet("assistanceDetails", { ...set.assistanceDetails, resistance: (currentRes + 1).toString() });
              }}
              className="w-6 h-6 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all active:scale-90"
            >
              <Plus size={10} />
            </button>
          </>
        )}
      </div>

      <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/5 mt-1" onClick={(e) => e.stopPropagation()}>
        {(["kg", "lbs"] as const).map(u => (
          <button
            key={u} type="button" onClick={(e) => { e.stopPropagation(); updateSet("weightUnit", u); }}
            className={cn(
              "px-1 py-0.5 rounded-md text-[6px] font-black transition-all uppercase",
              (set.weightUnit || "kg") === u
                ? (isWeighted ? "bg-purple-500 text-white" : "bg-orange-500 text-black")
                : "text-slate-500"
            )}
          >
            {u === "lbs" ? "LB" : "KG"}
          </button>
        ))}
      </div>
      <span className="text-[7px] font-black uppercase tracking-widest text-slate-600 italic leading-none">
        {set.loadType === "weighted" ? "WEIGHT (+)" : set.loadType === "assisted" ? "ASST (-)" : "LOAD"}
      </span>
    </div>
  );
};
