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
  GripWidth,
  ThumbPosition,
  EquipmentType, 
  ExecutionStyle,
  ExecutionMethod,
  OneArmHandPosition,
  BandPlacement,
  BandLoopType,
  BodyPosition,
  LoadType,
  LegProgression,
  SingleLegPosition
} from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';

interface WorkoutFormProps {
  onSave: (log: ExerciseLog) => void;
  onDelete?: () => void;
  initialExerciseId?: string | null;
  initialData?: ExerciseLog | null;
}

const GRIPS: GripType[] = ['pronated', 'supinated', 'neutral', 'mixed'];
const GRIP_WIDTHS: GripWidth[] = ['narrow', 'shoulder-width', 'wide'];
const THUMBS: { val: ThumbPosition; label: string }[] = [
  { val: 'bottom', label: 'Standard (Palec dole)' },
  { val: 'top', label: 'Suicide (Palec nahoře)' }
];
const EQUIPMENTS: EquipmentType[] = ['pull-up bar', 'low bar', 'dip bars', 'rings', 'floor', 'parallelettes', 'stall bars'];
const EXECUTION_STYLES: ExecutionStyle[] = ['basic', 'one arm', 'archer', 'typewriter', 'commando', 'high', 'korean'];
const EXECUTION_METHODS: ExecutionMethod[] = ['standard', 'explosive', 'partial', 'negative', 'scapula', 'controlled'];
const POSITIONS: BodyPosition[] = ['neutral', 'hollow body', 'arch back', 'L-sit'];
const LEG_PROGRESSIONS: LegProgression[] = ['none', 'tuck', 'adv tuck', 'straddle', 'one leg', 'halflay', 'full', 'australian (bent legs)', 'australian (straight legs)'];
const BAND_PLACEMENTS: BandPlacement[] = ['both legs', 'one leg', 'waist', 'knees', 'back'];
const LOOP_TYPES: { val: BandLoopType; label: string }[] = [
  { val: 'single', label: 'Jednoduché' },
  { val: 'double', label: 'Dvojité (omotané)' }
];
const SINGLE_LEG_POSITIONS: SingleLegPosition[] = ['tuck', 'adv tuck', 'halflay', 'full'];
const ONE_ARM_POSITIONS: { val: OneArmHandPosition; label: string }[] = [
  { val: 'wrist', label: 'Zápěstí' },
  { val: 'forearm', label: 'Předloktí' },
  { val: 'elbow', label: 'Loket' },
  { val: 'biceps', label: 'Biceps/Triceps' },
  { val: 'shoulder', label: 'Rameno' },
  { val: 'horizontal', label: 'Vodorovně/Prsa' },
  { val: 'free', label: 'Volně podél těla' }
];

