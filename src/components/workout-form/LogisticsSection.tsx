import React from "react";
import { Share2, Edit3, Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { ExerciseLog } from "../../types";

interface LogisticsSectionProps {
  shared: boolean;
  setShared: (val: boolean) => void;
  onDelete?: () => void;
  initialData: ExerciseLog | null | undefined;
}

export const LogisticsSection: React.FC<LogisticsSectionProps> = ({
  shared,
  setShared,
  onDelete,
  initialData,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 flex items-center gap-2 px-2">
            <Share2 size={14} /> Operation Logistics
          </label>
          <div className="flex items-center justify-between px-6 py-6 bg-white/5 rounded-[32px] border border-white/5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Mark as verified execution
            </span>
            <button
              type="button"
              onClick={() => setShared(!shared)}
              className={cn(
                "w-12 h-6 rounded-full relative transition-colors duration-300",
                shared ? "bg-cyan-500" : "bg-white/10"
              )}
            >
              <div
                className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300",
                  shared ? "left-7" : "left-1"
                )}
              />
            </button>
          </div>
        </div>

        <div className="flex items-end italic text-[10px] text-slate-600 px-4 leading-relaxed">
          Uložením potvrdíte provedení celého výkonnostního bloku se všemi zaznamenanými parametry a médii.
        </div>
      </div>

      {/* SUBMIT */}
      <div className="pt-8 flex flex-col sm:flex-row gap-4">
        {initialData && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="flex-1 py-7 bg-red-500/10 text-red-500 text-sm font-black uppercase tracking-[0.5em] rounded-[32px] border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
          >
            Delete this exercise
          </button>
        )}
        <button
          type="submit"
          className={cn(
            "flex-[2] py-7 text-sm font-black uppercase tracking-[0.5em] rounded-[32px] active:scale-95 transition-all shadow-2xl group relative overflow-hidden",
            initialData
              ? "bg-cyan-500 text-black shadow-cyan-500/10"
              : "bg-white text-black shadow-white/5 hover:bg-cyan-500",
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="flex items-center justify-center gap-4 relative z-10">
            {initialData ? <Edit3 size={24} /> : <Check size={24} />}
            {initialData ? "Update Block" : "Save to workout"}
          </div>
        </button>
      </div>
    </>
  );
};
