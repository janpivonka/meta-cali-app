import React, { useState, useCallback, memo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Minus,
  Check,
  PlusCircle,
  Copy,
  Target,
  Zap,
  Activity,
  Edit3,
  Search,
  Camera,
  Video,
  X,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Boxes,
  Waves,
  GripVertical,
  Share2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  WorkoutSet,
  ExerciseLog,
  GripType,
  GripWidth,
  ThumbPosition,
  EquipmentType,
  ExecutionStyle,
  ExecutionMethod,
  OneArmHandPosition,
  BandPlacement,
  BandLoopType,
  BodyPosition,
  LoadType,
  LegProgression,
  SingleLegPosition,
  AssistanceDetails,
  MixedGripDetails,
  ExerciseMedia,
} from "../types";
import {
  cn,
  getMediaUrl,
  isHoldExercise,
  getSetMetadata,
  getColorFromMeta,
} from "../lib/utils";
import {
  motion,
  AnimatePresence,
  Reorder,
  useDragControls,
} from "framer-motion";
import { EXERCISE_LIBRARY } from "../data/exerciseLibrary";
import { MediaPreviewModal } from "./MediaPreviewModal";
import { MediaRenderer } from "./MediaRenderer";

interface WorkoutFormProps {
  onSave: (log: ExerciseLog) => void;
  onDelete?: () => void;
  initialExerciseId?: string | null;
  initialData?: ExerciseLog | null;
  highlightedSetIndex?: number | null;
}

const GRIPS: GripType[] = [
  "pronated",
  "supinated",
  "neutral",
  "mixed",
  "alternating",
];
const GRIP_WIDTHS: GripWidth[] = [
  "narrow",
  "shoulder-width",
  "wide",
  "alternating",
];
const THUMBS: { val: ThumbPosition; label: string }[] = [
  { val: "under", label: "Under" },
  { val: "over", label: "Over" },
  { val: "alternating", label: "Alternating" },
];
const EQUIPMENTS: EquipmentType[] = [
  "pull-up bar",
  "low bar",
  "dip bars",
  "rings",
  "floor",
  "parallelettes",
  "stall bars",
];
const EXECUTION_STYLES: ExecutionStyle[] = [
  "basic",
  "one arm",
  "archer",
  "typewriter",
  "commando",
  "high",
  "korean",
  "korean archer",
  "korean typewriter",
];
const EXECUTION_METHODS: ExecutionMethod[] = [
  "standard",
  "explosive",
  "partial",
  "negative",
  "scapula",
  "controlled",
];
const POSITIONS: BodyPosition[] = [
  "neutral",
  "hollow body",
  "arch back",
  "L-sit",
];
const LEG_PROGRESSIONS: LegProgression[] = [
  "tuck",
  "adv tuck",
  "straddle",
  "one leg",
  "halflay",
  "full",
  "australian (bent legs)",
  "australian (straight legs)",
];
const BAND_PLACEMENTS: BandPlacement[] = [
  "both feet",
  "one foot",
  "knees",
  "buttocks",
  "waist",
  "chest",
];
const LOOP_TYPES: { val: BandLoopType; label: string }[] = [
  { val: "single", label: "Single" },
  { val: "double", label: "Double (wrapped)" },
  { val: "half", label: "1/2" },
];
const SINGLE_LEG_POSITIONS: SingleLegPosition[] = [
  "tuck",
  "adv tuck",
  "halflay",
  "full",
];
const ONE_ARM_POSITIONS: { val: OneArmHandPosition; label: string }[] = [
  { val: "wrist", label: "Wrist" },
  { val: "forearm", label: "Forearm" },
  { val: "elbow", label: "Elbow" },
  { val: "biceps", label: "Biceps/Triceps" },
  { val: "shoulder", label: "Shoulder" },
  { val: "horizontal", label: "Horizontal/Chest" },
  { val: "free", label: "Free along body" },
];

const MediaGrid = ({
  media,
  onMediaClick,
  onEditThumbnail,
  onDelete,
  borderColor,
}: {
  media: ExerciseMedia[];
  onMediaClick: (idx: number) => void;
  onEditThumbnail: (m: ExerciseMedia, idx: number) => void;
  onDelete?: (idx: number) => void;
  borderColor: string;
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

interface WorkoutSetItemProps {
  set: WorkoutSet;
  index: number;
  highlightedSetIndex: number | null;
  activeSetId: string | null;
  exerciseId: string;
  loadType: LoadType;
  executionStyle: string;
  legProgression: string;
  oneArmSide: "left" | "right" | "alternating";
  legTarget: "primary" | "secondary" | "alternating";
  setActiveSetId: (id: string | null) => void;
  updateActiveAssistance: (field: string, val: any) => void;
  updateSet: (index: number, field: keyof WorkoutSet, value: any) => void;
  removeSet: (index: number) => void;
  setSets: React.Dispatch<React.SetStateAction<WorkoutSet[]>>;
  isHoldExercise: (id: string) => boolean;
  onFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number,
    scope?: "series" | "group" | "fragment",
  ) => void;
  onMediaClick: (media: ExerciseMedia[], index: number) => void;
  onEditThumbnail: (
    media: ExerciseMedia,
    mIdx: number,
    setIdx: number,
    type?: "set" | "group" | "fragment",
  ) => void;
  onNoteChange: (val: string, scope: "series" | "group" | "fragment") => void;
  getSetGroupIndices: (idx: number) => number[];
}

const WorkoutSetDetail = memo<WorkoutSetItemProps>(
  ({
    set,
    index,
    highlightedSetIndex,
    activeSetId,
    exerciseId,
    loadType,
    executionStyle,
    legProgression,
    oneArmSide,
    legTarget,
    setActiveSetId,
    updateActiveAssistance,
    updateSet,
    removeSet,
    setSets,
    isHoldExercise,
    onFileUpload,
    onMediaClick,
    onEditThumbnail,
    onNoteChange,
  }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const assistanceValue =
      set.assistanceDetails?.resistance?.toString() ||
      set.weight?.toString() ||
      "";
    const bandLoopType = set.assistanceDetails?.loopType || "single";
    const weightUnit = set.weightUnit || "kg";

    const meta = getSetMetadata(set, {
      exerciseId,
      loadType,
      executionStyle,
      legProgression,
    });
    const metaKey = JSON.stringify({
      l: meta.currentLoadLabel,
      o: meta.orangeLine,
      g: meta.gripLine,
      e: meta.equipLine,
      a: meta.armLine,
      c: meta.coreLine,
      le: meta.legLine,
    });
    const groupColor = getColorFromMeta(metaKey);

    return (
      <div
        id={`set-item-${index}`}
        className={cn(
          "glass-card flex flex-col p-4 md:p-6 border-white/5 bg-white/5 rounded-[32px] group transition-all shadow-lg relative",
          highlightedSetIndex === index || activeSetId === set.id
            ? "bg-cyan-500/5 ring-1 ring-cyan-500/20"
            : "hover:border-white/10",
        )}
        style={{
          borderColor:
            highlightedSetIndex === index || activeSetId === set.id
              ? "#22d3ee80"
              : groupColor + "60",
          boxShadow:
            highlightedSetIndex === index || activeSetId === set.id
              ? undefined
              : `0 10px 15px -3px ${groupColor}20`,
        }}
      >
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => onFileUpload(e, index, "series")}
        />

        <div className="w-full flex flex-col md:flex-row items-center gap-6 overflow-hidden">
          <div className="flex flex-col items-center gap-1 min-w-[30px] md:min-w-[80px]">
            <div
              className={cn(
                "w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center border transition-all relative",
                highlightedSetIndex === index || activeSetId === set.id
                  ? "border-cyan-400 text-cyan-400 scale-105 shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                  : "border-white/10 text-white italic",
              )}
            >
              <span className="text-lg font-black">{index + 1}</span>
              <div className="absolute -top-1 -right-1 flex gap-0.5">
                {(set.notes || (set.media && set.media.length > 0)) && (
                  <div className="w-2.5 h-2.5 bg-orange-500 rounded-full border border-black shadow-[0_0_3px_rgba(249,115,22,0.5)]" />
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4 w-full pr-8 md:pr-12">
            {/* Reps/Time */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateSet(
                      index,
                      isHoldExercise(exerciseId) ? "time" : "reps",
                      Math.max(
                        0,
                        (isHoldExercise(exerciseId)
                          ? set.time || 0
                          : set.reps || 0) - 1,
                      ),
                    );
                  }}
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="number"
                  value={
                    isHoldExercise(exerciseId) ? set.time || 0 : set.reps || 0
                  }
                  onChange={(e) =>
                    updateSet(
                      index,
                      isHoldExercise(exerciseId) ? "time" : "reps",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  onClick={(e) => e.stopPropagation()}
                  className="bg-transparent text-2xl font-black text-white w-14 text-center focus:outline-none font-mono tracking-tighter"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateSet(
                      index,
                      isHoldExercise(exerciseId) ? "time" : "reps",
                      (isHoldExercise(exerciseId)
                        ? set.time || 0
                        : set.reps || 0) + 1,
                    );
                  }}
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-[7px] font-black uppercase tracking-widest text-slate-600 italic leading-none">
                {isHoldExercise(exerciseId) ? "Time" : "Reps"}
              </span>
            </div>

            {/* Load Details (Weight/Assistance) */}
            <div className="flex flex-col items-center gap-1">
              {set.loadType === "weighted" ||
              (set.weight !== undefined && set.weight > 0) ||
              set.loadType === "assisted" ||
              set.assistanceDetails?.resistance ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    {set.loadType === "weighted" ||
                    (set.weight !== undefined && set.weight > 0) ? (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateSet(
                              index,
                              "weight",
                              Math.max(0, (set.weight || 0) - 1),
                            );
                          }}
                          className="w-6 h-6 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all active:scale-90"
                        >
                          <Minus size={10} />
                        </button>
                        <input
                          type="number"
                          value={set.weight || 0}
                          onChange={(e) =>
                            updateSet(
                              index,
                              "weight",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="bg-transparent text-xl font-black text-purple-400 w-12 text-center focus:outline-none font-mono tracking-tighter"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateSet(index, "weight", (set.weight || 0) + 1);
                          }}
                          className="w-6 h-6 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all active:scale-90"
                        >
                          <Plus size={10} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentRes = parseFloat(
                              set.assistanceDetails?.resistance || "0",
                            );
                            const newVal = Math.max(0, currentRes - 1);
                            updateSet(index, "assistanceDetails", {
                              ...set.assistanceDetails,
                              resistance: newVal.toString(),
                            });
                          }}
                          className="w-6 h-6 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all active:scale-90"
                        >
                          <Minus size={10} />
                        </button>
                        <input
                          type="number"
                          value={set.assistanceDetails?.resistance || ""}
                          onChange={(e) =>
                            updateSet(index, "assistanceDetails", {
                              ...set.assistanceDetails,
                              resistance: e.target.value,
                            })
                          }
                          onClick={(e) => e.stopPropagation()}
                          placeholder="0"
                          className="bg-transparent text-xl font-black text-orange-400 w-12 text-center focus:outline-none font-mono tracking-tighter"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentRes = parseFloat(
                              set.assistanceDetails?.resistance || "0",
                            );
                            const newVal = currentRes + 1;
                            updateSet(index, "assistanceDetails", {
                              ...set.assistanceDetails,
                              resistance: newVal.toString(),
                            });
                          }}
                          className="w-6 h-6 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all active:scale-90"
                        >
                          <Plus size={10} />
                        </button>
                      </>
                    )}
                  </div>

                  <div
                    className="flex bg-black/40 rounded-lg p-0.5 border border-white/5 mt-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateSet(index, "weightUnit", "kg");
                      }}
                      className={cn(
                        "px-1 py-0.5 rounded-md text-[6px] font-black transition-all",
                        (set.weightUnit || "kg") === "kg"
                          ? set.loadType === "weighted"
                            ? "bg-purple-500 text-white"
                            : "bg-orange-500 text-black"
                          : "text-slate-500",
                      )}
                    >
                      KG
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateSet(index, "weightUnit", "lbs");
                      }}
                      className={cn(
                        "px-1 py-0.5 rounded-md text-[6px] font-black transition-all",
                        set.weightUnit === "lbs"
                          ? set.loadType === "weighted"
                            ? "bg-purple-500 text-white"
                            : "bg-orange-500 text-black"
                          : "text-slate-500",
                      )}
                    >
                      LB
                    </button>
                  </div>
                </div>
              ) : (
                <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest pt-2">
                  BW
                </span>
              )}
              <span className="text-[7px] font-black uppercase tracking-widest text-slate-600 italic leading-none">
                {set.loadType === "weighted"
                  ? "Weight"
                  : set.loadType === "assisted"
                    ? "Assist"
                    : "Load"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const newId = generateId();
                const newSet = { ...set, id: newId, notes: "", media: [] };
                setSets((prev) => {
                  const next = [...prev];
                  next.splice(index + 1, 0, newSet);
                  return next;
                });
                setActiveSetId(newId);
              }}
              title="Duplicate this set"
              className="w-8 h-8 rounded-xl bg-cyan-500/5 text-slate-700 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all p-1.5 flex items-center justify-center"
            >
              <Copy size={16} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSet(index);
              }}
              className="w-8 h-8 rounded-xl bg-red-500/5 text-slate-700 hover:text-red-500 hover:bg-red-500/10 transition-all p-1.5 flex items-center justify-center"
            >
              <Minus size={16} />
            </button>
          </div>
        </div>

        {/* Detail view contents - ONLY SERIES LEVEL */}
        <div className="w-full flex flex-col gap-10 mt-6 pt-8 border-t border-white/5 px-2 md:px-10 overflow-hidden text-left">
          {/* SERIES NOTE */}
          <div className="flex flex-col gap-4 text-left">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400/80 flex items-center gap-2">
              <MessageSquare size={14} className="text-cyan-500" /> Series
              Commentary
            </label>
            <textarea
              value={set.notes || ""}
              onChange={(e) => onNoteChange(e.target.value, "series")}
              placeholder="Specific feel for this series..."
              className="w-full bg-black/30 border border-white/5 rounded-2xl p-4 text-xs font-medium text-slate-300 focus:outline-none focus:border-cyan-500/20 transition-all min-h-[60px] leading-relaxed placeholder:text-slate-700"
            />
          </div>

          {/* SERIES MEDIA */}
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400/80 flex items-center gap-2">
                <Camera size={14} className="text-cyan-500" /> Series Media
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[8px] font-black uppercase text-white hover:bg-white/10 transition-all"
              >
                <Plus size={10} /> Add Media
              </button>
            </div>
            <MediaGrid
              media={set.media || []}
              onMediaClick={(mIdx) => onMediaClick(set.media!, mIdx)}
              onEditThumbnail={(m, midx) => onEditThumbnail(m, midx, index)}
              onDelete={(mIdx) => {
                const newMedia = [...(set.media || [])];
                newMedia.splice(mIdx, 1);
                updateSet(index, "media", newMedia);
              }}
              borderColor="border-white/10"
            />
          </div>
        </div>
      </div>
    );
  },
);

