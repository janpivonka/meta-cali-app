import React from "react";
import { Zap, PlusCircle } from "lucide-react";

interface BulkPatternInputProps {
  bulkInputRef: React.RefObject<HTMLInputElement>;
  handleBulkApply: () => void;
}

export const BulkPatternInput: React.FC<BulkPatternInputProps> = ({ bulkInputRef, handleBulkApply }) => {
  return (
    <div className="px-2 mb-8">
      <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-[28px] p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
            <Zap size={14} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-cyan-500/70 italic">Quick Entry</span>
        </div>
        <div className="flex-1 w-full flex items-center gap-2">
          <input
            ref={bulkInputRef}
            type="text"
            inputMode="decimal"
            placeholder="Pattern... (e.g. 10, 8, 8, 7)"
            className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-[11px] font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-cyan-500/30"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                handleBulkApply();
              }
            }}
          />
          <button
            type="button"
            onClick={handleBulkApply}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black text-[9px] font-black uppercase tracking-widest hover:bg-cyan-400 active:scale-95 transition-all shadow-lg shadow-cyan-500/20"
          >
            <PlusCircle size={14} />
            ADD
          </button>
        </div>
      </div>
    </div>
  );
};
