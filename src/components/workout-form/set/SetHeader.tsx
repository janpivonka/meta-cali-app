import React from "react";
import { cn } from "../../../lib/utils";

interface SetHeaderProps {
  index: number;
  highlighted: boolean;
  notesExist: boolean;
  mediaExist: boolean;
}

export const SetHeader: React.FC<SetHeaderProps> = ({ index, highlighted, notesExist, mediaExist }) => {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[30px] md:min-w-[80px]">
      <div className={cn(
        "w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center border transition-all relative",
        highlighted ? "border-cyan-400 text-cyan-400 scale-105 shadow-[0_0_10px_rgba(34,211,238,0.1)]" : "border-white/10 text-white italic"
      )}>
        <span className="text-lg font-black">{index + 1}</span>
        <div className="absolute -top-1 -right-1 flex gap-0.5">
          {(notesExist || mediaExist) && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full border border-black shadow-[0_0_3px_rgba(249,115,22,0.5)]" />}
        </div>
      </div>
    </div>
  );
};
