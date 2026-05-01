import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { 
  GripType,
  GripWidth,
  ExecutionStyle,
  ExecutionMethod,
  BodyPosition,
  LegProgression,
  OneArmHandPosition,
  SingleLegPosition,
  WorkoutSet 
} from "../../types";
import { 
  EQUIPMENTS, 
  EXECUTION_STYLES, 
  GRIP_WIDTHS, 
  GRIPS, 
  ONE_ARM_POSITIONS, 
  EXECUTION_METHODS, 
  POSITIONS, 
  LEG_PROGRESSIONS, 
  SINGLE_LEG_POSITIONS,
  THUMBS
} from "./constants";

interface TaxonomySectionProps {
  equipment: string;
  setEquipment: (val: any) => void;
  availableEquipment: string[];
  executionStyle: ExecutionStyle | string;
  setExecutionStyle: (val: any) => void;
  availableExecutionStyles: string[];
  handleStyleChange: (style: ExecutionStyle | string) => void;
  grip: GripType | string;
  setGrip: (val: any) => void;
  gripWidth: GripWidth | string;
  setGripWidth: (val: any) => void;
  executionMethod: ExecutionMethod | string;
  setExecutionMethod: (val: any) => void;
  position: BodyPosition | string;
  setPosition: (val: any) => void;
  legProgression: LegProgression | string;
  setLegProgression: (val: any) => void;
  oneArmHandPosition: OneArmHandPosition | string;
  setOneArmHandPosition: (val: any) => void;
  oneArmSide: "left" | "right" | "alternating";
  setOneArmSide: (val: any) => void;
  isOneLeg: boolean;
  setIsOneLeg: (val: any) => void;
  oneLegPrimaryPosition: SingleLegPosition | string;
  setOneLegPrimaryPosition: (val: any) => void;
  oneLegSecondaryPosition: SingleLegPosition | string;
  setOneLegSecondaryPosition: (val: any) => void;
  thumb: string;
  setThumb: (val: any) => void;
  falseGrip: boolean;
  setFalseGrip: (val: any) => void;
  mixedGripLeft: string;
  setMixedGripLeft: (val: any) => void;
  mixedGripRight: string;
  setMixedGripRight: (val: any) => void;
  mixedGripIsAlternating: boolean;
  setMixedGripIsAlternating: (val: any) => void;
  dipBarFootSupport: boolean;
  updateActiveValue: (
    field: string,
    setter: (val: any) => void,
    val: any,
  ) => void;
  updateSet: (index: number, field: keyof WorkoutSet, value: any) => void;
  activeSetId: string | null;
  activeSet: WorkoutSet | undefined;
  safeActiveSetIndex: number;
}

