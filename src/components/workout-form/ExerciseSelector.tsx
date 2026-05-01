import React from "react";
import { Search, Activity, Boxes } from "lucide-react";
import { cn } from "../../lib/utils";
import { ExerciseDefinition } from "../../types";

interface ExerciseSelectorProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredExercises: ExerciseDefinition[];
  selectedExerciseId: string;
  onExerciseSelect: (id: string) => void;
}

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  searchQuery,
  setSearchQuery,
  filteredExercises,
  selectedExerciseId,
  onExerciseSelect,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-2">
          <Boxes size={14} className="text-cyan-500" /> Exercise Identification
        </h3>
        <div className="relative w-48">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-full py-2 pl-9 pr-4 text-[10px] font-bold text-white focus:outline-none focus:border-cyan-500/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {filteredExercises.map((ex) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => onExerciseSelect(ex.id)}
            className={cn(
              "p-4 rounded-[24px] border transition-all flex flex-col items-center gap-2 relative overflow-hidden group/item",
              selectedExerciseId === ex.id
                ? "bg-cyan-500 border-cyan-400 text-black shadow-xl shadow-cyan-500/10 scale-105"
                : "bg-white/5 border-white/5 text-slate-500 hover:border-cyan-500/20 hover:text-slate-200",
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors mb-1",
                selectedExerciseId === ex.id
                  ? "bg-black/10"
                  : "bg-white/5 group-hover/item:bg-white/10",
              )}
            >
              <Activity size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter leading-none text-center">
              {ex.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
