import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { LegProgression, SingleLegPosition, WorkoutSet } from "../../../types";
import { LEG_PROGRESSIONS, SINGLE_LEG_POSITIONS } from "../constants";

interface SupportSectionProps {
  equipment: string;
  setEquipment: (val: any) => void;
  availableEquipment: string[];
  legProgression: LegProgression | string;
  setLegProgression: (val: any) => void;
  isOneLeg: boolean;
  setIsOneLeg: (val: any) => void;
  oneLegPrimaryPosition: SingleLegPosition | string;
  setOneLegPrimaryPosition: (val: any) => void;
  oneLegSecondaryPosition: SingleLegPosition | string;
  setOneLegSecondaryPosition: (val: any) => void;
  oneArmSide: "left" | "right" | "alternating";
  setOneArmSide: (val: any) => void;
  dipBarFootSupport: boolean;
  updateActiveValue: (field: string, setter: (val: any) => void, val: any) => void;
  updateSet: (index: number, field: keyof WorkoutSet, value: any) => void;
  activeSetId: string | null;
  activeSet: WorkoutSet | undefined;
  safeActiveSetIndex: number;
}

export const SupportSection: React.FC<SupportSectionProps> = ({
  equipment, setEquipment, availableEquipment,
  legProgression, setLegProgression,
  isOneLeg, setIsOneLeg,
  oneLegPrimaryPosition, setOneLegPrimaryPosition,
  oneLegSecondaryPosition, setOneLegSecondaryPosition,
  oneArmSide, setOneArmSide,
  dipBarFootSupport,
  updateActiveValue, updateSet,
  activeSetId, activeSet, safeActiveSetIndex
}) => {
  return (
    <div className="space-y-8 p-8 bg-white/5 rounded-[32px] border border-white/5">
      <div className="space-y-6">
        <div>
          <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block mb-3">Equipment</label>
          <div className="flex flex-wrap gap-2">
            {availableEquipment.map((eq) => (
              <button key={eq} type="button" onClick={() => updateActiveValue("equipment", setEquipment, eq)} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all", equipment === eq ? "bg-white text-black border-white shadow-lg" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20")}>
                {eq === "pull-up bar" ? "PULL-UP BAR" : eq === "low bar" ? "LOW BAR" : eq === "dip bars" ? "DIP BARS" : eq === "rings" ? "RINGS" : eq === "floor" ? "FLOOR" : eq === "parallelettes" ? "PARALLELETTES" : eq === "stall bars" ? "STALL BARS" : eq.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {!dipBarFootSupport && (
          <div>
            <label className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/60 block mb-3">Leg Progression</label>
            <div className="flex flex-wrap gap-2">
              {LEG_PROGRESSIONS.map((prog) => (
                <button key={prog} type="button" onClick={() => updateActiveValue("legProgression", setLegProgression, prog)} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all", legProgression === prog ? "bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/20" : "bg-black/40 text-slate-500 border-white/5 hover:border-white/20")}>
                   {prog === "tuck" ? "TUCK" : prog === "adv tuck" ? "ADV TUCK" : prog === "straddle" ? "STRADDLE" : prog === "one leg" ? "ONE LEG" : prog === "halflay" ? "HALFLAY" : prog === "full" ? "FULL" : prog.replace("-", " ").toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        {legProgression.toString().includes("australian") && (
          <div className="flex items-center gap-3 pt-2">
            <button type="button" onClick={() => updateActiveValue("isOneLeg", setIsOneLeg, !isOneLeg)} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all", isOneLeg ? "bg-cyan-500 text-black border-cyan-400 shadow-lg" : "bg-black/20 text-slate-500 border-white/5")}>One leg {isOneLeg ? "✓" : "✗"}</button>
          </div>
        )}

        {(legProgression === "one leg" || (legProgression.toString().includes("australian") && isOneLeg) || dipBarFootSupport) && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 pt-4 border-t border-white/5 pb-4 overflow-hidden">
            <div className="space-y-2">
              <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400 block mb-2">Leg Assistance</label>
              <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 mb-4">
                {(["left", "right", "alternating"] as const).map((side) => (
                  <button key={side} type="button" onClick={() => updateActiveValue("oneArmSide", setOneArmSide, side)} className={cn("flex-1 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all", oneArmSide === side ? "bg-cyan-500 text-black shadow-lg" : "text-slate-500 hover:text-white")}>
                    {side === "left" ? "LEFT" : side === "right" ? "RIGHT" : "ALTERNATE"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400 block mb-2">{dipBarFootSupport ? "Free Leg Position" : legProgression.toString().includes("australian") ? "Assisting Leg Position" : "Primary Leg"}</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SINGLE_LEG_POSITIONS.map((p) => (
                  <button key={p} type="button" onClick={() => {
                    if (activeSetId) {
                      const newPrimary = p;
                      let newSecondary = activeSet?.oneLegSecondaryPosition || oneLegSecondaryPosition;
                      if (p === newSecondary && legProgression === "one leg") {
                        newSecondary = SINGLE_LEG_POSITIONS.find((lp) => lp !== p) || "tuck";
                      }
                      updateSet(safeActiveSetIndex, "oneLegPrimaryPosition" as any, newPrimary);
                      updateSet(safeActiveSetIndex, "oneLegSecondaryPosition" as any, newSecondary);
                    }
                    setOneLegPrimaryPosition(p);
                    if (p === oneLegSecondaryPosition && legProgression === "one leg") {
                      const fallback = SINGLE_LEG_POSITIONS.find((lp) => lp !== p) || "tuck";
                      setOneLegSecondaryPosition(fallback as any);
                    }
                  }} className={cn("px-3 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all text-center", oneLegPrimaryPosition === p ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20" : "bg-black/40 text-slate-500 border-white/5 hover:border-white/20")}>
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {legProgression === "one leg" && (
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400/60 block mb-2">Secondary Leg</label>
                <div className="grid grid-cols-3 gap-2">
                  {SINGLE_LEG_POSITIONS.filter((p) => p !== oneLegPrimaryPosition).map((p) => (
                    <button key={p} type="button" onClick={() => updateActiveValue("oneLegSecondaryPosition", setOneLegSecondaryPosition, p)} className={cn("px-3 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all text-center", oneLegSecondaryPosition === p ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20" : "bg-black/40 text-slate-500 border-white/5 hover:border-white/20")}>{p.toUpperCase()}</button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
