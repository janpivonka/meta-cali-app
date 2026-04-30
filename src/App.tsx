import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Explorer } from './components/Explorer';
import { WorkoutForm } from './components/WorkoutForm';
import { AiInsights } from './components/AiInsights';
import { Profile } from './components/Profile';
import { MediaPreviewModal } from './components/MediaPreviewModal';
import { ExerciseLog, UserProfile, Workout, ExerciseDefinition, BandPlacement, ExerciseMedia } from './types';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { Activity, Github, Twitter, Instagram, Sun, Moon, Share2, Edit3, MessageSquare, GripVertical, Video, Camera, ArrowUp } from 'lucide-react';
import { EXERCISE_LIBRARY } from './data/exerciseLibrary';
import { cn, getMediaUrl, isHoldExercise, getSetMetadata, getColorFromMeta } from './lib/utils';
import { MediaRenderer } from './components/MediaRenderer';
import { getWorkoutsFromDB, saveWorkoutsToDB, getCurrentWorkoutFromDB, saveCurrentWorkoutToDB } from './lib/db';

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

interface SetReorderItemProps {
  group: {
    id: string;
    metaKey: string;
    meta: any;
    sets: any[];
    originalIndices: number[];
  };
  i: number;
  ex: any;
  editingIndex: number | null;
  editingSetIndex: number | null;
  handleEditSet: (exIndex: number, setIndex: number, e: React.MouseEvent) => void;
  onMediaClick: (media: ExerciseMedia[], index: number) => void;
  key?: React.Key;
}

function VolumeBadge({ subSummaries, unit, isHighlighted }: { subSummaries: {v: number, c: number}[], unit: string, isHighlighted: boolean }) {
  const UnitBox = ({ children }: { children: React.ReactNode }) => (
    <span className={cn(
      "inline-flex items-center justify-center w-2.5 h-2.5 rounded-[1px] text-[5px] font-black leading-none border transition-all duration-300 font-sans select-none",
      isHighlighted 
        ? "bg-black/20 border-black/10 text-black" 
        : "bg-white/20 border-white/10 text-white/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
    )}>
      {children}
    </span>
  );

  return (
    <div className="flex flex-wrap items-center justify-start gap-x-1 gap-y-1">
      {subSummaries.map((ss, idx) => (
        <div key={idx} className={cn(
          "flex items-center gap-0.5 px-1 py-0.5 rounded-[3px] border shadow-sm",
          isHighlighted 
            ? "bg-black/10 border-black/10" 
            : "bg-zinc-950 border-white/5"
        )}>
          {ss.c > 1 && (
            <div className="flex items-center gap-0.5">
              <span className={cn(
                "font-mono text-[9px] font-bold tracking-tight",
                isHighlighted ? "text-black" : "text-white"
              )}>{ss.c}</span>
              <UnitBox>S</UnitBox>
              <span className={cn(
                "text-[6px] font-bold opacity-30 mx-px",
                isHighlighted ? "text-black" : "text-white"
              )}>×</span>
            </div>
          )}
          <span className={cn(
            "font-mono text-[9px] font-bold tracking-tight",
            isHighlighted ? "text-black" : "text-white"
          )}>{ss.v}</span>
          <UnitBox>{unit.charAt(0).toUpperCase()}</UnitBox>
        </div>
      ))}
    </div>
  );
}