const generateVideoThumbnail = (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    const url = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      // Seek to 1 second (or middle if shorter)
      video.currentTime = Math.min(video.duration / 2, 1);
    };

    video.onseeked = async () => {
      try {
        const canvas = document.createElement("canvas");

        // Resize thumbnail to something reasonable
        const MAX_THUMB = 400;
        let width = video.videoWidth;
        let height = video.videoHeight;

        if (width <= 0 || height <= 0) {
          URL.revokeObjectURL(url);
          resolve(null);
          return;
        }

        if (width > height) {
          if (width > MAX_THUMB) {
            height *= MAX_THUMB / width;
            width = MAX_THUMB;
          }
        } else {
          if (height > MAX_THUMB) {
            width *= MAX_THUMB / height;
            height = MAX_THUMB;
          }
        }

        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve(null);
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const thumbnail = canvas.toDataURL("image/jpeg", 0.7);
        URL.revokeObjectURL(url);
        resolve(thumbnail);
      } catch (e) {
        console.error("Error generating video thumbnail:", e);
        URL.revokeObjectURL(url);
        resolve(null);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };

    video.src = url;
  });
};

const processFile = (file: File): Promise<ExerciseMedia | null> => {
  return new Promise(async (resolve) => {
    const isVideo = file.type.startsWith("video");
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB video, 10MB image

    if (file.size > maxSize) {
      alert(
        `Soubor ${file.name} je příliš velký (max ${isVideo ? "100MB" : "10MB"}).`,
      );
      resolve(null);
      return;
    }

    if (isVideo) {
      const thumbnail = await generateVideoThumbnail(file);
      // For videos, we store the File object itself (a Blob)
      // IndexedDB handles this much better than a massive base64 string
      resolve({ type: "video", url: file as any, thumbnail });
    } else {
      const url = URL.createObjectURL(file);
      const img = new Image();

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };

      img.onload = async () => {
        try {
          // Ensure image is fully decoded before drawing to canvas
          if ("decode" in img) {
            await img.decode();
          }

          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width <= 0 || height <= 0) {
            URL.revokeObjectURL(url);
            resolve(null);
            return;
          }

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = Math.floor(width);
          canvas.height = Math.floor(height);

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            URL.revokeObjectURL(url);
            resolve(null);
            return;
          }

          // Normal drawing - no background fill that might mask failures
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Compress to JPEG for smaller storage
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          URL.revokeObjectURL(url);
          resolve({ type: "image", url: dataUrl });
        } catch (e) {
          console.error("Error processing image:", e);
          URL.revokeObjectURL(url);
          resolve(null);
        }
      };

      img.src = url;
    }
  });
};

// Move constant helpers outside to prevent recreation
const generateId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

