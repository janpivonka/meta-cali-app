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
  const [block, setBlock] = useState('');
  const [sets, setSets] = useState<WorkoutSet[]>([{ reps: 0, weight: 0 }]);

  const exerciseGroups = [
    {
      name: 'Statiky',
      items: [
        'Planche lean', 'Tuck planche', 'Advtuck planche', 'Straddle planche', 'Full planche', 'Maltese', 'Iron Cross',
        'Frontlever', 'Frontlever hold', 'Backlever', 'Victorian', 'L-Sit', 'V-Sit', 'Hollowback', 'Planche hold', 'Human flag'
      ]
    },
    {
      name: 'Tlakové',
      items: [
        'Kliky', 'Dipy', 'HSPU', '90° HSPU', 'Deep HSPU', 'Pike press', 'Bentarm press', 'Handstand press', 'Stojka', 'Hefesto',
        'Korean dips', 'Russian dips', 'Archer pushups', 'Typewriters', 'Yguana pushups', 'Tigerbent pushups', 'Scapula pushups', 'Pike float pushups', 'Impossible dip'
      ]
    },
    {
      name: 'Tahové',
      items: [
        'Shyby', 'Muscleups', 'Muscle-ups', 'High pull-ups', 'Pullovers', 'Výmyky', 'Pelican', 'Australian pull-ups', 'Australian rows', 'Chin ups', 'Scapula pull-ups', 'Shoulder shrugs', 'Backlever pull-ups'
      ]
    },
    {
      name: 'Prvky & Drilly',
      items: [
        'Tuck frontlever raises', 'Halflay frontlever raises', 'Frontlever raises', 'Ice cream makers', 'Upside down deadlift', 'Hefesto negatives', 'Entrada deadhang', 'Handstand walkthrough'
      ]
    },
    {
      name: 'Dynamika',
      items: [
        'Tornado 360', '540 try', '360 pull-up', 'Shrimpflip', 'Alleyhoop', 'Swing', 'Giant', 'Salto'
      ]
    },
    {
      name: 'Core & Basics',
      items: [
        'Plank', 'Přednosy', 'Stall bars leg raises', 'Dragon flag', 'Dřepy', 'Výpady', 'Pistol squats', 'Deadlift', 'Sit ups', 'Angličáky', 'Heavily weighted dips', 'Weighted pull-ups'
      ]
    }
  ];

  const allPredefined = exerciseGroups.flatMap(g => g.items);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const visibleExercises = (selectedCategory 
    ? exerciseGroups.find(g => g.name === selectedCategory)?.items || []
    : allPredefined).filter(ex => ex.toLowerCase().includes(searchQuery.toLowerCase()));

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
      block: block || undefined,
      sets: sets.filter(s => s.reps > 0 || (s.weight && s.weight > 0)),
      timestamp: Date.now(),
    });

    setSets([{ reps: 0, weight: 0 }]);
    setCustomExercise('');
    setBlock('');
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 font-black flex items-center gap-2">
              Tréninkový Blok
            </label>
            <input 
              type="text"
              list="block-suggestions"
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              placeholder="Např. PLANCHE, PULL BASICS..."
              className="w-full bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-400"
            />
            <datalist id="block-suggestions">
              <option value="PLANCHE" />
              <option value="FRONTLEVER" />
              <option value="PULL BASICS" />
              <option value="PUSH BASICS" />
              <option value="HANDSTAND" />
              <option value="CORE" />
              <option value="REST" />
            </datalist>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 font-black flex items-center gap-2">
              Manuální Identifikátor
            </label>
            <input
              type="text"
              value={customExercise}
              onChange={(e) => setCustomExercise(e.target.value)}
              disabled={type !== 'Vlastní'}
              className="w-full bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-purple-500/40 transition-all placeholder:text-slate-400 disabled:opacity-30"
              placeholder="Pouze pro 'Vlastní'..."
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <label className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 font-black flex items-center gap-2">
              <Target size={12} /> Výběr Modulu Cviků
            </label>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest transition-all",
                  selectedCategory === null ? "bg-cyan-500 text-black" : "text-[#94a3b8] hover:text-white"
                )}
              >
                Vše
              </button>
              {exerciseGroups.map(g => (
                <button
                  key={g.name}
                  type="button"
                  onClick={() => setSelectedCategory(g.name)}
                  className={cn(
                    "px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest transition-all",
                    selectedCategory === g.name ? "bg-cyan-500 text-black" : "text-[#94a3b8] hover:text-white"
                  )}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Vyhledat cvik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {visibleExercises.map((ex) => (
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
                        className="bg-transparent text-4xl font-black text-slate-900 dark:text-white w-16 text-center focus:outline-none font-mono"
                      />
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">OPAK</span>
                    </div>
                    <div className="h-10 w-[1px] bg-black/5 dark:bg-white/10 mx-2" />
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        value={set.weight || 0}
                        onChange={(e) => {
                          const newSets = [...sets];
                          newSets[index].weight = parseInt(e.target.value) || 0;
                          setSets(newSets);
                        }}
                        className="bg-transparent text-2xl font-black text-purple-500 w-12 text-center focus:outline-none font-mono"
                      />
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#94a3b8]">KG</span>
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
