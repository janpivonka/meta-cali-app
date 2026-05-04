import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { ExecutionStyle, ExecutionMethod, BodyPosition, OneArmHandPosition } from "../../../types";
import { EXECUTION_METHODS, POSITIONS, ONE_ARM_POSITIONS } from "../constants";

interface ExecutionSectionProps {
  executionStyle: ExecutionStyle | string;
  availableExecutionStyles: string[];
  handleStyleChange: (style: ExecutionStyle | string) => void;
  executionMethod: ExecutionMethod | string;
  setExecutionMethod: (val: any) => void;
  position: BodyPosition | string;
  setPosition: (val: any) => void;
  oneArmHandPosition: OneArmHandPosition | string;
  setOneArmHandPosition: (val: any) => void;
  oneArmSide: "left" | "right" | "alternating";
  setOneArmSide: (val: any) => void;
  updateActiveValue: (field: string, setter: (val: any) => void, val: any) => void;
}

export const ExecutionSection: React.FC<ExecutionSectionProps> = ({
  executionStyle, availableExecutionStyles, handleStyleChange,
  executionMethod, setExecutionMethod, position, setPosition,
  oneArmHandPosition, setOneArmHandPosition, oneArmSide, setOneArmSide,
  updateActiveValue
}) => {
  return (
    <div className="space-y-8 p-8 bg-white/5 rounded-[32px] border border-white/5">
      <div className="space-y-6">
        <div>
          <label className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/60 block mb-3">Execution Style</label>
          <div className="flex flex-wrap gap-2">
            {availableExecutionStyles.map((style) => (
              <button key={style} type="button" onClick={() => handleStyleChange(style)} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all", executionStyle === style ? "bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/20" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20")}>
                {style === "one arm" ? "ONE ARM" : style === "archer" ? "ARCHER" : style === "typewriter" ? "TYPEWRITER" : style === "commando" ? "COMMANDO" : style === "high" ? "HIGH" : style === "korean" ? "KOREAN" : style.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {executionStyle.toString().startsWith("korean") && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 mt-3 pt-3 border-t border-white/5 mb-6">
            {(["archer", "typewriter"] as const).map((variant) => {
              const variantStyle = `korean ${variant}` as ExecutionStyle;
              const isActive = executionStyle === variantStyle;
              return (
                <button key={variant} type="button" onClick={() => handleStyleChange(isActive ? "korean" : variantStyle)} className={cn("flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all", isActive ? "bg-purple-600 text-white border-purple-400" : "bg-black/40 text-slate-500 border-white/5")}>+ {variant === "archer" ? "ARCHER" : "TYPEWRITER"}</button>
              );
            })}
          </motion.div>
        )}

        {(executionStyle === "one arm" || executionStyle === "commando") && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-5 pt-4 border-t border-white/5 pb-4 overflow-hidden">
            <div className="space-y-2">
              <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400 block mb-2">{executionStyle === "one arm" ? "Active Hand" : "Front Hand"}</label>
              <div className="flex gap-2">
                {(["left", "right", "alternating"] as const).map((side) => (
                  <button key={side} type="button" onClick={() => updateActiveValue("oneArmSide", setOneArmSide, side)} className={cn("flex-1 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all", oneArmSide === side ? "bg-cyan-500 text-black border-cyan-400" : "bg-black/40 text-slate-500 border-white/5")}>
                    {side === "left" ? "LEFT" : side === "right" ? "RIGHT" : "ALTERNATE"}
                  </button>
                ))}
              </div>
            </div>
            {executionStyle === "one arm" && (
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400 block mb-2">Passive Hand Support</label>
                <div className="flex flex-wrap gap-2">
                  {ONE_ARM_POSITIONS.map((pos) => (
                    <button key={pos.val} type="button" onClick={() => updateActiveValue("oneArmHandPosition", setOneArmHandPosition, pos.val)} className={cn("px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all flex-1 text-center min-w-[80px]", oneArmHandPosition === pos.val ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/10" : "bg-black/40 text-slate-500 border-white/5")}>
                      {pos.label === "Wrist" ? "WRIST" : pos.label === "Forearm" ? "FOREARM" : pos.label === "Elbow" ? "ELBOW" : pos.label === "Biceps/Triceps" ? "BICEPS" : pos.label === "Shoulder" ? "SHOULDER" : pos.label === "Horizontal/Chest" ? "CHEST" : "FREE"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        <div>
          <label className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/60 block mb-3">Method / Tempo</label>
          <div className="flex flex-wrap gap-2">
            {EXECUTION_METHODS.map((method) => (
              <button key={method} type="button" onClick={() => updateActiveValue("executionMethod", setExecutionMethod, method)} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all", executionMethod === method ? "bg-white/20 text-white border-white/20 shadow-lg" : "bg-black/20 text-slate-600 border-white/5 hover:border-white/20")}>
                {method === "explosive" ? "EXPLOSIVE" : method === "partial" ? "PARTIAL" : method === "negative" ? "NEGATIVES" : method === "scapula" ? "SCAPULA" : method === "controlled" ? "CONTROLLED" : method.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/60 block mb-3">Core Position</label>
          <div className="flex flex-wrap gap-2">
            {POSITIONS.map((pos) => (
              <button key={pos} type="button" onClick={() => updateActiveValue("position", setPosition, pos)} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all", position === pos ? "bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/20" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20")}>
                {pos === "hollow body" ? "HOLLOW BODY" : pos === "arch back" ? "ARCH BACK" : pos.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