function SetReorderItem({ 
  group, 
  i, 
  ex, 
  editingIndex, 
  editingSetIndex, 
  handleEditSet, 
  onMediaClick
}: SetReorderItemProps) {
  const controls = useDragControls();
  const { sets, meta } = group;
  const firstSet = sets[0];
  const lastIndex = group.originalIndices[group.originalIndices.length - 1];
  
  const isHighlighted = editingIndex === i && editingSetIndex !== null && group.originalIndices.includes(editingSetIndex);
  const exName = EXERCISE_LIBRARY.find(e => e.id === ex.exerciseId)?.name || ex.type;
                                     
  const { currentLoadLabel, orangeLine, gripLine, armLine, coreLine, legLine } = meta;
  const unit = isHoldExercise(ex.exerciseId) ? 's' : 'R';
  
  const groupColor = getColorFromMeta(group.metaKey);

  // Group by reps/time for the summary
  const subSummaries: {v: number, c: number}[] = [];
  sets.forEach(s => {
    const v = s.reps || s.time || 0;
    if (subSummaries.length > 0 && subSummaries[subSummaries.length - 1].v === v) {
      subSummaries[subSummaries.length - 1].c++;
    } else {
      subSummaries.push({ v, c: 1 });
    }
  });

  return (
    <Reorder.Item 
      value={group} 
      key={group.id}
      id={group.id}
      dragListener={false}
      dragControls={controls}
      className="relative w-full group-reorder mb-2"
    >
      <div className="flex items-stretch gap-2">
        <button 
          onClick={(e) => handleEditSet(i, lastIndex, e)}
          className={cn(
            "flex-1 p-4 pb-3 border transition-all text-left flex flex-col gap-1.5 relative group/set overflow-hidden rounded-2xl",
            isHighlighted
              ? "bg-cyan-500 border-cyan-400 shadow-xl z-20"
              : "bg-black/80 border-white/10 text-white hover:border-white/20 shadow-lg"
          )}
          style={{ 
            borderColor: isHighlighted ? undefined : groupColor + '60',
            boxShadow: isHighlighted ? undefined : `0 10px 15px -3px ${groupColor}20`
          }}
        >
          {isHighlighted && (
            <div className="absolute inset-0 bg-cyan-500 opacity-10 animate-pulse pointer-events-none" />
          )}

          <div className="flex flex-row justify-between items-start gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
              <span className={cn(
                "text-[10px] font-black italic uppercase tracking-tighter shrink-0",
                isHighlighted ? "text-black" : "text-white"
              )}>
                {exName}
              </span>
              <span className={cn(
                "text-[8px] font-bold opacity-10 shrink-0",
                isHighlighted ? "text-black" : "text-white"
              )}>/</span>
              <div 
                className={cn(
                  "text-[7px] font-bold uppercase tracking-tight px-1.5 py-0.5 rounded-[4px] border shrink-0",
                  isHighlighted ? "bg-black/10 border-black/10 text-black/60" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                )}
                style={{ color: isHighlighted ? undefined : groupColor, borderColor: isHighlighted ? undefined : groupColor + '40' }}
              >
                {currentLoadLabel}
              </div>
            </div>

            <div className={cn(
              "px-1.5 py-1 rounded-lg border flex items-center shadow-md transition-all duration-300 shrink-0 max-w-[60%] mr-[26px]",
              isHighlighted ? "bg-white/10 border-white/20 shadow-none text-black" : "bg-white/5 border-white/5 text-white"
            )}>
              <VolumeBadge subSummaries={subSummaries} unit={unit} isHighlighted={isHighlighted} />
            </div>
          </div>

          <div className="flex flex-col gap-y-0.5 pr-2 select-none">
            <div className="flex flex-col gap-0.5 mb-1">
              {orangeLine.length > 0 && (
                <div className="flex items-baseline gap-x-1">
                  <span className={cn("text-[7px] font-black uppercase tracking-tighter opacity-40 shrink-0", isHighlighted ? "text-black" : "text-orange-400")}>ASSIST:</span>
                  <div className="flex flex-wrap items-baseline gap-x-1">
                    {orangeLine.map((p: any, pidx: number) => (
                      <span key={pidx} className={cn(
                        "text-[7px] font-black uppercase italic whitespace-nowrap",
                        isHighlighted ? "text-black/70" : "text-orange-400"
                      )}>
                        {pidx > 0 && "• "}{p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {gripLine.length > 0 && (
                <div className="flex items-baseline gap-x-1">
                  <span className={cn("text-[7px] font-black uppercase tracking-tighter opacity-40 shrink-0", isHighlighted ? "text-black" : "text-slate-500")}>GRIP:</span>
                  <div className="flex flex-wrap items-baseline gap-x-1">
                    {gripLine.map((p: any, pidx: number) => (
                      <span key={pidx} className={cn(
                        "text-[7px] font-bold uppercase whitespace-nowrap",
                        isHighlighted ? "text-black/60" : "text-slate-500"
                      )}>
                        {pidx > 0 && "• "}{p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {armLine.length > 0 && (
                <div className="flex items-baseline gap-x-1">
                  <span className={cn("text-[7px] font-black uppercase tracking-tighter opacity-40 shrink-0", isHighlighted ? "text-black" : "text-[#a855f7]")}>ARMS:</span>
                  <div className="flex flex-wrap items-baseline gap-x-1">
                    {armLine.map((p: any, pidx: number) => (
                      <span key={pidx} className={cn("text-[7px] font-black italic uppercase", isHighlighted ? "text-black/60" : "text-[#a855f7]")}>
                        {pidx > 0 && "• "}{p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {coreLine.length > 0 && (
                <div className="flex items-baseline gap-x-1">
                  <span className={cn("text-[7px] font-black uppercase tracking-tighter opacity-40 shrink-0", isHighlighted ? "text-black" : "text-[#a855f7]")}>CORE:</span>
                  <div className="flex flex-wrap items-baseline gap-x-1">
                    {coreLine.map((p: any, pidx: number) => (
                      <span key={pidx} className={cn("text-[7px] font-black italic uppercase", isHighlighted ? "text-black/60" : "text-[#a855f7]")}>
                        {pidx > 0 && "• "}{p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {legLine.length > 0 && (
                <div className="flex items-baseline gap-x-1">
                  <span className={cn("text-[7px] font-black uppercase tracking-tighter opacity-40 shrink-0", isHighlighted ? "text-black" : "text-[#a855f7]")}>LEGS:</span>
                  <div className="flex flex-wrap items-baseline gap-x-1">
                    {legLine.map((p: any, pidx: number) => (
                      <span key={pidx} className={cn("text-[7px] font-black italic uppercase", isHighlighted ? "text-black/60" : "text-[#a855f7]")}>
                        {pidx > 0 && "• "}{p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {sets.some(s => s.notes) && (
              <div className="mt-1 flex flex-col gap-0.5">
                {sets.map((s, idx) => s.notes && (
                  <p key={idx} className={cn(
                    "text-[9px] italic font-medium leading-tight line-clamp-1",
                    isHighlighted ? "text-black/70" : "text-slate-400"
                  )}>
                    {sets.length > 1 && <span className="opacity-40 mr-1">#{group.originalIndices[idx]+1}</span>}
                    "{s.notes}"
                  </p>
                ))}
              </div>
            )}
          </div>

          {sets.some(s => s.media && s.media.length > 0) && (
            <div className="flex gap-1.5 overflow-x-auto mt-2">
              {sets.flatMap(s => s.media || []).map((m: any, midx: number) => (
                <div 
                  key={midx} 
                  className="w-8 h-8 rounded-lg overflow-hidden border border-white/5 bg-black shrink-0 cursor-pointer pointer-events-auto transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMediaClick([m], 0);
                  }}
                >
                  <MediaRenderer url={m.url || m.thumbnail} type={m.type || 'image'} className="w-full h-full object-cover opacity-60 hover:opacity-100" />
                </div>
              ))}
            </div>
          )}
          
          <div 
            onPointerDown={(e) => controls.start(e)}
            className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-full max-h-[64px] flex flex-col justify-center gap-1 items-center cursor-grab active:cursor-grabbing hover:bg-white/5 rounded-xl transition-all z-30"
            style={{ touchAction: 'none' }}
          >
             <GripVertical size={16} className={cn(isHighlighted ? "text-black/40" : "text-slate-600")} />
          </div>
        </button>
      </div>
    </Reorder.Item>
  );
}



interface ExerciseReorderItemProps {
  ex: any;
  i: number;
  editingIndex: number | null;
  editingSetIndex: number | null;
  handleEditExercise: (index: number) => void;
  handleEditSet: (exIndex: number, setIndex: number, e: React.MouseEvent) => void;
  handleReorderSets: (exerciseId: string, newSets: any[]) => void;
  key?: React.Key;
}

function ExerciseReorderItem({ 
  ex, 
  i, 
  editingIndex, 
  editingSetIndex, 
  handleEditExercise, 
  handleEditSet, 
  handleReorderSets,
  onMediaClick
}: any) {
  const exerciseControls = useDragControls();

  // Group adjacent sets with identical metadata
  const groups: any[] = [];
  (ex.sets || []).forEach((s: any, si: number) => {
    const meta = getSetMetadata(s, ex);
    const metaKey = JSON.stringify({
      l: meta.currentLoadLabel,
      o: meta.orangeLine,
      g: meta.gripLine,
      e: meta.equipLine,
      a: meta.armLine,
      c: meta.coreLine,
      le: meta.legLine
    });

    if (groups.length > 0 && groups[groups.length - 1].metaKey === metaKey) {
      groups[groups.length - 1].sets.push(s);
      groups[groups.length - 1].originalIndices.push(si);
    } else {
      groups.push({
        id: `group-${ex.id}-${s.id}`,
        metaKey,
        meta,
        sets: [s],
        originalIndices: [si]
      });
    }
  });
  
  return (
    <Reorder.Item 
      value={ex} 
      key={ex.id}
      dragListener={false}
      dragControls={exerciseControls}
      className="relative overflow-visible"
    >
      <div 
        className={cn(
          "w-full text-left p-6 rounded-[32px] border transition-all group flex flex-col gap-6",
          (editingIndex === i && editingSetIndex === null)
            ? "bg-cyan-500/10 border-cyan-500/30 shadow-2xl shadow-cyan-500/10" 
            : "bg-black/40 border-white/5 hover:border-white/10"
        )}
      >
        <div className="flex flex-col gap-6 w-full">
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-4 flex-1" onClick={() => handleEditExercise(i)}>
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black italic shrink-0",
                editingIndex === i ? "bg-cyan-500 text-black" : "bg-white/5 text-slate-400 group-hover:text-white transition-colors"
              )}>
                {i + 1}
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic leading-none mb-2">
                  Session Fragment
                </span>
                {ex.media && ex.media.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pointer-events-auto">
                    {ex.media.map((m: any, midx: number) => (
                        <div 
                          key={midx} 
                          className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-black/40 cursor-pointer hover:border-cyan-500/50 transition-all relative"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMediaClick(ex.media, midx);
                          }}
                        >
                          {m?.type === 'image' ? (
                            <MediaRenderer url={m.url} type="image" className="w-full h-full object-cover pointer-events-none" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full relative pointer-events-none">
                              {m?.thumbnail ? (
                                <img src={m.thumbnail} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-cyan-500">
                                  <Video size={14} />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => handleEditExercise(i)}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  editingIndex === i ? "bg-cyan-500 text-black scale-110" : "bg-white/5 text-slate-700 hover:text-white"
                )}
              >
                <Edit3 size={16} />
              </button>
              
              <div 
                onPointerDown={(e) => exerciseControls.start(e)}
                className="w-10 h-10 rounded-xl bg-white/5 flex flex-col justify-center gap-1 items-center cursor-grab active:cursor-grabbing hover:bg-white/10 transition-all shadow-inner"
                style={{ touchAction: 'none' }}
              >
                 <div className="w-[3px] h-[3px] rounded-full bg-slate-600 transition-colors group-hover:bg-cyan-500" />
                 <div className="w-[3px] h-[3px] rounded-full bg-slate-600 transition-colors group-hover:bg-cyan-500" />
                 <div className="w-[3px] h-[3px] rounded-full bg-slate-600 transition-colors group-hover:bg-cyan-500" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Reorder.Group 
              axis="y" 
              values={groups} 
              onReorder={(newGroups) => {
                const flattened = newGroups.flatMap(g => g.sets);
                handleReorderSets(ex.id, flattened);
              }}
              className="flex flex-col w-full"
            >
              {groups.map((group) => (
                <SetReorderItem 
                  key={group.id}
                  group={group}
                  i={i}
                  ex={ex}
                  editingIndex={editingIndex}
                  editingSetIndex={editingSetIndex}
                  handleEditSet={handleEditSet}
                  onMediaClick={onMediaClick}
                />
              ))}
            </Reorder.Group>
          </div>

          {ex.notes && (
            <div className="mt-2 flex items-start gap-2 bg-white/5 p-3 rounded-2xl border border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
              <MessageSquare size={12} className="text-cyan-500 shrink-0 mt-0.5" />
              <p className="text-[10px] font-medium text-slate-300 italic whitespace-normal leading-relaxed">{ex.notes}</p>
            </div>
          )}
        </div>
      </div>
    </Reorder.Item>
  );
}


export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [preSelectedExerciseId, setPreSelectedExerciseId] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingSetIndex, setEditingSetIndex] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [previewMedia, setPreviewMedia] = useState<ExerciseMedia[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const builderRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLElement>(null);

  const handleMediaClick = (media: ExerciseMedia[], index: number) => {
    setPreviewMedia(media);
    setPreviewIndex(index);
    setIsPreviewOpen(true);
  };

  // Load data from IndexedDB on mount, with migration from localStorage
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // 1. Check for legacy localStorage data
      const savedWorkouts = localStorage.getItem('meta-cali-workouts');
      const savedCurrentWorkout = localStorage.getItem('meta-cali-current-workout');
      
      let workoutsToUse: Workout[] = [];
      let currentWorkoutToUse: Workout | null = null;

      // 2. Load from IndexedDB
      try {
        const dbWorkouts = await getWorkoutsFromDB();
        const dbCurrent = await getCurrentWorkoutFromDB();
        
        workoutsToUse = dbWorkouts || [];
        currentWorkoutToUse = dbCurrent;

        // 3. Migration logic: if DB is empty but localStorage has data, migrate it
        if (workoutsToUse.length === 0 && savedWorkouts) {
          try {
            const parsed = JSON.parse(savedWorkouts);
            if (Array.isArray(parsed) && parsed.length > 0) {
              workoutsToUse = parsed;
              await saveWorkoutsToDB(workoutsToUse);
              console.log("Migrated workouts to IDB");
            }
          } catch (e) {
            console.error("Migration failed", e);
          }
        }

        if (!currentWorkoutToUse && savedCurrentWorkout) {
          try {
            const parsed = JSON.parse(savedCurrentWorkout);
            if (parsed) {
              currentWorkoutToUse = parsed;
              await saveCurrentWorkoutToDB(currentWorkoutToUse);
              console.log("Migrated current workout to IDB");
            }
          } catch (e) {
            console.error("Current workout migration failed", e);
          }
        }

        setWorkouts(workoutsToUse);
        setCurrentWorkout(currentWorkoutToUse);
      } catch (e) {
        console.error("Error loading from IDB", e);
        // Fallback to localStorage if IDB fails
        if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
        if (savedCurrentWorkout) setCurrentWorkout(JSON.parse(savedCurrentWorkout));
      }

      // Load Profile and Theme (still in localStorage as they are small)
      const savedProfile = localStorage.getItem('meta-cali-profile');
      const savedTheme = localStorage.getItem('meta-cali-theme');
      
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
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
      
      setIsLoading(false);
    };

    loadData();
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

  // Save data to IndexedDB on change
  useEffect(() => {
    if (isLoading) return;
    saveWorkoutsToDB(workouts).catch(e => console.error("Failed to save workouts to IDB", e));
  }, [workouts, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    saveCurrentWorkoutToDB(currentWorkout).catch(e => console.error("Failed to save current workout to IDB", e));
  }, [currentWorkout, isLoading]);

  useEffect(() => {
    try {
      localStorage.setItem('meta-cali-profile', JSON.stringify(profile));
    } catch (e) {
      console.error("Failed to save profile", e);
    }
  }, [profile]);

  const handleAddExerciseToWorkout = (log: ExerciseLog) => {
    const safeUUID = () => {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
      }
      return Math.random().toString(36).substring(2, 15);
    };

    setCurrentWorkout(prev => {
      if (!prev) {
        return {
          id: safeUUID(),
          exercises: [log],
          timestamp: Date.now(),
        };
      }
      
      const updatedExercises = [...(prev.exercises || [])];
      // Check by ID first to be absolutely sure we don't duplicate
      const existingByIdIndex = updatedExercises.findIndex(ex => ex.id === log.id);
      
      if (editingIndex !== null || existingByIdIndex !== -1) {
        const indexToUpdate = editingIndex !== null ? editingIndex : existingByIdIndex;
        updatedExercises[indexToUpdate] = log;
      } else {
        updatedExercises.push(log);
      }
      return { ...prev, exercises: updatedExercises };
    });

    setEditingIndex(null);
    setEditingSetIndex(null);
    setPreSelectedExerciseId(null);

    // Explicit scroll to top after saving
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Also scroll builder into view to be sure
    setTimeout(() => {
      builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
  };

  const handleReorderExercises = (newExercises: ExerciseLog[]) => {
    if (currentWorkout) {
      setCurrentWorkout({ ...currentWorkout, exercises: newExercises });
    }
  };

  const handleReorderSets = (exerciseId: string, newSets: any[]) => {
    if (currentWorkout) {
      const updatedExercises = currentWorkout.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, sets: newSets } : ex
      );
      setCurrentWorkout({ ...currentWorkout, exercises: updatedExercises });
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
    if (!currentWorkout) return;
    const exercises = currentWorkout.exercises || [];
    if (exercises.length === 0) return;

    setWorkouts(prev => {
      const existing = Array.isArray(prev) ? prev : [];
      return [currentWorkout, ...existing];
    });
    setCurrentWorkout(null);
    setEditingIndex(null);
    setEditingSetIndex(null);
    setActiveTab('stats');
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelWorkout = () => {
    // Confirmation handled implicitly or just clear. 
    // To resolve "not responding", we remove the blocking confirm 
    // but keep a small safety check in the UI if needed
    setCurrentWorkout(null);
    setEditingIndex(null);
    setEditingSetIndex(null);
    setPreSelectedExerciseId(null);
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
    }
  };

  const handleEditSet = (exerciseIndex: number, setIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab('log');
    
    if (editingIndex === exerciseIndex && editingSetIndex === setIndex) {
      setEditingSetIndex(null);
    } else {
      setEditingIndex(exerciseIndex);
      setEditingSetIndex(setIndex);
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
                      className="flex-1 sm:flex-none px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all transform active:scale-95 shadow-lg shadow-red-500/5 group/cancel relative overflow-hidden"
                    >
                      <span className="relative z-10">Zrušit Vše</span>
                      <div className="absolute inset-0 bg-red-500 translate-y-full group-hover/cancel:translate-y-0 transition-transform duration-300" />
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
                    <ExerciseReorderItem
                      key={ex.id}
                      ex={ex}
                      i={i}
                      editingIndex={editingIndex}
                      editingSetIndex={editingSetIndex}
                      handleEditExercise={handleEditExercise}
                      handleEditSet={handleEditSet}
                      handleReorderSets={handleReorderSets}
                      onMediaClick={handleMediaClick}
                    />
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
                 key={editingIndex !== null ? `edit-${editingIndex}` : `new-${preSelectedExerciseId}`}
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
                          <p className="text-xs font-black text-white uppercase tracking-widest mt-0.5">{(workout.exercises || []).length} EXERCISES • {(workout.exercises || []).reduce((acc, ex) => acc + (ex.sets || []).length, 0)} SETS</p>
                        </div>
                      </div>
                      <Share2 size={16} className="text-slate-500 hover:text-cyan-400 cursor-pointer transition-colors" />
                    </div>
                    <div className="p-6 space-y-6">
                      {(workout.exercises || []).map((log) => {
                        const exercise = EXERCISE_LIBRARY.find(e => e.id === log.exerciseId);
                        return (
                          <div key={log.id} className="flex flex-col gap-6 pb-12 border-b border-white/5 last:border-0 last:pb-0">
                            <div>
                               <span className="text-[12px] font-black text-white/20 uppercase tracking-widest italic mb-4 block">
                                 Mission Execution Fragment
                               </span>

                               <div className="flex overflow-x-auto gap-4 pb-6 snap-x no-scrollbar">
                                 {(() => {
                                   const sets = log.sets || [];
                                   const groups: any[] = [];
                                   sets.forEach(s => {
                                     const meta = getSetMetadata(s, log);
                                     const metaKey = JSON.stringify({
                                       l: meta.currentLoadLabel,
                                       o: meta.orangeLine,
                                       g: meta.gripLine,
                                       e: meta.equipLine,
                                       a: meta.armLine,
                                       c: meta.coreLine,
                                       le: meta.legLine
                                     });
                                     const lastGroup = groups.length > 0 ? groups[groups.length - 1] : null;
                                     if (lastGroup && lastGroup.key === metaKey) {
                                       lastGroup.items.push(s);
                                       if (s.media) lastGroup.media.push(...s.media);
                                     } else {
                                       groups.push({ key: metaKey, metadata: meta, items: [s], media: s.media ? [...s.media] : [] });
                                     }
                                   });

                                   return groups.map((group, gi) => {
                                     const { metadata, items, media } = group;
                                     const { currentLoadLabel, orangeLine, gripLine, equipLine, armLine, coreLine, legLine } = metadata;
                                     const unit = isHoldExercise(log.exerciseId) ? 's' : 'R';
                                     
                                     const subGroups: { v: number; c: number }[] = [];
                                     items.forEach((s: any) => {
                                       const v = s.reps || s.time || 0;
                                       if (subGroups.length > 0 && subGroups[subGroups.length - 1].v === v) {
                                         subGroups[subGroups.length - 1].c++;
                                       } else {
                                         subGroups.push({ v, c: 1 });
                                       }
                                     });
                                     
                                     const exName = EXERCISE_LIBRARY.find(e => e.id === log.exerciseId)?.name || log.type;
                                     const groupColor = getColorFromMeta(group.key);

                                     return (
                                       <div 
                                         key={gi} 
                                         className="min-w-[240px] sm:min-w-[280px] p-4 rounded-2xl border bg-black/40 border-white/10 text-white flex flex-col gap-1.5 relative overflow-hidden shadow-lg snap-center"
                                         style={{ 
                                           borderColor: groupColor + '60',
                                           boxShadow: `0 10px 15px -3px ${groupColor}20`
                                         }}
                                       >
                                         <div className="flex flex-row justify-between items-start gap-2 mb-2">
                                           <div className="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
                                             <span className="text-[10px] font-black italic uppercase tracking-tighter text-white shrink-0">
                                               {exName}
                                             </span>
                                             <span className="text-[8px] font-bold text-white/10 shrink-0">/</span>
                                             <div 
                                               className="text-[7px] font-bold uppercase tracking-tight px-1 py-0.5 rounded-[3px] border bg-black/40 border-white/5 text-white/40 shrink-0 shadow-sm"
                                               style={{ color: groupColor, borderColor: groupColor + '40' }}
                                             >
                                                {currentLoadLabel}
                                             </div>
                                           </div>

                                           <div className="px-1.5 py-1 bg-white/[0.03] rounded-lg border border-white/5 flex items-center shadow-2xl shrink-0 max-w-[60%] mr-[26px]">
                                             <VolumeBadge subSummaries={subGroups} unit={unit} isHighlighted={false} />
                                           </div>
                                         </div>

                                         <div className="flex flex-col gap-y-0.5 pr-2 select-none">
                                           <div className="flex flex-col gap-0.5 mb-1">
                                             {orangeLine.length > 0 && (
                                               <div className="flex items-baseline gap-x-1">
                                                 <span className="text-[7px] font-black uppercase tracking-tighter text-orange-400 opacity-40 shrink-0">ASSIST:</span>
                                                 <div className="flex flex-wrap items-baseline gap-x-1">
                                                   {orangeLine.map((p: any, pidx: number) => (
                                                     <span key={pidx} className="text-[7px] font-black uppercase italic text-orange-400 whitespace-nowrap">
                                                       {pidx > 0 && "• "}{p}
                                                     </span>
                                                   ))}
                                                 </div>
                                               </div>
                                             )}

                                             {gripLine.length > 0 && (
                                               <div className="flex items-baseline gap-x-1">
                                                 <span className="text-[7px] font-black uppercase tracking-tighter text-slate-500 opacity-40 shrink-0">GRIP:</span>
                                                 <div className="flex flex-wrap items-baseline gap-x-1">
                                                   {gripLine.map((p: any, pidx: number) => (
                                                     <span key={pidx} className="text-[7px] font-bold uppercase text-slate-500 whitespace-nowrap">
                                                       {pidx > 0 && "• "}{p}
                                                     </span>
                                                   ))}
                                                 </div>
                                               </div>
                                             )}

                                             {armLine.length > 0 && (
                                               <div className="flex items-baseline gap-x-1">
                                                 <span className="text-[7px] font-black uppercase tracking-tighter text-[#a855f7] opacity-40 shrink-0">ARMS:</span>
                                                 <div className="flex flex-wrap items-baseline gap-x-1">
                                                   {armLine.map((p: any, pidx: number) => (
                                                     <span key={pidx} className="text-[7px] font-black uppercase italic text-[#a855f7] whitespace-nowrap">
                                                       {pidx > 0 && "• "}{p}
                                                     </span>
                                                   ))}
                                                 </div>
                                               </div>
                                             )}

                                             {coreLine.length > 0 && (
                                               <div className="flex items-baseline gap-x-1">
                                                 <span className="text-[7px] font-black uppercase tracking-tighter text-[#a855f7] opacity-40 shrink-0">CORE:</span>
                                                 <div className="flex flex-wrap items-baseline gap-x-1">
                                                   {coreLine.map((p: any, pidx: number) => (
                                                     <span key={pidx} className="text-[7px] font-black uppercase italic text-[#a855f7] whitespace-nowrap">
                                                       {pidx > 0 && "• "}{p}
                                                     </span>
                                                   ))}
                                                 </div>
                                               </div>
                                             )}

                                             {legLine.length > 0 && (
                                               <div className="flex items-baseline gap-x-1">
                                                 <span className="text-[7px] font-black uppercase tracking-tighter text-[#a855f7] opacity-40 shrink-0">LEGS:</span>
                                                 <div className="flex flex-wrap items-baseline gap-x-1">
                                                   {legLine.map((p: any, pidx: number) => (
                                                     <span key={pidx} className="text-[7px] font-black uppercase italic text-[#a855f7] whitespace-nowrap">
                                                       {pidx > 0 && "• "}{p}
                                                     </span>
                                                   ))}
                                                 </div>
                                               </div>
                                             )}
                                           </div>
                                         </div>

                                         {media.length > 0 && (
                                             <div className="flex gap-1 overflow-x-auto mt-1">
                                               {media.map((m: any, midx: number) => (
                                                 <div key={midx} className="w-6 h-6 rounded-md overflow-hidden bg-black/40 border border-white/5 shrink-0">
                                                   {m?.type === 'image' ? (
                                                     <MediaRenderer url={m.url} type="image" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                                                   ) : (
                                                     <div className="w-full h-full relative">
                                                       {m?.thumbnail ? (
                                                         <img src={m.thumbnail} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" alt="" />
                                                       ) : (
                                                         <div className="w-full h-full flex items-center justify-center text-cyan-500/40 transform scale-75"><Video size={8} /></div>
                                                       )}
                                                     </div>
                                                   )}
                                                 </div>
                                               ))}
                                             </div>
                                           )}
                                       </div>
                                     );
                                   });
                                 })()}
                               </div>

                              {/* Exercise Level notes and media */}
                              {(log.notes || (log.media && log.media.length > 0)) && (
                                <div className="mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
                                  {log.notes && (
                                    <div className="flex items-start gap-2">
                                      <MessageSquare size={12} className="text-cyan-500 shrink-0 mt-0.5" />
                                      <p className="text-[10px] font-medium text-slate-400 italic leading-relaxed">{log.notes}</p>
                                    </div>
                                  )}
                                  {log.media && log.media.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {log.media.map((m: any, midx: number) => (
                                        <div 
                                          key={midx} 
                                          className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-black/40 shrink-0 cursor-pointer hover:border-cyan-500/50 transition-all"
                                          onClick={() => handleMediaClick(log.media!, midx)}
                                        >
                                          {m?.type === 'image' ? (
                                            <MediaRenderer url={m.url} type="image" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                          ) : (
                                            <div className="w-full h-full relative">
                                              {m?.thumbnail ? (
                                                <img src={m.thumbnail} className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" alt="" />
                                              ) : (
                                                <div className="w-full h-full flex items-center justify-center text-cyan-500"><Video size={20} /></div>
                                              )}
                                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <Activity size={14} className="text-cyan-500 animate-pulse" />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
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
    <div className="min-h-screen bg-app flex flex-col lg:flex-row font-sans overflow-x-hidden selection:bg-cyan-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full flex flex-col min-h-screen pb-32 lg:pb-12 relative overflow-x-hidden bg-app">
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

        <MediaPreviewModal 
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          media={previewMedia}
          initialIndex={previewIndex}
        />

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