export const WorkoutForm: React.FC<WorkoutFormProps> = ({ onSave, onDelete, initialExerciseId, initialData }) => {
  const [exerciseId, setExerciseId] = useState<string>(initialData?.exerciseId || initialExerciseId || EXERCISE_LIBRARY[0].id);

  const [grip, setGrip] = useState<GripType>('pronated');
  const [gripWidth, setGripWidth] = useState<GripWidth>('shoulder-width');
  const [thumb, setThumb] = useState<ThumbPosition>('bottom');
  const [equipment, setEquipment] = useState<EquipmentType>('pull-up bar');
  const [executionStyle, setExecutionStyle] = useState<ExecutionStyle | string>('basic');
  const [executionMethod, setExecutionMethod] = useState<ExecutionMethod | string>('standard');
  const [oneArmHandPosition, setOneArmHandPosition] = useState<OneArmHandPosition | string>('free');
  const [oneLegPrimaryPosition, setOneLegPrimaryPosition] = useState<SingleLegPosition>('full');
  const [oneLegSecondaryPosition, setOneLegSecondaryPosition] = useState<SingleLegPosition>('tuck');
  const [position, setPosition] = useState<BodyPosition | string>('neutral');
  const [legProgression, setLegProgression] = useState<LegProgression | string>('none');
  const [loadType, setLoadType] = useState<LoadType>('bodyweight');
  const [assistanceValue, setAssistanceValue] = useState('');
  const [bandPlacements, setBandPlacements] = useState<BandPlacement[]>(['both legs']);
  const [bandLoopType, setBandLoopType] = useState<BandLoopType>('single');
  const [falseGrip, setFalseGrip] = useState(false);
  const [sets, setSets] = useState<WorkoutSet[]>([{ reps: 10 }]);
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [shared, setShared] = useState(false);

  const resetForm = () => {
    setGrip('pronated');
    setGripWidth('shoulder-width');
    setThumb('bottom');
    setFalseGrip(false);
    setEquipment('pull-up bar');
    setExecutionStyle('basic');
    setExecutionMethod('standard');
    setOneArmHandPosition('free');
    setOneLegPrimaryPosition('full');
    setOneLegSecondaryPosition('tuck');
    setPosition('neutral');
    setLegProgression('none');
    setLoadType('bodyweight');
    setAssistanceValue('');
    setBandPlacements(['both legs']);
    setBandLoopType('single');
    setSets([{ reps: 10 }]);
    setNotes('');
    setSearchQuery('');
    setShared(false);
    if (!initialExerciseId) {
      setExerciseId(EXERCISE_LIBRARY[0].id);
    } else {
      setExerciseId(initialExerciseId);
    }
  };

  // Sync with initialData if it changes
  React.useEffect(() => {
    if (initialData) {
      setExerciseId(initialData.exerciseId);
      setGrip(initialData.grip || 'pronated');
      setGripWidth(initialData.gripWidth || 'shoulder-width');
      setThumb(initialData.thumb || 'bottom');
      setFalseGrip(initialData.falseGrip || false);
      setEquipment(initialData.equipment || 'pull-up bar');
      setExecutionStyle(initialData.executionStyle || 'basic');
      setExecutionMethod(initialData.executionMethod || 'standard');
      setOneArmHandPosition(initialData.oneArmHandPosition || 'free');
      setOneLegPrimaryPosition(initialData.oneLegPrimaryPosition || 'full');
      setOneLegSecondaryPosition(initialData.oneLegSecondaryPosition || 'tuck');
      setPosition(initialData.position || 'neutral');
      setLegProgression(initialData.legProgression || 'none');
      setSets(initialData.sets);
      setNotes(initialData.notes || '');
      setShared(initialData.shared || false);
      setLoadType(initialData.loadType || 'bodyweight');
      setAssistanceValue(initialData.assistanceValue?.toString() || '');
      if (initialData.assistanceDetails) {
        setBandPlacements(initialData.assistanceDetails.placement as BandPlacement[] || ['both legs']);
        setBandLoopType(initialData.assistanceDetails.loopType || 'single');
      }
    } else {
      // If we are no longer editing, reset to defaults or initialExerciseId
      resetForm();
    }
  }, [initialData, initialExerciseId]);

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
    if (currentExercise?.category === 'Pull') {
      // Standard hard exclusions for Pull
      if (eq === 'floor' || eq === 'parallelettes') return false;
    }
    return true;
  });

  const availableExecutionStyles = EXECUTION_STYLES;

  // Track the previous values to know what changed
  const prevEquipmentRef = React.useRef(equipment);
  const prevStyleRef = React.useRef(executionStyle);
  const prevPositionRef = React.useRef(position);
  const prevLegProgressionRef = React.useRef(legProgression);
  const prevGripRef = React.useRef(grip);
  const prevGripWidthRef = React.useRef(gripWidth);

  // Smart conflict resolution (Proactive de-selection)
  React.useEffect(() => {
    if (currentExercise?.category === 'Pull') {
      const styleChanged = prevStyleRef.current !== executionStyle;
      const equipChanged = prevEquipmentRef.current !== equipment;
      const posChanged = prevPositionRef.current !== position;
      const legProgChanged = prevLegProgressionRef.current !== legProgression;
      const gripChanged = prevGripRef.current !== grip;
      const widthChanged = prevGripWidthRef.current !== gripWidth;

      // Logic: A changed value updates the other incompatible one
      
      // If user selected narrow + neutral grip -> Change style to Commando
      if ((gripChanged || widthChanged) && grip === 'neutral' && gripWidth === 'narrow') {
        if (executionStyle !== 'commando') {
          setExecutionStyle('commando');
        }
      }

      // If executionStyle is Commando but user changes grip/width away -> Revert to basic
      if (executionStyle === 'commando' && (grip !== 'neutral' || gripWidth !== 'narrow')) {
        if (gripChanged || widthChanged) {
          setExecutionStyle('basic');
        }
      }

      // If style is Archer/Typewriter but width changes away from Wide -> Revert to basic
      if ((executionStyle === 'archer' || executionStyle === 'typewriter') && gripWidth !== 'wide') {
        if (widthChanged) {
          setExecutionStyle('basic');
        }
      }

      // If user selected Australian progression -> Change high bar to low bar
      if (legProgChanged && (legProgression && legProgression.toString().includes('australian'))) {
        if (equipment === 'pull-up bar') {
          setEquipment('low bar');
        }
      }

      // If user selected Pull-up bar -> Remove Australian progression
      if (equipChanged && equipment === 'pull-up bar') {
        if (legProgression && legProgression.toString().includes('australian')) {
          setLegProgression('none');
        }
      }
    }

    prevEquipmentRef.current = equipment;
    prevStyleRef.current = executionStyle;
    prevPositionRef.current = position;
    prevLegProgressionRef.current = legProgression;
    prevGripRef.current = grip;
    prevGripWidthRef.current = gripWidth;
  }, [equipment, executionStyle, position, legProgression, grip, gripWidth, currentExercise]);

  const handleStyleChange = (style: ExecutionStyle) => {
    setExecutionStyle(style);
    if (style === 'archer' || style === 'typewriter') {
      setGripWidth('wide');
    } else if (style === 'commando') {
      setGripWidth('narrow');
      setGrip('neutral');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validSets = sets.filter(s => (s.reps && s.reps > 0) || (s.time && s.time > 0));
    if (validSets.length === 0) return;

    onSave({
      id: initialData?.id || crypto.randomUUID(),
      exerciseId,
      type: currentExercise?.name || 'Unknown',
      grip,
      gripWidth,
      thumb,
      falseGrip,
      equipment,
      executionStyle,
      executionMethod,
      oneArmHandPosition: executionStyle === 'one arm' ? oneArmHandPosition : undefined,
      oneLegPrimaryPosition: legProgression === 'one leg' ? oneLegPrimaryPosition : undefined,
      oneLegSecondaryPosition: legProgression === 'one leg' ? oneLegSecondaryPosition : undefined,
      position,
      legProgression,
      loadType,
      assistanceValue: loadType !== 'bodyweight' ? assistanceValue : undefined,
      assistanceDetails: loadType === 'assisted' ? {
        placement: bandPlacements,
        loopType: bandLoopType,
      } : undefined,
      sets: validSets,
      notes,
      shared,
      timestamp: Date.now(),
    });

    resetForm();
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
                   <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block mb-3">Šířka Úchopu (Width)</label>
                   <div className="flex flex-wrap gap-2">
                      {GRIP_WIDTHS.map(w => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setGripWidth(w)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                            gripWidth === w ? "bg-white text-black border-white shadow-lg" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20"
                          )}
                        >
                          {w === 'shoulder-width' ? 'Šířka ramen' : w === 'narrow' ? 'Úzký' : 'Široký'}
                        </button>
                      ))}
                   </div>
                 </div>

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

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/60 block mb-3">Pozice palce (Thumb)</label>
                      <div className="flex flex-wrap gap-2">
                         {THUMBS.map(t => (
                           <button
                             key={t.val}
                             type="button"
                             onClick={() => setThumb(t.val)}
                             className={cn(
                               "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex-1 text-center",
                               thumb === t.val ? "bg-white text-black border-white shadow-lg" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20"
                             )}
                           >
                             {t.label.split(' ')[0]}
                           </button>
                         ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400 block mb-3">False Grip</label>
                      <button
                        type="button"
                        onClick={() => setFalseGrip(!falseGrip)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all w-full text-center h-[38px] flex items-center justify-center",
                          falseGrip ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20"
                        )}
                      >
                        {falseGrip ? 'AKTIVNÍ' : 'NEAKTIVNÍ'}
                      </button>
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
                   <label className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/60 block mb-3">Styl Cviku (Style)</label>
                   <div className="flex flex-wrap gap-2">
                      {availableExecutionStyles.map(style => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => handleStyleChange(style)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                            executionStyle === style ? "bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/20" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20"
                          )}
                        >
                          {style === 'basic' ? 'Základní' : 
                           style === 'one arm' ? 'Jedna ruka' : 
                           style === 'archer' ? 'Archer' : 
                           style === 'typewriter' ? 'Typewriter' : 
                           style === 'commando' ? 'Commando' : 
                           style === 'high' ? 'Vysoké' : 
                           style === 'korean' ? 'Korejské' : 'Australské'}
                        </button>
                      ))}
                   </div>
                 </div>

                 {executionStyle === 'one arm' && (
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
                   <label className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/60 block mb-3">Metoda/Tempo (Method)</label>
                    <div className="flex flex-wrap gap-2">
                       {EXECUTION_METHODS.map(method => (
                         <button
                           key={method}
                           type="button"
                           onClick={() => setExecutionMethod(method)}
                           className={cn(
                             "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                             executionMethod === method ? "bg-white/20 text-white border-white/20 shadow-lg" : "bg-black/20 text-slate-600 border-white/5 hover:border-white/20"
                           )}
                         >
                           {method === 'standard' ? 'Standardní' : 
                            method === 'explosive' ? 'Explozivní' : 
                            method === 'partial' ? 'Částečné' : 
                            method === 'negative' ? 'Negativní' : 
                            method === 'scapula' ? 'Lopatkové' : 'Kontrolované'}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div>
                   <label className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/60 block mb-3">Tělesná Pozice (Core)</label>
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
                          {pos === 'neutral' ? 'Neutrální' : pos}
                        </button>
                      ))}
                   </div>
                  </div>

                  <div>
                   <label className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/60 block mb-3">Progrese Nohou (Legs)</label>
                   <div className="flex flex-wrap gap-2">
                      {LEG_PROGRESSIONS.map(prog => (
                        <button
                          key={prog}
                          type="button"
                          onClick={() => setLegProgression(prog)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                            legProgression === prog ? "bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/20" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20"
                          )}
                        >
                          {prog === 'none' ? 'Základní (Sounož)' : prog}
                        </button>
                      ))}
                   </div>
                  </div>

                  {legProgression === 'one leg' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-4 border-t border-white/5 pb-4"
                    >
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400 block mb-2">První noha (Primary Leg)</label>
                        <div className="flex flex-wrap gap-2">
                          {SINGLE_LEG_POSITIONS.map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => {
                                setOneLegPrimaryPosition(p);
                                if (p === oneLegSecondaryPosition) {
                                  const fallback = SINGLE_LEG_POSITIONS.find(lp => lp !== p) || 'tuck';
                                  setOneLegSecondaryPosition(fallback as any);
                                }
                              }}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all flex-1 text-center min-w-[80px]",
                                oneLegPrimaryPosition === p ? "bg-cyan-500 text-black border-cyan-400" : "bg-black/40 text-slate-500 border-white/5"
                              )}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400/60 block mb-2">Druhá noha (Secondary Leg)</label>
                        <div className="flex flex-wrap gap-2">
                          {SINGLE_LEG_POSITIONS.filter(p => p !== oneLegPrimaryPosition).map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setOneLegSecondaryPosition(p)}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all flex-1 text-center min-w-[80px]",
                                oneLegSecondaryPosition === p ? "bg-cyan-500 text-black border-cyan-400" : "bg-black/40 text-slate-500 border-white/5"
                              )}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
              </div>
           </div>
        </div>

        {/* LOAD & ASSISTANCE */}
        <div className="p-8 bg-orange-500/5 rounded-[32px] border border-orange-500/10">
           <div className="flex flex-col items-stretch gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 flex items-center gap-2">
                   <Target size={14} /> Konfigurace Zátěže
                </label>
                <div className="flex gap-2">
                   {(['bodyweight', 'weighted', 'assisted'] as LoadType[]).map(lt => (
                     <button
                        key={lt}
                        type="button"
                        onClick={() => setLoadType(lt)}
                        className={cn(
                          "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                          loadType === lt ? "bg-orange-500 text-black border-orange-400 shadow-lg" : "bg-black/20 text-slate-500 border-white/5 hover:border-white/20"
                        )}
                     >
                        {lt === 'bodyweight' ? 'Vlastní' : lt === 'weighted' ? 'Zatížení (+)' : 'Odlehčení (-)'}
                     </button>
                   ))}
                </div>
              </div>

              {loadType !== 'bodyweight' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-col sm:flex-row items-end gap-4">
                    <div className="flex-1 space-y-4 w-full">
                      <label className="text-[8px] font-black uppercase tracking-[0.3em] text-orange-500/60 block px-2">
                        {loadType === 'weighted' ? 'Extra Hmotnost (kg)' : 'Metoda Odlehčení (Guma/Stroj/Dopomoc)'}
                      </label>
                      <input 
                        type="text"
                        placeholder={loadType === 'weighted' ? "Např. 10..." : "Např. Červená guma..."}
                        value={assistanceValue}
                        onChange={(e) => setAssistanceValue(e.target.value)}
                        className="w-full bg-black/40 border border-orange-500/20 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-orange-500 italic"
                      />
                    </div>
                    {loadType === 'assisted' && (
                      <div className="bg-black/20 p-2 rounded-2xl border border-white/5 h-[54px] flex items-center">
                        <button
                          type="button"
                          onClick={() => setBandLoopType(bandLoopType === 'single' ? 'double' : 'single')}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[7px] font-black uppercase tracking-widest transition-all",
                            bandLoopType === 'double' ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20" : "bg-white/10 text-slate-400"
                          )}
                        >
                          {bandLoopType === 'double' ? 'Dvojité' : 'Jednoduché'}
                        </button>
                      </div>
                    )}
                  </div>

                  {loadType === 'assisted' && (
                    <div className="space-y-4">
                      <label className="text-[8px] font-black uppercase tracking-[0.3em] text-orange-500/60 block px-2">Umístění Podpory</label>
                      <div className="flex flex-wrap gap-2">
                         {BAND_PLACEMENTS.map(p => (
                           <button
                             key={p}
                             type="button"
                             onClick={() => toggleBandPlacement(p)}
                             className={cn(
                               "px-4 py-2 rounded-xl text-[7px] font-black uppercase tracking-widest border transition-all flex-1 text-center",
                               bandPlacements.includes(p) ? "bg-orange-500 text-black border-orange-400" : "bg-black/40 text-slate-500 border-white/5"
                             )}
                           >
                             {p === 'one leg' ? 'Jedna noha' : p === 'both legs' ? 'Obě nohy' : p === 'waist' ? 'Pas' : p === 'back' ? 'Záda' : 'Kolena'}
                           </button>
                         ))}
                      </div>
                    </div>
                  )}
                </motion.div>
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
                    className="glass-card flex flex-col md:flex-row items-center gap-6 p-8 border-white/5 bg-white/5 rounded-[40px] group hover:border-cyan-500/30 transition-all shadow-xl"
                  >
                    <div className="flex items-center gap-4 min-w-[120px]">
                       <div className="w-12 h-12 rounded-[18px] bg-black/40 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/40 transition-colors">
                          <span className="text-xl font-black text-white italic">{index + 1}</span>
                       </div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Série</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-2">
                       <div className="flex items-center gap-6">
                          <button 
                            type="button" 
                            onClick={() => updateSet(index, isHoldExercise(exerciseId) ? 'time' : 'reps', Math.max(0, (isHoldExercise(exerciseId) ? (set.time || 0) : (set.reps || 0)) - 1))}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                          ><Minus size={18} /></button>
                          <input 
                             type="number"
                             value={isHoldExercise(exerciseId) ? (set.time || 0) : (set.reps || 0)}
                             onChange={(e) => updateSet(index, isHoldExercise(exerciseId) ? 'time' : 'reps', parseInt(e.target.value) || 0)}
                             className="bg-transparent text-5xl font-black text-white w-24 text-center focus:outline-none font-mono tracking-tighter"
                          />
                          <button 
                            type="button" 
                            onClick={() => updateSet(index, isHoldExercise(exerciseId) ? 'time' : 'reps', (isHoldExercise(exerciseId) ? (set.time || 0) : (set.reps || 0)) + 1)}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                          ><Plus size={18} /></button>
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">
                         {isHoldExercise(exerciseId) ? 'Sekund' : 'Opakování'}
                       </span>
                    </div>

                    <div className="flex justify-end min-w-[60px]">
                       <button 
                        type="button" 
                        onClick={() => removeSet(index)}
                        className="w-10 h-10 rounded-xl bg-red-500/5 text-slate-700 hover:text-red-500 hover:bg-red-500/10 transition-all p-2 flex items-center justify-center"
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
        <div className="pt-8 flex flex-col sm:flex-row gap-4">
           {initialData && onDelete && (
             <button
               type="button"
               onClick={onDelete}
               className="flex-1 py-7 bg-red-500/10 text-red-500 text-sm font-black uppercase tracking-[0.5em] rounded-[32px] border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
             >
               Smazat tento cvik
             </button>
           )}
           <button
             type="submit"
             className={cn(
               "flex-[2] py-7 text-sm font-black uppercase tracking-[0.5em] rounded-[32px] active:scale-95 transition-all shadow-2xl group relative overflow-hidden",
               initialData ? "bg-cyan-500 text-black shadow-cyan-500/10" : "bg-white text-black shadow-white/5 hover:bg-cyan-500"
             )}
           >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
             <div className="flex items-center justify-center gap-4 relative z-10">
               {initialData ? <Edit3 size={24} /> : <Check size={24} />}
               {initialData ? 'Aktualizovat Blok' : 'Uložit do tréninku'}
             </div>
           </button>
        </div>
      </form>
    </div>
  );
};
