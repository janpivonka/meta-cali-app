import React, { useState } from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import { ExerciseType, WorkoutSet, ExerciseLog } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface WorkoutFormProps {
  onSave: (log: ExerciseLog) => void;
}

export const WorkoutForm: React.FC<WorkoutFormProps> = ({ onSave }) => {
  const [type, setType] = useState<ExerciseType>('Shyby');
  const [customExercise, setCustomExercise] = useState('');
  const [sets, setSets] = useState<WorkoutSet[]>([{ reps: 0 }]);

  const predefinedExercises: ExerciseType[] = [
    'Shyby', 'Kliky', 'Dipy', 'Dřepy', 'Výpady', 'Plank', 'Muscle-ups', 'Přednosy', 'Angličáky'
  ];

  const addSet = () => setSets([...sets, { reps: 0 }]);
  const removeSet = (index: number) => setSets(sets.filter((_, i) => i !== index));
  const updateReps = (index: number, reps: number) => {
    const newSets = [...sets];
    newSets[index].reps = Math.max(0, reps);
    setSets(newSets);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sets.every(s => s.reps === 0)) return;

    const finalType = type === 'Vlastní' ? customExercise : type;
    if (!finalType) return;

    onSave({
      id: crypto.randomUUID(),
      type: finalType,
      sets: sets.filter(s => s.reps > 0),
      timestamp: Date.now(),
    });

    setSets([{ reps: 0 }]);
    setCustomExercise('');
  };

  return (
    <div id="workout-form-container" className="glass-card p-6">
      <h2 className="text-xl font-bold text-white mb-6">Zapsat nový trénink</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-xs uppercase tracking-widest text-[#94a3b8] font-bold mb-3 block">Vyberte cvik</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {predefinedExercises.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setType(ex)}
                className={cn(
                  "px-3 py-2 rounded-lg border text-xs transition-all",
                  type === ex 
                    ? "bg-cyan-500 border-cyan-400 text-black font-bold shadow-lg shadow-cyan-500/20" 
                    : "bg-white/5 border-white/10 text-[#94a3b8] hover:border-white/20"
                )}
              >
                {ex}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setType('Vlastní')}
              className={cn(
                "px-3 py-2 rounded-lg border text-xs transition-all",
                type === 'Vlastní' 
                  ? "bg-purple-500 border-purple-400 text-black font-bold shadow-lg shadow-purple-500/20" 
                  : "bg-white/5 border-white/10 text-[#94a3b8] hover:border-white/20"
              )}
            >
              Vlastní...
            </button>
          </div>
        </div>

        {type === 'Vlastní' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            <label className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-2 block">Název vlastního cviku</label>
            <input
              type="text"
              value={customExercise}
              onChange={(e) => setCustomExercise(e.target.value)}
              className="w-full bg-black/20 border border-purple-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/40 transition-colors"
              placeholder="Např. Handstand Pushups"
              required
            />
          </motion.div>
        )}

        <div>
          <label className="text-xs uppercase tracking-widest text-[#94a3b8] font-bold mb-3 block">Série</label>
          <div className="space-y-3">
            {sets.map((set, index) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                key={index} 
                className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white border border-white/10">
                  {index + 1}
                </div>
                <div className="flex-1 flex items-center justify-center gap-4">
                  <button 
                    type="button"
                    onClick={() => updateReps(index, set.reps - 1)}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => updateReps(index, parseInt(e.target.value) || 0)}
                    className="bg-transparent text-2xl font-bold text-white w-16 text-center focus:outline-none"
                  />
                  <button
                    type="button" 
                    onClick={() => updateReps(index, set.reps + 1)}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeSet(index)}
                  className="text-slate-600 hover:text-red-400 p-1"
                >
                  <Minus size={14} />
                </button>
              </motion.div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSet}
            className="mt-4 w-full py-2 border border-dashed border-white/10 rounded-xl text-slate-500 hover:text-slate-300 hover:border-white/30 transition-all text-xs flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Přidat sérii
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-cyan-500 text-black font-bold rounded-2xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10"
        >
          <Check size={18} /> Uložit trénink
        </button>
      </form>
    </div>
  );
};