export const TaxonomySection: React.FC<TaxonomySectionProps> = ({
  equipment,
  setEquipment,
  availableEquipment,
  executionStyle,
  setExecutionStyle,
  availableExecutionStyles,
  handleStyleChange,
  grip,
  setGrip,
  gripWidth,
  setGripWidth,
  executionMethod,
  setExecutionMethod,
  position,
  setPosition,
  legProgression,
  setLegProgression,
  oneArmHandPosition,
  setOneArmHandPosition,
  oneArmSide,
  setOneArmSide,
  isOneLeg,
  setIsOneLeg,
  oneLegPrimaryPosition,
  setOneLegPrimaryPosition,
  oneLegSecondaryPosition,
  setOneLegSecondaryPosition,
  thumb,
  setThumb,
  falseGrip,
  setFalseGrip,
  mixedGripLeft,
  setMixedGripLeft,
  mixedGripRight,
  setMixedGripRight,
  mixedGripIsAlternating,
  setMixedGripIsAlternating,
  dipBarFootSupport,
  updateActiveValue,
  updateSet,
  activeSetId,
  activeSet,
  safeActiveSetIndex,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-8 p-8 bg-white/5 rounded-[32px] border border-white/5">
        <div className="space-y-6">
          {executionStyle !== "commando" && (
            <>
              {executionStyle !== "one arm" && (
                <div id="grip-width-section">
                  <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block mb-3">
                    Grip Width
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {GRIP_WIDTHS.map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() =>
                          updateActiveValue("gripWidth", setGripWidth, w)
                        }
                        className={cn(
                          "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                          gripWidth === w
                            ? "bg-white text-black border-white shadow-lg"
                            : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                        )}
                      >
                        {w === "shoulder-width"
                          ? "Shoulder-width"
                          : w === "narrow"
                            ? "Narrow"
                            : w === "wide"
                              ? "Wide"
                              : "Alternating"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block mb-3">
                  Grip Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {GRIPS.filter((g) =>
                    executionStyle === "one arm" ? g !== "mixed" : true,
                  ).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => updateActiveValue("grip", setGrip, g)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                        grip === g
                          ? "bg-white text-black border-white shadow-lg"
                          : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {grip === "mixed" && executionStyle !== "one arm" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-4 border-t border-white/5 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block">
                          Left Hand
                        </label>
                        <div className="flex gap-1">
                          {(
                            [
                              "pronated",
                              "supinated",
                              "neutral",
                              "alternating",
                            ] as const
                          ).map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => {
                                const details = {
                                  left: g,
                                  right: mixedGripRight,
                                  isAlternating: mixedGripIsAlternating,
                                };
                                updateActiveValue(
                                  "mixedGripDetails",
                                  (val) => setMixedGripLeft(val.left),
                                  details,
                                );
                              }}
                              className={cn(
                                "flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase border transition-all",
                                mixedGripLeft === g
                                  ? "bg-white text-black border-white shadow-sm"
                                  : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                              )}
                            >
                              {g === "alternating" ? "ALT" : g[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block">
                          Right Hand
                        </label>
                        <div className="flex gap-1">
                          {(
                            [
                              "pronated",
                              "supinated",
                              "neutral",
                              "alternating",
                            ] as const
                          ).map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => {
                                const details = {
                                  left: mixedGripLeft,
                                  right: g,
                                  isAlternating: mixedGripIsAlternating,
                                };
                                updateActiveValue(
                                  "mixedGripDetails",
                                  (val) => setMixedGripRight(val.right),
                                  details,
                                );
                              }}
                              className={cn(
                                "flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase border transition-all",
                                mixedGripRight === g
                                  ? "bg-white text-black border-white shadow-sm"
                                  : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                              )}
                            >
                              {g === "alternating" ? "ALT" : g[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/5 flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          const details = {
                            left: mixedGripLeft,
                            right: mixedGripRight,
                            isAlternating: !mixedGripIsAlternating,
                          };
                          updateActiveValue(
                            "mixedGripDetails",
                            (val) =>
                              setMixedGripIsAlternating(
                                val.isAlternating || false,
                              ),
                            details,
                          );
                        }}
                        className={cn(
                          "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2",
                          mixedGripIsAlternating
                            ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20"
                            : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                        )}
                      >
                        <div
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            mixedGripIsAlternating
                              ? "bg-black animate-pulse"
                              : "bg-slate-600",
                          )}
                        />
                        Alternating Hands (Per Rep)
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block mb-3">
                Thumb Position
              </label>
              <div className="flex flex-wrap gap-2">
                {THUMBS.map((t) => (
                  <button
                    key={t.val}
                    type="button"
                    onClick={() => updateActiveValue("thumb", setThumb, t.val)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex-1 text-center",
                      thumb === t.val
                        ? "bg-white text-black border-white shadow-lg"
                        : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400 block mb-3">
                False Grip
              </label>
              <button
                type="button"
                onClick={() =>
                  updateActiveValue("falseGrip", setFalseGrip, !falseGrip)
                }
                className={cn(
                  "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all w-full text-center h-[38px] flex items-center justify-center",
                  falseGrip
                    ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20"
                    : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                )}
              >
                {falseGrip ? "ACTIVE" : "INACTIVE"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block mb-3">
              Equipment
            </label>
            <div className="flex flex-wrap gap-2">
              {availableEquipment.map((eq) => (
                <button
                  key={eq}
                  type="button"
                  onClick={() =>
                    updateActiveValue("equipment", setEquipment, eq)
                  }
                  className={cn(
                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                    equipment === eq
                      ? "bg-white text-black border-white shadow-lg"
                      : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                  )}
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-8 bg-white/5 rounded-[32px] border border-white/5">
        <div className="space-y-6">
          <div>
            <label className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/60 block mb-3">
              Execution Style
            </label>
            <div className="flex flex-wrap gap-2">
              {availableExecutionStyles.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => handleStyleChange(style)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                    executionStyle === style
                      ? "bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/20"
                      : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                  )}
                >
                  {style.replace("-", " ").toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {executionStyle.toString().startsWith("korean") && (
            <motion.div
              key="korean-variants"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 mt-3 pt-3 border-t border-white/5 mb-6"
            >
              {(["archer", "typewriter"] as const).map((variant) => {
                const variantStyle = `korean ${variant}` as ExecutionStyle;
                const isActive = executionStyle === variantStyle;
                return (
                  <button
                    key={variant}
                    type="button"
                    onClick={() =>
                      handleStyleChange(isActive ? "korean" : variantStyle)
                    }
                    className={cn(
                      "flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all",
                      isActive
                        ? "bg-purple-600 text-white border-purple-400"
                        : "bg-black/40 text-slate-500 border-white/5",
                    )}
                  >
                    + {variant}
                  </button>
                );
              })}
            </motion.div>
          )}

          {(executionStyle === "one arm" || executionStyle === "commando") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-5 pt-4 border-t border-white/5 pb-4"
            >
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400 block mb-2">
                  {executionStyle === "one arm"
                    ? "Active Arm"
                    : "Front Hand Position"}
                </label>
                <div className="flex gap-2">
                  {(["left", "right", "alternating"] as const).map((side) => (
                    <button
                      key={side}
                      type="button"
                      onClick={() =>
                        updateActiveValue("oneArmSide", setOneArmSide, side)
                      }
                      className={cn(
                        "flex-1 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all",
                        oneArmSide === side
                          ? "bg-cyan-500 text-black border-cyan-400"
                          : "bg-black/40 text-slate-500 border-white/5",
                      )}
                    >
                      {side}
                    </button>
                  ))}
                </div>
              </div>

              {executionStyle === "one arm" && (
                <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400 block mb-2">
                    Passive Arm Support
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ONE_ARM_POSITIONS.map((pos) => (
                      <button
                        key={pos.val}
                        type="button"
                        onClick={() =>
                          updateActiveValue(
                            "oneArmHandPosition",
                            setOneArmHandPosition,
                            pos.val,
                          )
                        }
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all flex-1 text-center min-w-[80px]",
                          oneArmHandPosition === pos.val
                            ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/10"
                            : "bg-black/40 text-slate-500 border-white/5",
                        )}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          <div>
            <label className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/60 block mb-3">
              Method/Tempo
            </label>
            <div className="flex flex-wrap gap-2">
              {EXECUTION_METHODS.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() =>
                    updateActiveValue(
                      "executionMethod",
                      setExecutionMethod,
                      method,
                    )
                  }
                  className={cn(
                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                    executionMethod === method
                      ? "bg-white/20 text-white border-white/20 shadow-lg"
                      : "bg-black/20 text-slate-600 border-white/5 hover:border-white/20",
                  )}
                >
                  {method === "standard"
                    ? "Standard"
                    : method === "explosive"
                      ? "Explosive"
                      : method === "partial"
                        ? "Partial"
                        : method === "negative"
                          ? "Negative"
                          : method === "scapula"
                            ? "Scapula"
                            : "Controlled"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/60 block mb-3">
              Core Position
            </label>
            <div className="flex flex-wrap gap-2">
              {POSITIONS.map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() =>
                    updateActiveValue("position", setPosition, pos)
                  }
                  className={cn(
                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                    position === pos
                      ? "bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/20"
                      : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                  )}
                >
                  {pos === "neutral" ? "Neutral" : pos}
                </button>
              ))}
            </div>
          </div>

          {!dipBarFootSupport && (
            <div>
              <label className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/60 block mb-3">
                Leg Progression
              </label>
              <div className="flex flex-wrap gap-2">
                {LEG_PROGRESSIONS.map((prog) => (
                  <button
                    key={prog}
                    type="button"
                    onClick={() =>
                      updateActiveValue(
                        "legProgression",
                        setLegProgression,
                        prog,
                      )
                    }
                    className={cn(
                      "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                      legProgression === prog
                        ? "bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/20"
                        : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                    )}
                  >
                    {prog === "full"
                      ? "Full"
                      : prog === "australian (bent legs)"
                        ? "Australian (Bent)"
                        : prog === "australian (straight legs)"
                          ? "Australian (Straight)"
                          : prog}
                  </button>
                ))}
              </div>
            </div>
          )}

          {legProgression.toString().includes("australian") && (
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  updateActiveValue("isOneLeg", setIsOneLeg, !isOneLeg)
                }
                className={cn(
                  "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                  isOneLeg
                    ? "bg-cyan-500 text-black border-cyan-400 shadow-lg"
                    : "bg-black/20 text-slate-500 border-white/5",
                )}
              >
                One Leg {isOneLeg ? "✓" : "✗"}
              </button>
            </div>
          )}

          {(legProgression === "one leg" ||
            (legProgression.toString().includes("australian") && isOneLeg) ||
            dipBarFootSupport) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4 pt-4 border-t border-white/5 pb-4"
            >
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400 block mb-2">
                  Leg Assist
                </label>
                <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 mb-4">
                  {(["left", "right", "alternating"] as const).map((side) => (
                    <button
                      key={side}
                      type="button"
                      onClick={() =>
                        updateActiveValue("oneArmSide", setOneArmSide, side)
                      }
                      className={cn(
                        "flex-1 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all",
                        oneArmSide === side
                          ? "bg-cyan-500 text-black shadow-lg"
                          : "text-slate-500 hover:text-white",
                      )}
                    >
                      {side}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400 block mb-2">
                  {dipBarFootSupport
                    ? "Floating Leg Position"
                    : legProgression.toString().includes("australian")
                      ? "Assisting Leg Position"
                      : "Primary Leg"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SINGLE_LEG_POSITIONS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        if (activeSetId) {
                          const newPrimary = p;
                          let newSecondary =
                            activeSet?.oneLegSecondaryPosition ||
                            oneLegSecondaryPosition;
                          if (
                            p === newSecondary &&
                            legProgression === "one leg"
                          ) {
                            newSecondary =
                              SINGLE_LEG_POSITIONS.find((lp) => lp !== p) ||
                              "tuck";
                          }
                          updateSet(
                            safeActiveSetIndex,
                            "oneLegPrimaryPosition",
                            newPrimary,
                          );
                          updateSet(
                            safeActiveSetIndex,
                            "oneLegSecondaryPosition",
                            newSecondary,
                          );
                        }
                        setOneLegPrimaryPosition(p);
                        if (
                          p === oneLegSecondaryPosition &&
                          legProgression === "one leg"
                        ) {
                          const fallback =
                            SINGLE_LEG_POSITIONS.find((lp) => lp !== p) ||
                            "tuck";
                          setOneLegSecondaryPosition(fallback as any);
                        }
                      }}
                      className={cn(
                        "px-3 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all text-center",
                        oneLegPrimaryPosition === p
                          ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20"
                          : "bg-black/40 text-slate-500 border-white/5 hover:border-white/20",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {legProgression === "one leg" && (
                <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400/60 block mb-2">
                    Secondary Leg
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {SINGLE_LEG_POSITIONS.filter(
                      (p) => p !== oneLegPrimaryPosition,
                    ).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() =>
                          updateActiveValue(
                            "oneLegSecondaryPosition",
                            setOneLegSecondaryPosition,
                            p,
                          )
                        }
                        className={cn(
                          "px-3 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all text-center",
                          oneLegSecondaryPosition === p
                            ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20"
                            : "bg-black/40 text-slate-500 border-white/5 hover:border-white/20",
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
