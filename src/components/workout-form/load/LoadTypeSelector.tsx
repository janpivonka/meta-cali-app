import React from "react";
import { cn } from "../../../lib/utils";
import { LoadType } from "../../../types";

interface LoadTypeSelectorProps {
  loadType: LoadType;
  setLoadTypeAndClean: (lt: LoadType) => void;
}

export const LoadTypeSelector: React.FC<LoadTypeSelectorProps> = ({ loadType, setLoadTypeAndClean }) => {
  return (
    <div className="flex gap-2">
      {(["bodyweight", "weighted", "assisted"] as LoadType[]).map((lt) => (
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
          {lt === "bodyweight" ? "Bodyweight" : lt === "weighted" ? "Weighted (+)" : "Assisted (-)"}
        </button>
      ))}
    </div>
  );
};
