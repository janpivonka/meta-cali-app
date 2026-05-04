import React, { useRef } from 'react';
import { Reorder } from 'framer-motion';
import { ExerciseReorderItem } from '../workout-builder/ExerciseReorderItem';
import { WorkoutForm } from '../WorkoutForm';
import { Workout, ExerciseLog, ExerciseMedia } from '../../types';

interface OperationLogProps {
  currentWorkout: Workout | null;
  editingIndex: number | null;
  editingSetIndex: number | null;
  preSelectedExerciseId: string | null;
  handleCancelWorkout: () => void;
  handleSaveWorkout: () => void;
  handleReorderExercises: (val: ExerciseLog[]) => void;
  handleEditExercise: (idx: number) => void;
  handleEditSet: (exIdx: number, setIdx: number, e: React.MouseEvent) => void;
  handleReorderSets: (id: string, sets: any[]) => void;
  handleMediaClick: (m: ExerciseMedia[], i: number) => void;
  handleAddExerciseToWorkout: (log: ExerciseLog) => void;
  handleRemoveExerciseFromWorkout: (idx: number) => void;
  setEditingIndex: (idx: number | null) => void;
  setEditingSetIndex: (idx: number | null) => void;
  setPreSelectedExerciseId: (id: string | null) => void;
}

export const OperationLog: React.FC<OperationLogProps> = ({
  currentWorkout,
  editingIndex,
  editingSetIndex,
  preSelectedExerciseId,
  handleCancelWorkout,
  handleSaveWorkout,
  handleReorderExercises,
  handleEditExercise,
  handleEditSet,
  handleReorderSets,
  handleMediaClick,
  handleAddExerciseToWorkout,
  handleRemoveExerciseFromWorkout,
  setEditingIndex,
  setEditingSetIndex,
  setPreSelectedExerciseId
}) => {
  const builderRef = useRef<HTMLDivElement>(null);
  const isEditing = editingIndex !== null;
  const currentEditingData = isEditing && currentWorkout ? currentWorkout.exercises[editingIndex] : null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {currentWorkout && Array.isArray(currentWorkout.exercises) && currentWorkout.exercises.length > 0 && (
        <div ref={builderRef} className="glass-card p-6 border-cyan-500/20 bg-cyan-500/5 rounded-[40px] mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-6">
            <div>
              <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">Mission Builder</h3>
              <p className="text-sm font-black text-white italic mt-1 tracking-tight">Currently in progress: {currentWorkout.exercises.length} exercises</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button onClick={handleCancelWorkout} className="flex-1 sm:flex-none px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all transform active:scale-95 shadow-lg shadow-red-500/5 group/cancel relative overflow-hidden">
                <span className="relative z-10">Cancel All</span>
                <div className="absolute inset-0 bg-red-500 translate-y-full group-hover/cancel:translate-y-0 transition-transform duration-300" />
              </button>
              {!isEditing && (
                <button onClick={handleSaveWorkout} className="flex-2 sm:flex-none px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all">
                  Finalize & Save
                </button>
              )}
            </div>
          </div>
          
          <Reorder.Group axis="y" values={currentWorkout.exercises || []} onReorder={handleReorderExercises} className="space-y-3">
            {(currentWorkout.exercises || []).map((ex, i) => (
              <ExerciseReorderItem
                key={ex.id}
                ex={ex}
                i={i}
                editingIndex={editingIndex}
                editingSetIndex={editingSetIndex}
                handleEditExercise={handleEditExercise}
                handleEditSet={handleEditSet}
                handleReorderSets={handleReorderSets}
                onMediaClick={handleMediaClick}
              />
            ))}
          </Reorder.Group>
        </div>
      )}

      <div className="relative">
         {isEditing && (
           <div className="absolute -top-12 left-0 right-0 flex justify-center">
              <button onClick={() => setEditingIndex(null)} className="bg-white text-black px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">
                + Add new block instead of editing
              </button>
           </div>
         )}
         <WorkoutForm 
           key={editingIndex !== null ? `edit-${editingIndex}` : `new-${preSelectedExerciseId}`}
           onSave={(log) => {
             handleAddExerciseToWorkout(log);
             setPreSelectedExerciseId(null);
             setEditingSetIndex(null);
           }} 
           onDelete={isEditing ? () => handleRemoveExerciseFromWorkout(editingIndex!) : undefined}
           initialExerciseId={preSelectedExerciseId}
           initialData={currentEditingData}
           highlightedSetIndex={editingSetIndex}
         />
      </div>
    </div>
  );
};
