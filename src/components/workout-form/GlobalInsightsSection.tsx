import React from "react";
import { MessageSquare } from "lucide-react";

interface GlobalInsightsSectionProps {
  notes: string;
  setNotes: (val: string) => void;
}

export const GlobalInsightsSection: React.FC<GlobalInsightsSectionProps> = ({
  notes,
  setNotes,
}) => {
  return (
    <div className="mt-12 px-2 pb-12 border-t border-white/5 pt-12">
      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 mb-6 flex items-center gap-2">
        <MessageSquare size={14} className="text-cyan-500" /> Fragment Global Notes
      </h3>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Post-block reflections, feeling for the whole exercise..."
        className="w-full bg-cyan-500/[0.02] border border-cyan-500/10 rounded-[32px] p-6 text-sm font-medium text-cyan-100 focus:outline-none focus:border-cyan-500/30 transition-all min-h-[140px] leading-relaxed placeholder:text-cyan-900 shadow-inner"
      />
      <p className="text-[9px] text-slate-600 italic mt-4 px-4">
        Tyto poznámky se propíší k celému fragmentu v logu. Ideální pro celkové zhodnocení techniky nebo únavy.
      </p>
    </div>
  );
};
