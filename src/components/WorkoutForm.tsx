import React, { useState } from 'react';
import { Plus, Minus, Check, PlusCircle, Target, Zap } from 'lucide-react';
import { ExerciseType, WorkoutSet, ExerciseLog } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

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
    <div id="workout-form-container" className="glass-card p-6 md:p-10 max-w-3xl mx-auto border-cyan-500/10">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center text-black shadow-lg shadow-cyan-500/20">
          <PlusCircle size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Nový záznam</h2>
          <p className="text-xs text-[#94a3b8] font-bold uppercase tracking-widest">Vstupní brána telemetrie</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 font-black flex items-center gap-2">
            <Target size={12} /> Výběr Modulu Cviků
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {predefinedExercises.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setType(ex)}
                className={cn(
                  "px-3 py-3 rounded-xl border text-[10px] font-black uppercase tracking-tighter transition-all duration-300",
                  type === ex 
                    ? "bg-cyan-500 border-cyan-400 text-black shadow-xl shadow-cyan-500/20 scale-105" 
                    : "bg-white/40 dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-600 dark:text-[#94a3b8] hover:border-cyan-500/30"
                )}
              >
                {ex}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setType('Vlastní')}
              className={cn(
                "px-3 py-3 rounded-xl border text-[10px] font-black uppercase tracking-tighter transition-all duration-300",
                type === 'Vlastní' 
                  ? "bg-purple-600 border-purple-500 text-white shadow-xl shadow-purple-600/20 scale-105" 
                  : "bg-white/40 dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-600 dark:text-[#94a3b8] hover:border-purple-500/30"
              )}
            >
              Vlastní
            </button>
          </div>
        </div>

        {type === 'Vlastní' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 p-4 bg-purple-600/5 border border-purple-600/20 rounded-2xl"
          >
            <label className="text-[10px] uppercase tracking-widest text-purple-500 font-black block">Manuální identifikátor</label>
            <input
              type="text"
              value={customExercise}
              onChange={(e) => setCustomExercise(e.target.value)}
              className="w-full bg-transparent border-b-2 border-purple-600/30 py-2 text-xl font-black text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors uppercase italic"
              placeholder="Zadejte název..."
              required
            />
          </motion.div>
        )}

        <div className="space-y-6">
          <label className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 font-black flex items-center gap-2">
            <Zap size={12} /> Konfigurace Sérií
          </label>
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {sets.map((set, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={index} 
                  className="flex items-center gap-4 bg-white/40 dark:bg-black/40 p-5 rounded-2xl border border-black/5 dark:border-white/10 group hover:border-cyan-500/20 transition-all shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-xs font-black text-orange-500 border border-orange-500/20">
                    S{index + 1}
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-6">
                    <button 
                      type="button"
                      onClick={() => updateReps(index, set.reps - 1)}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-cyan-500 hover:bg-cyan-500/10 transition-all"
                    >
                      <Minus size={20} />
                    </button>
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateReps(index, parseInt(e.target.value) || 0)}
                        className="bg-transparent text-4xl font-black text-slate-900 dark:text-white w-20 text-center focus:outline-none font-mono"
                      />
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">OPAKOVÁNÍ</span>
                    </div>
                    <button
                      type="button" 
                      onClick={() => updateReps(index, set.reps + 1)}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-cyan-500 hover:bg-cyan-500/10 transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSet(index)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    title="Odebrat sérii"
                  >
                    <Minus size={14} className="opacity-40" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={addSet}
            className="w-full py-4 border-2 border-dashed border-black/5 dark:border-white/10 rounded-2xl text-[#94a3b8] hover:text-cyan-500 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3"
          >
            <Plus size={16} /> Inicializovat další sérii
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-cyan-500 dark:hover:bg-cyan-400 hover:text-black transition-all flex items-center justify-center gap-3 shadow-2xl shadow-cyan-500/10 group"
        >
          <Check size={18} className="group-hover:scale-125 transition-transform" /> Potvrdit do systému
        </button>
      </form>
    </div>
  );
};
