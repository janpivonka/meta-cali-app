import React from "react";
import { Camera, Plus } from "lucide-react";
import { MediaGrid } from "./MediaGrid";
import { ExerciseMedia } from "../../types";

interface GlobalMediaGalleryProps {
  exerciseMedia: ExerciseMedia[];
  onUploadClick: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onMediaClick: (media: ExerciseMedia[], index: number) => void;
  onEditThumbnail: (media: ExerciseMedia, index: number) => void;
  onDelete: (index: number) => void;
}

export const GlobalMediaGallery: React.FC<GlobalMediaGalleryProps> = ({
  exerciseMedia,
  onUploadClick,
  onFileUpload,
  fileInputRef,
  onMediaClick,
  onEditThumbnail,
  onDelete,
}) => {
  return (
    <div className="mb-12 px-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 flex items-center gap-2">
            <Camera size={14} className="text-cyan-500" /> Fragment Global Gallery
          </h3>
          <p className="text-[8px] font-black text-slate-600 uppercase italic opacity-60">
            Média platná pro všechny série v tomto cviku
          </p>
        </div>
        <button
          type="button"
          onClick={onUploadClick}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-black uppercase text-cyan-400 hover:bg-cyan-500/20 transition-all shadow-sm"
        >
          <Plus size={14} /> Upload
        </button>
      </div>

      <div className="p-6 rounded-[32px] bg-cyan-500/[0.03] border border-cyan-500/10 relative overflow-hidden">
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={onFileUpload}
        />

        {exerciseMedia.length > 0 ? (
          <MediaGrid
            media={exerciseMedia}
            onMediaClick={(mIdx) => onMediaClick(exerciseMedia, mIdx)}
            onEditThumbnail={(m, midx) => onEditThumbnail(m, midx)}
            onDelete={onDelete}
            borderColor="border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.05)]"
          />
        ) : (
          <div
            className="w-full py-10 border-2 border-dashed border-white/5 rounded-[24px] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-cyan-500/20 transition-all group"
            onClick={onUploadClick}
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-700 group-hover:scale-110 group-hover:text-cyan-500 transition-all">
              <Camera size={24} />
            </div>
            <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] italic">
              No global media attached
            </span>
          </div>
        )}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-cyan-500/5 blur-3xl rounded-full"></div>
      </div>
    </div>
  );
};
