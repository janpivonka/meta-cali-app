import React from 'react';
import { Share2 } from 'lucide-react';
import { Workout, ExerciseMedia } from '../../types';
import { HistoryExerciseLog } from './HistoryExerciseLog';

interface HistoryWorkoutCardProps {
  workout: Workout;
  onMediaClick: (media: ExerciseMedia[], index: number) => void;
}

export const HistoryWorkoutCard: React.FC<HistoryWorkoutCardProps> = React.memo(({ workout, onMediaClick }) => {
  const workoutDate = new Date(workout.timestamp).toLocaleString();
  const exerciseCount = (workout.exercises || []).length;
  const setCount = (workout.exercises || []).reduce((acc, ex) => acc + (ex.sets || []).length, 0);

  return (
    <div className="glass-card p-0 border-white/5 bg-white/5 group hover:border-cyan-500/20 transition-all overflow-hidden rounded-[32px]">
      <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-black font-black italic">W</div>
          <div>
            <p className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-[0.25em]">{workoutDate}</p>
            <p className="text-xs font-black text-white uppercase tracking-widest mt-0.5">
              {exerciseCount} EXERCISES • {setCount} SETS
            </p>
          </div>
        </div>
        <Share2 size={16} className="text-slate-500 hover:text-cyan-400 cursor-pointer transition-colors" />
      </div>
      <div className="p-6 space-y-6">
        {(workout.exercises || []).map((log) => (
          <HistoryExerciseLog 
            key={log.id} 
            log={log} 
            onMediaClick={onMediaClick} 
          />
        ))}
      </div>
    </div>
  );
});

HistoryWorkoutCard.displayName = 'HistoryWorkoutCard';
