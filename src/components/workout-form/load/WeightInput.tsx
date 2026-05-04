import React from "react";
import { cn } from "../../../lib/utils";
import { LoadType, BandLoopType } from "../../../types";

interface WeightInputProps {
  loadType: LoadType;
  weightUnit: "kg" | "lbs";
  assistanceValue: string;
  bandLoopType: BandLoopType;
  updateActiveAssistance: (field: string, val: any) => void;
}

export const WeightInput: React.FC<WeightInputProps> = ({
  loadType, weightUnit, assistanceValue, bandLoopType, updateActiveAssistance
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-end gap-4">
      <div className="flex-1 space-y-4 w-full">
        <div className="flex items-center justify-between px-2">
          <label className="text-[8px] font-black uppercase tracking-[0.3em] text-orange-500/60 block">
            {loadType === "weighted" ? `Extra weight (${weightUnit})` : `Assistance value (${weightUnit})`}
          </label>
          <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/5">
            {(["kg", "lbs"] as const).map(u => (
              <button
                key={u} type="button" onClick={() => updateActiveAssistance("unit", u)}
                className={cn("px-2 py-1 rounded-md text-[8px] font-black transition-all", weightUnit === u ? "bg-orange-500 text-black" : "text-slate-500")}
              >
                {u.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <input
          type="number" placeholder="0" value={assistanceValue}
          onChange={(e) => updateActiveAssistance("resistance", e.target.value)}
          className="w-full bg-black/40 border border-orange-500/20 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-orange-500 italic"
        />
      </div>
      {loadType === "assisted" && (
        <div className="bg-black/20 p-2 rounded-2xl border border-white/5 h-[54px] flex items-center">
          <button
            type="button"
            onClick={() => {
              const next = bandLoopType === "single" ? "double" : bandLoopType === "double" ? "half" : "single";
              updateActiveAssistance("loopType", next);
            }}
            className={cn(
              "px-4 py-2 rounded-xl text-[7px] font-black uppercase tracking-widest transition-all",
              bandLoopType !== "single" ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20" : "bg-white/10 text-slate-400",
            )}
          >
            {bandLoopType === "double" ? "DOUBLE (LOOPED)" : bandLoopType === "half" ? "1/2 BAND" : "SINGLE"}
          </button>
        </div>
      )}
    </div>
  );
};
