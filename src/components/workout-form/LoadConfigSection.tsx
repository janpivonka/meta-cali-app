import React from "react";
import { Target } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { LoadType, BandPlacement, BandLoopType } from "../../types";
import { BAND_PLACEMENTS } from "./constants";

interface LoadConfigSectionProps {
  loadType: LoadType;
  setLoadTypeAndClean: (lt: LoadType) => void;
  equipment: string;
  executionStyle: string;
  dipBarFootSupport: boolean;
  updateActiveAssistance: (field: string, val: any) => void;
  weightUnit: "kg" | "lbs";
  assistanceValue: string;
  bandLoopType: BandLoopType;
  bandPlacements: BandPlacement[];
  toggleBandPlacement: (p: BandPlacement) => void;
  legProgression: string;
  isOneLeg: boolean;
  oneLegPrimaryPosition: string;
  oneLegSecondaryPosition: string;
  legTarget: "primary" | "secondary" | "alternating";
  position: string;
}

export const LoadConfigSection = React.memo(
  ({
    loadType,
    setLoadTypeAndClean,
    equipment,
    executionStyle,
    dipBarFootSupport,
    updateActiveAssistance,
    weightUnit,
    assistanceValue,
    bandLoopType,
    bandPlacements,
    toggleBandPlacement,
    legProgression,
    isOneLeg,
    oneLegPrimaryPosition,
    oneLegSecondaryPosition,
    legTarget,
    position,
  }: LoadConfigSectionProps) => {
    const filteredBandPlacements = React.useMemo(() => {
      return BAND_PLACEMENTS.filter((p) => {
        // If dip bar foot support is ON, only WAIST is allowed
        if (dipBarFootSupport && p !== "waist") return false;

        const isAustr = legProgression.toString().includes("australian");
        const isOneLegNor = legProgression === "one leg";
        const isOneLegAustr = isAustr && isOneLeg;

        if (
          (isOneLegNor ||
            legProgression === "straddle" ||
            isOneLegAustr) &&
          p === "both feet"
        ) {
          return false;
        }

        const isPrimHalf =
          (isOneLegNor || isOneLegAustr) &&
          oneLegPrimaryPosition === "halflay";
        const isSecHalf =
          (isOneLegNor || isOneLegAustr) &&
          oneLegSecondaryPosition === "halflay";
        const isFullHalf = legProgression === "halflay";

        const targetHalf =
          isFullHalf ||
          (legTarget === "primary" && isPrimHalf) ||
          (legTarget === "secondary" && isSecHalf);
        const isFloatAustr =
          isAustr && isOneLeg && legTarget === "primary";

        if (targetHalf && !isFloatAustr) {
          return p !== "both feet" && p !== "one foot";
        }

        // Restricted Buttocks / Waist logic
        const isRestrictedEquip = [
          "pull-up bar",
          "rings",
          "stall bars",
        ].includes(equipment);
        const isNotL = position !== "L-sit";
        if (
          isRestrictedEquip &&
          isNotL &&
          (p === "buttocks" || p === "waist")
        )
          return false;

        return true;
      });
    }, [
      dipBarFootSupport,
      legProgression,
      isOneLeg,
      oneLegPrimaryPosition,
      oneLegSecondaryPosition,
      legTarget,
      equipment,
      position,
    ]);

    return (
      <div className="p-8 bg-orange-500/5 rounded-[32px] border border-orange-500/10">
        <div className="flex flex-col items-stretch gap-8">
          {equipment === "dip bars" &&
            executionStyle.toString().startsWith("korean") && (
              <div className="bg-orange-500/10 p-5 rounded-2xl border border-orange-500/20">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 italic">
                      Dip Bar Foot Support
                    </span>
                    <span className="text-[8px] text-orange-400/60 font-bold uppercase leading-tight">
                      One foot resting on the other bar for assistance
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateActiveAssistance(
                        "dipBarFootSupport",
                        !dipBarFootSupport,
                      )
                    }
                    className={cn(
                      "w-14 h-7 rounded-full transition-all relative border shrink-0",
                      dipBarFootSupport
                        ? "bg-orange-500 border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                        : "bg-black/40 border-white/10",
                    )}
                  >
                    <motion.div
                      animate={{ x: dipBarFootSupport ? 30 : 4 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                      className={cn(
                        "w-5 h-5 rounded-full absolute top-0.5",
                        dipBarFootSupport ? "bg-black" : "bg-slate-600",
                      )}
                    />
                  </button>
                </div>
              </div>
            )}

          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 flex items-center gap-2">
            <Target size={14} /> Load Configuration
          </label>
          <div className="flex gap-2">
            {(["bodyweight", "weighted", "assisted"] as LoadType[]).map(
              (lt) => (
                <button
                  key={lt}
                  type="button"
                  onClick={() => setLoadTypeAndClean(lt)}
                  className={cn(
                    "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                    loadType === lt
                      ? "bg-orange-500 text-black border-orange-400 shadow-lg"
                      : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                  )}
                >
                  {lt === "bodyweight"
                    ? "Bodyweight"
                    : lt === "weighted"
                      ? "Weighted (+)"
                      : "Assisted (-)"}
                </button>
              ),
            )}
          </div>
        </div>

        {loadType !== "bodyweight" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="flex-1 space-y-4 w-full">
                <div className="flex items-center justify-between px-2">
                  <label className="text-[8px] font-black uppercase tracking-[0.3em] text-orange-500/60 block">
                    {loadType === "weighted"
                      ? `Extra weight (${weightUnit})`
                      : `Assistance value (${weightUnit})`}
                  </label>
                  <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/5">
                    <button
                      type="button"
                      onClick={() => updateActiveAssistance("unit", "kg")}
                      className={cn(
                        "px-2 py-1 rounded-md text-[8px] font-black transition-all",
                        weightUnit === "kg"
                          ? "bg-orange-500 text-black"
                          : "text-slate-500",
                      )}
                    >
                      KG
                    </button>
                    <button
                      type="button"
                      onClick={() => updateActiveAssistance("unit", "lbs")}
                      className={cn(
                        "px-2 py-1 rounded-md text-[8px] font-black transition-all",
                        weightUnit === "lbs"
                          ? "bg-orange-500 text-black"
                          : "text-slate-500",
                      )}
                    >
                      LBS
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  placeholder="0"
                  value={assistanceValue}
                  onChange={(e) =>
                    updateActiveAssistance("resistance", e.target.value)
                  }
                  className="w-full bg-black/40 border border-orange-500/20 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-orange-500 italic"
                />
              </div>
              {loadType === "assisted" && (
                <div className="bg-black/20 p-2 rounded-2xl border border-white/5 h-[54px] flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      const next =
                        bandLoopType === "single"
                          ? "double"
                          : bandLoopType === "double"
                            ? "half"
                            : "single";
                      updateActiveAssistance("loopType", next);
                    }}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[7px] font-black uppercase tracking-widest transition-all",
                      bandLoopType !== "single"
                        ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20"
                        : "bg-white/10 text-slate-400",
                    )}
                  >
                    {bandLoopType === "double"
                      ? "Double"
                      : bandLoopType === "half"
                        ? "1/2"
                        : "Single"}
                  </button>
                </div>
              )}
            </div>

            {loadType === "assisted" && (
              <div className="space-y-4">
                <label className="text-[8px] font-black uppercase tracking-[0.3em] text-orange-500/60 block px-2">
                  Assistance Placement
                </label>
                <div className="flex flex-wrap gap-2">
                  {filteredBandPlacements.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => toggleBandPlacement(p)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[7px] font-black uppercase tracking-widest border transition-all flex-1 text-center min-w-[80px]",
                        bandPlacements.includes(p)
                          ? "bg-orange-500 text-black border-orange-400"
                          : "bg-black/40 text-slate-500 border-white/5",
                      )}
                    >
                      {p === "one foot"
                        ? "One foot"
                        : p === "both feet"
                          ? "Both feet"
                          : p === "knees"
                            ? "Knee(s)"
                            : p === "waist"
                              ? "Waist (hips)"
                              : p === "buttocks"
                                ? "Buttocks"
                                : "Chest"}
                    </button>
                  ))}
                </div>

                {(legProgression === "one leg" ||
                  legProgression === "straddle") &&
                  (bandPlacements.includes("one foot") ||
                    bandPlacements.includes("knees")) && (
                    <div className="space-y-3 pt-2">
                      <label className="text-[8px] font-black uppercase tracking-[0.3em] text-orange-500/40 block px-2">
                        Leg Assistance Target
                      </label>
                      <div className="flex gap-2">
                        {(
                          ["primary", "secondary", "alternating"] as const
                        ).map((side) => (
                          <button
                            key={side}
                            type="button"
                            onClick={() =>
                              updateActiveAssistance("legTarget", side)
                            }
                            className={cn(
                              "px-4 py-2 rounded-xl text-[7px] font-black uppercase tracking-widest border transition-all flex-1 text-center",
                              legTarget === side
                                ? "bg-orange-500/20 text-orange-400 border-orange-400/30"
                                : "bg-black/40 text-slate-600 border-white/5",
                            )}
                          >
                            {side === "primary"
                              ? "Primary"
                              : side === "secondary"
                                ? "Secondary"
                                : "Alternating"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    );
  },
);
