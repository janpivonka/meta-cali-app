import React, { useMemo } from 'react';
import { Workout, ExerciseMedia } from '../../types';
import { HistoryWorkoutCard } from './HistoryWorkoutCard';

interface HistoryProps {
  workouts: Workout[];
  onMediaClick: (media: ExerciseMedia[], index: number) => void;
}

export const History: React.FC<HistoryProps> = ({ workouts, onMediaClick }) => {
  const reversedWorkouts = useMemo(() => [...workouts].reverse(), [workouts]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Operation History</h2>
      <div className="grid gap-4">
        {reversedWorkouts.length > 0 ? (
          reversedWorkouts.map((workout) => (
            <HistoryWorkoutCard 
              key={workout.id} 
              workout={workout} 
              onMediaClick={onMediaClick} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
            <p className="text-slate-500 font-black uppercase tracking-widest italic">System archive is empty</p>
          </div>
        )}
      </div>
    </div>
  );
};
