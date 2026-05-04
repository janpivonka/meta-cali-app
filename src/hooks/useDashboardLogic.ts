import { useState } from 'react';
import { Workout } from '../types';

export const useDashboardLogic = (workouts: Workout[]) => {
  const [activeTab, setActiveTab] = useState<'zaklad' | 'osobni' | 'verejne'>('zaklad');

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getDate() === d2.getDate();

  const today = new Date();

  const totalSets = Array.isArray(workouts) 
    ? workouts.reduce((acc, w) => acc + (w.exercises || []).reduce((exAcc, ex) => exAcc + (ex.sets || []).length, 0), 0)
    : 0;
  
  const calculateStreak = () => {
    if (!Array.isArray(workouts) || workouts.length === 0) return 0;
    let streak = 0;
    const hasLogToday = workouts.some(w => w && w.timestamp && isSameDay(new Date(w.timestamp), today));
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const hasLogYesterday = workouts.some(w => w && w.timestamp && isSameDay(new Date(w.timestamp), yesterday));

    if (!hasLogToday && !hasLogYesterday) return 0;

    let checkDate = hasLogToday ? today : yesterday;
    while (true) {
      const dayLogs = workouts.filter(w => w && w.timestamp && isSameDay(new Date(w.timestamp), checkDate));
      if (dayLogs.length > 0) {
        streak++;
        const prevDay = new Date(checkDate);
        prevDay.setDate(prevDay.getDate() - 1);
        checkDate = prevDay;
      } else break;
      if (streak > 3650) break;
    }
    return streak;
  };

  const streak = calculateStreak();

  return {
    activeTab, setActiveTab,
    totalSets,
    streak,
    today
  };
};
