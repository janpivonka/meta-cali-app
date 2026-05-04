import React, { memo, useRef } from "react";
import { Plus, Minus, Copy, MessageSquare, Camera } from "lucide-react";
import { WorkoutSet, LoadType, ExerciseMedia } from "../../types";
import { 
  cn, 
  isHoldExercise, 
  getSetMetadata, 
  getColorFromMeta 
} from "../../lib/utils";
import { MediaGrid } from "./MediaGrid";
import { generateId } from "./utils";

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

export const WorkoutSetDetail = memo<WorkoutSetItemProps>(
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
    const currentSetExId = set.exerciseId || exerciseId;

    const meta = getSetMetadata(set, {
      exerciseId: currentSetExId,
      loadType,
      executionStyle,
      legProgression,
    });
    const metaKey = `${currentSetExId}|${meta.currentLoadLabel}|${meta.orangeLine.join(",")}|${meta.gripLine.join(",")}|${meta.equipLine.join(",")}|${meta.armLine.join(",")}|${meta.coreLine.join(",")}|${meta.legLine.join(",")}`;
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
                      isHoldExercise(currentSetExId) ? "time" : "reps",
                      Math.max(
                        0,
                        (isHoldExercise(currentSetExId)
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
                    isHoldExercise(currentSetExId) ? set.time || 0 : set.reps || 0
                  }
                  onChange={(e) =>
                    updateSet(
                      index,
                      isHoldExercise(currentSetExId) ? "time" : "reps",
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
                      isHoldExercise(currentSetExId) ? "time" : "reps",
                      (isHoldExercise(currentSetExId)
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
                {isHoldExercise(currentSetExId) ? "Time" : "Reps"}
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
