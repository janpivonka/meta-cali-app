import React from "react";
import { PlusCircle, Search } from "lucide-react";
import { WorkoutSet, ExerciseLog, ExerciseDefinition } from "../../types";
import { ExerciseSelector } from "./ExerciseSelector";
import { GlobalMediaGallery } from "./GlobalMediaGallery";
import { PerformanceBlock } from "./PerformanceBlock";
import { TaxonomySection } from "./TaxonomySection";
import { LoadConfigSection } from "./LoadConfigSection";
import { GlobalInsightsSection } from "./GlobalInsightsSection";
import { LogisticsSection } from "./LogisticsSection";
import { cn } from "../../lib/utils";

interface WorkoutFormLayoutProps {
  exerciseId: string;
  setExerciseId: (v: string) => void;
  filteredExercises: ExerciseDefinition[];
  sets: WorkoutSet[];
  setSets: (v: any) => void;
  activeSetId: string | null;
  setActiveSetId: (v: string | null) => void;
  exerciseMedia: any[];
  notes: string;
  setNotes: (v: string) => void;
  loadType: any;
  grip: any;
  gripWidth: any;
  thumb: any;
  falseGrip: any;
  equipment: any;
  setEquipment: (v: any) => void;
  availableEquipment: string[];
  executionStyle: any;
  setExecutionStyle: (v: any) => void;
  availableExecutionStyles: string[];
  handleStyleChange: (style: any) => void;
  executionMethod: any;
  setExecutionMethod: (v: any) => void;
  position: any;
  setPosition: (v: any) => void;
  legProgression: any;
  setLegProgression: (v: any) => void;
  isOneLeg: any;
  setIsOneLeg: (v: any) => void;
  oneLegPrimaryPosition: any;
  setOneLegPrimaryPosition: (v: any) => void;
  oneLegSecondaryPosition: any;
  setOneLegSecondaryPosition: (v: any) => void;
  oneArmHandPosition: any;
  setOneArmHandPosition: (v: any) => void;
  oneArmSide: any;
  setOneArmSide: (v: any) => void;
  mixedGripLeft: any;
  setMixedGripLeft: (v: any) => void;
  mixedGripRight: any;
  setMixedGripRight: (v: any) => void;
  mixedGripIsAlternating: any;
  setMixedGripIsAlternating: (v: any) => void;
  assistanceValue: any;
  bandPlacements: any;
  bandLoopType: any;
  legTarget: any;
  dipBarFootSupport: any;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  handleFileUpload: any;
  handleMediaClick: any;
  handleBulkApply: any;
  handleSave: any;
  onDelete?: () => void;
  updateSet: any;
  updateActiveValue: any;
  updateActiveAssistance: any;
  setLoadTypeAndClean: any;
  toggleBandPlacement: any;
  onExerciseMediaDelete: any;
  setsScrollRef: any;
  bulkInputRef: any;
  exerciseFileInputRef: any;
  isHoldExercise: (id: string) => boolean;
  getSetGroupIndices: (idx: number) => number[];
  onNoteChange: (val: string, scope: "series" | "group" | "fragment") => void;
  onEditThumbnailClick: any;
  addSet: any;
  addSets: any;
  removeSet: any;
  highlightedSetIndex: number | null;
  shared: boolean;
  setShared: (val: boolean) => void;
  initialData: ExerciseLog | null | undefined;
}

export const WorkoutFormLayout: React.FC<WorkoutFormLayoutProps> = (props) => {
  const {
    exerciseId, sets, activeSetId, setActiveSetId, exerciseMedia, notes, setNotes,
    handleFileUpload, handleMediaClick, handleBulkApply, handleSave, onDelete,
    setsScrollRef, bulkInputRef, exerciseFileInputRef, filteredExercises,
    onExerciseMediaDelete, onEditThumbnailClick
  } = props;

  const activeSet = sets.find(s => s.id === activeSetId);
  const safeActiveSetIndex = sets.findIndex(s => s.id === activeSetId);

  const onUploadClick = () => exerciseFileInputRef.current?.click();

  return (
    <div className="glass-card p-6 md:p-10 border-white/5 bg-white/[0.03] rounded-[40px] shadow-2xl relative overflow-hidden group/form">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-sm font-black text-white/20 uppercase tracking-[0.4em] mb-1 italic">Fragment Capture</h2>
          <h1 className="text-3xl font-black text-white tracking-widest uppercase italic">Exercise Log</h1>
        </div>
        <div className="flex gap-4">
          {onDelete && (
            <button onClick={onDelete} className="px-6 py-3 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
              DELETE EXERCISE
            </button>
          )}
          <button onClick={handleSave} className="flex-1 md:flex-none px-10 py-3 bg-cyan-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cyan-500/10 transition-all hover:scale-105 active:scale-95">
            CONFIRM PERFORMANCE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-10">
          <ExerciseSelector 
            selectedExerciseId={exerciseId} 
            onExerciseSelect={props.setExerciseId}
            searchQuery={props.searchQuery}
            setSearchQuery={props.setSearchQuery}
            filteredExercises={filteredExercises}
          />
          <GlobalMediaGallery 
            exerciseMedia={exerciseMedia}
            onUploadClick={onUploadClick}
            onFileUpload={(e) => handleFileUpload(e)}
            onMediaClick={handleMediaClick}
            fileInputRef={exerciseFileInputRef}
            onEditThumbnail={(m, idx) => onEditThumbnailClick(m, idx, -1, "fragment")}
            onDelete={onExerciseMediaDelete}
          />
        </div>

        <div className="lg:col-span-8 space-y-12">
          <PerformanceBlock {...props} />
          <TaxonomySection 
            {...props} 
            activeSet={activeSet}
            safeActiveSetIndex={safeActiveSetIndex}
            oneArmSide={props.oneArmSide}
            setOneArmSide={props.setOneArmSide}
          />
          <LoadConfigSection 
            {...props}
            setLoadTypeAndClean={props.setLoadTypeAndClean}
            toggleBandPlacement={props.toggleBandPlacement}
          />
          <GlobalInsightsSection notes={notes} setNotes={setNotes} />
          <LogisticsSection 
            shared={props.shared} 
            setShared={props.setShared} 
            onDelete={onDelete} 
            initialData={props.initialData}
          />
        </div>
      </div>
    </div>
  );
};
