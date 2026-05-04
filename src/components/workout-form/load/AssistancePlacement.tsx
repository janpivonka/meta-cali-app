import React from "react";
import { cn } from "../../../lib/utils";
import { BandPlacement } from "../../../types";
import { BAND_PLACEMENTS } from "../constants";

interface AssistancePlacementProps {
  dipBarFootSupport: boolean;
  legProgression: string;
  isOneLeg: boolean;
  oneLegPrimaryPosition: string;
  oneLegSecondaryPosition: string;
  legTarget: "primary" | "secondary" | "alternating";
  equipment: string;
  position: string;
  bandPlacements: BandPlacement[];
  toggleBandPlacement: (p: BandPlacement) => void;
  updateActiveAssistance: (field: string, val: any) => void;
}

export const AssistancePlacement: React.FC<AssistancePlacementProps> = ({
  dipBarFootSupport, legProgression, isOneLeg, oneLegPrimaryPosition,
  oneLegSecondaryPosition, legTarget, equipment, position,
  bandPlacements, toggleBandPlacement, updateActiveAssistance,
}) => {
  const filteredPlacements = BAND_PLACEMENTS.filter((p) => {
    if (dipBarFootSupport && p !== "waist") return false;
    const isAustr = legProgression.toString().includes("australian");
    const isOneLegNor = legProgression === "one leg";
    const isOneLegAustr = isAustr && isOneLeg;

    if ((isOneLegNor || legProgression === "straddle" || isOneLegAustr) && p === "both feet") return false;

    const isPrimHalf = (isOneLegNor || isOneLegAustr) && oneLegPrimaryPosition === "halflay";
    const isSecHalf = (isOneLegNor || isOneLegAustr) && oneLegSecondaryPosition === "halflay";
    const isFullHalf = legProgression === "halflay";
    const targetHalf = isFullHalf || (legTarget === "primary" && isPrimHalf) || (legTarget === "secondary" && isSecHalf);
    const isFloatAustr = isAustr && isOneLeg && legTarget === "primary";

    if (targetHalf && !isFloatAustr) return (p !== "both feet" && p !== "one foot");

    const isRestrictedEquip = ["pull-up bar", "rings", "stall bars"].includes(equipment);
    const isNotL = position !== "L-sit";
    if (isRestrictedEquip && isNotL && (p === "buttocks" || p === "waist")) return false;

    return true;
  });

  return (
    <div className="space-y-4">
      <label className="text-[8px] font-black uppercase tracking-[0.3em] text-orange-500/60 block px-2">Band Placement</label>
      <div className="flex flex-wrap gap-2">
        {filteredPlacements.map((p) => (
          <button
            key={p} type="button" onClick={() => toggleBandPlacement(p)}
            className={cn(
              "px-4 py-2 rounded-xl text-[7px] font-black uppercase tracking-widest border transition-all flex-1 text-center min-w-[80px]",
              bandPlacements.includes(p) ? "bg-orange-500 text-black border-orange-400" : "bg-black/40 text-slate-500 border-white/5",
            )}
          >
            {p === "one foot" ? "ONE FOOT" : p === "both feet" ? "BOTH FEET" : p === "knees" ? "KNEE(S)" : p === "waist" ? "WAIST (HIPS)" : p === "buttocks" ? "BUTTOCKS" : "CHEST"}
          </button>
        ))}
      </div>

      {(legProgression === "one leg" || legProgression === "straddle") && (bandPlacements.includes("one foot") || bandPlacements.includes("knees")) && (
        <div className="space-y-3 pt-2">
          <label className="text-[8px] font-black uppercase tracking-[0.3em] text-orange-500/40 block px-2">Leg Assistance Target</label>
          <div className="flex gap-2">
            {(["primary", "secondary", "alternating"] as const).map((side) => (
              <button
                key={side} type="button" onClick={() => updateActiveAssistance("legTarget", side)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[7px] font-black uppercase tracking-widest border transition-all flex-1 text-center",
                  legTarget === side ? "bg-orange-500/20 text-orange-400 border-orange-400/30" : "bg-black/40 text-slate-600 border-white/5",
                )}
              >
                {side === "primary" ? "PRIMARY" : side === "secondary" ? "SECONDARY" : "ALTERNATE"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
