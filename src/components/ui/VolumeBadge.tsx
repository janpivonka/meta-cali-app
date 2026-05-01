import React from 'react';
import { cn } from '../../lib/utils';

interface VolumeBadgeProps {
  subSummaries: { v: number; c: number; color?: string }[];
  unit: string;
  isHighlighted: boolean;
}

export function VolumeBadge({ subSummaries, unit, isHighlighted }: VolumeBadgeProps) {
  const UnitBox = ({ children, color }: { children: React.ReactNode, color?: string }) => (
    <span className={cn(
      "inline-flex items-center justify-center w-2.5 h-2.5 rounded-[1px] text-[5px] font-black leading-none border transition-all duration-300 font-sans select-none",
      isHighlighted 
        ? "bg-black/20 border-black/10 text-black" 
        : "bg-white/20 border-white/10 text-white/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
    )}
    style={!isHighlighted && color ? { borderColor: color, color: color } : {}}
    >
      {children}
    </span>
  );

  return (
    <div className="flex flex-wrap items-center justify-start gap-x-1 gap-y-1">
      {subSummaries.map((ss, idx) => (
        <div 
          key={idx} 
          className={cn(
            "flex items-center gap-0.5 px-2 py-0.5 rounded-[4px] border shadow-sm transition-all",
            isHighlighted 
              ? "bg-black/20 border-black/10" 
              : "bg-[#121212] border-white/10"
          )}
          style={!isHighlighted && ss.color ? { borderColor: ss.color, boxShadow: `0 0 10px ${ss.color}20` } : {}}
        >
          {ss.c > 1 && (
            <div className="flex items-center gap-0.5">
              <span className={cn(
                "font-mono text-[9px] font-bold tracking-tight",
                isHighlighted ? "text-black" : (ss.color || "text-white")
              )}
              style={!isHighlighted && ss.color ? { color: ss.color } : {}}
              >{ss.c}</span>
              <UnitBox color={ss.color}>S</UnitBox>
              <span className={cn(
                "text-[6px] font-bold opacity-30 mx-px",
                isHighlighted ? "text-black" : "text-white"
              )}>×</span>
            </div>
          )}
          <span className={cn(
            "font-mono text-[9px] font-bold tracking-tight",
            isHighlighted ? "text-black" : (ss.color || "text-white")
          )}
          style={!isHighlighted && ss.color ? { color: ss.color } : {}}
          >{ss.v}</span>
          <UnitBox color={ss.color}>{unit.charAt(0).toUpperCase()}</UnitBox>
        </div>
      ))}
    </div>
  );
}
