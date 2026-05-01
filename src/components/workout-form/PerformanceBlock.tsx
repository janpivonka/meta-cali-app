import React from "react";
import { Plus, Zap, ArrowLeft, ArrowRight, Video, PlusCircle } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { cn, getSetMetadata, getColorFromMeta } from "../../lib/utils";
import { WorkoutSet, ExerciseMedia, LoadType } from "../../types";
import { MediaGrid } from "./MediaGrid";
import { WorkoutSetDetail } from "./WorkoutSetDetail";

interface PerformanceBlockProps {
  sets: WorkoutSet[];
  setSets: React.Dispatch<React.SetStateAction<WorkoutSet[]>>;
  activeSetId: string | null;
  setActiveSetId: (id: string | null) => void;
  exerciseId: string;
  loadType: LoadType;
  executionStyle: string;
  legProgression: string;
  oneArmSide: "left" | "right" | "alternating";
  legTarget: "primary" | "secondary" | "alternating";
  highlightedSetIndex: number | null;
  isHoldExercise: (id: string) => boolean;
  addSet: () => void;
  addSets: (count: number) => void;
  removeSet: (index: number) => void;
  updateSet: (index: number, field: keyof WorkoutSet, value: any) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, index?: number, scope?: "series" | "group" | "fragment") => void;
  handleMediaClick: (media: ExerciseMedia[], index: number) => void;
  onEditThumbnailClick: (media: ExerciseMedia, mIdx: number, setIdx: number, type?: "set" | "group" | "fragment") => void;
  updateActiveAssistance: (field: string, val: any) => void;
  getSetGroupIndices: (idx: number) => number[];
  setsScrollRef: React.RefObject<HTMLDivElement>;
  bulkInputRef: React.RefObject<HTMLInputElement>;
  handleBulkApply: () => void;
  onNoteChange: (val: string, scope: "series" | "group" | "fragment") => void;
}

export const PerformanceBlock: React.FC<PerformanceBlockProps> = ({
  sets,
  setSets,
  activeSetId,
  setActiveSetId,
  exerciseId,
  loadType,
  executionStyle,
  legProgression,
  oneArmSide,
  legTarget,
  highlightedSetIndex,
  isHoldExercise,
  addSet,
  addSets,
  removeSet,
  updateSet,
  handleFileUpload,
  handleMediaClick,
  onEditThumbnailClick,
  updateActiveAssistance,
  getSetGroupIndices,
  setsScrollRef,
  bulkInputRef,
  handleBulkApply,
  onNoteChange,
}) => {
  const safeActiveSetIndex = sets.findIndex((s) => s.id === activeSetId);
  const activeSet = sets[safeActiveSetIndex];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2 mb-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 flex items-center gap-2">
          <Zap size={14} className="text-cyan-500" /> Performance Block Configuration
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
            onClick={() => addSets(3)}
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

      {/* ACTIVE SET DETAIL VIEW with Swipe Navigation */}
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
                            Tyto prvky jsou společné pro všechny série v této skupině
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
                highlightedSetIndex={highlightedSetIndex}
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
                onNoteChange={onNoteChange}
                getSetGroupIndices={getSetGroupIndices}
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
    </div>
  );
};
