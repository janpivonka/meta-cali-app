import React, { useState, useEffect } from 'react';
import { Workout, UserProfile, ExerciseLog, ExerciseDefinition, ExerciseMedia } from '../types';
import { getWorkoutsFromDB, saveWorkoutsToDB, getCurrentWorkoutFromDB, saveCurrentWorkoutToDB } from '../lib/db';

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

export const useAppLogic = () => {
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

  const handleMediaClick = (media: ExerciseMedia[], index: number) => {
    setPreviewMedia(media);
    setPreviewIndex(index);
    setIsPreviewOpen(true);
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const savedWorkouts = localStorage.getItem('meta-cali-workouts');
      const savedCurrentWorkout = localStorage.getItem('meta-cali-current-workout');
      
      let workoutsToUse: Workout[] = [];
      let currentWorkoutToUse: Workout | null = null;

      try {
        const dbWorkouts = await getWorkoutsFromDB();
        const dbCurrent = await getCurrentWorkoutFromDB();
        workoutsToUse = dbWorkouts || [];
        currentWorkoutToUse = dbCurrent;

        if (workoutsToUse.length === 0 && savedWorkouts) {
          try {
            const parsed = JSON.parse(savedWorkouts);
            if (Array.isArray(parsed) && parsed.length > 0) {
              workoutsToUse = parsed;
              await saveWorkoutsToDB(workoutsToUse);
            }
          } catch (e) { console.error(e); }
        }

        if (!currentWorkoutToUse && savedCurrentWorkout) {
          try {
            const parsed = JSON.parse(savedCurrentWorkout);
            if (parsed) {
              currentWorkoutToUse = parsed;
              await saveCurrentWorkoutToDB(currentWorkoutToUse);
            }
          } catch (e) { console.error(e); }
        }

        setWorkouts(workoutsToUse);
        setCurrentWorkout(currentWorkoutToUse);
      } catch (e) {
        console.error(e);
      }

      const savedProfile = localStorage.getItem('meta-cali-profile');
      const savedTheme = localStorage.getItem('meta-cali-theme');
      
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          if (parsedProfile && parsedProfile.goals && !Array.isArray(parsedProfile.goals)) {
            parsedProfile.goals = DEFAULT_PROFILE.goals;
          }
          setProfile(parsedProfile);
        } catch (e) { console.error(e); }
      }

      if (savedTheme !== null) setIsDark(savedTheme === 'true');
      setIsLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('meta-cali-theme', String(isDark));
  }, [isDark]);

  useEffect(() => {
    if (!isLoading) saveWorkoutsToDB(workouts);
  }, [workouts, isLoading]);

  useEffect(() => {
    if (!isLoading) saveCurrentWorkoutToDB(currentWorkout);
  }, [currentWorkout, isLoading]);

  useEffect(() => {
    localStorage.setItem('meta-cali-profile', JSON.stringify(profile));
  }, [profile]);

  const handleAddExerciseToWorkout = (log: ExerciseLog) => {
    const safeUUID = () => {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
      return Math.random().toString(36).substring(2, 15);
    };

    setCurrentWorkout(prev => {
      if (!prev) return { id: safeUUID(), exercises: [log], timestamp: Date.now() };
      const updatedExercises = [...(prev.exercises || [])];
      const existingByIdIndex = updatedExercises.findIndex(ex => ex.id === log.id);
      if (editingIndex !== null || existingByIdIndex !== -1) {
        const indexToUpdate = editingIndex !== null ? editingIndex : existingByIdIndex;
        updatedExercises[indexToUpdate] = log;
      } else updatedExercises.push(log);
      return { ...prev, exercises: updatedExercises };
    });

    setEditingIndex(null);
    setEditingSetIndex(null);
    setPreSelectedExerciseId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReorderExercises = (newExercises: ExerciseLog[]) => {
    if (currentWorkout) setCurrentWorkout({ ...currentWorkout, exercises: newExercises });
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
      if (updatedExercises.length === 0) setCurrentWorkout(null);
      else setCurrentWorkout({ ...currentWorkout, exercises: updatedExercises });
      setEditingIndex(null);
    }
  };

  const handleSaveWorkout = () => {
    if (!currentWorkout || (currentWorkout.exercises || []).length === 0) return;
    setWorkouts(prev => [currentWorkout!, ...prev]);
    setCurrentWorkout(null);
    setEditingIndex(null);
    setEditingSetIndex(null);
    setActiveTab('stats');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelWorkout = () => {
    setCurrentWorkout(null);
    setEditingIndex(null);
    setEditingSetIndex(null);
    setPreSelectedExerciseId(null);
  };

  const handleStartExercise = (ex: ExerciseDefinition) => {
    setPreSelectedExerciseId(ex.id);
    setActiveTab('log');
    setTimeout(() => {
      document.getElementById('grip-width-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
  };

  const handleEditExercise = (index: number) => {
    setActiveTab('log');
    setEditingIndex(editingIndex === index && editingSetIndex === null ? null : index);
    setEditingSetIndex(null);
  };

  const handleEditSet = (exerciseIndex: number, setIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab('log');
    const isSameSet = editingIndex === exerciseIndex && editingSetIndex === setIndex;
    setEditingIndex(exerciseIndex);
    setEditingSetIndex(isSameSet ? null : setIndex);
  };

  const handleUpdateProfile = (newProfile: UserProfile) => setProfile(newProfile);

  return {
    activeTab, setActiveTab,
    workouts, setWorkouts,
    currentWorkout, setCurrentWorkout,
    profile, setProfile,
    preSelectedExerciseId, setPreSelectedExerciseId,
    editingIndex, setEditingIndex,
    editingSetIndex, setEditingSetIndex,
    isDark, setIsDark,
    previewMedia, setPreviewMedia,
    previewIndex, setPreviewIndex,
    isPreviewOpen, setIsPreviewOpen,
    isLoading,
    handleMediaClick,
    handleAddExerciseToWorkout,
    handleReorderExercises,
    handleReorderSets,
    handleRemoveExerciseFromWorkout,
    handleSaveWorkout,
    handleCancelWorkout,
    handleStartExercise,
    handleEditExercise,
    handleEditSet,
    handleUpdateProfile
  };
};
