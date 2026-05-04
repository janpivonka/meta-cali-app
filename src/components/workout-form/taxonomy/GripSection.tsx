import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../lib/utils";
import { GripType, GripWidth, ExecutionStyle } from "../../../types";
import { GRIPS, GRIP_WIDTHS } from "../constants";

interface GripSectionProps {
  grip: GripType | string;
  setGrip: (val: any) => void;
  gripWidth: GripWidth | string;
  setGripWidth: (val: any) => void;
  executionStyle: ExecutionStyle | string;
  updateActiveValue: (field: string, setter: (val: any) => void, val: any) => void;
  mixedGripLeft: string;
  setMixedGripLeft: (val: any) => void;
  mixedGripRight: string;
  setMixedGripRight: (val: any) => void;
  mixedGripIsAlternating: boolean;
  setMixedGripIsAlternating: (val: any) => void;
  thumb: string;
  setThumb: (val: any) => void;
  falseGrip: boolean;
  setFalseGrip: (val: any) => void;
}

export const GripSection: React.FC<GripSectionProps> = ({
  grip, setGrip, gripWidth, setGripWidth, executionStyle, updateActiveValue,
  mixedGripLeft, setMixedGripLeft, mixedGripRight, setMixedGripRight,
  mixedGripIsAlternating, setMixedGripIsAlternating,
  thumb, setThumb, falseGrip, setFalseGrip
}) => {
  const THUMBS = [
    { label: "Wrapped", val: "wrapped" },
    { label: "Suicide", val: "suicide" },
  ];

  return (
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
                      onClick={() => updateActiveValue("gripWidth", setGripWidth, w)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                        gripWidth === w
                          ? "bg-white text-black border-white shadow-lg"
                          : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                      )}
                    >
                      {w === "shoulder-width" ? "SHOULDER WIDTH" : w.replace("-", " ").toUpperCase()}
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
                {GRIPS.filter((g) => executionStyle === "one arm" ? g !== "mixed" : true).map((g) => (
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
                    {g === "pronated" ? "PRONATED" : g === "supinated" ? "SUPINATED" : g === "neutral" ? "NEUTRAL" : g === "mixed" ? "MIXED" : g.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {grip === "mixed" && executionStyle !== "one arm" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-4 border-t border-white/5 overflow-hidden">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block">Left Hand</label>
                      <div className="flex gap-1">
                        {(["pronated", "supinated", "neutral", "alternating"] as const).map((g) => (
                          <button key={g} type="button" onClick={() => updateActiveValue("mixedGripDetails", (val) => setMixedGripLeft(val.left), { left: g, right: mixedGripRight, isAlternating: mixedGripIsAlternating })} className={cn("flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase border transition-all", mixedGripLeft === g ? "bg-white text-black border-white shadow-sm" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20")}>
                            {g === "pronated" ? "P" : g === "supinated" ? "S" : g === "neutral" ? "NTR" : "ALT"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block">Right Hand</label>
                      <div className="flex gap-1">
                        {(["pronated", "supinated", "neutral", "alternating"] as const).map((g) => (
                          <button key={g} type="button" onClick={() => updateActiveValue("mixedGripDetails", (val) => setMixedGripRight(val.right), { left: mixedGripLeft, right: g, isAlternating: mixedGripIsAlternating })} className={cn("flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase border transition-all", mixedGripRight === g ? "bg-white text-black border-white shadow-sm" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20")}>
                            {g === "pronated" ? "P" : g === "supinated" ? "S" : g === "neutral" ? "NTR" : "ALT"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-white/5 flex justify-center">
                    <button type="button" onClick={() => updateActiveValue("mixedGripDetails", (val) => setMixedGripIsAlternating(val.isAlternating || false), { left: mixedGripLeft, right: mixedGripRight, isAlternating: !mixedGripIsAlternating })} className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2", mixedGripIsAlternating ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20")}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", mixedGripIsAlternating ? "bg-black animate-pulse" : "bg-slate-600")} />
                      Alternating Hands (each rep)
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block mb-3">Thumb Position</label>
            <div className="flex flex-wrap gap-2">
              {THUMBS.map((t) => (
                <button key={t.val} type="button" onClick={() => updateActiveValue("thumb", setThumb, t.val)} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex-1 text-center", thumb === t.val ? "bg-white text-black border-white shadow-lg" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20")}>
                  {t.val === "wrapped" ? "WRAPPED" : "SUICIDE"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400 block mb-3">False Grip</label>
            <button type="button" onClick={() => updateActiveValue("falseGrip", setFalseGrip, !falseGrip)} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all w-full text-center h-[38px] flex items-center justify-center", falseGrip ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20")}>
              {falseGrip ? "ACTIVE" : "INACTIVE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
