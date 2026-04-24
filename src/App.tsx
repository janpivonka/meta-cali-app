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
    if (editingIndex !== null && currentWorkout) {
      const updatedExercises = [...currentWorkout.exercises];
      updatedExercises[editingIndex] = log;
      setCurrentWorkout({ ...currentWorkout, exercises: updatedExercises });
      setEditingIndex(null);
    } else {
      if (!currentWorkout) {
        const newWorkout: Workout = {
          id: crypto.randomUUID(),
          exercises: [log],
          timestamp: Date.now(),
        };
        setCurrentWorkout(newWorkout);
      } else {
        setCurrentWorkout({
          ...currentWorkout,
          exercises: [...currentWorkout.exercises, log]
        });
      }
    }

    // Scroll to builder after saving
    setTimeout(() => {
      builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    if (editingIndex === index) {
      setEditingIndex(null);
    } else {
      setEditingIndex(index);
      // Scroll to grip section
      setTimeout(() => {
        document.getElementById('grip-width-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    }
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
                      <button 
                        onClick={() => handleEditExercise(i)}
                        className={cn(
                          "w-full text-left p-4 rounded-[24px] border transition-all group flex items-center justify-between gap-4 cursor-grab active:cursor-grabbing",
                          editingIndex === i 
                            ? "bg-cyan-500/20 border-cyan-500/40 translate-x-1 shadow-lg shadow-cyan-500/5" 
                            : "bg-black/40 border-white/5 hover:border-white/10"
                        )}
                      >
                        <div className="flex items-center gap-4 flex-1 overflow-hidden">
                          <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black italic shrink-0",
                            editingIndex === i ? "bg-cyan-500 text-black" : "bg-white/5 text-slate-400 group-hover:text-white transition-colors"
                          )}>
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span className="text-[11px] font-black text-white uppercase tracking-tighter italic truncate">{ex.type}</span>
                              <span className="text-[11px] font-black text-slate-700">/</span>
                              <span className="text-[10px] font-black text-cyan-500/80 uppercase tracking-widest bg-cyan-500/5 px-2 py-0.5 rounded-lg border border-cyan-500/10">
                                {ex.loadType === 'bodyweight' ? 'Bodyweight' : 
                                 ex.loadType === 'weighted' ? `Weight+ (${ex.assistanceValue}kg)` : 
                                 `Weight- (${ex.assistanceValue})`}
                              </span>
                              {ex.loadType === 'assisted' && ex.assistanceDetails && (
                                <span className="text-[8px] font-bold text-orange-500/60 uppercase">
                                  {ex.assistanceDetails.loopType === 'double' ? 'Double' : 'Single'} band • 
                                  {(ex.assistanceDetails.placement as BandPlacement[] || []).map(p => 
                                    p === 'one foot' ? 'One Foot' : 
                                    p === 'both feet' ? 'Both Feet' : 
                                    p === 'knees' ? 'Knees' : 
                                    p === 'waist' ? 'Waist' : 
                                    p === 'buttocks' ? 'Buttocks' : 'Chest'
                                  ).join(', ')}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                              {/* Physical Parameters */}
                              <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                                  {ex.executionStyle === 'commando' ? 'Commando' : (
                                    <>
                                      {ex.executionStyle !== 'one arm' && (ex.gripWidth === 'wide' ? 'Wide ' : ex.gripWidth === 'narrow' ? 'Narrow ' : 'Shoulder-width ')}
                                      {ex.grip}
                                    </>
                                  )}
                                  {ex.thumb && ` • ${ex.thumb === 'under' ? 'Under' : 'Over'} thumb`}
                                  {ex.falseGrip && ` • False Grip`}
                                </span>
                              </div>
                              
                              {/* Tactical Params */}
                              <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
                                <span className="text-[8px] font-black text-purple-400 uppercase tracking-tighter italic">
                                  {ex.executionStyle !== 'basic' && ex.executionStyle !== 'commando' && `${ex.executionStyle} • `}
                                  {ex.oneArmHandPosition && ex.executionStyle === 'one arm' && `(${ex.oneArmHandPosition}) • `}
                                  {ex.executionMethod}
                                  {ex.position && ex.position !== 'neutral' && ex.position !== 'standard' && ` • ${ex.position}`}
                                  {ex.legProgression && ex.legProgression !== 'full' && ` • ${ex.legProgression}`}
                                  {ex.isOneLeg && ex.legProgression !== 'one leg' && ex.oneLegPrimaryPosition && ` (One Leg: ${ex.oneLegPrimaryPosition})`}
                                  {ex.legProgression === 'one leg' && ex.oneLegPrimaryPosition && ex.oneLegSecondaryPosition && ` (${ex.oneLegPrimaryPosition}/${ex.oneLegSecondaryPosition})`}
                                  {ex.equipment && ` @ ${ex.equipment}`}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-1 ml-auto">
                                {ex.sets.map((s, si) => (
                                  <div key={si} className="flex items-center">
                                    <span className="text-[10px] font-black text-white font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                      {s.reps || s.time}{s.reps ? 'r' : 's'}
                                    </span>
                                    {si < ex.sets.length - 1 && <span className="text-[10px] text-slate-700 mx-0.5">|</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {ex.notes && (
                              <div className="mt-2 flex items-start gap-2 bg-white/5 p-2 rounded-xl border border-white/5 opacity-50 group-hover:opacity-100 transition-opacity">
                                <MessageSquare size={10} className="text-cyan-500 shrink-0 mt-0.5" />
                                <p className="text-[9px] font-medium text-slate-400 italic line-clamp-1">{ex.notes}</p>
                              </div>
                            )}
                          </div>
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
                      </button>
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
                 }} 
                 onDelete={isEditing ? () => handleRemoveExerciseFromWorkout(editingIndex!) : undefined}
                 initialExerciseId={preSelectedExerciseId}
                 initialData={currentEditingData}
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
                          <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                            <div className="flex-1 space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-base font-black text-white uppercase tracking-tight italic">{exercise?.name || log.type}</p>
                                {log.executionStyle && log.executionStyle !== 'basic' && (
                                  <span className="text-[9px] font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 uppercase tracking-widest">
                                    {log.executionStyle}
                                  </span>
                                )}
                                {log.executionMethod && log.executionMethod !== 'standard' && (
                                  <span className="text-[9px] font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 uppercase tracking-widest">
                                    {log.executionMethod}
                                  </span>
                                )}
                                {log.grip && (
                                  <span className="text-[8px] font-black bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 uppercase tracking-tighter shadow-sm flex items-center gap-1">
                                    {log.gripWidth && `${log.gripWidth} `}{log.grip} {log.thumb && `(${log.thumb})`}
                                    {log.falseGrip && <span className="text-cyan-400 ml-1">• FALSE</span>}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-[8px] font-black uppercase tracking-widest text-slate-500">
                                {log.equipment && <span>• {log.equipment}</span>}
                                {log.position && <span>• {log.position}</span>}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-end sm:max-w-[40%]">
                              {log.sets.map((s, i) => (
                                <div key={i} className="flex flex-col items-center px-4 py-2 bg-black/40 rounded-2xl border border-white/5 min-w-[60px] shadow-inner group-hover:border-cyan-500/10 transition-colors">
                                  <div className="flex items-baseline gap-0.5">
                                    <span className="text-lg font-black text-cyan-400 font-mono leading-none">
                                      {s.reps || s.time}
                                    </span>
                                    <span className="text-[8px] font-black text-cyan-800 uppercase">
                                      {s.reps ? 'R' : 'S'}
                                    </span>
                                  </div>
                                  {s.weight && (
                                    <span className="text-[9px] text-purple-400 font-black mt-1 leading-none">+{s.weight}KG</span>
                                  )}
                                </div>
                              ))}
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
