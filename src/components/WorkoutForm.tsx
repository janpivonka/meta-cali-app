import React, { useState } from 'react';
import { Plus, Minus, Check, PlusCircle, Target, Zap, Activity, Edit3, Search } from 'lucide-react';
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

  const [variation, setVariation] = useState('');
  const [form, setForm] = useState<'Hollowbody' | 'Archy' | 'Standard'>('Standard');
  const [assistanceType, setAssistanceType] = useState<'None' | 'Band' | 'Weight'>('None');
  const [assistanceValue, setAssistanceValue] = useState('');

  const isHoldExercise = (ex: string) => {
    const holds = ['hold', 'Planche', 'Frontlever', 'Backlever', 'Plank', 'L-Sit', 'V-Sit', 'Hollowback', 'Victorian', 'Iron Cross', 'Maltese'];
    return holds.some(h => ex.includes(h));
  };

  const getCommonVariations = (ex: string) => {
    if (ex.includes('Shyby')) return ['Standard', 'High', 'Chest-to-Bar', 'Australian', 'Scapula', 'Muscle-up Transition'];
    if (ex.includes('Kliky')) return ['Standard', 'Diamond', 'Archer', 'Pseudo-Planche', 'Tigerbend', 'Scapula'];
    if (ex.includes('Dipy')) return ['Standard', 'Deep', 'Straight-Bar', 'Korean', 'Russian'];
    return [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sets.every(s => !(s.reps && s.reps > 0) && !(s.time && s.time > 0))) return;

    const finalType = type === 'Vlastní' ? customExercise : type;
    if (!finalType) return;

    onSave({
      id: crypto.randomUUID(),
      type: finalType,
      block: block || undefined,
      variation: variation || undefined,
      form: form !== 'Standard' ? form : undefined,
      assistance: assistanceType !== 'None' ? {
        type: assistanceType,
        value: assistanceType === 'Band' ? assistanceValue : parseFloat(assistanceValue) || undefined
      } : undefined,
      sets: sets.filter(s => (s.reps && s.reps > 0) || (s.time && s.time > 0)),
      timestamp: Date.now(),
    });

    setSets([{ reps: 0, weight: 0 }]);
    setCustomExercise('');
    setBlock('');
    setVariation('');
    setForm('Standard');
    setAssistanceType('None');
    setAssistanceValue('');
  };

  return (
    <div id="workout-form-container" className="glass-card p-6 md:p-10 max-w-4xl mx-auto border-cyan-500/10">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center text-black shadow-lg shadow-cyan-500/20">
          <PlusCircle size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-serif italic">Operační Protokol</h2>
          <p className="text-xs text-[#94a3b8] font-bold uppercase tracking-widest">Sekvenční záznam parametrů výkonu</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* HEADER SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white/5 rounded-3xl border border-white/5">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 font-black flex items-center gap-2">
              <Activity size={12} /> Tréninkový Blok
            </label>
            <input 
              type="text"
              list="block-suggestions"
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              placeholder="Např. PLANCHE, PULL BASICS..."
              className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold focus:outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.3em] text-purple-500 font-black flex items-center gap-2">
              <Edit3 size={12} /> Manuální Identifikátor
            </label>
            <input
              type="text"
              value={customExercise}
              onChange={(e) => setCustomExercise(e.target.value)}
              disabled={type !== 'Vlastní'}
              className="w-full bg-black/10 border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold focus:outline-none focus:border-purple-500/40 transition-all placeholder:text-slate-600 disabled:opacity-20 italic"
              placeholder="Pouze pro 'Vlastní'..."
            />
          </div>
        </div>

        {/* EXERCISE SELECTION */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 font-black flex items-center gap-2">
              <Target size={12} /> Modul Cviků
            </label>
            <div className="flex flex-wrap gap-2 justify-center bg-white/5 p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                  selectedCategory === null ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "text-[#94a3b8] hover:text-white"
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
                    "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                    selectedCategory === g.name ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "text-[#94a3b8] hover:text-white"
                  )}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          <div className="relative px-2">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search size={14} className="text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Vyhledat v databázi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar px-2">
            {visibleExercises.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => {
                  setType(ex);
                  setVariation(''); // Reset variation when base changes
                }}
                className={cn(
                  "px-3 py-4 rounded-2xl border text-[9px] font-black uppercase tracking-tighter transition-all duration-300 relative overflow-hidden group",
                  type === ex 
                    ? "bg-cyan-500 border-cyan-400 text-black shadow-xl shadow-cyan-500/10 scale-105" 
                    : "bg-white/5 border-white/5 text-slate-500 hover:border-cyan-500/20 hover:text-slate-300"
                )}
              >
                {type === ex && (
                  <motion.div layoutId="active-bg" className="absolute inset-0 bg-cyan-500 -z-1" />
                )}
                <span className="relative z-10">{ex}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setType('Vlastní')}
              className={cn(
                "px-3 py-4 rounded-2xl border text-[9px] font-black uppercase tracking-tighter transition-all duration-300",
                type === 'Vlastní' 
                  ? "bg-purple-600 border-purple-500 text-white shadow-xl shadow-purple-600/10 scale-105" 
                  : "bg-white/5 border-white/5 text-slate-500 hover:border-purple-500/20"
              )}
            >
              Vlastní
            </button>
          </div>
        </div>

        {/* VARIATION & TAXONOMY SECTION */}
        <AnimatePresence mode="wait">
          {type && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 p-8 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-[40px] border border-white/5 shadow-inner"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-4 bg-cyan-500 rounded-full animate-pulse" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Konfigurace Varianty: <span className="text-white">{type}</span></h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Variant */}
                <div className="space-y-4">
                  <span className="text-[8px] font-black text-[#94a3b8] uppercase tracking-widest block">Specifická Varianta</span>
                  <div className="flex flex-wrap gap-2">
                    {getCommonVariations(type).map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVariation(v)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all",
                          variation === v ? "bg-white text-black border-white" : "text-slate-500 border-white/5 hover:border-white/20"
                        )}
                      >
                        {v}
                      </button>
                    ))}
                    <input 
                      type="text" 
                      placeholder="Jiné..."
                      value={variation}
                      onChange={(e) => setVariation(e.target.value)}
                      className="bg-transparent border-b border-white/10 text-[10px] font-bold text-white focus:outline-none focus:border-cyan-500/50 px-2 py-1 w-20"
                    />
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <span className="text-[8px] font-black text-[#94a3b8] uppercase tracking-widest block">Technické Provedení</span>
                  <div className="flex gap-2">
                    {['Standard', 'Hollowbody', 'Archy'].map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setForm(f as any)}
                        className={cn(
                          "flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all",
                          form === f ? "bg-white text-black border-white" : "text-slate-500 border-white/5 hover:border-white/20"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Assistance */}
                <div className="space-y-4">
                  <span className="text-[8px] font-black text-[#94a3b8] uppercase tracking-widest block">Mechanická Asistence</span>
                  <div className="flex gap-2 items-center">
                    <div className="flex gap-1 overflow-hidden rounded-lg border border-white/5 p-0.5 bg-black/20">
                      {['None', 'Band', 'Weight'].map(a => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setAssistanceType(a as any)}
                          className={cn(
                            "px-2 py-1 text-[7px] font-black uppercase tracking-widest transition-all rounded-md",
                            assistanceType === a ? "bg-white/10 text-white" : "text-slate-600 hover:text-slate-400"
                          )}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                    {assistanceType !== 'None' && (
                      <input 
                        type="text" 
                        placeholder={assistanceType === 'Band' ? "Barva..." : "KG..."}
                        value={assistanceValue}
                        onChange={(e) => setAssistanceValue(e.target.value)}
                        className="bg-transparent border-b border-white/10 text-[10px] font-bold text-white focus:outline-none focus:border-cyan-500/50 px-2 py-1 w-16"
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SETS CONFIGURATION */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 font-black flex items-center gap-2">
              <Zap size={12} /> Konfigurace Sérií
            </label>
            <div className="text-[8px] font-black text-[#94a3b8] uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
              Režim: {isHoldExercise(type) ? 'STATICKÝ HOLD' : 'DYNAMICKÁ OPAKOVÁNÍ'}
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {sets.map((set, index) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={index} 
                  className="flex items-center gap-4 bg-gradient-to-r from-white/5 to-transparent p-6 rounded-[32px] border border-white/5 group hover:border-cyan-500/20 transition-all shadow-lg"
                >
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex flex-col items-center justify-center border border-orange-500/20">
                    <span className="text-[7px] font-black text-orange-500/40 uppercase">SET</span>
                    <span className="text-sm font-black text-orange-500">{index + 1}</span>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-around">
                    {/* VALUE (REPS OR TIME) */}
                    <div className="flex flex-col items-center gap-1 group/control">
                      <div className="flex items-center gap-4">
                        <button 
                          type="button"
                          onClick={() => {
                            const newSets = [...sets];
                            if (isHoldExercise(type)) {
                              newSets[index].time = Math.max(0, (newSets[index].time || 0) - 1);
                            } else {
                              newSets[index].reps = Math.max(0, (newSets[index].reps || 0) - 1);
                            }
                            setSets(newSets);
                          }}
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-slate-600 hover:text-cyan-500 hover:border-cyan-500/30 border border-transparent transition-all"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          value={isHoldExercise(type) ? (set.time || 0) : (set.reps || 0)}
                          onChange={(e) => {
                            const newSets = [...sets];
                            const val = parseInt(e.target.value) || 0;
                            if (isHoldExercise(type)) newSets[index].time = val;
                            else newSets[index].reps = val;
                            setSets(newSets);
                          }}
                          className="bg-transparent text-4xl font-black text-white w-20 text-center focus:outline-none font-mono tracking-tighter"
                        />
                        <button
                          type="button" 
                          onClick={() => {
                            const newSets = [...sets];
                            if (isHoldExercise(type)) {
                              newSets[index].time = (newSets[index].time || 0) + 1;
                            } else {
                              newSets[index].reps = (newSets[index].reps || 0) + 1;
                            }
                            setSets(newSets);
                          }}
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-slate-600 hover:text-cyan-500 hover:border-cyan-500/30 border border-transparent transition-all"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#94a3b8] group-hover/control:text-cyan-500/60 transition-colors">
                        {isHoldExercise(type) ? 'Sekundy' : 'Opakování'}
                      </span>
                    </div>

                    <div className="w-[1px] h-12 bg-white/5" />

                    {/* WEIGHT (Optional/Contextual Override) */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center">
                         <input
                          type="number"
                          value={set.weight || 0}
                          onChange={(e) => {
                            const newSets = [...sets];
                            newSets[index].weight = parseFloat(e.target.value) || 0;
                            setSets(newSets);
                          }}
                          className="bg-transparent text-2xl font-black text-purple-500 w-16 text-center focus:outline-none font-mono"
                        />
                         <span className="text-[10px] font-black text-purple-500/40 font-mono">KG</span>
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#94a3b8]">Zátěž</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSet(index)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-500/5 transition-all"
                  >
                    <Minus size={16} className="opacity-40" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <button
            type="button"
            onClick={addSet}
            className="w-full py-6 border-2 border-dashed border-white/5 rounded-[32px] text-slate-600 hover:text-cyan-500 hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 active:scale-[0.99]"
          >
            <Plus size={18} /> Přidat Další Sekvenci
          </button>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-6 bg-white text-black text-xs font-black uppercase tracking-[0.4em] rounded-[32px] hover:bg-cyan-500 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-white/5 active:scale-95 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Check size={20} className="relative z-10" /> 
            <span className="relative z-10">Uložit do Národního Archivu</span>
          </button>
        </div>
      </form>
    </div>
  );
};
