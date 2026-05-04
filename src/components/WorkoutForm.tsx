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
import { 
  GRIPS, 
  GRIP_WIDTHS, 
  THUMBS, 
  EQUIPMENTS, 
  EXECUTION_STYLES, 
  EXECUTION_METHODS, 
  POSITIONS, 
  LEG_PROGRESSIONS, 
  BAND_PLACEMENTS, 
  LOOP_TYPES, 
  SINGLE_LEG_POSITIONS, 
  ONE_ARM_POSITIONS 
} from "./workout-form/constants";
import { generateId, processFile } from "./workout-form/utils";
import { MediaGrid } from "./workout-form/MediaGrid";
import { WorkoutSetDetail } from "./workout-form/WorkoutSetDetail";
import { ExerciseSelector } from "./workout-form/ExerciseSelector";
import { GlobalMediaGallery } from "./workout-form/GlobalMediaGallery";
import { PerformanceBlock } from "./workout-form/PerformanceBlock";
import { TaxonomySection } from "./workout-form/TaxonomySection";
import { LoadConfigSection } from "./workout-form/LoadConfigSection";
import { GlobalInsightsSection } from "./workout-form/GlobalInsightsSection";
import { LogisticsSection } from "./workout-form/LogisticsSection";

interface WorkoutFormProps {
  onSave: (log: ExerciseLog) => void;
  onDelete?: () => void;
  initialExerciseId?: string | null;
  initialData?: ExerciseLog | null;
  highlightedSetIndex?: number | null;
}

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
        exerciseId: targetSet.exerciseId || exerciseId,
        loadType,
        executionStyle,
        legProgression,
      });
      const targetKey = `${targetMeta.exerciseId}|${targetMeta.currentLoadLabel}|${targetMeta.orangeLine.join(",")}|${targetMeta.gripLine.join(",")}|${targetMeta.equipLine.join(",")}|${targetMeta.armLine.join(",")}|${targetMeta.coreLine.join(",")}|${targetMeta.legLine.join(",")}`;

      return sets
        .map((s, i) => {
          const m = getSetMetadata(s, {
            exerciseId: s.exerciseId || exerciseId,
            loadType,
            executionStyle,
            legProgression,
          });
          const k = `${m.exerciseId}|${m.currentLoadLabel}|${m.orangeLine.join(",")}|${m.gripLine.join(",")}|${m.equipLine.join(",")}|${m.armLine.join(",")}|${m.coreLine.join(",")}|${m.legLine.join(",")}`;
          return k === targetKey ? i : -1;
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
  const isUpdatingRef = useRef(false);

  // Auto-scroll active set into view
  const lastScrollIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (activeSetId && setsScrollRef.current && activeSetId !== lastScrollIdRef.current) {
      const container = setsScrollRef.current;
      lastScrollIdRef.current = activeSetId;
      
      const timeoutId = setTimeout(() => {
        try {
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
              const targetScroll = itemLeft - (containerWidth / 2) + (itemWidth / 2);

              container.scrollTo({
                left: targetScroll,
                behavior: "smooth",
              });
            }
          }
        } catch (err) {
          console.error("Auto-scroll failed", err);
        }
      }, 100);
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
      const baseSet = activeSet || sets[sets.length - 1];
      const newSetsToAdd = vals.map((v) => {
        const currentSetExId = baseSet?.exerciseId || exerciseId;
        return {
          ...(baseSet || {}),
          id: generateId(),
          exerciseId: currentSetExId,
          [isHoldExercise(currentSetExId) ? "time" : "reps"]: v,
          notes: "",
          media: [],
          mixedGripDetails: baseSet?.mixedGripDetails ? { ...baseSet.mixedGripDetails } : undefined,
          assistanceDetails: baseSet?.assistanceDetails
            ? {
                ...baseSet.assistanceDetails,
                placement: baseSet.assistanceDetails.placement
                  ? [
                      ...(Array.isArray(baseSet.assistanceDetails.placement)
                        ? baseSet.assistanceDetails.placement
                        : [baseSet.assistanceDetails.placement]),
                    ]
                  : undefined,
              }
            : undefined,
          loadType: baseSet?.loadType || loadType,
        };
      });
      setSets((prev) => {
        const next = [...prev];
        const insertIndex =
          activeSetIndex !== -1 ? activeSetIndex + 1 : prev.length;
        next.splice(insertIndex, 0, ...newSetsToAdd);
        return next;
      });
      setActiveSetId(newSetsToAdd[newSetsToAdd.length - 1].id);
      bulkInputRef.current.value = "";
      bulkInputRef.current.blur();
    }
  }, [sets, exerciseId, loadType, activeSet, activeSetIndex]);

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
        console.warn(
          "Video not yet loaded for capture. Please try again in a second.",
        );
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (canvas.width === 0 || canvas.height === 0) {
        console.error("Error reading video dimensions.");
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
      // 1. First update global state for instant UI feedback
      if (field === "resistance") setAssistanceValue(val.toString());
      else if (field === "loopType") setBandLoopType(val);
      else if (field === "placement") setBandPlacements(val);
      else if (field === "legTarget") setLegTarget(val);
      else if (field === "unit") setWeightUnit(val);
      else if (field === "dipBarFootSupport") {
        setDipBarFootSupport(val);
        if (val) {
          setBandPlacements(["waist"]);
          setBandLoopType("double");
          // Non-reactive update for leg progression if needed
          setLegProgression(prev => {
            if (prev === "one leg" || prev.toString().includes("australian")) {
              return oneLegPrimaryPosition;
            }
            return prev;
          });
        }
      }

      // 2. Update sets array using functional update to avoid dependency on 'sets'
      if (activeSetId) {
        setSets((prev) => {
          const idx = prev.findIndex(s => s.id === activeSetId);
          if (idx === -1) return prev;
          const newSets = [...prev];
          
          if (field === "unit") {
            newSets[idx] = { ...newSets[idx], weightUnit: val };
            return newSets;
          }

          const currentDetails = newSets[idx].assistanceDetails || {
            resistance: "",
            loopType: "single",
            placement: ["both feet"],
            legTarget: "primary",
          };
          const updatedDetails = { ...currentDetails, [field]: val };

          if (field === "dipBarFootSupport" && val) {
            updatedDetails.placement = ["waist"];
            updatedDetails.loopType = "double";
            updatedDetails.dipBarFootSupport = true;
          }

          if (loadType === "weighted" && field === "resistance") {
            const numericWeight = parseFloat(val) || 0;
            newSets[idx] = { 
              ...newSets[idx], 
              weight: numericWeight, 
              assistanceDetails: undefined,
              loadType: 'weighted'
            };
          } else {
            newSets[idx] = { 
              ...newSets[idx], 
              assistanceDetails: updatedDetails,
              loadType: updatedDetails.resistance ? 'assisted' : 'bodyweight'
            };
          }
          return newSets;
        });
      }
    },
    [activeSetId, loadType, oneLegPrimaryPosition],
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

  const isAustralian = React.useMemo(() => legProgression.toString().includes("australian"), [legProgression]);
  const isOneLegAustralian = React.useMemo(() => isAustralian && isOneLeg, [isAustralian, isOneLeg]);
  const isOneLegNormal = React.useMemo(() => legProgression === "one leg", [legProgression]);

  // Sync band placements based on leg progression and leg positions
  useEffect(() => {
    if (isUpdatingRef.current) return;
    
    let next: BandPlacement[] | null = null;

    // 1. One leg / Straddle / One leg Australian -> No "both feet"
    if (isOneLegNormal || legProgression === "straddle" || isOneLegAustralian) {
      if (bandPlacements.includes("both feet")) {
        next = bandPlacements.map((p) =>
          p === "both feet" ? ("one foot" as BandPlacement) : p,
        );
      }
    }

    // 2. Halflay logic
    if (!next) {
      const isPrimaryHalflay = (isOneLegNormal || isOneLegAustralian) && oneLegPrimaryPosition === "halflay";
      const isSecondaryHalflay = (isOneLegNormal || isOneLegAustralian) && oneLegSecondaryPosition === "halflay";
      const isFullHalflay = legProgression === "halflay";

      const isTargetLegHalflay = isFullHalflay || (legTarget === "primary" && isPrimaryHalflay) || (legTarget === "secondary" && isSecondaryHalflay);
      const isFloatingLegInAustralian = isOneLegAustralian && legTarget === "primary";

      if (isTargetLegHalflay && !isFloatingLegInAustralian) {
        if (bandPlacements.includes("both feet") || bandPlacements.includes("one foot")) {
          next = bandPlacements
            .filter((p) => p !== "both feet" && p !== "one foot")
            .concat(
              bandPlacements.some((p) => p === "both feet" || p === "one foot")
                ? ["knees" as BandPlacement]
                : [],
            );
        }
      }
    }

    // 3. Equipment restrictions
    if (!next) {
      const isEquipmentRestricted = ["pull-up bar", "rings", "stall bars"].includes(equipment);
      const isNotLSit = position === "neutral" || position === "hollow body" || position === "arch back"; 
      
      if (isEquipmentRestricted && isNotLSit && position !== "L-sit" && (bandPlacements.includes("buttocks") || bandPlacements.includes("waist"))) {
        const filtered = bandPlacements.filter((p) => p !== "buttocks" && p !== "waist");
        const fallback: BandPlacement = isOneLegNormal || legProgression === "straddle" ? "one foot" : "both feet";
        next = filtered.length === 0 ? [fallback] : filtered;
      }
    }

    if (next) {
      const uniqueNext = Array.from(new Set(next));
      // Only update if actually different to prevent loops
      if (JSON.stringify(uniqueNext) !== JSON.stringify(bandPlacements)) {
        isUpdatingRef.current = true;
        updateActiveAssistance("placement", uniqueNext);
        setTimeout(() => { isUpdatingRef.current = false; }, 50);
      }
    }
  }, [
    legProgression,
    isOneLeg,
    oneLegPrimaryPosition,
    oneLegSecondaryPosition,
    legTarget,
    equipment,
    position,
    bandPlacements,
    isAustralian,
    isOneLegAustralian,
    isOneLegNormal,
    updateActiveAssistance
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

  const addSets = useCallback(
    (count: number) => {
      const baseSet = activeSet || sets[sets.length - 1];
      const newSetsToAdd: WorkoutSet[] = [];
      let lastId = "";

      for (let i = 0; i < count; i++) {
        const newId = generateId();
        lastId = newId;
        newSetsToAdd.push({
          ...baseSet,
          id: newId,
          exerciseId: baseSet.exerciseId || exerciseId,
          notes: "", // Don't copy notes
          media: [], // Don't copy media
          mixedGripDetails: baseSet.mixedGripDetails ? { ...baseSet.mixedGripDetails } : undefined,
          assistanceDetails: baseSet.assistanceDetails
            ? {
                ...baseSet.assistanceDetails,
                placement: baseSet.assistanceDetails.placement
                  ? [
                      ...(Array.isArray(baseSet.assistanceDetails.placement)
                        ? baseSet.assistanceDetails.placement
                        : [baseSet.assistanceDetails.placement]),
                    ]
                  : undefined,
              }
            : undefined,
        });
      }

      setSets((prev) => {
        const next = [...prev];
        const insertIndex =
          activeSetIndex !== -1 ? activeSetIndex + 1 : prev.length;
        next.splice(insertIndex, 0, ...newSetsToAdd);
        return next;
      });
      setActiveSetId(lastId);
    },
    [sets, activeSet, activeSetIndex],
  );

  const addSet = useCallback(() => {
    addSets(1);
  }, [addSets]);

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
        <ExerciseSelector
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredExercises={filteredExercises}
          selectedExerciseId={activeSet?.exerciseId || exerciseId}
          onExerciseSelect={(id) => {
            if (activeSetId) {
              updateSet(safeActiveSetIndex, "exerciseId", id);
            } else {
              setExerciseId(id);
            }
          }}
        />

        {/* FRAGMENT GLOBAL MEDIA GALLERY */}
        <GlobalMediaGallery
          exerciseMedia={exerciseMedia}
          onUploadClick={() => exerciseFileInputRef.current?.click()}
          onFileUpload={(e) => handleFileUpload(e, undefined, "fragment")}
          fileInputRef={exerciseFileInputRef}
          onMediaClick={(media, idx) => handleMediaClick(media, idx)}
          onEditThumbnail={(m, midx) =>
            onEditThumbnailClick(m, midx, -1, "fragment")
          }
          onDelete={(mIdx) => {
            const newMedia = [...exerciseMedia];
            newMedia.splice(mIdx, 1);
            setExerciseMedia(newMedia);
          }}
        />

          <PerformanceBlock
            sets={sets}
            setSets={setSets}
            activeSetId={activeSetId}
            setActiveSetId={setActiveSetId}
            exerciseId={exerciseId}
            loadType={loadType}
            executionStyle={executionStyle}
            legProgression={legProgression}
            oneArmSide={oneArmSide}
            legTarget={legTarget}
            highlightedSetIndex={highlightedSetIndex || null}
            isHoldExercise={isHoldExercise}
            addSet={addSet}
            addSets={addSets}
            removeSet={removeSet}
            updateSet={updateSet}
            handleFileUpload={handleFileUpload}
            handleMediaClick={handleMediaClick}
            onEditThumbnailClick={onEditThumbnailClick}
            updateActiveAssistance={updateActiveAssistance}
            getSetGroupIndices={getSetGroupIndices}
            setsScrollRef={setsScrollRef}
            bulkInputRef={bulkInputRef}
            handleBulkApply={handleBulkApply}
            onNoteChange={(val, scope) => {
              if (scope === "series") {
                const idx = sets.findIndex((s) => s.id === activeSetId);
                if (idx !== -1) updateSet(idx, "notes", val);
              } else if (scope === "group") {
                const idx = sets.findIndex((s) => s.id === activeSetId);
                if (idx !== -1) {
                  const indices = getSetGroupIndices(idx);
                  setSets((prev) =>
                    prev.map((s, i) =>
                      indices.includes(i) ? { ...s, groupNotes: val } : s,
                    ),
                  );
                }
              } else {
                setNotes(val);
              }
            }}
          />

          <TaxonomySection
            equipment={equipment}
            setEquipment={setEquipment}
            availableEquipment={availableEquipment}
            executionStyle={executionStyle}
            setExecutionStyle={setExecutionStyle}
            availableExecutionStyles={availableExecutionStyles}
            handleStyleChange={handleStyleChange}
            grip={grip}
            setGrip={setGrip}
            gripWidth={gripWidth}
            setGripWidth={setGripWidth}
            executionMethod={executionMethod}
            setExecutionMethod={setExecutionMethod}
            position={position}
            setPosition={setPosition}
            legProgression={legProgression}
            setLegProgression={setLegProgression}
            oneArmHandPosition={oneArmHandPosition}
            setOneArmHandPosition={setOneArmHandPosition}
            oneArmSide={oneArmSide}
            setOneArmSide={setOneArmSide}
            isOneLeg={isOneLeg}
            setIsOneLeg={setIsOneLeg}
            oneLegPrimaryPosition={oneLegPrimaryPosition}
            setOneLegPrimaryPosition={setOneLegPrimaryPosition}
            oneLegSecondaryPosition={oneLegSecondaryPosition}
            setOneLegSecondaryPosition={setOneLegSecondaryPosition}
            thumb={thumb}
            setThumb={setThumb}
            falseGrip={falseGrip}
            setFalseGrip={setFalseGrip}
            mixedGripLeft={mixedGripLeft}
            setMixedGripLeft={setMixedGripLeft}
            mixedGripRight={mixedGripRight}
            setMixedGripRight={setMixedGripRight}
            mixedGripIsAlternating={mixedGripIsAlternating}
            setMixedGripIsAlternating={setMixedGripIsAlternating}
            dipBarFootSupport={dipBarFootSupport}
            updateActiveValue={updateActiveValue}
            updateSet={updateSet}
            activeSetId={activeSetId}
            activeSet={activeSet}
            safeActiveSetIndex={safeActiveSetIndex}
          />

          <LoadConfigSection
            loadType={loadType}
            setLoadTypeAndClean={setLoadTypeAndClean}
            equipment={equipment}
            executionStyle={executionStyle}
            dipBarFootSupport={dipBarFootSupport}
            updateActiveAssistance={updateActiveAssistance}
            weightUnit={weightUnit}
            assistanceValue={assistanceValue}
            bandLoopType={bandLoopType}
            bandPlacements={bandPlacements}
            toggleBandPlacement={toggleBandPlacement}
            legProgression={legProgression}
            isOneLeg={isOneLeg}
            oneLegPrimaryPosition={oneLegPrimaryPosition}
            oneLegSecondaryPosition={oneLegSecondaryPosition}
            legTarget={legTarget}
            position={position}
          />

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

        <GlobalInsightsSection notes={notes} setNotes={setNotes} />

        <LogisticsSection
          shared={shared}
          setShared={setShared}
          onDelete={onDelete}
          initialData={initialData}
        />
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
                      SELECT THUMBNAIL
                    </h3>
                    <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mt-1">
                      Play the video and save the current frame as the thumbnail
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
                    SCAN CURRENT FRAME
                  </button>
                  <p className="text-center text-[9px] font-black text-slate-500 uppercase tracking-widest italic opacity-60">
                    Pause the video at the moment you want to use as the thumbnail
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
