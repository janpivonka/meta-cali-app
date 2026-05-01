import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Video, X } from "lucide-react";
import { ExerciseMedia } from "../../types";
import { cn } from "../../lib/utils";
import { MediaRenderer } from "../MediaRenderer";

interface MediaGridProps {
  media: ExerciseMedia[];
  onMediaClick: (idx: number) => void;
  onEditThumbnail: (m: ExerciseMedia, idx: number) => void;
  onDelete?: (idx: number) => void;
  borderColor: string;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  media,
  onMediaClick,
  onEditThumbnail,
  onDelete,
  borderColor,
}) => (
  <div className="flex flex-wrap gap-3 min-h-[40px]">
    <AnimatePresence mode="popLayout">
      {media.map((m, mIdx) => (
        <motion.div
          key={m.id || mIdx}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="relative group/mitem"
        >
          <div
            className={cn(
              "w-20 h-20 rounded-2xl overflow-hidden border bg-black/40 cursor-pointer hover:border-cyan-500/50 transition-all relative group/thumb",
              borderColor,
            )}
            onClick={(e) => {
              e.stopPropagation();
              if (m.isProcessing) return;
              onMediaClick(mIdx);
            }}
          >
            <div
              className={cn(
                "w-full h-full pointer-events-none",
                m.isProcessing && "animate-pulse",
              )}
            >
              {m.isProcessing ? (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                </div>
              ) : m?.type === "image" ? (
                <MediaRenderer
                  url={m.url}
                  type="image"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full relative">
                  {m?.thumbnail ? (
                    <img
                      src={m.thumbnail}
                      className="w-full h-full object-cover"
                      alt="Thumbnail"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cyan-500">
                      <Video size={32} />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/thumb:opacity-0 transition-opacity">
                    <Video size={16} className="text-cyan-500" />
                  </div>
                </div>
              )}
            </div>
            {!m.isProcessing && m?.type === "video" && (
              <button
                type="button"
                className="absolute top-1 right-1 w-7 h-7 rounded-full bg-cyan-500 text-black border border-white/20 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditThumbnail(m, mIdx);
                }}
                title="Nastavit úvodní fotku"
              >
                <Camera size={14} />
              </button>
            )}
          </div>
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(mIdx);
              }}
              className="absolute -top-2 -right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-red-500 hover:scale-110 active:scale-90 z-[50] transition-all duration-200 cursor-pointer"
              title="Smazat médium"
            >
              <X size={14} strokeWidth={3} />
            </button>
          )}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);
