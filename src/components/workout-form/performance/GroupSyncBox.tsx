import React from "react";
import { Video } from "lucide-react";
import { motion } from "framer-motion";
import { getSetMetadata, getColorFromMeta } from "../../../lib/utils";
import { WorkoutSet, ExerciseMedia, LoadType } from "../../../types";
import { MediaGrid } from "../MediaGrid";

interface GroupSyncBoxProps {
  activeSet: WorkoutSet;
  safeActiveSetIndex: number;
  getSetGroupIndices: (idx: number) => number[];
  exerciseId: string;
  loadType: LoadType;
  executionStyle: string;
  legProgression: string;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, index?: number, scope?: "series" | "group" | "fragment") => void;
  handleMediaClick: (media: ExerciseMedia[], index: number) => void;
  onEditThumbnailClick: (media: ExerciseMedia, mIdx: number, setIdx: number, type?: "set" | "group" | "fragment") => void;
  setSets: React.Dispatch<React.SetStateAction<WorkoutSet[]>>;
}

export const GroupSyncBox: React.FC<GroupSyncBoxProps> = ({
  activeSet, safeActiveSetIndex, getSetGroupIndices, exerciseId, loadType,
  executionStyle, legProgression, handleFileUpload, handleMediaClick,
  onEditThumbnailClick, setSets
}) => {
  const indices = getSetGroupIndices(safeActiveSetIndex);
  if (indices.length <= 1) return null;

  const groupMetadata = getSetMetadata(activeSet, { exerciseId, loadType, executionStyle, legProgression });
  const groupColor = getColorFromMeta(JSON.stringify({
    l: groupMetadata.currentLoadLabel, o: groupMetadata.orangeLine, g: groupMetadata.gripLine,
    e: groupMetadata.equipLine, a: groupMetadata.armLine, c: groupMetadata.coreLine, le: groupMetadata.legLine,
  }));

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-8 rounded-[40px] bg-white/[0.02] border border-dashed border-white/10 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ backgroundColor: groupColor }} />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Group Sync Context</span>
          </div>
          <p className="text-[8px] font-black text-slate-700 uppercase italic tracking-wider">These elements are shared across all sets in this group</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const input = document.createElement("input");
            input.type = "file"; input.accept = "image/*,video/*"; input.multiple = true;
            input.onchange = (ev) => handleFileUpload(ev as any, safeActiveSetIndex, "group");
            input.click();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase text-slate-400 hover:bg-white/10 transition-all font-mono"
        >
          <Video size={12} /> Sync Group Media
        </button>
      </div>

      <div className="space-y-6">
        <MediaGrid
          media={activeSet.groupMedia || []}
          onMediaClick={(mIdx) => handleMediaClick(activeSet.groupMedia!, mIdx)}
          onEditThumbnail={(m, midx) => onEditThumbnailClick(m, midx, safeActiveSetIndex, "group")}
          onDelete={(mIdx) => {
            const newMedia = [...(activeSet.groupMedia || [])];
            newMedia.splice(mIdx, 1);
            setSets((prev) => prev.map((s, i) => indices.includes(i) ? { ...s, groupMedia: newMedia } : s));
          }}
          borderColor="border-slate-800/50 shadow-inner"
        />
        <textarea
          value={activeSet.groupNotes || ""}
          onChange={(e) => {
            const val = e.target.value;
            setSets((prev) => prev.map((s, i) => indices.includes(i) ? { ...s, groupNotes: val } : s));
          }}
          placeholder="Group notes, shared focus points..."
          className="w-full bg-black/40 border border-dashed border-white/5 rounded-[24px] p-5 text-xs font-medium text-slate-400 focus:outline-none focus:border-cyan-500/20 transition-all min-h-[80px] leading-relaxed placeholder:text-slate-800 italic"
        />
      </div>
      <div className="absolute -top-16 -right-16 w-48 h-48 blur-[80px] opacity-[0.07] pointer-events-none rounded-full" style={{ backgroundColor: groupColor }}></div>
    </motion.div>
  );
};
