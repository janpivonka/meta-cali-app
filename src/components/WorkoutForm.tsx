import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  Check, 
  PlusCircle, 
  Target, 
  Zap, 
  Activity, 
  Edit3, 
  Search,
  Camera,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Boxes,
  Waves
} from 'lucide-react';
import { 
  WorkoutSet, 
  ExerciseLog, 
  GripType, 
  ThumbPosition,
  EquipmentType, 
  ExecutionType, 
  OneArmHandPosition,
  BandPlacement,
  BandLoopType,
  BodyPosition 
} from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';

interface WorkoutFormProps {
  onSave: (log: ExerciseLog) => void;
}

const GRIPS: GripType[] = ['pronated', 'supinated', 'neutral', 'false', 'mixed'];
const THUMBS: { val: ThumbPosition; label: string }[] = [
  { val: 'bottom', label: 'Standard (Palec dole)' },
  { val: 'top', label: 'Suicide (Palec nahoře)' }
];
const EQUIPMENTS: EquipmentType[] = ['pull-up bar', 'dip bars', 'rings', 'floor', 'parallelettes', 'stall bars'];
const EXECUTIONS: ExecutionType[] = ['standard', 'wide', 'shoulder-width', 'narrow', 'commando', 'one arm', 'archer', 'typewriter', 'high', 'negatives', 'partials', 'explosive', 'controlled', 'scapula', 'korean'];
const POSITIONS: BodyPosition[] = ['hollow body', 'arch back', 'L-sit', 'tuck', 'adv tuck', 'halflay', 'one leg', 'straddle', 'full', 'australian (bent legs)', 'australian (straight legs)'];
const BAND_PLACEMENTS: BandPlacement[] = ['both legs', 'one leg', 'waist', 'knees', 'back'];
const LOOP_TYPES: { val: BandLoopType; label: string }[] = [
  { val: 'single', label: 'Jednoduché' },
  { val: 'double', label: 'Dvojité (omotané)' }
];
const ONE_ARM_POSITIONS: { val: OneArmHandPosition; label: string }[] = [
  { val: 'wrist', label: 'Zápěstí' },
  { val: 'forearm', label: 'Předloktí' },
  { val: 'elbow', label: 'Loket' },
  { val: 'biceps', label: 'Biceps/Triceps' },
  { val: 'shoulder', label: 'Rameno' },
  { val: 'horizontal', label: 'Vodorovně/Prsa' },
  { val: 'free', label: 'Volně podél těla' }
];

