import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Explorer } from './components/Explorer';
import { WorkoutForm } from './components/WorkoutForm';
import { AiInsights } from './components/AiInsights';
import { Profile } from './components/Profile';
import { ExerciseLog, UserProfile, Workout, ExerciseDefinition, BandPlacement } from './types';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { Activity, Github, Twitter, Instagram, Sun, Moon, Share2, Edit3, MessageSquare } from 'lucide-react';
import { EXERCISE_LIBRARY } from './data/exerciseLibrary';
import { cn } from './lib/utils';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Karel Operator',
  weight: 82,
  height: 185,
  bio: 'Calisthenics operative focused on static elements and progressive telemetry.',
  posts: 124,
  followers: 1204,
  following: 85,
  favoriteExercises: ['pullups', 'planche'],
  goals: [
    { exercise: 'Pull-ups', targetValue: 15, currentValue: 12, progress: 80, metric: 'reps' },
    { exercise: 'Push-ups', targetValue: 40, currentValue: 35, progress: 87, metric: 'reps' },
    { exercise: 'Dips', targetValue: 20, currentValue: 18, progress: 90, metric: 'reps' },
    { exercise: 'Planche', targetValue: 5, currentValue: 2, progress: 40, metric: 'sec' },
    { exercise: 'Front Lever', targetValue: 5, currentValue: 3, progress: 60, metric: 'sec' }
  ],
  trophies: ['🥇 PULL-UPS PRO', '🎖️ PLANCHE SURVIVOR', '⚡ MUSCLE-UP ELITE', '🛡️ IRON CORE']
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [preSelectedExerciseId, setPreSelectedExerciseId] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingSetIndex, setEditingSetIndex] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(true);
  const builderRef = useRef<HTMLDivElement>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedWorkouts = localStorage.getItem('meta-cali-workouts');
    const savedProfile = localStorage.getItem('meta-cali-profile');
    const savedTheme = localStorage.getItem('meta-cali-theme');
    const savedCurrentWorkout = localStorage.getItem('meta-cali-current-workout');
    
    if (savedWorkouts) {
      try {
        setWorkouts(JSON.parse(savedWorkouts));
      } catch (e) {
        console.error("Failed to parse workouts", e);
      }
    }

    if (savedCurrentWorkout) {
      try {
        setCurrentWorkout(JSON.parse(savedCurrentWorkout));
      } catch (e) {
        console.error("Failed to parse current workout", e);
      }
    }

    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        // Goal migration from object to array if needed
        if (parsedProfile && parsedProfile.goals && !Array.isArray(parsedProfile.goals)) {
          parsedProfile.goals = DEFAULT_PROFILE.goals;
        }
        setProfile(parsedProfile);
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }

    if (savedTheme !== null) {
      setIsDark(savedTheme === 'true');
    }
  }, []);

  // Sync theme class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('meta-cali-theme', String(isDark));
  }, [isDark]);

  // Save data to localStorage on change
  useEffect(() => {
    localStorage.setItem('meta-cali-workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('meta-cali-current-workout', JSON.stringify(currentWorkout));
  }, [currentWorkout]);

  useEffect(() => {
    localStorage.setItem('meta-cali-profile', JSON.stringify(profile));
  }, [profile]);

  const handleAddExerciseToWorkout = (log: ExerciseLog) => {
    setCurrentWorkout(prev => {
      if (!prev) {
        return {
          id: crypto.randomUUID(),
          exercises: [log],
          timestamp: Date.now(),
        };
      }

      // Check by ID first to be absolutely sure we don't duplicate
      const existingByIdIndex = prev.exercises.findIndex(ex => ex.id === log.id);
      
      if (editingIndex !== null || existingByIdIndex !== -1) {
        const indexToUpdate = editingIndex !== null ? editingIndex : existingByIdIndex;
        const updatedExercises = [...prev.exercises];
        updatedExercises[indexToUpdate] = log;
        return { ...prev, exercises: updatedExercises };
      } else {
        return {
          ...prev,
          exercises: [...prev.exercises, log]
        };
      }
    });

    setEditingIndex(null);
    setEditingSetIndex(null);
    setPreSelectedExerciseId(null);

    // Scroll to builder after saving
    setTimeout(() => {
      builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleReorderExercises = (newExercises: ExerciseLog[]) => {
    if (currentWorkout) {
      setCurrentWorkout({ ...currentWorkout, exercises: newExercises });
    }
  };

  const handleRemoveExerciseFromWorkout = (index: number) => {
    if (currentWorkout) {
      const updatedExercises = currentWorkout.exercises.filter((_, i) => i !== index);
      if (updatedExercises.length === 0) {
        setCurrentWorkout(null);
      } else {
        setCurrentWorkout({ ...currentWorkout, exercises: updatedExercises });
      }
      setEditingIndex(null);
    }
  };

  const handleSaveWorkout = () => {
    if (currentWorkout && currentWorkout.exercises.length > 0) {
      setWorkouts(prev => [currentWorkout, ...prev]);
      setCurrentWorkout(null);
      setActiveTab('stats');
    }
  };

  const handleCancelWorkout = () => {
    if (window.confirm('Are you sure you want to cancel the unsaved workout?')) {
      setCurrentWorkout(null);
    }
  };

  const handleStartExercise = (ex: ExerciseDefinition) => {
    setPreSelectedExerciseId(ex.id);
    setActiveTab('log');
    // Scroll to grip section after tab change
    setTimeout(() => {
      document.getElementById('grip-width-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
  };

  const handleEditExercise = (index: number) => {
    setActiveTab('log');
    if (editingIndex === index && editingSetIndex === null) {
      setEditingIndex(null);
    } else {
      setEditingIndex(index);
      setEditingSetIndex(null);
      // Scroll to grip section
      setTimeout(() => {
        document.getElementById('grip-width-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    }
  };

  const handleEditSet = (exerciseIndex: number, setIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab('log');
    setEditingIndex(exerciseIndex);
    setEditingSetIndex(setIndex);
    
    // Scroll to the specific set in the form
    setTimeout(() => {
      const el = document.getElementById(`set-item-${setIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('animate-pulse-cyan');
        setTimeout(() => el.classList.remove('animate-pulse-cyan'), 2000);
      } else {
        // Fallback to grip section if set element not found (maybe form not fully rendered)
        document.getElementById('grip-width-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 500);
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard workouts={workouts} />;
      case 'explorer':
        return <Explorer profile={profile} onUpdateProfile={handleUpdateProfile} onAddExercise={handleStartExercise} />;
      case 'log':
        const isEditing = editingIndex !== null;
        const currentEditingData = isEditing && currentWorkout ? currentWorkout.exercises[editingIndex] : null;

        return (
          <div className="space-y-8 max-w-5xl mx-auto pb-20">
            {currentWorkout && currentWorkout.exercises.length > 0 && (
              <div 
                ref={builderRef}
                className="glass-card p-6 border-cyan-500/20 bg-cyan-500/5 rounded-[40px] mb-8"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-6">
                  <div>
                    <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">Stavba Mise (Session Builder)</h3>
                    <p className="text-sm font-black text-white italic mt-1 tracking-tight">Aktuálně rozpracováno: {currentWorkout.exercises.length} cviků</p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button 
                      onClick={handleCancelWorkout}
                      className="flex-1 sm:flex-none px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all transition-transform active:scale-95"
                    >
                      Zrušit Vše
                    </button>
                    {!isEditing && (
                      <button 
                        onClick={handleSaveWorkout}
                        className="flex-2 sm:flex-none px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        Finalizovat & Uložit
                      </button>
                    )}
                  </div>
                </div>
                
                <Reorder.Group 
                  axis="y" 
                  values={currentWorkout.exercises} 
                  onReorder={handleReorderExercises}
                  className="space-y-3"
                >
                  {currentWorkout.exercises.map((ex, i) => (
                    <Reorder.Item 
                      value={ex} 
                      key={ex.id}
                      className="relative overflow-visible"
                    >
                      <div 
                        onClick={() => handleEditExercise(i)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleEditExercise(i);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`Edit ${ex.type}`}
                        className={cn(
                          "w-full text-left p-4 rounded-[24px] border transition-all group flex items-center justify-between gap-4 cursor-pointer",
                          editingIndex === i 
                            ? "bg-cyan-500/20 border-cyan-500/40 translate-x-1 shadow-lg shadow-cyan-500/5" 
                            : "bg-black/40 border-white/5 hover:border-white/10"
                        )}
                      >
                        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black italic shrink-0",
                              editingIndex === i ? "bg-cyan-500 text-black" : "bg-white/5 text-slate-400 group-hover:text-white transition-colors"
                            )}>
                              {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                               <div className="flex items-baseline gap-2">
                                 <span className="text-[12px] font-black text-white/50 uppercase tracking-widest italic py-2">
                                   Session Fragment Execution
                                 </span>
                               </div>

                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {ex.sets.map((s, si) => {
                                    // Categories for set-specific display
                                    const exName = EXERCISE_LIBRARY.find(e => e.id === ex.exerciseId)?.name || ex.type;
                                    
                                    const loadTag = [];
                                    const effectiveLType = s.loadType || ex.loadType;
                                    const effectiveUnit = s.weightUnit || ex.weightUnit || 'kg';
                                    const resTotal = s.assistanceDetails?.resistance || s.weight || (effectiveLType === 'weighted' ? s.weight : null) || ex.assistanceValue;
                                    if (effectiveLType === 'bodyweight') loadTag.push('BODYWEIGHT');
                                    else if (effectiveLType === 'weighted') loadTag.push(`WEIGHT- (${s.weight || resTotal || 0}${effectiveUnit.toUpperCase()})`);
                                    else loadTag.push(`ASSIST- (${resTotal || '?'})`);

                                    const gripLine = [];
                                    const gWidth = s.gripWidth || ex.gripWidth || 'shoulder-width';
                                    const gType = s.grip || ex.grip || 'pronated';
                                    const gThumb = s.thumb || ex.thumb || 'under';
                                    const gFalse = (s.falseGrip !== undefined ? s.falseGrip : ex.falseGrip) ? 'FALSE GRIP' : null;
                                    const gEquip = s.equipment || ex.equipment || 'pull-up bar';

                                    gripLine.push(gWidth);
                                    gripLine.push(gType);
                                    gripLine.push(`${gThumb} THUMB`);
                                    if (gFalse) gripLine.push(gFalse);
                                    gripLine.push(`@ ${gEquip}`);
  
                                    const execLine = [];
                                    const eStyle = s.executionStyle || ex.executionStyle || 'basic';
                                    const eMethod = s.executionMethod || ex.executionMethod || 'standard';
                                    const ePos = s.position || ex.position || 'neutral';
                                    const eLeg = s.legProgression || ex.legProgression || 'full';
                                    const eHand = s.oneArmHandPosition || ex.oneArmHandPosition;
                                    const eOneLeg = s.isOneLeg || ex.isOneLeg;

                                    execLine.push(eStyle);
                                    execLine.push(eMethod);
                                    execLine.push(ePos);
                                    execLine.push(eLeg);
                                    if (eStyle === 'one arm' && eHand && eHand !== 'free') execLine.push(`H:${eHand}`);
                                    if (eOneLeg) execLine.push(`1L:${s.oneLegPrimaryPosition || ex.oneLegPrimaryPosition || 'full'}`);
  
                                    const orangeLine = [];
                                    // Primary load display in header loadTag, but details here
                                    const res = s.assistanceDetails?.resistance || ex.assistanceValue;
                                    const effectiveLoadType = s.loadType || ex.loadType;
                                    if (effectiveLoadType === 'assisted' && res) {
                                      orangeLine.push(`${res} BAND`);
                                      const p = s.assistanceDetails?.placement || (ex.assistanceDetails?.placement as any);
                                      if (p) orangeLine.push(Array.isArray(p) ? p.join('/') : p);
                                      if (s.assistanceDetails?.loopType || ex.assistanceDetails?.loopType) {
                                        orangeLine.push((s.assistanceDetails?.loopType || ex.assistanceDetails?.loopType) === 'double' ? 'WRAP' : 'SINGLE');
                                      }
                                    }
                                    if (s.weight && s.weight > 0 && effectiveLoadType !== 'weighted') orangeLine.push(`+${s.weight}${effectiveUnit.toUpperCase()}`);
                                    
                                    const isHighlighted = editingIndex === i && editingSetIndex === si;
  
                                    const currentLoadLabel = (() => {
                                      const effectiveLoadType = s.loadType || ex.loadType;
                                      if (effectiveLoadType === 'bodyweight') return 'BODYWEIGHT';
                                      if (s.weight && s.weight > 0) return `WEIGHTED (+${s.weight}${effectiveUnit.toUpperCase()})`;
                                      if (effectiveLoadType === 'assisted' && res) return `ASSISTED (${res})`;
                                      if (effectiveLoadType === 'weighted') return `WEIGHTED (${res || 0}${effectiveUnit.toUpperCase()})`;
                                      return 'BODYWEIGHT';
                                    })();

                                    return (
                                      <button 
                                        key={si} 
                                        onClick={(e) => handleEditSet(i, si, e)}
                                        className={cn(
                                          "w-full p-3.5 rounded-2xl border transition-all text-left flex flex-col gap-2 relative group/set overflow-hidden",
                                          isHighlighted
                                            ? "bg-cyan-500 border-cyan-400 shadow-xl"
                                            : "bg-black/40 border-white/5 text-white hover:border-white/10"
                                        )}
                                      >
                                        {/* Set Header: Exercise + Load Tag */}
                                        <div className="flex items-center gap-2 mb-0.5">
                                          <span className={cn(
                                            "text-[10px] font-black italic uppercase tracking-tighter",
                                            isHighlighted ? "text-black" : "text-white"
                                          )}>
                                            {exName}
                                          </span>
                                          <span className="text-[9px] font-black text-slate-800/30">/</span>
                                          <div className={cn(
                                            "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border",
                                            isHighlighted ? "bg-black/10 border-black/10 text-black/60" : "bg-cyan-500/5 border-cyan-500/10 text-cyan-400"
                                          )}>
                                            {currentLoadLabel}
                                          </div>
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                          {/* Orange Line: Assistance */}
                                          {orangeLine.length > 0 && (
                                            <div className="flex flex-wrap gap-x-2 gap-y-1">
                                              {orangeLine.map((p, pidx) => (
                                                <span key={pidx} className={cn(
                                                  "text-[7px] font-black uppercase italic",
                                                  isHighlighted ? "text-black/70" : "text-orange-400"
                                                )}>
                                                  {pidx > 0 && "• "}{p}
                                                </span>
                                              ))}
                                            </div>
                                          )}

                                          {/* Gray Line: Grip */}
                                          {gripLine.length > 0 && (
                                            <div className="flex flex-wrap gap-x-2 gap-y-1">
                                              {gripLine.map((p, pidx) => (
                                                <span key={pidx} className={cn(
                                                  "text-[7px] font-bold uppercase",
                                                  isHighlighted ? "text-black/60" : "text-slate-500"
                                                )}>
                                                  {pidx > 0 && "• "}{p}
                                                </span>
                                              ))}
                                            </div>
                                          )}

                                          {/* Purple Line: Execution */}
                                          {execLine.length > 0 && (
                                            <div className="flex flex-wrap gap-x-2 gap-y-1">
                                              {execLine.map((p, pidx) => (
                                                <span key={pidx} className={cn(
                                                  "text-[7px] font-black uppercase italic",
                                                  isHighlighted ? "text-black" : "text-purple-400"
                                                )}>
                                                  {pidx > 0 && "• "}{p}
                                                </span>
                                              ))}
                                            </div>
                                          )}
                                        </div>

                                        {/* Bottom Right Reps Badge */}
                                        <div className={cn(
                                          "absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/40 border border-white/5 flex items-baseline gap-0.5",
                                          isHighlighted && "bg-black/20 border-black/10"
                                        )}>
                                          <span className={cn(
                                            "text-[10px] font-black font-mono",
                                            isHighlighted ? "text-black" : "text-white"
                                          )}>
                                            {s.reps || s.time}
                                          </span>
                                          <span className={cn(
                                            "text-[7px] font-black uppercase",
                                            isHighlighted ? "text-black/60" : "text-slate-500"
                                          )}>
                                            {s.reps ? 'r' : 's'}
                                          </span>
                                          {s.weight !== undefined && s.weight > 0 && effectiveLoadType !== 'weighted' && (
                                            <span className={cn(
                                              "text-[10px] font-black font-mono ml-1",
                                              isHighlighted ? "text-black" : "text-orange-400"
                                            )}>
                                              +{s.weight}{(s.weightUnit || ex.weightUnit || 'kg').toLowerCase() === 'kg' ? 'k' : 'lb'}
                                            </span>
                                          )}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              
                                {ex.notes && (
                                  <div className="mt-4 flex items-start gap-2 bg-white/5 p-3 rounded-2xl border border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <MessageSquare size={12} className="text-cyan-500 shrink-0 mt-0.5" />
                                    <p className="text-[10px] font-medium text-slate-300 italic whitespace-normal leading-relaxed">{ex.notes}</p>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                          <div className="w-1 h-8 rounded-full bg-white/5 flex flex-col justify-center gap-1 items-center px-[1px]">
                             <div className="w-[2px] h-[2px] rounded-full bg-slate-600" />
                             <div className="w-[2px] h-[2px] rounded-full bg-slate-600" />
                             <div className="w-[2px] h-[2px] rounded-full bg-slate-600" />
                          </div>
                          <Edit3 size={14} className={cn(
                            "transition-all",
                            editingIndex === i ? "text-cyan-500 scale-125" : "text-slate-700 opacity-0 group-hover:opacity-100"
                          )} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>
            )}

            <div className="relative">
               {isEditing && (
                 <div className="absolute -top-12 left-0 right-0 flex justify-center">
                    <button 
                      onClick={() => setEditingIndex(null)}
                      className="bg-white text-black px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
                    >
                      + Add new block instead of editing
                    </button>
                 </div>
               )}
               <WorkoutForm 
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
      case 'stats':
        return (
          <div className="space-y-6 max-w-4xl mx-auto pb-20">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Operation History</h2>
            <div className="grid gap-4">
              {workouts.length > 0 ? (
                [...workouts].reverse().map((workout) => (
                  <div key={workout.id} className="glass-card p-0 border-white/5 bg-white/5 group hover:border-cyan-500/20 transition-all overflow-hidden rounded-[32px]">
                    <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-black font-black italic">W</div>
                        <div>
                          <p className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-[0.25em]">{new Date(workout.timestamp).toLocaleString()}</p>
                          <p className="text-xs font-black text-white uppercase tracking-widest mt-0.5">{workout.exercises.length} EXERCISES • {workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)} SETS</p>
                        </div>
                      </div>
                      <Share2 size={16} className="text-slate-500 hover:text-cyan-400 cursor-pointer transition-colors" />
                    </div>
                    <div className="p-6 space-y-6">
                      {workout.exercises.map((log) => {
                        const exercise = EXERCISE_LIBRARY.find(e => e.id === log.exerciseId);
                        return (
                          <div key={log.id} className="flex flex-col gap-6 pb-12 border-b border-white/5 last:border-0 last:pb-0">
                            <div>
                               <span className="text-[12px] font-black text-white/20 uppercase tracking-widest italic mb-4 block">
                                 Mission Execution Fragment
                               </span>

                               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {log.sets.map((s, si) => {
                                  // Categories for set-specific display
                                  const exName = EXERCISE_LIBRARY.find(e => e.id === log.exerciseId)?.name || log.type;
                                  
                                  const loadTag = [];
                                  const effectiveLType = s.loadType || log.loadType;
                                  const effectiveUnit = s.weightUnit || log.weightUnit || 'kg';
                                  const resTotal = s.assistanceDetails?.resistance || s.weight || (effectiveLType === 'weighted' ? s.weight : null) || log.assistanceValue;
                                  if (effectiveLType === 'bodyweight') loadTag.push('BODYWEIGHT');
                                  else if (effectiveLType === 'weighted') loadTag.push(`WEIGHT- (${s.weight || resTotal || 0}${effectiveUnit.toUpperCase()})`);
                                  else loadTag.push(`ASSIST- (${resTotal || '?'})`);

                                  const gripLine = [];
                                  const gWidth = s.gripWidth || log.gripWidth || 'shoulder-width';
                                  const gType = s.grip || log.grip || 'pronated';
                                  const gThumb = s.thumb || log.thumb || 'under';
                                  const gFalse = (s.falseGrip !== undefined ? s.falseGrip : log.falseGrip) ? 'FALSE GRIP' : null;
                                  const gEquip = s.equipment || log.equipment || 'pull-up bar';
  
                                  gripLine.push(gWidth);
                                  gripLine.push(gType);
                                  gripLine.push(`${gThumb} THUMB`);
                                  if (gFalse) gripLine.push(gFalse);
                                  gripLine.push(`@ ${gEquip}`);
  
                                  const execLine = [];
                                  const eStyle = s.executionStyle || log.executionStyle || 'basic';
                                  const eMethod = s.executionMethod || log.executionMethod || 'standard';
                                  const ePos = s.position || log.position || 'neutral';
                                  const eLeg = s.legProgression || log.legProgression || 'full';
                                  const eHand = s.oneArmHandPosition || log.oneArmHandPosition;
                                  const eOneLeg = s.isOneLeg || log.isOneLeg;
  
                                  execLine.push(eStyle);
                                  execLine.push(eMethod);
                                  execLine.push(ePos);
                                  execLine.push(eLeg);
                                  if (eStyle === 'one arm' && eHand && eHand !== 'free') execLine.push(`H:${eHand}`);
                                  if (eOneLeg) execLine.push(`1L:${s.oneLegPrimaryPosition || log.oneLegPrimaryPosition || 'full'}`);
  
                                  const orangeLine = [];
                                  const effectiveLoadType = s.loadType || log.loadType;
                                  const res = s.assistanceDetails?.resistance || log.assistanceValue;
                                  if (effectiveLoadType === 'assisted' && res) {
                                    orangeLine.push(`${res} BAND`);
                                    const p = s.assistanceDetails?.placement || (log.assistanceDetails?.placement as any);
                                    if (p) orangeLine.push(Array.isArray(p) ? p.join('/') : p);
                                    if (s.assistanceDetails?.loopType || log.assistanceDetails?.loopType) {
                                      orangeLine.push((s.assistanceDetails?.loopType || log.assistanceDetails?.loopType) === 'double' ? 'WRAP' : 'SINGLE');
                                    }
                                  }
                                  if (s.weight && s.weight > 0 && effectiveLoadType !== 'weighted') orangeLine.push(`+${s.weight}${effectiveUnit.toUpperCase()}`);

                                  const currentLoadLabel = (() => {
                                    if (effectiveLoadType === 'bodyweight') return 'BODYWEIGHT';
                                    if (s.weight && s.weight > 0) return `WEIGHTED (+${s.weight}${effectiveUnit.toUpperCase()})`;
                                    if (effectiveLoadType === 'assisted' && res) return `ASSISTED (${res})`;
                                    if (effectiveLoadType === 'weighted') return `WEIGHTED (${res || 0}${effectiveUnit.toUpperCase()})`;
                                    return 'BODYWEIGHT';
                                  })();

                                       return (
                                    <div 
                                      key={si} 
                                      className="p-4 rounded-2xl border bg-black/40 border-white/5 text-white flex flex-col gap-2 relative overflow-hidden shadow-lg"
                                    >
                                      {/* Header */}
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[10px] font-black italic uppercase tracking-tighter text-white">
                                          {exName}
                                        </span>
                                        <span className="text-[9px] font-black text-slate-800/30">/</span>
                                        <div className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border bg-cyan-500/5 border-cyan-500/10 text-cyan-400">
                                          {currentLoadLabel}
                                        </div>
                                      </div>

                                      <div className="flex flex-col gap-1.5">
                                        {/* Orange Line */}
                                        {orangeLine.length > 0 && (
                                          <div className="flex flex-wrap gap-x-2 gap-y-1">
                                            {orangeLine.map((p, pidx) => (
                                              <span key={pidx} className="text-[7px] font-black uppercase italic text-orange-400">
                                                {pidx > 0 && "• "}{p}
                                              </span>
                                            ))}
                                          </div>
                                        )}

                                        {/* Gray Line */}
                                        {gripLine.length > 0 && (
                                          <div className="flex flex-wrap gap-x-2 gap-y-1">
                                            {gripLine.map((p, pidx) => (
                                              <span key={pidx} className="text-[7px] font-bold uppercase text-slate-500">
                                                {pidx > 0 && "• "}{p}
                                              </span>
                                            ))}
                                          </div>
                                        )}

                                        {/* Purple Line */}
                                        {execLine.length > 0 && (
                                          <div className="flex flex-wrap gap-x-2 gap-y-1">
                                            {execLine.map((p, pidx) => (
                                              <span key={pidx} className="text-[7px] font-black uppercase italic text-purple-400">
                                                {pidx > 0 && "• "}{p}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                      </div>

                                      {/* Bottom Right Badge */}
                                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/40 border border-white/5 flex items-baseline gap-0.5">
                                        <span className="text-[10px] font-black font-mono text-white">
                                          {s.reps || s.time}
                                        </span>
                                        <span className="text-[7px] font-black uppercase text-slate-500">
                                          {s.reps ? 'r' : 's'}
                                        </span>
                                        {s.weight !== undefined && s.weight > 0 && effectiveLoadType !== 'weighted' && (
                                          <span className="text-[10px] font-black font-mono ml-1 text-orange-400">
                                            +{s.weight}{(s.weightUnit || log.weightUnit || 'kg').toLowerCase() === 'kg' ? 'k' : 'lb'}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
                  <p className="text-slate-500 font-black uppercase tracking-widest italic">System archive is empty</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'ai':
        return <AiInsights workouts={workouts} />;
      case 'profile':
        return <Profile profile={profile} onSave={handleUpdateProfile} />;
      default:
        return <Dashboard workouts={workouts} />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col lg:flex-row font-sans overflow-x-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full flex flex-col min-h-screen pb-32 lg:pb-12 relative overflow-x-hidden">
        {/* Decorative Grid Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#22d3ee08,transparent)]"></div>
        </div>
        <header className="mb-8 lg:mb-12 flex justify-between items-start md:items-end">
          <div className="flex-1">
            <div className="flex items-center gap-3 lg:hidden mb-4">
              <h1 className="text-xl font-extrabold tracking-tighter bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent italic">
                META-CALI
              </h1>
              <span className="text-[8px] uppercase tracking-widest text-[#94a3b8] font-bold border border-white/10 px-1 rounded">v2.4</span>
            </div>
            <h2 className="text-cyan-500 text-[10px] font-extrabold uppercase tracking-[0.3em] mb-2 px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 w-fit rounded-md">Meta-Tactical OS</h2>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              {activeTab === 'dashboard' ? 'Monitor' : 
               activeTab === 'explorer' ? 'Explorer' :
               activeTab === 'log' ? 'Operation Log' : 
               activeTab === 'stats' ? 'Data Analysis' : 
               activeTab === 'profile' ? 'Configuration' : 'Meta-Processing'}
            </h1>
          </div>
          <div className="flex flex-col items-end gap-3">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-3 bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl hover:bg-white transition-all shadow-sm"
              title="Toggle theme"
            >
              {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-purple-600" />}
            </button>
            <div className="hidden md:block glass-card px-4 py-2 border-cyan-500/20">
              <p className="text-[#94a3b8] text-[9px] uppercase font-bold tracking-widest leading-none mb-1">Status</p>
              <div className="flex items-center gap-2 text-cyan-500 text-xs font-black">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                ACTIVE
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="mt-20 pt-8 border-t border-black/5 dark:border-white/5 pb-10 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 hover:opacity-100 transition-opacity relative z-10">
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-[#94a3b8] font-black uppercase tracking-widest hidden lg:inline">System-Status: Optimal</span>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors"><Twitter size={18} /></a>
              <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors"><Instagram size={18} /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github size={18} /></a>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
              by @PEONY_PRODUCTION
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-700 mt-1 uppercase tracking-tighter font-black">
              &copy; 2026 Meta-Cali Platform • Protocol-X Ready
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