export const WorkoutForm: React.FC<WorkoutFormProps> = ({
  onSave,
  onDelete,
  initialExerciseId,
  initialData,
  highlightedSetIndex,
}) => {
  const [exerciseId, setExerciseId] = useState<string>(
    initialData?.exerciseId || initialExerciseId || EXERCISE_LIBRARY[0].id,
  );

  const [grip, setGrip] = useState<GripType>("pronated");
  const [gripWidth, setGripWidth] = useState<GripWidth>("shoulder-width");
  const [thumb, setThumb] = useState<ThumbPosition>("under");
  const [equipment, setEquipment] = useState<EquipmentType>("pull-up bar");
  const [executionStyle, setExecutionStyle] = useState<ExecutionStyle | string>(
    "basic",
  );
  const [executionMethod, setExecutionMethod] = useState<
    ExecutionMethod | string
  >("standard");
  const [oneArmHandPosition, setOneArmHandPosition] = useState<
    OneArmHandPosition | string
  >("free");
  const [oneArmSide, setOneArmSide] = useState<
    "left" | "right" | "alternating"
  >("right");
  const [oneLegPrimaryPosition, setOneLegPrimaryPosition] =
    useState<SingleLegPosition>("full");
  const [oneLegSecondaryPosition, setOneLegSecondaryPosition] =
    useState<SingleLegPosition>("tuck");
  const [isOneLeg, setIsOneLeg] = useState(false);
  const [position, setPosition] = useState<BodyPosition | string>("neutral");
  const [legProgression, setLegProgression] = useState<LegProgression | string>(
    "full",
  );
  const [loadType, setLoadType] = useState<LoadType>("bodyweight");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [assistanceValue, setAssistanceValue] = useState("");
  const [mixedGripLeft, setMixedGripLeft] = useState<
    "pronated" | "supinated" | "neutral" | "alternating"
  >("supinated");
  const [mixedGripRight, setMixedGripRight] = useState<
    "pronated" | "supinated" | "neutral" | "alternating"
  >("pronated");
  const [mixedGripIsAlternating, setMixedGripIsAlternating] = useState(false);
  const [bandPlacements, setBandPlacements] = useState<BandPlacement[]>([
    "both feet",
  ]);
  const [bandLoopType, setBandLoopType] = useState<BandLoopType>("single");
  const [legTarget, setLegTarget] = useState<
    "primary" | "secondary" | "alternating"
  >("primary");
  const [falseGrip, setFalseGrip] = useState(false);
  const [dipBarFootSupport, setDipBarFootSupport] = useState(false);
  const [sets, setSets] = useState<WorkoutSet[]>(() => {
    if (initialData) return initialData.sets;
    return [
      {
        id: generateId(),
        reps: 10,
        grip: "pronated",
        gripWidth: "shoulder-width",
        thumb: "under",
        falseGrip: false,
        equipment: "pull-up bar",
        executionStyle: "basic",
        executionMethod: "standard",
        position: "neutral",
        legProgression: "full",
        oneArmHandPosition: "free",
        isOneLeg: false,
        oneLegPrimaryPosition: "full",
        oneLegSecondaryPosition: "tuck",
      },
    ];
  });
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [shared, setShared] = useState(false);
  const [activeSetId, setActiveSetId] = useState<string | null>(() => {
    if (initialData) {
      if (
        highlightedSetIndex !== null &&
        highlightedSetIndex !== undefined &&
        initialData.sets[highlightedSetIndex]
      ) {
        return initialData.sets[highlightedSetIndex].id;
      }
      return initialData.sets[initialData.sets.length - 1]?.id || null;
    }
    return null;
  });

  // Sync activeSetId if it's null but sets exist (for new fragment case)
  useEffect(() => {
    if (!activeSetId && sets.length > 0) {
      setActiveSetId(sets[sets.length - 1].id);
    }
  }, [activeSetId, sets]);
  const [exerciseMedia, setExerciseMedia] = useState<ExerciseMedia[]>(
    initialData?.media || [],
  );

  const getSetGroupIndices = useCallback(
    (idx: number) => {
      const targetSet = sets[idx];
      if (!targetSet) return [idx];
      const targetMeta = getSetMetadata(targetSet, {
        exerciseId,
        loadType,
        executionStyle,
        legProgression,
      });
      const targetKey = JSON.stringify(targetMeta);

      return sets
        .map((s, i) => {
          const m = getSetMetadata(s, {
            exerciseId,
            loadType,
            executionStyle,
            legProgression,
          });
          return JSON.stringify(m) === targetKey ? i : -1;
        })
        .filter((i) => i !== -1);
    },
    [sets, exerciseId, loadType, executionStyle, legProgression],
  );

  const [previewMedia, setPreviewMedia] = useState<ExerciseMedia[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingThumbnail, setEditingThumbnail] = useState<{
    media: ExerciseMedia;
    type: "fragment" | "set" | "group";
    mIdx: number;
    setIdx?: number;
  } | null>(null);

  const sharedActionRef = useRef<HTMLButtonElement>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);
  const setsScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active set into view
  useEffect(() => {
    if (activeSetId && setsScrollRef.current) {
      const container = setsScrollRef.current;
      const timeoutId = setTimeout(() => {
        const activeEl = document.getElementById(`nav-set-${activeSetId}`);
        if (activeEl && container) {
          const isLastSet = activeSetId === sets[sets.length - 1]?.id;

          if (isLastSet) {
            container.scrollTo({
              left: container.scrollWidth,
              behavior: "smooth",
            });
          } else {
            const containerWidth = container.offsetWidth;
            const itemWidth = activeEl.offsetWidth;
            const itemLeft = activeEl.offsetLeft;
            const targetScroll = itemLeft - containerWidth / 2 + itemWidth / 2;

            container.scrollTo({
              left: targetScroll,
              behavior: "smooth",
            });
          }
        }
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [activeSetId, sets]);

  // Sync activeSetId with external highlightedSetIndex (e.g. from Log)
  const lastHighlightedRef = useRef(highlightedSetIndex);
  useEffect(() => {
    if (highlightedSetIndex !== lastHighlightedRef.current) {
      if (
        highlightedSetIndex !== null &&
        highlightedSetIndex !== undefined &&
        sets[highlightedSetIndex]
      ) {
        setActiveSetId(sets[highlightedSetIndex].id);
      } else if (highlightedSetIndex === null && initialData) {
        setActiveSetId(sets[sets.length - 1]?.id || null);
      }
      lastHighlightedRef.current = highlightedSetIndex;
    }
  }, [highlightedSetIndex, sets, initialData]);

  const activeSet = sets.find((s) => s.id === activeSetId);
  const activeSetIndex = sets.findIndex((s) => s.id === activeSetId);
  const safeActiveSetIndex = activeSetIndex === -1 ? 0 : activeSetIndex;

  const handleThumbnailFromPreview = useCallback(
    (media: ExerciseMedia, thumbnail: string) => {
      // 1. Check in exercise fragments
      setExerciseMedia((prev) =>
        prev.map((m) => {
          if (m.url === media.url) return { ...m, thumbnail };
          return m;
        }),
      );

      // 2. Check in sets
      setSets((prev) =>
        prev.map((s) => {
          if (!s.media) return s;
          const newMedia = s.media.map((m) => {
            if (m.url === media.url) return { ...m, thumbnail };
            return m;
          });
          return { ...s, media: newMedia };
        }),
      );

      setIsPreviewOpen(false);
    },
    [],
  );

  const handleBulkApply = useCallback(() => {
    if (!bulkInputRef.current) return;
    const pattern = bulkInputRef.current.value;
    const vals = pattern
      .split(/[,;\s]+/)
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v));
    if (vals.length > 0) {
      const lastSet = sets[sets.length - 1];
      const newSetsToAdd = vals.map((v) => ({
        ...(lastSet || {}),
        id: generateId(),
        [isHoldExercise(exerciseId) ? "time" : "reps"]: v,
        notes: "",
        media: [],
        loadType: lastSet?.loadType || loadType,
      }));
      setSets((prev) => [...prev, ...newSetsToAdd]);
      setActiveSetId(newSetsToAdd[newSetsToAdd.length - 1].id);
      bulkInputRef.current.value = "";
      bulkInputRef.current.blur();
    }
  }, [sets, exerciseId, loadType]);

  const handleMediaClick = useCallback(
    (media: ExerciseMedia[], index: number) => {
      setPreviewMedia(media);
      setPreviewIndex(index);
      setIsPreviewOpen(true);
    },
    [],
  );

  const captureMediaThumbnail = useCallback(
    (video: HTMLVideoElement) => {
      if (!editingThumbnail) return;

      // Ensure video is ready
      if (video.readyState < 2) {
        alert(
          "Video se nestihlo načíst pro snímek. Zkuste to prosím znovu za sekundu.",
        );
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (canvas.width === 0 || canvas.height === 0) {
        alert("Chyba při čtení rozměrů videa.");
        return;
      }

      // Resize
      const MAX_THUMB = 420;
      let { width, height } = canvas;
      if (width > height) {
        if (width > MAX_THUMB) {
          height *= MAX_THUMB / width;
          width = MAX_THUMB;
        }
      } else {
        if (height > MAX_THUMB) {
          width *= MAX_THUMB / height;
          height = MAX_THUMB;
        }
      }
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnail = canvas.toDataURL("image/jpeg", 0.9);

      const { type, mIdx, setIdx } = editingThumbnail;
      if (type === "fragment") {
        const newMedia = [...exerciseMedia];
        newMedia[mIdx] = { ...newMedia[mIdx], thumbnail };
        setExerciseMedia(newMedia);
      } else if (type === "set" && setIdx !== undefined) {
        setSets((prev) =>
          prev.map((s, i) => {
            if (i !== setIdx) return s;
            const setMedia = [...(s.media || [])];
            setMedia[mIdx] = { ...setMedia[mIdx], thumbnail };
            return { ...s, media: setMedia };
          }),
        );
      } else if (type === "group" && setIdx !== undefined) {
        const indices = getSetGroupIndices(setIdx);
        setSets((prev) =>
          prev.map((s, i) => {
            if (!indices.includes(i)) return s;
            const groupMedia = [...(s.groupMedia || [])];
            if (groupMedia[mIdx]) {
              groupMedia[mIdx] = { ...groupMedia[mIdx], thumbnail };
            }
            return { ...s, groupMedia };
          }),
        );
      }

      // Quick indicator that it worked before closing
      setEditingThumbnail(null);
    },
    [editingThumbnail, exerciseMedia, getSetGroupIndices],
  );

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const exerciseFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      setIndex?: number,
      scope: "series" | "group" | "fragment" = "fragment",
    ) => {
      const files = Array.from(e.target.files || []) as File[];
      if (files.length === 0) return;

      // 1. Create temporary placeholders for immediate feedback
      const placeholders: ExerciseMedia[] = files.map((file) => ({
        type: file.type.startsWith("video") ? "video" : "image",
        url: URL.createObjectURL(file), // Temporary local URL
        isProcessing: true,
        id: Math.random().toString(36).substring(2, 11),
      }));

      if (scope === "group" && setIndex !== undefined) {
        const groupIndices = getSetGroupIndices(setIndex);
        setSets((prev) =>
          prev.map((s, i) => {
            if (!groupIndices.includes(i)) return s;
            return {
              ...s,
              groupMedia: [...(s.groupMedia || []), ...placeholders],
            };
          }),
        );
      } else if (scope === "series" && setIndex !== undefined) {
        setSets((prev) =>
          prev.map((s, i) => {
            if (i !== setIndex) return s;
            return { ...s, media: [...(s.media || []), ...placeholders] };
          }),
        );
      } else {
        setExerciseMedia((prev) => [...prev, ...placeholders]);
      }

      // 2. Process files and replace placeholders
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const placeholderId = placeholders[i].id;

        const processed = await processFile(file);

        if (processed) {
          const finalMedia = { ...processed, id: placeholderId };

          if (scope === "group" && setIndex !== undefined) {
            const groupIndices = getSetGroupIndices(setIndex);
            setSets((prev) =>
              prev.map((s, idx) => {
                if (!groupIndices.includes(idx)) return s;
                const newMedia = (s.groupMedia || []).map((m) =>
                  m.id === placeholderId ? finalMedia : m,
                );
                return { ...s, groupMedia: newMedia };
              }),
            );
          } else if (scope === "series" && setIndex !== undefined) {
            setSets((prev) =>
              prev.map((s, idx) => {
                if (idx !== setIndex) return s;
                const newMedia = (s.media || []).map((m) =>
                  m.id === placeholderId ? finalMedia : m,
                );
                return { ...s, media: newMedia };
              }),
            );
          } else {
            setExerciseMedia((prev) =>
              prev.map((m) => (m.id === placeholderId ? finalMedia : m)),
            );
          }
        } else {
          // Remove on failure
          if (scope === "series" && setIndex !== undefined) {
            setSets((prev) =>
              prev.map((s, idx) => {
                if (idx !== setIndex) return s;
                return {
                  ...s,
                  media: (s.media || []).filter((m) => m.id !== placeholderId),
                };
              }),
            );
          } else if (scope === "group" && setIndex !== undefined) {
            const groupIndices = getSetGroupIndices(setIndex);
            setSets((prev) =>
              prev.map((s, idx) => {
                if (!groupIndices.includes(idx)) return s;
                return {
                  ...s,
                  groupMedia: (s.groupMedia || []).filter(
                    (m) => m.id !== placeholderId,
                  ),
                };
              }),
            );
          } else {
            setExerciseMedia((prev) =>
              prev.filter((m) => m.id !== placeholderId),
            );
          }
        }

        // Cleanup
        if (placeholders[i].url.startsWith("blob:")) {
          URL.revokeObjectURL(placeholders[i].url);
        }
      }

      // Reset input
      e.target.value = "";
    },
    [setSets, setExerciseMedia, getSetGroupIndices, processFile],
  );

  const updateSet = useCallback(
    (index: number, field: keyof WorkoutSet, value: any) => {
      setSets((prev) => {
        if (index < 0 || index >= prev.length) return prev;
        const newSets = [...prev];
        if (!newSets[index]) return prev;

        newSets[index] = { ...newSets[index], [field]: value };

        // Auto-update loadType field on the set itself
        if (field === "weight") {
          if (value > 0) {
            newSets[index].loadType = "weighted";
            newSets[index].assistanceDetails = undefined;
          } else if (!newSets[index].assistanceDetails?.resistance) {
            newSets[index].loadType = "bodyweight";
          }
        } else if (field === "assistanceDetails") {
          if (value?.resistance) {
            newSets[index].loadType = "assisted";
            newSets[index].weight = 0;
          } else if (!newSets[index].weight || newSets[index].weight === 0) {
            newSets[index].loadType = "bodyweight";
          }
        }
        return newSets;
      });

      // We can't easily sync local UI state here without index/localEditingSetIndex comparison
      // But updateSet is mostly used by WorkoutSetItem which is for the current item or we pass it index.
    },
    [],
  );

  // Sync local editing index with parent highlight
  const lastSyncRef = useRef<number | null | undefined>(undefined);
  React.useEffect(() => {
    if (highlightedSetIndex !== lastSyncRef.current) {
      if (highlightedSetIndex !== undefined && highlightedSetIndex !== null) {
        const targetSet = sets[highlightedSetIndex];
        if (targetSet) {
          setActiveSetId(targetSet.id);
        }
      }
      lastSyncRef.current = highlightedSetIndex;
    }
  }, [highlightedSetIndex, sets]);

  // Smart Conflict Resolution Handlers
  const updateActiveAssistance = useCallback(
    (field: string, val: any) => {
      // 1. First update global/local state for instant UI feedback
      if (field === "resistance") setAssistanceValue(val.toString());
      if (field === "loopType") setBandLoopType(val);
      if (field === "placement") setBandPlacements(val);
      if (field === "legTarget") setLegTarget(val);
      if (field === "unit") {
        setWeightUnit(val);
        if (activeSetId) updateSet(safeActiveSetIndex, "weightUnit", val);
        return;
      }
      if (field === "dipBarFootSupport") {
        setDipBarFootSupport(val);
        // Pre-set defaults for support
        if (val) {
          setBandPlacements(["waist"]);
          setBandLoopType("double");
          if (
            legProgression === "one leg" ||
            legProgression.toString().includes("australian")
          ) {
            setLegProgression(oneLegPrimaryPosition);
            if (activeSetId) {
              updateSet(
                safeActiveSetIndex,
                "legProgression",
                oneLegPrimaryPosition,
              );
            }
          }
        }
      }

      // 2. Then update the active set in the array
      if (activeSetId && sets[safeActiveSetIndex]) {
        const currentDetails = sets[safeActiveSetIndex]?.assistanceDetails || {
          resistance: "",
          loopType: "single",
          placement: ["both feet"],
          legTarget: "primary",
        };
        const updatedDetails = { ...currentDetails, [field]: val };

        // Special override for dip bar support defaults
        if (field === "dipBarFootSupport" && val) {
          updatedDetails.placement = ["waist"];
          updatedDetails.loopType = "double";
          updatedDetails.dipBarFootSupport = true;
        }

        if (loadType === "weighted" && field === "resistance") {
          const numericWeight = parseFloat(val) || 0;
          updateSet(safeActiveSetIndex, "weight", numericWeight);
          updateSet(safeActiveSetIndex, "assistanceDetails", undefined);
        } else {
          updateSet(safeActiveSetIndex, "assistanceDetails", updatedDetails);
        }
      }
    },
    [
      activeSetId,
      sets,
      safeActiveSetIndex,
      loadType,
      legProgression,
      oneLegPrimaryPosition,
      updateSet,
    ],
  );

  // Sync global form-state ONLY when the selected set index changes
  // This prevents the lag caused by syncing on every individual keystroke (sets array update)
  React.useEffect(() => {
    if (!activeSetId) return;
    const active = activeSet;
    if (active) {
      setGrip(active.grip || "pronated");
      setGripWidth(active.gripWidth || "shoulder-width");
      setThumb(active.thumb || "under");
      setFalseGrip(active.falseGrip !== undefined ? active.falseGrip : false);
      setEquipment(active.equipment || "pull-up bar");
      setExecutionStyle(active.executionStyle || "basic");
      setExecutionMethod(active.executionMethod || "standard");
      setPosition(active.position || "neutral");
      setLegProgression(active.legProgression || "full");
      setOneArmHandPosition(active.oneArmHandPosition || "free");
      setOneArmSide(active.oneArmSide || "right");
      setOneLegPrimaryPosition(active.oneLegPrimaryPosition || "full");
      setOneLegSecondaryPosition(active.oneLegSecondaryPosition || "tuck");
      setIsOneLeg(active.isOneLeg !== undefined ? active.isOneLeg : false);

      const activeLoadType =
        active.loadType ||
        (active.assistanceDetails?.resistance
          ? "assisted"
          : active.weight && active.weight > 0
            ? "weighted"
            : "bodyweight");
      setLoadType(activeLoadType);
      setWeightUnit(active.weightUnit || "kg");

      setMixedGripLeft(active.mixedGripDetails?.left || "supinated");
      setMixedGripRight(active.mixedGripDetails?.right || "pronated");
      setMixedGripIsAlternating(
        active.mixedGripDetails?.isAlternating || false,
      );

      if (active.assistanceDetails) {
        setBandPlacements(
          (active.assistanceDetails.placement as BandPlacement[]) || [
            "both feet",
          ],
        );
        setBandLoopType(active.assistanceDetails.loopType || "single");
        setAssistanceValue(
          active.assistanceDetails.resistance?.toString() || "",
        );
        setLegTarget(active.assistanceDetails.legTarget || "primary");
        setDipBarFootSupport(
          active.assistanceDetails.dipBarFootSupport || false,
        );
      } else if (
        activeLoadType === "weighted" ||
        (active.weight && active.weight > 0)
      ) {
        setAssistanceValue(active.weight?.toString() || "");
        setBandPlacements(["both feet"]);
        setBandLoopType("single");
        setLegTarget("primary");
        setDipBarFootSupport(false);
      } else {
        setAssistanceValue("");
        setBandPlacements(["both feet"]);
        setBandLoopType("single");
        setLegTarget("primary");
        setDipBarFootSupport(false);
      }
    }
  }, [activeSetId]); // ONLY depend on the id change

  // Sync band placements based on leg progression and leg positions
  React.useEffect(() => {
    const isAustralian = legProgression.toString().includes("australian");
    const isOneLegAustralian = isAustralian && isOneLeg;
    const isOneLegNormal = legProgression === "one leg";

    // 1. One leg / Straddle / One leg Australian -> No "both feet"
    if (isOneLegNormal || legProgression === "straddle" || isOneLegAustralian) {
      if (bandPlacements.includes("both feet")) {
        const next = bandPlacements.map((p) =>
          p === "both feet" ? ("one foot" as BandPlacement) : p,
        );
        updateActiveAssistance("placement", next);
        return;
      }
    }

    // 2. Halflay logic (feet invalid unless floating australian)
    const isPrimaryHalflay =
      (isOneLegNormal || isOneLegAustralian) &&
      oneLegPrimaryPosition === "halflay";
    const isSecondaryHalflay =
      (isOneLegNormal || isOneLegAustralian) &&
      oneLegSecondaryPosition === "halflay";
    const isFullHalflay = legProgression === "halflay";

    const isTargetLegHalflay =
      isFullHalflay ||
      (legTarget === "primary" && isPrimaryHalflay) ||
      (legTarget === "secondary" && isSecondaryHalflay);

    // Exception: Floating leg in Australian version can have band under foot even in halflay
    const isFloatingLegInAustralian =
      isOneLegAustralian && legTarget === "primary";

    if (isTargetLegHalflay && !isFloatingLegInAustralian) {
      if (
        bandPlacements.includes("both feet") ||
        bandPlacements.includes("one foot")
      ) {
        const next = bandPlacements
          .filter((p) => p !== "both feet" && p !== "one foot")
          .concat(
            bandPlacements.some((p) => p === "both feet" || p === "one foot")
              ? ["knees" as BandPlacement]
              : [],
          );

        // Remove duplicates and ensure fallback is clean
        const uniqueNext = Array.from(new Set(next));
        updateActiveAssistance("placement", uniqueNext);
        return;
      }
    }

    // 3. Buttocks/Waist placement logic: Not allowed on High Bar/Rings/Stall Bars unless in L-Sit
    const isEquipmentRestricted = [
      "pull-up bar",
      "rings",
      "stall bars",
    ].includes(equipment);
    const isNotLSit = position !== "L-sit";
    if (
      isEquipmentRestricted &&
      isNotLSit &&
      (bandPlacements.includes("buttocks") || bandPlacements.includes("waist"))
    ) {
      const next = bandPlacements.filter(
        (p) => p !== "buttocks" && p !== "waist",
      );
      const fallback: BandPlacement =
        legProgression === "one leg" || legProgression === "straddle"
          ? "one foot"
          : "both feet";
      const finalNext = next.length === 0 ? [fallback] : next;
      updateActiveAssistance("placement", finalNext);
      return;
    }
  }, [
    legProgression,
    bandPlacements,
    updateActiveAssistance,
    oneLegPrimaryPosition,
    oneLegSecondaryPosition,
    isOneLeg,
    legTarget,
    equipment,
    position,
  ]);

  const updateActiveValue = (
    setField: keyof WorkoutSet,
    globalSetter: (val: any) => void,
    val: any,
  ) => {
    if (activeSetId) {
      updateSet(safeActiveSetIndex, setField, val);
    }
    globalSetter(val);
  };

  const setLoadTypeAndClean = (newType: LoadType) => {
    setLoadType(newType);

    // ONLY clean the currently active set, not all sets
    if (activeSetId) {
      setSets((prev) =>
        prev.map((s) => {
          if (s.id !== activeSetId) return s;
          const updated = { ...s, loadType: newType };
          if (newType === "bodyweight") {
            updated.weight = 0;
            // Preserve dipBarFootSupport if it existed
            const support = updated.assistanceDetails?.dipBarFootSupport;
            updated.assistanceDetails = support
              ? { dipBarFootSupport: true }
              : undefined;
          } else if (newType === "weighted") {
            updated.assistanceDetails = undefined;
          } else if (newType === "assisted") {
            updated.weight = 0;
            const support = updated.assistanceDetails?.dipBarFootSupport;
            // If support is active, ALWAYS force waist/double defaults
            if (support) {
              updated.assistanceDetails = {
                resistance: updated.assistanceDetails?.resistance || "",
                loopType: "double",
                placement: ["waist"],
                dipBarFootSupport: true,
              };
              setBandLoopType("double");
              setBandPlacements(["waist"]);
            } else if (!updated.assistanceDetails) {
              updated.assistanceDetails = {
                resistance: "",
                loopType: "double",
                placement: ["waist"],
                dipBarFootSupport: support,
              };
              setBandLoopType("double");
              setBandPlacements(["waist"]);
            }
          }
          return updated;
        }),
      );
    }
  };

  const resetForm = () => {
    setGrip("pronated");
    setGripWidth("shoulder-width");
    setThumb("under");
    setFalseGrip(false);
    setEquipment("pull-up bar");
    setExecutionStyle("basic");
    setExecutionMethod("standard");
    setOneArmHandPosition("free");
    setOneArmSide("right");
    setOneLegPrimaryPosition("full");
    setOneLegSecondaryPosition("tuck");
    setIsOneLeg(false);
    setPosition("neutral");
    setLegProgression("full");
    setLoadType("bodyweight");
    setAssistanceValue("");
    setMixedGripLeft("supinated");
    setMixedGripRight("pronated");
    setMixedGripIsAlternating(false);
    setBandPlacements(["both feet"]);
    setBandLoopType("single");
    setDipBarFootSupport(false);
    const safeUUID = () => {
      if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
      ) {
        return crypto.randomUUID();
      }
      return Math.random().toString(36).substring(2, 15);
    };

    setSets([
      {
        id: safeUUID(),
        reps: 10,
        grip: "pronated",
        gripWidth: "shoulder-width",
        thumb: "under",
        falseGrip: false,
        equipment: "pull-up bar",
        executionStyle: "basic",
        executionMethod: "standard",
        position: "neutral",
        legProgression: "full",
        oneArmHandPosition: "free",
        isOneLeg: false,
        oneLegPrimaryPosition: "full",
        oneLegSecondaryPosition: "tuck",
      },
    ]);
    setNotes("");
    setExerciseMedia([]);
    setSearchQuery("");
    setShared(false);
    setActiveSetId(null);
    if (!initialExerciseId) {
      setExerciseId(EXERCISE_LIBRARY[0].id);
    } else {
      setExerciseId(initialExerciseId);
    }
  };

  // Sync with initialData if it changes
  React.useEffect(() => {
    if (initialData) {
      setExerciseId(initialData.exerciseId);
      setGrip(initialData.grip || "pronated");
      setGripWidth(initialData.gripWidth || "shoulder-width");
      setThumb(initialData.thumb || "under");
      setFalseGrip(initialData.falseGrip || false);
      setEquipment(initialData.equipment || "pull-up bar");
      setExecutionStyle(initialData.executionStyle || "basic");
      setExecutionMethod(initialData.executionMethod || "standard");
      setOneArmHandPosition(initialData.oneArmHandPosition || "free");
      setOneArmSide(initialData.oneArmSide || "right");
      setOneLegPrimaryPosition(initialData.oneLegPrimaryPosition || "full");
      setOneLegSecondaryPosition(initialData.oneLegSecondaryPosition || "tuck");
      setIsOneLeg(initialData.isOneLeg || false);
      setPosition(initialData.position || "neutral");
      setLegProgression(initialData.legProgression || "full");
      setSets(initialData.sets);

      if (highlightedSetIndex !== undefined && highlightedSetIndex !== null) {
        if (initialData.sets[highlightedSetIndex]) {
          setActiveSetId(initialData.sets[highlightedSetIndex].id);
        }
      } else {
        setActiveSetId(
          initialData.sets[initialData.sets.length - 1]?.id || null,
        );
      }

      setNotes(initialData.notes || "");
      setExerciseMedia(initialData.media || []);
      setShared(initialData.shared || false);
      setLoadType(initialData.loadType || "bodyweight");
      setWeightUnit(initialData.weightUnit || "kg");
      setAssistanceValue(initialData.assistanceValue?.toString() || "");
      setMixedGripLeft(initialData.mixedGripDetails?.left || "supinated");
      setMixedGripRight(initialData.mixedGripDetails?.right || "pronated");
      setMixedGripIsAlternating(
        initialData.mixedGripDetails?.isAlternating || false,
      );

      if (initialData.assistanceDetails) {
        setBandPlacements(
          (initialData.assistanceDetails.placement as BandPlacement[]) || [
            "both feet",
          ],
        );
        setBandLoopType(initialData.assistanceDetails.loopType || "single");
        setLegTarget(initialData.assistanceDetails.legTarget || "primary");
        setDipBarFootSupport(
          initialData.assistanceDetails.dipBarFootSupport || false,
        );
      }
    } else {
      // If we are no longer editing, reset to defaults or initialExerciseId
      resetForm();
    }
  }, [initialData, initialExerciseId, highlightedSetIndex]);

  const filteredExercises = React.useMemo(
    () =>
      EXERCISE_LIBRARY.filter(
        (ex) =>
          ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ex.id.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );

  const currentExercise = React.useMemo(
    () => EXERCISE_LIBRARY.find((e) => e.id === exerciseId),
    [exerciseId],
  );

  const addSet = useCallback(() => {
    const lastSet = sets[sets.length - 1];
    const newId = generateId();
    const newSet = {
      ...lastSet,
      id: newId,
      notes: "", // Don't copy notes
      media: [], // Don't copy media
      assistanceDetails: lastSet.assistanceDetails
        ? {
            ...lastSet.assistanceDetails,
            placement: lastSet.assistanceDetails.placement
              ? [
                  ...(Array.isArray(lastSet.assistanceDetails.placement)
                    ? lastSet.assistanceDetails.placement
                    : [lastSet.assistanceDetails.placement]),
                ]
              : undefined,
          }
        : undefined,
    };
    setSets((prev) => [...prev, newSet]);
    setActiveSetId(newId);
  }, [sets]);

  const removeSet = useCallback(
    (index: number) => {
      const idToRemove = sets[index]?.id;
      setSets((prev) => prev.filter((_, i) => i !== index));
      if (idToRemove === activeSetId) {
        setActiveSetId(sets[index === 0 ? 1 : index - 1]?.id || null);
      }
    },
    [activeSetId, sets],
  );

  const toggleBandPlacement = (p: BandPlacement) => {
    const isLegSupport = (item: BandPlacement) =>
      item === "both feet" || item === "one foot" || item === "knees";
    const isUpperSupport = (item: BandPlacement) =>
      item === "waist" || item === "buttocks" || item === "chest";

    const currentActivePlacements = bandPlacements;
    let next: BandPlacement[];

    if (currentActivePlacements.includes(p)) {
      const filtered = currentActivePlacements.filter((item) => item !== p);
      const fallback: BandPlacement =
        legProgression === "one leg" || legProgression === "straddle"
          ? "one foot"
          : "both feet";
      next = filtered.length === 0 ? [fallback] : filtered;
    } else {
      if (isLegSupport(p)) {
        const upper = currentActivePlacements.filter(isUpperSupport);
        next = [...upper, p];
      } else if (isUpperSupport(p)) {
        const leg = currentActivePlacements.filter(isLegSupport);
        next = [...leg, p];
      } else {
        next = [p];
      }
    }

    updateActiveAssistance("placement", next);
  };

  const availableEquipment = EQUIPMENTS.filter((eq) => {
    if (currentExercise?.category === "Pull") {
      // Standard hard exclusions for Pull
      if (eq === "floor" || eq === "parallelettes") return false;
    }
    return true;
  });

  const availableExecutionStyles = EXECUTION_STYLES.filter(
    (s) => !s.startsWith("korean ") || s === "korean",
  );

  // Track the previous values to know what changed
  const prevEquipmentRef = React.useRef(equipment);
  const prevStyleRef = React.useRef(executionStyle);
  const prevPositionRef = React.useRef(position);
  const prevLegProgressionRef = React.useRef(legProgression);
  const prevGripRef = React.useRef(grip);
  const prevGripWidthRef = React.useRef(gripWidth);

  // Smart conflict resolution (Proactive de-selection)
  React.useEffect(() => {
    if (currentExercise?.category === "Pull") {
      const prevEquipment = prevEquipmentRef.current;
      const prevStyle = prevStyleRef.current;
      const prevGrip = prevGripRef.current;
      const prevGripWidth = prevGripWidthRef.current;
      const prevLegProgression = prevLegProgressionRef.current;

      const styleChanged = prevStyle !== executionStyle;
      const equipChanged = prevEquipment !== equipment;
      const legProgChanged = prevLegProgression !== legProgression;
      const gripChanged = prevGrip !== grip;
      const widthChanged = prevGripWidth !== gripWidth;

      // Logic: A changed value updates the other incompatible one

      // If user selected narrow + neutral grip -> Change style to Commando
      if (
        (gripChanged || widthChanged) &&
        grip === "neutral" &&
        gripWidth === "narrow"
      ) {
        if (executionStyle !== "commando") {
          setExecutionStyle("commando");
        }
      }

      // If executionStyle is Commando but user changes grip/width away -> Revert to basic
      if (
        executionStyle === "commando" &&
        (grip !== "neutral" || gripWidth !== "narrow")
      ) {
        if (gripChanged || widthChanged) {
          setExecutionStyle("basic");
        }
      }

      // If style is Archer/Typewriter but width changes away from Wide -> Revert to basic
      if (
        (executionStyle === "archer" || executionStyle === "typewriter") &&
        gripWidth !== "wide"
      ) {
        if (widthChanged) {
          setExecutionStyle("basic");
        }
      }

      // If user selected Australian progression -> Change high bar to low bar and default assistance
      if (
        legProgChanged &&
        legProgression &&
        legProgression.toString().includes("australian")
      ) {
        if (equipment === "pull-up bar") {
          setEquipment("low bar");
        }
        if (loadType === "assisted") {
          setBandPlacements(isOneLeg ? ["one foot"] : ["both feet"]);
        }
      }

      // Auto assistance for one leg
      if (
        legProgChanged &&
        legProgression === "one leg" &&
        loadType === "assisted"
      ) {
        setBandPlacements(["one foot"]);
      }

      if (prevEquipment !== equipment && equipment === "pull-up bar") {
        if (
          legProgression &&
          legProgression.toString().includes("australian")
        ) {
          setLegProgression("full");
          setIsOneLeg(false);
        }
      }
    }

    prevEquipmentRef.current = equipment;
    prevStyleRef.current = executionStyle;
    prevPositionRef.current = position;
    prevLegProgressionRef.current = legProgression;
    prevGripRef.current = grip;
    prevGripWidthRef.current = gripWidth;
  }, [
    equipment,
    executionStyle,
    position,
    legProgression,
    grip,
    gripWidth,
    currentExercise,
    isOneLeg,
    loadType,
    isHoldExercise,
  ]);

  const handleStyleChange = (style: ExecutionStyle) => {
    const newGrip =
      style === "commando"
        ? "neutral"
        : activeSetId && activeSet?.grip
          ? activeSet.grip
          : grip;
    const isWideStyle = [
      "archer",
      "typewriter",
      "korean archer",
      "korean typewriter",
    ].includes(style);
    const newWidth = isWideStyle
      ? "wide"
      : style === "commando"
        ? "narrow"
        : activeSetId && activeSet?.gripWidth
          ? activeSet.gripWidth
          : gripWidth;

    if (activeSetId) {
      const active = activeSet;
      const newSetValues = {
        ...active,
        executionStyle: style,
        grip: newGrip,
        gripWidth: newWidth,
      };
      setSets((prev) => {
        const next = [...prev];
        next[safeActiveSetIndex] = newSetValues as any;
        return next;
      });
    }

    // Always update local state so the UI (buttons, etc.) updates instantly
    setExecutionStyle(style);
    setGrip(newGrip);
    setGripWidth(newWidth);
  };

  const onSaveClick = () => {
    const validSets = sets.filter(
      (s) => (s.reps && s.reps > 0) || (s.time && s.time > 0),
    );
    if (validSets.length === 0) return;

    // Helper to find consensus among sets
    const getConsensus = (field: keyof WorkoutSet) => {
      if (validSets.length === 0) return undefined;
      const first = JSON.stringify(validSets[0][field]);
      for (let i = 1; i < validSets.length; i++) {
        if (JSON.stringify(validSets[i][field]) !== first) return undefined;
      }
      return validSets[0][field];
    };

    const getConsensusAssistanceField = (field: keyof AssistanceDetails) => {
      if (validSets.length === 0) return undefined;
      const firstVal = (validSets[0].assistanceDetails as any)?.[field];
      const first = JSON.stringify(firstVal);
      for (let i = 1; i < validSets.length; i++) {
        const currentVal = (validSets[i].assistanceDetails as any)?.[field];
        if (JSON.stringify(currentVal) !== first) return undefined;
      }
      return firstVal;
    };

    const finalLoadType = (() => {
      // If user manually chose assisted or weighted, keep it
      if (loadType !== "bodyweight") return loadType;
      // Otherwise check if any set has weight/assistance
      const hasWeight = validSets.some((s) => s.weight && s.weight > 0);
      const hasAssistance = validSets.some(
        (s) => s.assistanceDetails?.resistance,
      );
      if (hasWeight) return "weighted";
      if (hasAssistance) return "assisted";
      return "bodyweight";
    })();

    const safeUUID = () => {
      if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
      ) {
        return crypto.randomUUID();
      }
      return Math.random().toString(36).substring(2, 15);
    };

    const consensusGrip = getConsensus("grip") as GripType | undefined;
    const consensusMixedGrip = getConsensus("mixedGripDetails") as
      | MixedGripDetails
      | undefined;
    const consensusGripWidth = getConsensus("gripWidth") as
      | GripWidth
      | undefined;
    const consensusThumb = getConsensus("thumb") as ThumbPosition | undefined;
    const consensusFalseGrip = getConsensus("falseGrip") as boolean | undefined;
    const consensusEquipment = getConsensus("equipment") as
      | EquipmentType
      | undefined;
    const consensusExecStyle = getConsensus("executionStyle") as
      | ExecutionStyle
      | undefined;
    const consensusExecMethod = getConsensus("executionMethod") as
      | ExecutionMethod
      | undefined;
    const consensusOneArmPos = getConsensus("oneArmHandPosition") as
      | OneArmHandPosition
      | undefined;
    const consensusOneArmSide = getConsensus("oneArmSide") as
      | "left"
      | "right"
      | "alternating"
      | undefined;
    const consensusIsOneLeg = getConsensus("isOneLeg") as boolean | undefined;
    const consensusPrimaryLegPos = getConsensus("oneLegPrimaryPosition") as
      | SingleLegPosition
      | undefined;
    const consensusSecondaryLegPos = getConsensus("oneLegSecondaryPosition") as
      | SingleLegPosition
      | undefined;
    const consensusPosition = getConsensus("position") as
      | BodyPosition
      | undefined;
    const consensusLegProg = getConsensus("legProgression") as
      | LegProgression
      | undefined;
    const consensusAssistanceValue = getConsensusAssistanceField(
      "resistance",
    ) as string | undefined;
    const consensusLoopType = getConsensusAssistanceField("loopType") as
      | BandLoopType
      | undefined;
    const consensusPlacement = getConsensusAssistanceField("placement") as
      | BandPlacement[]
      | undefined;
    const consensusDipBarSupport = getConsensusAssistanceField(
      "dipBarFootSupport",
    ) as boolean | undefined;

    onSave({
      id: initialData?.id || safeUUID(),
      exerciseId,
      type: currentExercise?.name || "Unknown",
      grip: consensusGrip ?? grip,
      mixedGripDetails:
        consensusMixedGrip ??
        (grip === "mixed"
          ? { left: mixedGripLeft, right: mixedGripRight }
          : undefined),
      gripWidth: consensusGripWidth ?? gripWidth,
      thumb: consensusThumb ?? thumb,
      falseGrip: consensusFalseGrip ?? falseGrip,
      equipment: consensusEquipment ?? equipment,
      executionStyle: consensusExecStyle ?? executionStyle,
      executionMethod: consensusExecMethod ?? executionMethod,
      oneArmHandPosition: consensusOneArmPos ?? oneArmHandPosition,
      oneArmSide: consensusOneArmSide ?? oneArmSide,
      oneLegPrimaryPosition: consensusPrimaryLegPos ?? oneLegPrimaryPosition,
      oneLegSecondaryPosition:
        consensusSecondaryLegPos ?? oneLegSecondaryPosition,
      isOneLeg: consensusIsOneLeg || legProgression === "one leg" || isOneLeg,
      position: consensusPosition ?? position,
      legProgression: consensusLegProg ?? legProgression,
      loadType: finalLoadType,
      weightUnit: weightUnit,
      assistanceValue: assistanceValue,
      assistanceDetails:
        finalLoadType === "assisted" ||
        consensusDipBarSupport ||
        dipBarFootSupport
          ? {
              resistance: assistanceValue || "",
              loopType: bandLoopType || "single",
              placement:
                bandPlacements && bandPlacements.length > 0
                  ? bandPlacements
                  : ["both feet"],
              legTarget: legTarget || "primary",
              dipBarFootSupport: consensusDipBarSupport ?? dipBarFootSupport,
            }
          : undefined,
      sets: validSets.map((s) => ({
        ...s,
        // Ensure every set saved has its explicit load context to prevent "bleed" during display
        loadType:
          s.loadType ||
          (s.weight && s.weight > 0
            ? "weighted"
            : s.assistanceDetails?.resistance
              ? "assisted"
              : "bodyweight"),
      })),
      notes,
      media: exerciseMedia,
      shared,
      timestamp: Date.now(),
    });

    resetForm();
  };

  const onEditThumbnailClick = useCallback(
    (
      media: ExerciseMedia,
      mIdx: number,
      setIdx: number,
      type: "set" | "group" | "fragment" = "set",
    ) => {
      setEditingThumbnail({ media, type, mIdx, setIdx });
    },
    [],
  );

  const setControls = useDragControls();

  return (
    <div
      id="workout-form-container"
      className="glass-card p-6 md:p-10 max-w-5xl mx-auto border-cyan-500/10 bg-black/40 rounded-[40px]"
    >
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
        <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-black shadow-2xl shadow-cyan-500/20 rotate-3 group-hover:rotate-0 transition-transform">
          <PlusCircle size={32} />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">
            Operation Protocol
          </h2>
          <p className="text-[10px] text-cyan-500 font-black uppercase tracking-[0.4em]">
            Sequential Log of Performance Parameters • v3.0
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSaveClick();
        }}
        className="space-y-12"
      >
        {/* EXERCISE SELECTION GRID */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-2">
              <Boxes size={14} className="text-cyan-500" /> Exercise
              Identification
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
                onClick={() => setExerciseId(ex.id)}
                className={cn(
                  "p-4 rounded-[24px] border transition-all flex flex-col items-center gap-2 relative overflow-hidden group/item",
                  exerciseId === ex.id
                    ? "bg-cyan-500 border-cyan-400 text-black shadow-xl shadow-cyan-500/10 scale-105"
                    : "bg-white/5 border-white/5 text-slate-500 hover:border-cyan-500/20 hover:text-slate-200",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors mb-1",
                    exerciseId === ex.id
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

          {/* FRAGMENT GLOBAL MEDIA GALLERY */}
          <div className="mb-12 px-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 flex items-center gap-2">
                  <Camera size={14} className="text-cyan-500" /> Fragment Global
                  Gallery
                </h3>
                <p className="text-[8px] font-black text-slate-600 uppercase italic opacity-60">
                  Média platná pro všechny série v tomto cviku
                </p>
              </div>
              <button
                type="button"
                onClick={() => exerciseFileInputRef.current?.click()}
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
                ref={exerciseFileInputRef}
                className="hidden"
                onChange={(e) => handleFileUpload(e, undefined, "fragment")}
              />

              {exerciseMedia.length > 0 ? (
                <MediaGrid
                  media={exerciseMedia}
                  onMediaClick={(mIdx) => handleMediaClick(exerciseMedia, mIdx)}
                  onEditThumbnail={(m, midx) =>
                    onEditThumbnailClick(m, midx, -1, "fragment")
                  }
                  onDelete={(mIdx) => {
                    const newMedia = [...exerciseMedia];
                    newMedia.splice(mIdx, 1);
                    setExerciseMedia(newMedia);
                  }}
                  borderColor="border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.05)]"
                />
              ) : (
                <div
                  className="w-full py-10 border-2 border-dashed border-white/5 rounded-[24px] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-cyan-500/20 transition-all group"
                  onClick={() => exerciseFileInputRef.current?.click()}
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

          {/* SETS CONFIGURATION (Moved to Top for Stability) */}
          <div className="space-y-8">
            <div className="flex items-center justify-between px-2 mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 flex items-center gap-2">
                <Zap size={14} className="text-cyan-500" /> Performance Block
                Configuration
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={addSet}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-500 text-[8px] font-black uppercase tracking-widest hover:bg-cyan-500/20 transition-all"
                >
                  <Plus size={10} /> Set
                </button>
                <button
                  type="button"
                  onClick={() => {
                    for (let i = 0; i < 3; i++) addSet();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-500 text-[8px] font-black uppercase tracking-widest hover:bg-cyan-500/20 transition-all border border-cyan-500/20"
                >
                  <Plus size={10} /> 3 Sets
                </button>
              </div>
            </div>

            {/* Bulk Reps Input */}
            <div className="px-2 mb-8">
              <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-[28px] p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                    <Zap size={14} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-cyan-500/70 italic">
                    Bulk Pattern
                  </span>
                </div>
                <div className="flex-1 w-full flex items-center gap-2">
                  <input
                    ref={bulkInputRef}
                    type="text"
                    inputMode="decimal"
                    placeholder="Enter pattern e.g. 10, 8, 8, 7..."
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

            {/* Sets Quick Strip (Draggable) */}
            <div className="mb-6">
              <Reorder.Group
                ref={setsScrollRef}
                axis="x"
                values={sets}
                onReorder={setSets}
                className="flex gap-2 overflow-x-auto py-3 px-2 no-scrollbar snap-x snap-mandatory"
              >
                {sets.map((s, i) => {
                  const meta = getSetMetadata(s, {
                    exerciseId,
                    loadType,
                    executionStyle,
                    legProgression,
                  });
                  const metaKey = JSON.stringify({
                    l: meta.currentLoadLabel,
                    o: meta.orangeLine,
                    g: meta.gripLine,
                    e: meta.equipLine,
                    a: meta.armLine,
                    c: meta.coreLine,
                    le: meta.legLine,
                  });
                  const groupColor = getColorFromMeta(metaKey);

                  return (
                    <Reorder.Item
                      key={s.id}
                      id={`nav-set-${s.id}`}
                      value={s}
                      dragListener={activeSetId === s.id}
                      className="shrink-0 snap-center"
                      whileDrag={{ scale: 1.1, zIndex: 50 }}
                    >
                      <motion.div
                        role="button"
                        tabIndex={0}
                        onTap={() => {
                          if (activeSetId === s.id) {
                            setActiveSetId(null);
                          } else {
                            setActiveSetId(s.id);
                          }
                        }}
                        className={cn(
                          "flex flex-col items-center gap-1 min-w-[50px] p-2 rounded-2xl border cursor-grab active:cursor-grabbing transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50",
                          activeSetId === s.id
                            ? "bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                            : "bg-black/20 border-white/5 opacity-60 hover:opacity-100 hover:border-white/10",
                        )}
                        style={{
                          borderColor:
                            activeSetId === s.id
                              ? undefined
                              : groupColor + "40",
                        }}
                      >
                        <span
                          className={cn(
                            "text-[8px] font-black uppercase tracking-tighter pointer-events-none",
                            activeSetId === s.id
                              ? "text-cyan-400"
                              : "opacity-60",
                          )}
                          style={{
                            color:
                              activeSetId === s.id ? undefined : groupColor,
                          }}
                        >
                          Set {i + 1}
                        </span>
                        <div className="flex items-baseline gap-1 pointer-events-none">
                          <span
                            className={cn(
                              "text-sm font-black text-white",
                              activeSetId === s.id ? "text-white" : "opacity-80",
                            )}
                          >
                            {isHoldExercise(exerciseId)
                              ? s.time || 0
                              : s.reps || 0}
                          </span>
                          <span className="text-[7px] font-black text-slate-600 uppercase italic">
                            {isHoldExercise(exerciseId) ? "s" : "r"}
                          </span>
                        </div>

                        {/* Content Indicators */}
                        <div className="flex gap-1 mt-1 justify-center pointer-events-none">
                          {(s.notes || (s.media && s.media.length > 0)) && (
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full border border-black/50" />
                          )}
                          {(s.groupNotes ||
                            (s.groupMedia && s.groupMedia.length > 0)) && (
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full border border-black/50" />
                          )}
                        </div>
                      </motion.div>
                    </Reorder.Item>
                  );
                })}
                <button
                  type="button"
                  onClick={addSet}
                  className="flex items-center justify-center min-w-[50px] h-[58px] rounded-2xl border-2 border-dashed border-white/10 text-slate-600 hover:border-cyan-500/30 hover:text-cyan-500 transition-all group shrink-0"
                >
                  <Plus className="group-hover:rotate-90 transition-transform" />
                </button>
              </Reorder.Group>
            </div>
          </div>

          {/* ACTIVE SET DETAIL VIEW with Swipe Navigation (Moved Up for Stability) */}
          <div
            className="relative overflow-hidden -mx-4 px-4 pb-4 w-full max-w-full min-h-[520px] flex flex-col"
            style={{ isolation: "isolate" }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {activeSet && (
                <motion.div
                  key={activeSet.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, position: "absolute" }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe =
                      Math.abs(offset.x) > 40 || Math.abs(velocity.x) > 450;
                    if (swipe) {
                      const idx = sets.findIndex((s) => s.id === activeSetId);
                      if (offset.x > 0 && idx > 0) {
                        setActiveSetId(sets[idx - 1].id);
                      } else if (offset.x < 0 && idx < sets.length - 1) {
                        setActiveSetId(sets[idx + 1].id);
                      }
                    }
                  }}
                  className="w-full cursor-grab active:cursor-grabbing flex-1"
                >
                  {/* GROUP CONTEXT BOX - Shown if series is part of a group */}
                  {(() => {
                    const indices = getSetGroupIndices(safeActiveSetIndex);
                    if (indices.length > 1) {
                      const groupMetadata = getSetMetadata(activeSet, {
                        exerciseId,
                        loadType,
                        executionStyle,
                        legProgression,
                      });
                      const groupColor = getColorFromMeta(
                        JSON.stringify({
                          l: groupMetadata.currentLoadLabel,
                          o: groupMetadata.orangeLine,
                          g: groupMetadata.gripLine,
                          e: groupMetadata.equipLine,
                          a: groupMetadata.armLine,
                          c: groupMetadata.coreLine,
                          le: groupMetadata.legLine,
                        }),
                      );

                      return (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-8 p-8 rounded-[40px] bg-white/[0.02] border border-dashed border-white/10 relative overflow-hidden"
                        >
                          <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                  style={{ backgroundColor: groupColor }}
                                />
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                                  Group Sync Context
                                </span>
                              </div>
                              <p className="text-[8px] font-black text-slate-700 uppercase italic tracking-wider">
                                Tyto prvky jsou společné pro všechny série v
                                této skupině
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = "image/*,video/*";
                                input.multiple = true;
                                input.onchange = (ev) =>
                                  handleFileUpload(
                                    ev as any,
                                    safeActiveSetIndex,
                                    "group",
                                  );
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
                              onMediaClick={(mIdx) =>
                                handleMediaClick(activeSet.groupMedia!, mIdx)
                              }
                              onEditThumbnail={(m, midx) =>
                                onEditThumbnailClick(
                                  m,
                                  midx,
                                  safeActiveSetIndex,
                                  "group",
                                )
                              }
                              onDelete={(mIdx) => {
                                const newMedia = [
                                  ...(activeSet.groupMedia || []),
                                ];
                                newMedia.splice(mIdx, 1);
                                setSets((prev) =>
                                  prev.map((s, i) =>
                                    indices.includes(i)
                                      ? { ...s, groupMedia: newMedia }
                                      : s,
                                  ),
                                );
                              }}
                              borderColor="border-slate-800/50 shadow-inner"
                            />
                            <textarea
                              value={activeSet.groupNotes || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSets((prev) =>
                                  prev.map((s, i) =>
                                    indices.includes(i)
                                      ? { ...s, groupNotes: val }
                                      : s,
                                  ),
                                );
                              }}
                              placeholder="Coaching cues, common feel, or points of focus for this whole set group..."
                              className="w-full bg-black/40 border border-dashed border-white/5 rounded-[24px] p-5 text-xs font-medium text-slate-400 focus:outline-none focus:border-cyan-500/20 transition-all min-h-[80px] leading-relaxed placeholder:text-slate-800 italic"
                            />
                          </div>
                          <div
                            className="absolute -top-16 -right-16 w-48 h-48 blur-[80px] opacity-[0.07] pointer-events-none rounded-full"
                            style={{ backgroundColor: groupColor }}
                          ></div>
                        </motion.div>
                      );
                    }
                    return null;
                  })()}

                  <WorkoutSetDetail
                    set={activeSet}
                    index={safeActiveSetIndex}
                    highlightedSetIndex={highlightedSetIndex || null}
                    activeSetId={activeSetId}
                    exerciseId={exerciseId}
                    loadType={loadType}
                    executionStyle={executionStyle}
                    legProgression={legProgression}
                    oneArmSide={oneArmSide}
                    legTarget={legTarget}
                    setActiveSetId={setActiveSetId}
                    updateActiveAssistance={updateActiveAssistance}
                    updateSet={updateSet}
                    removeSet={removeSet}
                    setSets={setSets}
                    isHoldExercise={isHoldExercise}
                    onFileUpload={handleFileUpload}
                    onMediaClick={handleMediaClick}
                    onEditThumbnail={onEditThumbnailClick}
                    onNoteChange={(val, scope) => {
                      if (scope === "series") {
                        updateSet(safeActiveSetIndex, "notes", val);
                      } else if (scope === "group") {
                        const indices = getSetGroupIndices(safeActiveSetIndex);
                        setSets((prev) =>
                          prev.map((s, i) =>
                            indices.includes(i) ? { ...s, groupNotes: val } : s,
                          ),
                        );
                      } else {
                        setNotes(val);
                      }
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Swipe Hints for Desktop */}
            {sets.length > 1 && (
              <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 inset-x-0 justify-between pointer-events-none px-2">
                <button
                  type="button"
                  onClick={() => {
                    const idx = sets.findIndex((s) => s.id === activeSetId);
                    if (idx > 0) setActiveSetId(sets[idx - 1].id);
                  }}
                  className={cn(
                    "w-10 h-20 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:text-white hover:bg-white/10 transition-all pointer-events-auto",
                    safeActiveSetIndex === 0 && "opacity-0 pointer-events-none",
                  )}
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const idx = sets.findIndex((s) => s.id === activeSetId);
                    if (idx < sets.length - 1) setActiveSetId(sets[idx + 1].id);
                  }}
                  className={cn(
                    "w-10 h-20 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:text-white hover:bg-white/10 transition-all pointer-events-auto",
                    safeActiveSetIndex === sets.length - 1 &&
                      "opacity-0 pointer-events-none",
                  )}
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* TAXONOMY: GRIP / EQUIPMENT / EXECUTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8 p-8 bg-white/5 rounded-[32px] border border-white/5">
              <div className="space-y-6">
                {executionStyle !== "commando" && (
                  <>
                    {executionStyle !== "one arm" && (
                      <div id="grip-width-section">
                        <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block mb-3">
                          Grip Width
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {GRIP_WIDTHS.map((w) => (
                            <button
                              key={w}
                              type="button"
                              onClick={() =>
                                updateActiveValue("gripWidth", setGripWidth, w)
                              }
                              className={cn(
                                "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                                gripWidth === w
                                  ? "bg-white text-black border-white shadow-lg"
                                  : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                              )}
                            >
                              {w === "shoulder-width"
                                ? "Shoulder-width"
                                : w === "narrow"
                                  ? "Narrow"
                                  : w === "wide"
                                    ? "Wide"
                                    : "Alternating"}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block mb-3">
                        Grip Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {GRIPS.filter((g) =>
                          executionStyle === "one arm" ? g !== "mixed" : true,
                        ).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() =>
                              updateActiveValue("grip", setGrip, g)
                            }
                            className={cn(
                              "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                              grip === g
                                ? "bg-white text-black border-white shadow-lg"
                                : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                            )}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <AnimatePresence>
                      {grip === "mixed" && executionStyle !== "one arm" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 pt-4 border-t border-white/5 overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block">
                                Left Hand
                              </label>
                              <div className="flex gap-1">
                                {(
                                  [
                                    "pronated",
                                    "supinated",
                                    "neutral",
                                    "alternating",
                                  ] as const
                                ).map((g) => (
                                  <button
                                    key={g}
                                    type="button"
                                    onClick={() => {
                                      const details = {
                                        left: g,
                                        right: mixedGripRight,
                                        isAlternating: mixedGripIsAlternating,
                                      };
                                      updateActiveValue(
                                        "mixedGripDetails",
                                        (val) => setMixedGripLeft(val.left),
                                        details,
                                      );
                                    }}
                                    className={cn(
                                      "flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase border transition-all",
                                      mixedGripLeft === g
                                        ? "bg-white text-black border-white shadow-sm"
                                        : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                                    )}
                                  >
                                    {g === "alternating" ? "ALT" : g[0]}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block">
                                Right Hand
                              </label>
                              <div className="flex gap-1">
                                {(
                                  [
                                    "pronated",
                                    "supinated",
                                    "neutral",
                                    "alternating",
                                  ] as const
                                ).map((g) => (
                                  <button
                                    key={g}
                                    type="button"
                                    onClick={() => {
                                      const details = {
                                        left: mixedGripLeft,
                                        right: g,
                                        isAlternating: mixedGripIsAlternating,
                                      };
                                      updateActiveValue(
                                        "mixedGripDetails",
                                        (val) => setMixedGripRight(val.right),
                                        details,
                                      );
                                    }}
                                    className={cn(
                                      "flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase border transition-all",
                                      mixedGripRight === g
                                        ? "bg-white text-black border-white shadow-sm"
                                        : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                                    )}
                                  >
                                    {g === "alternating" ? "ALT" : g[0]}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 mt-4 border-t border-white/5 flex justify-center">
                            <button
                              type="button"
                              onClick={() => {
                                const details = {
                                  left: mixedGripLeft,
                                  right: mixedGripRight,
                                  isAlternating: !mixedGripIsAlternating,
                                };
                                updateActiveValue(
                                  "mixedGripDetails",
                                  (val) =>
                                    setMixedGripIsAlternating(
                                      val.isAlternating || false,
                                    ),
                                  details,
                                );
                              }}
                              className={cn(
                                "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2",
                                mixedGripIsAlternating
                                  ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20"
                                  : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                              )}
                            >
                              <div
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  mixedGripIsAlternating
                                    ? "bg-black animate-pulse"
                                    : "bg-slate-600",
                                )}
                              />
                              Alternating Hands (Per Rep)
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block mb-3">
                      Thumb Position
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {THUMBS.map((t) => (
                        <button
                          key={t.val}
                          type="button"
                          onClick={() =>
                            updateActiveValue("thumb", setThumb, t.val)
                          }
                          className={cn(
                            "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex-1 text-center",
                            thumb === t.val
                              ? "bg-white text-black border-white shadow-lg"
                              : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                          )}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400 block mb-3">
                      False Grip
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        updateActiveValue("falseGrip", setFalseGrip, !falseGrip)
                      }
                      className={cn(
                        "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all w-full text-center h-[38px] flex items-center justify-center",
                        falseGrip
                          ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20"
                          : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                      )}
                    >
                      {falseGrip ? "ACTIVE" : "INACTIVE"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block mb-3">
                    Equipment
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableEquipment.map((eq) => (
                      <button
                        key={eq}
                        type="button"
                        onClick={() =>
                          updateActiveValue("equipment", setEquipment, eq)
                        }
                        className={cn(
                          "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                          equipment === eq
                            ? "bg-white text-black border-white shadow-lg"
                            : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                        )}
                      >
                        {eq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 p-8 bg-white/5 rounded-[32px] border border-white/5">
              <div className="space-y-6">
                <div>
                  <label className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/60 block mb-3">
                    Execution Style
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableExecutionStyles.map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => handleStyleChange(style)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                          executionStyle === style
                            ? "bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/20"
                            : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                        )}
                      >
                        {style.replace("-", " ").toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>{" "}
                {executionStyle.toString().startsWith("korean") && (
                  <motion.div
                    key="korean-variants"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2 mt-3 pt-3 border-t border-white/5 mb-6"
                  >
                    {(["archer", "typewriter"] as const).map((variant) => {
                      const variantStyle =
                        `korean ${variant}` as ExecutionStyle;
                      const isActive = executionStyle === variantStyle;
                      return (
                        <button
                          key={variant}
                          type="button"
                          onClick={() =>
                            handleStyleChange(
                              isActive ? "korean" : variantStyle,
                            )
                          }
                          className={cn(
                            "flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all",
                            isActive
                              ? "bg-purple-600 text-white border-purple-400"
                              : "bg-black/40 text-slate-500 border-white/5",
                          )}
                        >
                          + {variant}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
                {(executionStyle === "one arm" ||
                  executionStyle === "commando") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-5 pt-4 border-t border-white/5 pb-4"
                  >
                    <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400 block mb-2">
                        {executionStyle === "one arm"
                          ? "Active Arm"
                          : "Front Hand Position"}
                      </label>
                      <div className="flex gap-2">
                        {(["left", "right", "alternating"] as const).map(
                          (side) => (
                            <button
                              key={side}
                              type="button"
                              onClick={() =>
                                updateActiveValue(
                                  "oneArmSide",
                                  setOneArmSide,
                                  side,
                                )
                              }
                              className={cn(
                                "flex-1 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all",
                                oneArmSide === side
                                  ? "bg-cyan-500 text-black border-cyan-400"
                                  : "bg-black/40 text-slate-500 border-white/5",
                              )}
                            >
                              {side}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    {executionStyle === "one arm" && (
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400 block mb-2">
                          Passive Arm Support
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {ONE_ARM_POSITIONS.map((pos) => (
                            <button
                              key={pos.val}
                              type="button"
                              onClick={() =>
                                updateActiveValue(
                                  "oneArmHandPosition",
                                  setOneArmHandPosition,
                                  pos.val,
                                )
                              }
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all flex-1 text-center min-w-[80px]",
                                oneArmHandPosition === pos.val
                                  ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/10"
                                  : "bg-black/40 text-slate-500 border-white/5",
                              )}
                            >
                              {pos.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
                <div>
                  <label className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/60 block mb-3">
                    Method/Tempo
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {EXECUTION_METHODS.map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() =>
                          updateActiveValue(
                            "executionMethod",
                            setExecutionMethod,
                            method,
                          )
                        }
                        className={cn(
                          "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                          executionMethod === method
                            ? "bg-white/20 text-white border-white/20 shadow-lg"
                            : "bg-black/20 text-slate-600 border-white/5 hover:border-white/20",
                        )}
                      >
                        {method === "standard"
                          ? "Standard"
                          : method === "explosive"
                            ? "Explosive"
                            : method === "partial"
                              ? "Partial"
                              : method === "negative"
                                ? "Negative"
                                : method === "scapula"
                                  ? "Scapula"
                                  : "Controlled"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/60 block mb-3">
                    Core Position
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {POSITIONS.map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() =>
                          updateActiveValue("position", setPosition, pos)
                        }
                        className={cn(
                          "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                          position === pos
                            ? "bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/20"
                            : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                        )}
                      >
                        {pos === "neutral" ? "Neutral" : pos}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/60 block mb-3">
                    {dipBarFootSupport
                      ? "Floating Leg Position"
                      : "Leg Progression"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {LEG_PROGRESSIONS.filter((p) => {
                      if (dipBarFootSupport) {
                        // Exclude Australian and complex variants from Floating Leg list
                        return (
                          !p.toString().includes("australian") &&
                          p !== "one leg" &&
                          p !== "straddle"
                        );
                      }
                      return true;
                    }).map((prog) => (
                      <button
                        key={prog}
                        type="button"
                        onClick={() =>
                          updateActiveValue(
                            "legProgression",
                            setLegProgression,
                            prog,
                          )
                        }
                        className={cn(
                          "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                          legProgression === prog
                            ? "bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/20"
                            : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20",
                        )}
                      >
                        {prog === "full"
                          ? "Full"
                          : prog === "australian (bent legs)"
                            ? "Australian (Bent)"
                            : prog === "australian (straight legs)"
                              ? "Australian (Straight)"
                              : prog}
                      </button>
                    ))}
                  </div>
                </div>
                {legProgression.toString().includes("australian") && (
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateActiveValue("isOneLeg", setIsOneLeg, !isOneLeg)
                      }
                      className={cn(
                        "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                        isOneLeg
                          ? "bg-cyan-500 text-black border-cyan-400 shadow-lg"
                          : "bg-black/20 text-slate-500 border-white/5",
                      )}
                    >
                      One Leg {isOneLeg ? "✓" : "✗"}
                    </button>
                  </div>
                )}
                {(legProgression === "one leg" ||
                  (legProgression.toString().includes("australian") &&
                    isOneLeg) ||
                  dipBarFootSupport) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4 pt-4 border-t border-white/5 pb-4"
                  >
                    <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400 block mb-2">
                        Leg Assist
                      </label>
                      <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 mb-4">
                        {(["left", "right", "alternating"] as const).map(
                          (side) => (
                            <button
                              key={side}
                              type="button"
                              onClick={() =>
                                updateActiveValue(
                                  "oneArmSide",
                                  setOneArmSide,
                                  side,
                                )
                              }
                              className={cn(
                                "flex-1 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all",
                                oneArmSide === side
                                  ? "bg-cyan-500 text-black shadow-lg"
                                  : "text-slate-500 hover:text-white",
                              )}
                            >
                              {side}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400 block mb-2">
                        {legProgression.toString().includes("australian") ||
                        dipBarFootSupport
                          ? "Floating Leg Position"
                          : "Primary Leg"}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {SINGLE_LEG_POSITIONS.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              if (activeSetId) {
                                const newPrimary = p;
                                let newSecondary =
                                  activeSet?.oneLegSecondaryPosition ||
                                  oneLegSecondaryPosition;
                                if (
                                  p === newSecondary &&
                                  legProgression === "one leg"
                                ) {
                                  newSecondary =
                                    SINGLE_LEG_POSITIONS.find(
                                      (lp) => lp !== p,
                                    ) || "tuck";
                                }
                                updateSet(
                                  safeActiveSetIndex,
                                  "oneLegPrimaryPosition",
                                  newPrimary,
                                );
                                updateSet(
                                  safeActiveSetIndex,
                                  "oneLegSecondaryPosition",
                                  newSecondary,
                                );
                              }
                              setOneLegPrimaryPosition(p);
                              if (
                                p === oneLegSecondaryPosition &&
                                legProgression === "one leg"
                              ) {
                                const fallback =
                                  SINGLE_LEG_POSITIONS.find((lp) => lp !== p) ||
                                  "tuck";
                                setOneLegSecondaryPosition(fallback as any);
                              }
                            }}
                            className={cn(
                              "px-3 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all text-center",
                              oneLegPrimaryPosition === p
                                ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20"
                                : "bg-black/40 text-slate-500 border-white/5 hover:border-white/20",
                            )}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {legProgression === "one leg" && (
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400/60 block mb-2">
                          Secondary Leg
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {SINGLE_LEG_POSITIONS.filter(
                            (p) => p !== oneLegPrimaryPosition,
                          ).map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() =>
                                updateActiveValue(
                                  "oneLegSecondaryPosition",
                                  setOneLegSecondaryPosition,
                                  p,
                                )
                              }
                              className={cn(
                                "px-3 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all text-center",
                                oneLegSecondaryPosition === p
                                  ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20"
                                  : "bg-black/40 text-slate-500 border-white/5 hover:border-white/20",
                              )}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* LOAD & ASSISTANCE */}
          <div className="p-8 bg-orange-500/5 rounded-[32px] border border-orange-500/10">
            <div className="flex flex-col items-stretch gap-8">
              {equipment === "dip bars" &&
                executionStyle.toString().startsWith("korean") && (
                  <div className="bg-orange-500/10 p-5 rounded-2xl border border-orange-500/20">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 italic">
                          Dip Bar Foot Support
                        </span>
                        <span className="text-[8px] text-orange-400/60 font-bold uppercase leading-tight">
                          One leg resting on the other bar for assistance
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateActiveAssistance(
                            "dipBarFootSupport",
                            !dipBarFootSupport,
                          )
                        }
                        className={cn(
                          "w-14 h-7 rounded-full transition-all relative border shrink-0",
                          dipBarFootSupport
                            ? "bg-orange-500 border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                            : "bg-black/40 border-white/10",
                        )}
                      >
                        <motion.div
                          animate={{ x: dipBarFootSupport ? 30 : 4 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                          className={cn(
                            "w-5 h-5 rounded-full absolute top-0.5",
                            dipBarFootSupport ? "bg-black" : "bg-slate-600",
                          )}
                        />
                      </button>
                    </div>
                  </div>
                )}

              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 flex items-center gap-2">
                <Target size={14} /> Load Configuration
              </label>
              <div className="flex gap-2">
                {(["bodyweight", "weighted", "assisted"] as LoadType[]).map(
                  (lt) => (
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
                      {lt === "bodyweight"
                        ? "Bodyweight"
                        : lt === "weighted"
                          ? "Weighted (+)"
                          : "Assisted (-)"}
                    </button>
                  ),
                )}
              </div>
            </div>

            {loadType !== "bodyweight" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col sm:flex-row items-end gap-4">
                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex items-center justify-between px-2">
                      <label className="text-[8px] font-black uppercase tracking-[0.3em] text-orange-500/60 block">
                        {loadType === "weighted"
                          ? `Extra Weight (${weightUnit})`
                          : `Assistance Value (${weightUnit})`}
                      </label>
                      <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/5">
                        <button
                          type="button"
                          onClick={() => updateActiveAssistance("unit", "kg")}
                          className={cn(
                            "px-2 py-1 rounded-md text-[8px] font-black transition-all",
                            weightUnit === "kg"
                              ? "bg-orange-500 text-black"
                              : "text-slate-500",
                          )}
                        >
                          KG
                        </button>
                        <button
                          type="button"
                          onClick={() => updateActiveAssistance("unit", "lbs")}
                          className={cn(
                            "px-2 py-1 rounded-md text-[8px] font-black transition-all",
                            weightUnit === "lbs"
                              ? "bg-orange-500 text-black"
                              : "text-slate-500",
                          )}
                        >
                          LBS
                        </button>
                      </div>
                    </div>
                    <input
                      type="number"
                      placeholder="0"
                      value={assistanceValue}
                      onChange={(e) =>
                        updateActiveAssistance("resistance", e.target.value)
                      }
                      className="w-full bg-black/40 border border-orange-500/20 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-orange-500 italic"
                    />
                  </div>
                  {loadType === "assisted" && (
                    <div className="bg-black/20 p-2 rounded-2xl border border-white/5 h-[54px] flex items-center">
                      <button
                        type="button"
                        onClick={() => {
                          const next =
                            bandLoopType === "single"
                              ? "double"
                              : bandLoopType === "double"
                                ? "half"
                                : "single";
                          updateActiveAssistance("loopType", next);
                        }}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[7px] font-black uppercase tracking-widest transition-all",
                          bandLoopType !== "single"
                            ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20"
                            : "bg-white/10 text-slate-400",
                        )}
                      >
                        {bandLoopType === "double"
                          ? "Double"
                          : bandLoopType === "half"
                            ? "1/2"
                            : "Single"}
                      </button>
                    </div>
                  )}
                </div>

                {loadType === "assisted" && (
                  <div className="space-y-4">
                    <label className="text-[8px] font-black uppercase tracking-[0.3em] text-orange-500/60 block px-2">
                      Assistance Placement
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {BAND_PLACEMENTS.filter((p) => {
                        // If dip bar foot support is ON, only WAIST is allowed
                        if (dipBarFootSupport && p !== "waist") return false;

                        const isAustr = legProgression
                          .toString()
                          .includes("australian");
                        const isOneLegNor = legProgression === "one leg";
                        const isOneLegAustr = isAustr && isOneLeg;

                        if (
                          (isOneLegNor ||
                            legProgression === "straddle" ||
                            isOneLegAustr) &&
                          p === "both feet"
                        ) {
                          return false;
                        }

                        const isPrimHalf =
                          (isOneLegNor || isOneLegAustr) &&
                          oneLegPrimaryPosition === "halflay";
                        const isSecHalf =
                          (isOneLegNor || isOneLegAustr) &&
                          oneLegSecondaryPosition === "halflay";
                        const isFullHalf = legProgression === "halflay";

                        const targetHalf =
                          isFullHalf ||
                          (legTarget === "primary" && isPrimHalf) ||
                          (legTarget === "secondary" && isSecHalf);
                        const isFloatAustr =
                          isAustr && isOneLeg && legTarget === "primary";

                        if (targetHalf && !isFloatAustr) {
                          return p !== "both feet" && p !== "one foot";
                        }

                        // Restricted Buttocks / Waist logic
                        const isRestrictedEquip = [
                          "pull-up bar",
                          "rings",
                          "stall bars",
                        ].includes(equipment);
                        const isNotL = position !== "L-sit";
                        if (
                          isRestrictedEquip &&
                          isNotL &&
                          (p === "buttocks" || p === "waist")
                        )
                          return false;

                        // Dip bar foot support logic
                        const isKorean = executionStyle
                          .toString()
                          .startsWith("korean");
                        // This comparison was invalid as it's not a BandPlacement value.
                        // Dip Bar Support has its own toggle.

                        return true;
                      }).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => toggleBandPlacement(p)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[7px] font-black uppercase tracking-widest border transition-all flex-1 text-center min-w-[80px]",
                            bandPlacements.includes(p)
                              ? "bg-orange-500 text-black border-orange-400"
                              : "bg-black/40 text-slate-500 border-white/5",
                          )}
                        >
                          {p === "one foot"
                            ? "One Foot"
                            : p === "both feet"
                              ? "Both Feet"
                              : p === "knees"
                                ? "Knee/s"
                                : p === "waist"
                                  ? "Waist (Lumbar)"
                                  : p === "buttocks"
                                    ? "Buttocks"
                                    : "Chest"}
                        </button>
                      ))}
                    </div>

                    {(legProgression === "one leg" ||
                      legProgression === "straddle") &&
                      (bandPlacements.includes("one foot") ||
                        bandPlacements.includes("knees")) && (
                        <div className="space-y-3 pt-2">
                          <label className="text-[8px] font-black uppercase tracking-[0.3em] text-orange-500/40 block px-2">
                            Assistance Target Leg
                          </label>
                          <div className="flex gap-2">
                            {(
                              ["primary", "secondary", "alternating"] as const
                            ).map((side) => (
                              <button
                                key={side}
                                type="button"
                                onClick={() =>
                                  updateActiveAssistance("legTarget", side)
                                }
                                className={cn(
                                  "px-4 py-2 rounded-xl text-[7px] font-black uppercase tracking-widest border transition-all flex-1 text-center",
                                  legTarget === side
                                    ? "bg-orange-500/20 text-orange-400 border-orange-400/30"
                                    : "bg-black/40 text-slate-600 border-white/5",
                                )}
                              >
                                {side === "primary"
                                  ? "Primary Leg"
                                  : side === "secondary"
                                    ? "Secondary Leg"
                                    : "Alternating"}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={addSet}
          className="w-full py-6 border-2 border-dashed border-white/5 rounded-[32px] text-slate-600 hover:text-cyan-500 hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all text-xs font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 active:scale-[0.99] group shadow-inner"
        >
          <Plus
            size={20}
            className="group-hover:rotate-90 transition-transform"
          />{" "}
          Add Performance Set
        </button>

         {/* FRAGMENT GLOBAL INSIGHTS (Notes at bottom) */}
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
            <p className="text-[9px] text-slate-600 italic mt-4 px-4">Tyto poznámky se propíší k celému fragmentu v logu. Ideální pro celkové zhodnocení techniky nebo únavy.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 flex items-center gap-2 px-2">
                  <Share2 size={14} /> Operation Logistics
               </label>
               <div className="flex items-center justify-between px-6 py-6 bg-white/5 rounded-[32px] border border-white/5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mark as verified execution</span>
                  <button 
                   type="button"
                   onClick={() => setShared(!shared)}
                   className={cn(
                     "w-12 h-6 rounded-full relative transition-colors duration-300",
                     shared ? "bg-cyan-500" : "bg-white/10"
                   )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300",
                      shared ? "left-7" : "left-1"
                    )} />
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
      </form>

      <MediaPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        media={previewMedia}
        initialIndex={previewIndex}
        onSelectThumbnail={handleThumbnailFromPreview}
      />

      {/* Thumbnail Selection Modal */}
      <AnimatePresence>
        {editingThumbnail &&
          createPortal(
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
              onClick={() => setEditingThumbnail(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-card w-full max-w-2xl bg-black border border-white/10 p-6 rounded-[40px] shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6 px-2">
                  <div>
                    <h3 className="text-xl font-black text-white italic tracking-tighter">
                      VÝBĚR ÚVODNÍ FOTKY
                    </h3>
                    <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mt-1">
                      Pusťte video a uložte aktuální snímek jako úvodní fotku
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingThumbnail(null)}
                    className="p-3 bg-white/5 rounded-2xl hover:bg-white hover:text-black transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-white/5 mb-6 group">
                  <MediaRenderer
                    url={editingThumbnail.media.url}
                    type="video"
                    className="w-full h-full object-contain"
                    autoPlay
                    preload="auto"
                    playsInline
                    controls
                    id="thumbnail-video-preview"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const video = document.getElementById(
                        "thumbnail-video-preview",
                      ) as HTMLVideoElement;
                      if (video) captureMediaThumbnail(video);
                    }}
                    className="w-full py-6 bg-cyan-500 rounded-[28px] text-black text-sm font-black uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-3 group/btn"
                  >
                    <Camera
                      size={24}
                      className="group-hover/btn:scale-110 transition-transform"
                    />
                    VYSKENOVAT AKTUÁLNÍ SNÍMEK
                  </button>
                  <p className="text-center text-[9px] font-black text-slate-500 uppercase tracking-widest italic opacity-60">
                    Zastavte video v momentu, který chcete použít jako úvodní
                    fotku
                  </p>
                </div>
              </motion.div>
            </motion.div>,
            document.body,
          )}
      </AnimatePresence>
    </div>
  );
};
