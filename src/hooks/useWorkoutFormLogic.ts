import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
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
  LegProgression,
  SingleLegPosition,
  LoadType,
  ExerciseMedia,
  ExerciseDefinition,
} from "../types";
import {
  isHoldExercise,
  getSetMetadata,
} from "../lib/utils";
import { EXERCISE_LIBRARY } from "../data/exerciseLibrary";
import { generateId, processFile } from "./workout-form/utils";

export const useWorkoutFormLogic = (
  onSave: (log: ExerciseLog) => void,
  initialExerciseId?: string | null,
  initialData?: ExerciseLog | null,
  highlightedSetIndex?: number | null,
) => {
  const [exerciseId, setExerciseId] = useState<string>(
    initialData?.exerciseId || initialExerciseId || EXERCISE_LIBRARY[0].id,
  );

  const [grip, setGrip] = useState<GripType>("pronated");
  const [gripWidth, setGripWidth] = useState<GripWidth>("shoulder-width");
  const [thumb, setThumb] = useState<ThumbPosition>("under");
  const [equipment, setEquipment] = useState<EquipmentType>("pull-up bar");
  const [executionStyle, setExecutionStyle] = useState<ExecutionStyle | string>("basic");
  const [executionMethod, setExecutionMethod] = useState<ExecutionMethod | string>("standard");
  const [oneArmHandPosition, setOneArmHandPosition] = useState<OneArmHandPosition | string>("free");
  const [oneArmSide, setOneArmSide] = useState<"left" | "right" | "alternating">("right");
  const [oneLegPrimaryPosition, setOneLegPrimaryPosition] = useState<SingleLegPosition>("full");
  const [oneLegSecondaryPosition, setOneLegSecondaryPosition] = useState<SingleLegPosition>("tuck");
  const [isOneLeg, setIsOneLeg] = useState(false);
  const [position, setPosition] = useState<BodyPosition | string>("neutral");
  const [legProgression, setLegProgression] = useState<LegProgression | string>("full");
  const [loadType, setLoadType] = useState<LoadType>("bodyweight");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [assistanceValue, setAssistanceValue] = useState("");
  const [mixedGripLeft, setMixedGripLeft] = useState<"pronated" | "supinated" | "neutral" | "alternating">("supinated");
  const [mixedGripRight, setMixedGripRight] = useState<"pronated" | "supinated" | "neutral" | "alternating">("pronated");
  const [mixedGripIsAlternating, setMixedGripIsAlternating] = useState(false);
  const [bandPlacements, setBandPlacements] = useState<BandPlacement[]>(["both feet"]);
  const [bandLoopType, setBandLoopType] = useState<BandLoopType>("single");
  const [legTarget, setLegTarget] = useState<"primary" | "secondary" | "alternating">("primary");
  const [falseGrip, setFalseGrip] = useState(false);
  const [dipBarFootSupport, setDipBarFootSupport] = useState(false);
  const [notes, setNotes] = useState("");
  const [shared, setShared] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<ExerciseMedia[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingThumbnail, setEditingThumbnail] = useState<any>(null);

  const updateSet = useCallback((index: number, field: keyof WorkoutSet, value: any) => {
    setSets(prev => {
      if (index < 0 || index >= prev.length) return prev;
      const newSets = [...prev];
      newSets[index] = { ...newSets[index], [field]: value };
      if (field === "weight") {
        if (value > 0) { newSets[index].loadType = "weighted"; newSets[index].assistanceDetails = undefined; }
        else if (!newSets[index].assistanceDetails?.resistance) newSets[index].loadType = "bodyweight";
      } else if (field === "assistanceDetails") {
        if (value?.resistance) { newSets[index].loadType = "assisted"; newSets[index].weight = 0; }
        else if (!newSets[index].weight || newSets[index].weight === 0) newSets[index].loadType = "bodyweight";
      }
      return newSets;
    });
  }, []);

  const [sets, setSets] = useState<WorkoutSet[]>(() => {
    if (initialData) return initialData.sets;
    return [{
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
    }];
  });

  const [activeSetId, setActiveSetId] = useState<string | null>(() => {
    if (initialData) {
      if (highlightedSetIndex !== null && highlightedSetIndex !== undefined && initialData.sets[highlightedSetIndex]) {
        return initialData.sets[highlightedSetIndex].id;
      }
      return initialData.sets[initialData.sets.length - 1]?.id || null;
    }
    return null;
  });

  const [exerciseMedia, setExerciseMedia] = useState<ExerciseMedia[]>(initialData?.media || []);

  const filteredExercises = useMemo(() => {
    return EXERCISE_LIBRARY.filter(ex => 
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const availableExecutionStyles = useMemo(() => ["basic", "one arm", "archer", "typewriter", "commando", "high", "korean"], []);
  const availableEquipment = useMemo(() => ["pull-up bar", "low bar", "dip bars", "rings", "floor", "parallelettes", "stall bars"], []);

  const handleStyleChange = useCallback((style: ExecutionStyle | string) => {
    setExecutionStyle(style);
    const activeIdx = sets.findIndex(s => s.id === activeSetId);
    if (activeIdx !== -1) updateSet(activeIdx, "executionStyle", style);
  }, [activeSetId, sets, updateSet]);

  const updateActiveValue = useCallback((field: string, setter: (val: any) => void, val: any) => {
    setter(val);
    const activeIdx = sets.findIndex(s => s.id === activeSetId);
    if (activeIdx !== -1) updateSet(activeIdx, field as keyof WorkoutSet, val);
  }, [activeSetId, sets, updateSet]);

  const getSetGroupIndices = useCallback((idx: number) => {
    const targetSet = sets[idx];
    if (!targetSet) return [idx];
    const targetMeta = getSetMetadata(targetSet, { exerciseId, loadType, executionStyle, legProgression });
    const targetKey = JSON.stringify(targetMeta);
    return sets.map((s, i) => {
      const m = getSetMetadata(s, { exerciseId, loadType, executionStyle, legProgression });
      return JSON.stringify(m) === targetKey ? i : -1;
    }).filter(i => i !== -1);
  }, [sets, exerciseId, loadType, executionStyle, legProgression]);

  const updateActiveAssistance = useCallback((field: string, val: any) => {
    if (field === "resistance") setAssistanceValue(val.toString());
    if (field === "loopType") setBandLoopType(val);
    if (field === "placement") setBandPlacements(val);
    if (field === "legTarget") setLegTarget(val);
    const activeIdx = sets.findIndex(s => s.id === activeSetId);
    if (activeIdx !== -1) {
       const current = sets[activeIdx].assistanceDetails || { resistance: "", loopType: "single", placement: ["both feet"], legTarget: "primary" };
       updateSet(activeIdx, "assistanceDetails", { ...current, [field]: val });
    }
  }, [activeSetId, sets, updateSet]);

  const handleMediaClick = useCallback((media: ExerciseMedia[], index: number) => {
    setPreviewMedia(media);
    setPreviewIndex(index);
    setIsPreviewOpen(true);
  }, []);

  const handleThumbnailFromPreview = useCallback((media: ExerciseMedia, thumbnail: string) => {
    setExerciseMedia(prev => prev.map(m => m.url === media.url ? { ...m, thumbnail } : m));
    setSets(prev => prev.map(s => {
      if (!s.media) return s;
      return { ...s, media: s.media.map(m => m.url === media.url ? { ...m, thumbnail } : m) };
    }));
    setIsPreviewOpen(false);
  }, []);

  const handleBulkApply = useCallback((val: string) => {
    const vals = val.split(/[,;\s]+/).map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    if (vals.length > 0) {
      const baseSet = sets.find(s => s.id === activeSetId) || sets[sets.length - 1];
      const newSetsToAdd = vals.map(v => ({
        ...(baseSet || {}),
        id: generateId(),
        [isHoldExercise(exerciseId) ? "time" : "reps"]: v,
        notes: "",
        media: [],
        loadType: baseSet?.loadType || loadType,
      }));
      setSets(prev => {
        const next = [...prev];
        const activeIdx = prev.findIndex(s => s.id === activeSetId);
        const insertIndex = activeIdx !== -1 ? activeIdx + 1 : prev.length;
        next.splice(insertIndex, 0, ...newSetsToAdd as any);
        return next;
      });
      setActiveSetId(newSetsToAdd[newSetsToAdd.length - 1].id);
    }
  }, [sets, activeSetId, exerciseId, loadType]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, setIndex?: number, scope: "series" | "group" | "fragment" = "fragment") => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;
    const placeholders: ExerciseMedia[] = files.map(file => ({
      type: file.type.startsWith("video") ? "video" : "image",
      url: URL.createObjectURL(file), // Temporary
      isProcessing: true,
      id: Math.random().toString(36).substring(2, 11),
    }));

    if (scope === "group" && setIndex !== undefined) {
      const groupIndices = getSetGroupIndices(setIndex);
      setSets(prev => prev.map((s, i) => groupIndices.includes(i) ? { ...s, groupMedia: [...(s.groupMedia || []), ...placeholders] } : s));
    } else if (scope === "series" && setIndex !== undefined) {
      setSets(prev => prev.map((s, i) => i === setIndex ? { ...s, media: [...(s.media || []), ...placeholders] } : s));
    } else {
      setExerciseMedia(prev => [...prev, ...placeholders]);
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const placeholderId = placeholders[i].id;
        const processed = await processFile(file);
        if (processed) {
          const finalMedia = { ...processed, id: placeholderId };
          if (scope === "group" && setIndex !== undefined) {
            const groupIndices = getSetGroupIndices(setIndex);
            setSets(prev => prev.map((s, idx) => groupIndices.includes(idx) ? { ...s, groupMedia: (s.groupMedia || []).map(m => m.id === placeholderId ? finalMedia : m) } : s));
          } else if (scope === "series" && setIndex !== undefined) {
            setSets(prev => prev.map((s, idx) => idx === setIndex ? { ...s, media: (s.media || []).map(m => m.id === placeholderId ? finalMedia : m) } : s));
          } else {
            setExerciseMedia(prev => prev.map(m => m.id === placeholderId ? finalMedia : m));
          }
        }
    }
  }, [getSetGroupIndices]);

  const addSet = useCallback(() => {
    const baseSet = sets[sets.length - 1] || sets[0];
    const newSet: WorkoutSet = {
      ...baseSet,
      id: generateId(),
      notes: "",
      media: [],
    };
    setSets(prev => [...prev, newSet]);
    setActiveSetId(newSet.id);
  }, [sets]);

  const addSets = useCallback((count: number) => {
    const baseSet = sets[sets.length - 1] || sets[0];
    const newSets = Array.from({ length: count }, () => ({
      ...baseSet,
      id: generateId(),
      notes: "",
      media: [],
    }));
    setSets(prev => [...prev, ...newSets as any]);
    setActiveSetId(newSets[newSets.length - 1].id);
  }, [sets]);

  const removeSet = useCallback((index: number) => {
    setSets(prev => {
      if (prev.length <= 1) return prev;
      const newSets = prev.filter((_, i) => i !== index);
      if (activeSetId === prev[index].id) {
        setActiveSetId(newSets[Math.max(0, index - 1)].id);
      }
      return newSets;
    });
  }, [activeSetId]);

  const onNoteChange = useCallback((val: string, scope: "series" | "group" | "fragment") => {
    if (scope === "fragment") setNotes(val);
    else if (scope === "group") {
      const activeIdx = sets.findIndex(s => s.id === activeSetId);
      if (activeIdx !== -1) {
        const groupIndices = getSetGroupIndices(activeIdx);
        setSets(prev => prev.map((s, i) => groupIndices.includes(i) ? { ...s, groupNotes: val } : s));
      }
    } else if (scope === "series") {
      const activeIdx = sets.findIndex(s => s.id === activeSetId);
      if (activeIdx !== -1) updateSet(activeIdx, "notes", val);
    }
  }, [activeSetId, sets, getSetGroupIndices, updateSet]);

  const onEditThumbnailClick = useCallback((media: ExerciseMedia, mIdx: number, setIdx: number, type: "set" | "group" | "fragment" = "fragment") => {
    setEditingThumbnail({ media, mIdx, setIdx, type });
  }, []);

  const setLoadTypeAndClean = useCallback((lt: LoadType) => {
    setLoadType(lt);
    const activeIdx = sets.findIndex(s => s.id === activeSetId);
    if (activeIdx !== -1) {
      const updated = { ...sets[activeIdx], loadType: lt };
      if (lt === "bodyweight") {
        updated.weight = 0;
        updated.assistanceDetails = undefined;
      }
      updateSet(activeIdx, "loadType" as any, lt);
    }
  }, [activeSetId, sets, updateSet]);

  const toggleBandPlacement = useCallback((p: BandPlacement) => {
    setBandPlacements(prev => {
      const next = prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p];
      updateActiveAssistance("placement", next);
      return next;
    });
  }, [updateActiveAssistance]);

  const onExerciseMediaDelete = useCallback((index: number) => {
    setExerciseMedia(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = () => {
    const log: ExerciseLog = {
      id: initialData?.id || Math.random().toString(36).substring(2, 15),
      exerciseId,
      type: EXERCISE_LIBRARY.find(e => e.id === exerciseId)?.name || "Exercise",
      sets: sets.map(s => ({...s, notes: s.notes || notes})),
      timestamp: initialData?.timestamp || Date.now(),
      notes,
      media: exerciseMedia,
      loadType: initialData?.loadType || loadType
    };
    onSave(log);
  };

  return {
    exerciseId, setExerciseId,
    grip, setGrip,
    gripWidth, setGripWidth,
    thumb, setThumb,
    equipment, setEquipment,
    executionStyle, setExecutionStyle,
    executionMethod, setExecutionMethod,
    oneArmHandPosition, setOneArmHandPosition,
    oneArmSide, setOneArmSide,
    oneLegPrimaryPosition, setOneLegPrimaryPosition,
    oneLegSecondaryPosition, setOneLegSecondaryPosition,
    isOneLeg, setIsOneLeg,
    position, setPosition,
    legProgression, setLegProgression,
    loadType, setLoadType,
    weightUnit, setWeightUnit,
    assistanceValue, setAssistanceValue,
    mixedGripLeft, setMixedGripLeft,
    mixedGripRight, setMixedGripRight,
    mixedGripIsAlternating, setMixedGripIsAlternating,
    bandPlacements, setBandPlacements,
    bandLoopType, setBandLoopType,
    legTarget, setLegTarget,
    falseGrip, setFalseGrip,
    dipBarFootSupport, setDipBarFootSupport,
    sets, setSets,
    notes, setNotes,
    searchQuery, setSearchQuery,
    shared, setShared,
    activeSetId, setActiveSetId,
    exerciseMedia, setExerciseMedia,
    isPreviewOpen, setIsPreviewOpen,
    previewMedia, setPreviewMedia,
    previewIndex, setPreviewIndex,
    editingThumbnail, setEditingThumbnail,
    getSetGroupIndices,
    updateSet,
    updateActiveAssistance,
    handleMediaClick,
    handleThumbnailFromPreview,
    handleBulkApply,
    handleFileUpload,
    handleSave,
    filteredExercises,
    availableExecutionStyles,
    availableEquipment,
    handleStyleChange,
    updateActiveValue,
    addSet,
    addSets,
    removeSet,
    onNoteChange,
    isHoldExercise,
    onEditThumbnailClick,
    setLoadTypeAndClean,
    toggleBandPlacement,
    onExerciseMediaDelete,
  };
};

export const useWorkoutFormSync = (
  activeSetId: string | null,
  activeSet: WorkoutSet | undefined,
  setGrip: (v: GripType) => void,
  setGripWidth: (v: GripWidth) => void,
  setThumb: (v: ThumbPosition) => void,
  setFalseGrip: (v: boolean) => void,
  setEquipment: (v: EquipmentType) => void,
  setExecutionStyle: (v: string) => void,
  setExecutionMethod: (v: string) => void,
  setPosition: (v: string) => void,
  setLegProgression: (v: string) => void,
  setOneArmHandPosition: (v: string) => void,
  setOneArmSide: (v: "left" | "right" | "alternating") => void,
  setOneLegPrimaryPosition: (v: SingleLegPosition) => void,
  setOneLegSecondaryPosition: (v: SingleLegPosition) => void,
  setIsOneLeg: (v: boolean) => void,
  setLoadType: (v: LoadType) => void,
  setWeightUnit: (v: "kg" | "lbs") => void,
  setMixedGripLeft: (v: any) => void,
  setMixedGripRight: (v: any) => void,
  setMixedGripIsAlternating: (v: boolean) => void,
  setBandPlacements: (v: BandPlacement[]) => void,
  setBandLoopType: (v: BandLoopType) => void,
  setAssistanceValue: (v: string) => void,
  setLegTarget: (v: "primary" | "secondary" | "alternating") => void,
  setDipBarFootSupport: (v: boolean) => void,
) => {
  useEffect(() => {
    if (!activeSetId || !activeSet) return;
    setGrip(activeSet.grip || "pronated");
    setGripWidth(activeSet.gripWidth || "shoulder-width");
    setThumb(activeSet.thumb || "under");
    setFalseGrip(activeSet.falseGrip ?? false);
    setEquipment(activeSet.equipment || "pull-up bar");
    setExecutionStyle(activeSet.executionStyle || "basic");
    setExecutionMethod(activeSet.executionMethod || "standard");
    setPosition(activeSet.position || "neutral");
    setLegProgression(activeSet.legProgression || "full");
    setOneArmHandPosition(activeSet.oneArmHandPosition || "free");
    setOneArmSide(activeSet.oneArmSide || "right");
    setOneLegPrimaryPosition(activeSet.oneLegPrimaryPosition || "full");
    setOneLegSecondaryPosition(activeSet.oneLegSecondaryPosition || "tuck");
    setIsOneLeg(activeSet.isOneLeg ?? false);

    const loadType = activeSet.loadType || (activeSet.assistanceDetails?.resistance ? "assisted" : (activeSet.weight && activeSet.weight > 0 ? "weighted" : "bodyweight"));
    setLoadType(loadType);
    setWeightUnit(activeSet.weightUnit || "kg");
    setMixedGripLeft(activeSet.mixedGripDetails?.left || "supinated");
    setMixedGripRight(activeSet.mixedGripDetails?.right || "pronated");
    setMixedGripIsAlternating(activeSet.mixedGripDetails?.isAlternating || false);

    if (activeSet.assistanceDetails) {
      setBandPlacements((activeSet.assistanceDetails.placement as BandPlacement[]) || ["both feet"]);
      setBandLoopType(activeSet.assistanceDetails.loopType || "single");
      setAssistanceValue(activeSet.assistanceDetails.resistance?.toString() || "");
      setLegTarget(activeSet.assistanceDetails.legTarget || "primary");
      setDipBarFootSupport(activeSet.assistanceDetails.dipBarFootSupport || false);
    } else {
      setAssistanceValue(activeSet.weight?.toString() || "");
      setBandPlacements(["both feet"]);
      setBandLoopType("single");
      setLegTarget("primary");
      setDipBarFootSupport(false);
    }
  }, [activeSetId]);
};