export const WorkoutForm: React.FC<WorkoutFormProps> = ({ onSave }) => {
  const [exerciseId, setExerciseId] = useState<string>(EXERCISE_LIBRARY[0].id);
  const [grip, setGrip] = useState<GripType>('pronated');
  const [thumb, setThumb] = useState<ThumbPosition>('bottom');
  const [equipment, setEquipment] = useState<EquipmentType>('pull-up bar');
  const [execution, setExecution] = useState<ExecutionType | string>('standard');
  const [oneArmHandPosition, setOneArmHandPosition] = useState<OneArmHandPosition | string>('free');
  const [position, setPosition] = useState<BodyPosition | string>('standard');
  const [assistanceType, setAssistanceType] = useState<'None' | 'Band' | 'Weight'>('None');
  const [assistanceValue, setAssistanceValue] = useState('');
  const [bandPlacements, setBandPlacements] = useState<BandPlacement[]>(['both legs']);
  const [bandLoopType, setBandLoopType] = useState<BandLoopType>('single');
  const [sets, setSets] = useState<WorkoutSet[]>([{ reps: 0, weight: 0, rpe: 7 }]);
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [shared, setShared] = useState(false);

  // Filtered exercises for selection
  const filteredExercises = EXERCISE_LIBRARY.filter(ex => 
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ex.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentExercise = EXERCISE_LIBRARY.find(e => e.id === exerciseId);

  const isHoldExercise = (id: string) => {
    return ['planche', 'frontlever', 'statics'].some(k => id.toLowerCase().includes(k));
  };

  const addSet = () => setSets([...sets, { ...sets[sets.length - 1] }]);
  const removeSet = (index: number) => setSets(sets.filter((_, i) => i !== index));

  const updateSet = (index: number, field: keyof WorkoutSet, value: any) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSets(newSets);
  };

  const toggleBandPlacement = (p: BandPlacement) => {
    setBandPlacements(prev => 
      prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]
    );
  };

  const availableEquipment = EQUIPMENTS.filter(eq => {
    if (currentExercise?.category === 'Pull' && !execution.toString().includes('australian')) {
      return eq !== 'floor' && eq !== 'parallelettes';
    }
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validSets = sets.filter(s => (s.reps && s.reps > 0) || (s.time && s.time > 0));
    if (validSets.length === 0) return;

    onSave({
      id: crypto.randomUUID(),
      exerciseId,
      type: currentExercise?.name || 'Unknown',
      grip,
      thumb,
      equipment,
      execution,
      oneArmHandPosition: execution === 'one arm' ? oneArmHandPosition : undefined,
      position,
      assistance: assistanceType !== 'None' ? {
        type: assistanceType,
        value: assistanceValue,
        placement: assistanceType === 'Band' ? bandPlacements : undefined,
        loopType: assistanceType === 'Band' ? bandLoopType : undefined,
      } : undefined,
      sets: validSets,
      notes,
      shared,
      timestamp: Date.now(),
    });

    // Reset some fields but keep core context for consecutive logs if needed
    setSets([{ reps: 0, weight: 0, rpe: 7 }]);
    setNotes('');
  };

  return (
    <div id="workout-form-container" className="glass-card p-6 md:p-10 max-w-5xl mx-auto border-cyan-500/10 bg-black/40 rounded-[40px]">
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
        <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-black shadow-2xl shadow-cyan-500/20 rotate-3 group-hover:rotate-0 transition-transform">
          <PlusCircle size={32} />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">Operační Protokol</h2>
          <p className="text-[10px] text-cyan-500 font-black uppercase tracking-[0.4em]">Sekvenční záznam parametrů výkonu • v3.0</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* EXERCISE SELECTION GRID */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-2">
              <Boxes size={14} className="text-cyan-500" /> Identifikace Cviků
            </h3>
            <div className="relative w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input 
                type="text"
                placeholder="Hledat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-full py-2 pl-9 pr-4 text-[10px] font-bold text-white focus:outline-none focus:border-cyan-500/30"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {filteredExercises.map(ex => (
              <button
                key={ex.id}
                type="button"
                onClick={() => setExerciseId(ex.id)}
                className={cn(
                  "p-4 rounded-[24px] border transition-all flex flex-col items-center gap-2 relative overflow-hidden group/item",
                  exerciseId === ex.id 
                    ? "bg-cyan-500 border-cyan-400 text-black shadow-xl shadow-cyan-500/10 scale-105" 
                    : "bg-white/5 border-white/5 text-slate-500 hover:border-cyan-500/20 hover:text-slate-200"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors mb-1",
                  exerciseId === ex.id ? "bg-black/10" : "bg-white/5 group-hover/item:bg-white/10"
                )}>
                  <Activity size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter leading-none text-center">{ex.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* TAXONOMY: GRIP / EQUIPMENT / EXECUTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="space-y-8 p-8 bg-white/5 rounded-[32px] border border-white/5">
              <div className="space-y-6">
                 <div>
                   <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block mb-3">Úchop (Grip)</label>
                   <div className="flex flex-wrap gap-2">
                      {GRIPS.map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGrip(g)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                            grip === g ? "bg-white text-black border-white shadow-lg" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20"
                          )}
                        >
                          {g}
                        </button>
                      ))}
                   </div>
                 </div>

                 <div>
                   <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block mb-3">Pozice palce (Thumb)</label>
                   <div className="flex flex-wrap gap-2">
                      {THUMBS.map(t => (
                        <button
                          key={t.val}
                          type="button"
                          onClick={() => setThumb(t.val)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                            thumb === t.val ? "bg-white text-black border-white shadow-lg" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20"
                          )}
                        >
                          {t.label}
                        </button>
                      ))}
                   </div>
                 </div>

                 <div>
                   <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block mb-3">Vybavení (Equipment)</label>
                   <div className="flex flex-wrap gap-2">
                      {availableEquipment.map(eq => (
                        <button
                          key={eq}
                          type="button"
                          onClick={() => setEquipment(eq)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                            equipment === eq ? "bg-white text-black border-white shadow-lg" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20"
                          )}
                        >
                          {eq}
                        </button>
                      ))}
                   </div>
                 </div>
              </div>
           </div>

           <div className="space-y-8 p-8 bg-white/5 rounded-[32px] border border-white/5">
              <div className="space-y-6">
                 <div>
                   <label className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/60 block mb-3">Provedení (Execution)</label>
                   <div className="flex flex-wrap gap-2">
                      {EXECUTIONS.map(ex => (
                        <button
                          key={ex}
                          type="button"
                          onClick={() => setExecution(ex)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                            execution === ex ? "bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/20" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20"
                          )}
                        >
                          {ex}
                        </button>
                      ))}
                   </div>
                 </div>

                 {execution === 'one arm' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3 pt-4 border-t border-white/5 pb-4"
                    >
                      <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400 block mb-2">Pozice volné ruky (One-Arm Progress)</label>
                      <div className="flex flex-wrap gap-2">
                         {ONE_ARM_POSITIONS.map(pos => (
                           <button
                             key={pos.val}
                             type="button"
                             onClick={() => setOneArmHandPosition(pos.val)}
                             className={cn(
                               "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all flex-1 text-center min-w-[80px]",
                               oneArmHandPosition === pos.val ? "bg-cyan-500 text-black border-cyan-400" : "bg-black/40 text-slate-500 border-white/5"
                             )}
                           >
                             {pos.label}
                           </button>
                         ))}
                      </div>
                    </motion.div>
                  )}

                 <div>
                   <label className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/60 block mb-3">Tělesná Pozice (Position)</label>
                   <div className="flex flex-wrap gap-2">
                      {POSITIONS.map(pos => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => setPosition(pos)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                            position === pos ? "bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/20" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20"
                          )}
                        >
                          {pos}
                        </button>
                      ))}
                   </div>
                 </div>
              </div>
           </div>
        </div>

        {/* ASSISTANCE & EXTRA LOAD */}
        <div className="p-8 bg-orange-500/5 rounded-[32px] border border-orange-500/10">
           <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 flex items-center gap-2">
                   <Target size={14} /> Mechanická Asistence
                </label>
                <div className="flex gap-2">
                   {['None', 'Band', 'Weight'].map(a => (
                     <button
                        key={a}
                        type="button"
                        onClick={() => setAssistanceType(a as any)}
                        className={cn(
                          "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                          assistanceType === a ? "bg-orange-500 text-black border-orange-400 shadow-lg" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20"
                        )}
                     >
                        {a === 'Band' ? 'Odporová Guma' : a === 'Weight' ? 'Závaží' : 'Žádná'}
                     </button>
                   ))}
                </div>
              </div>
              {assistanceType === 'Band' && (
                <div className="flex flex-col sm:flex-row gap-8 w-full">
                  <div className="flex-1 space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500/60 block">Odpor & Pozice</label>
                     <div className="grid grid-cols-1 gap-4">
                        <div className="flex gap-4">
                          <input 
                              type="text"
                              placeholder="Barva/Odpor..."
                              value={assistanceValue}
                              onChange={(e) => setAssistanceValue(e.target.value)}
                              className="flex-1 bg-black/40 border border-orange-500/20 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-orange-500 italic"
                          />
                          <div className="flex gap-1.5 bg-black/20 p-2 rounded-2xl border border-white/5">
                            <button
                              type="button"
                              onClick={() => setBandLoopType(bandLoopType === 'single' ? 'double' : 'single')}
                              className={cn(
                                "px-4 py-2 rounded-xl text-[7px] font-black uppercase tracking-widest transition-all",
                                bandLoopType === 'double' ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20" : "bg-white/10 text-slate-400"
                              )}
                            >
                              {bandLoopType === 'double' ? 'Dvojité Smotání' : 'Jednoduché Smotání'}
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                           {BAND_PLACEMENTS.map(p => (
                             <button
                               key={p}
                               type="button"
                               onClick={() => toggleBandPlacement(p)}
                               className={cn(
                                 "px-2 py-2 rounded-lg text-[7px] font-black uppercase tracking-widest border transition-all flex-1 text-center",
                                 bandPlacements.includes(p) ? "bg-orange-500 text-black border-orange-400 shadow-md shadow-orange-500/10" : "bg-black/40 text-slate-500 border-white/5"
                               )}
                             >
                               {p === 'one leg' ? 'Jedna noha' : p === 'both legs' ? 'Obě nohy' : p === 'waist' ? 'Pas' : p === 'back' ? 'Záda' : 'Kolena'}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {assistanceType === 'Weight' && (
                <div className="w-full md:w-64 space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500/60 block">Závaží</label>
                   <input 
                      type="text"
                      placeholder="Kilogramy..."
                      value={assistanceValue}
                      onChange={(e) => setAssistanceValue(e.target.value)}
                      className="w-full bg-black/40 border border-orange-500/20 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-orange-500 italic"
                   />
                </div>
              )}
           </div>
        </div>

        {/* SETS CONFIGURATION */}
        <div className="space-y-8">
           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 flex items-center gap-2 px-2">
              <Zap size={14} className="text-cyan-500" /> Konfigurace Výkonových Bloků
           </h3>
           <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {sets.map((set, index) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={index}
                    className="glass-card grid grid-cols-1 md:grid-cols-4 items-center gap-6 p-8 border-white/5 bg-white/5 rounded-[32px] group hover:border-cyan-500/30 transition-all shadow-xl"
                  >
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/40 transition-colors">
                          <span className="text-xl font-black text-white italic">{index + 1}</span>
                       </div>
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Sekvence</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                       <div className="flex items-center gap-4">
                          <button 
                            type="button" 
                            onClick={() => updateSet(index, isHoldExercise(exerciseId) ? 'time' : 'reps', Math.max(0, (isHoldExercise(exerciseId) ? (set.time || 0) : (set.reps || 0)) - 1))}
                            className="text-slate-600 hover:text-white transition-colors p-1"
                          ><Minus size={18} /></button>
                          <input 
                             type="number"
                             value={isHoldExercise(exerciseId) ? (set.time || 0) : (set.reps || 0)}
                             onChange={(e) => updateSet(index, isHoldExercise(exerciseId) ? 'time' : 'reps', parseInt(e.target.value) || 0)}
                             className="bg-transparent text-4xl font-black text-white w-16 text-center focus:outline-none font-mono tracking-tighter"
                          />
                          <button 
                            type="button" 
                            onClick={() => updateSet(index, isHoldExercise(exerciseId) ? 'time' : 'reps', (isHoldExercise(exerciseId) ? (set.time || 0) : (set.reps || 0)) + 1)}
                            className="text-slate-600 hover:text-white transition-colors p-1"
                          ><Plus size={18} /></button>
                       </div>
                       <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">{isHoldExercise(exerciseId) ? 'Sekund' : 'Opakování'}</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                       <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl border border-white/5 group-hover:border-purple-500/20 transition-all">
                          <span className="text-[9px] font-black text-purple-500">RPE:</span>
                          <input 
                             type="number"
                             min="1"
                             max="10"
                             value={set.rpe || 7}
                             onChange={(e) => updateSet(index, 'rpe', parseInt(e.target.value) || 0)}
                             className="bg-transparent text-xl font-black text-white w-8 text-center focus:outline-none font-mono"
                          />
                       </div>
                       <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">Intenzita (1-10)</span>
                    </div>

                    <div className="flex justify-end pr-4">
                       <button 
                        type="button" 
                        onClick={() => removeSet(index)}
                        className="text-slate-700 hover:text-red-500 transition-colors p-2"
                       ><Minus size={20} /></button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
           
           <button
             type="button"
             onClick={addSet}
             className="w-full py-6 border-2 border-dashed border-white/5 rounded-[32px] text-slate-600 hover:text-cyan-500 hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all text-xs font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 active:scale-[0.99] group shadow-inner"
           >
             <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" /> Duplikovat Sekvenci
           </button>
        </div>

        {/* NOTES & MEDIA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-2 px-2">
                 <MessageSquare size={14} /> Taktické Poznámky
              </label>
              <textarea 
                 value={notes}
                 onChange={(e) => setNotes(e.target.value)}
                 placeholder="Pocity, technické nedostatky, progresivní postřehy..."
                 className="w-full h-32 bg-white/5 border border-white/5 rounded-[32px] p-6 text-sm font-medium text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/30 transition-all resize-none italic"
              />
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-2 px-2">
                 <Camera size={14} /> Vizuální Telemetrie
              </label>
              <div className="w-full h-32 border-2 border-dashed border-white/5 rounded-[32px] flex flex-col items-center justify-center gap-2 group hover:border-cyan-500/20 transition-all cursor-pointer">
                 <Camera size={24} className="text-slate-700 group-hover:text-cyan-500 transition-colors" />
                 <span className="text-[8px] font-black text-slate-700 group-hover:text-slate-500 uppercase tracking-widest">Připojit záznam (Foto/Video)</span>
              </div>
              <div className="flex items-center justify-between px-6 py-4 bg-white/5 rounded-2xl border border-white/5">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sdílet s komunitou</span>
                 <button 
                  type="button"
                  onClick={() => setShared(!shared)}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    shared ? "bg-cyan-500" : "bg-white/10"
                  )}
                 >
                   <div className={cn(
                     "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300",
                     shared ? "left-7" : "left-1"
                   )} />
                 </button>
              </div>
           </div>
        </div>

        {/* SUBMIT */}
        <div className="pt-8">
           <button
             type="submit"
             className="w-full py-7 bg-white text-black text-sm font-black uppercase tracking-[0.5em] rounded-[32px] hover:bg-cyan-500 active:scale-95 transition-all shadow-2xl shadow-cyan-500/10 group relative overflow-hidden"
           >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
             <div className="flex items-center justify-center gap-4 relative z-10">
               <Check size={24} />
               Synchronizovat do Archivu
             </div>
           </button>
        </div>
      </form>
    </div>
  );
};
