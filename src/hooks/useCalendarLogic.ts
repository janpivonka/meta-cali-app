import React, { useState } from 'react';
import { Workout } from '../types';

export const useCalendarLogic = (workouts: Workout[]) => {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDayDetail, setSelectedDayDetail] = useState<number | null>(null);
  const today = new Date();
  
  const [historyYear, setHistoryYear] = useState(today.getFullYear());
  const [historyMonth, setHistoryMonth] = useState(today.getMonth());

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getDate() === d2.getDate();

  const getStatus = (date: Date) => {
    const hasLog = Array.isArray(workouts) && workouts.some(w => w && w.timestamp && isSameDay(new Date(w.timestamp), date));
    if (hasLog) return 'trained';
    if (date.getDay() === 0) return 'rest';
    if (date.getTime() > today.getTime()) return 'planned';
    return 'nothing';
  };

  const handlePrevMonth = () => {
    if (historyMonth === 0) {
      setHistoryMonth(11);
      setHistoryYear(prev => prev - 1);
    } else {
      setHistoryMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (historyMonth === 11) {
      setHistoryMonth(0);
      setHistoryYear(prev => prev + 1);
    } else {
      setHistoryMonth(prev => prev + 1);
    }
  };

  return {
    showCalendarModal, setShowCalendarModal,
    selectedDayDetail, setSelectedDayDetail,
    historyYear, setHistoryYear,
    historyMonth, setHistoryMonth,
    getStatus, isSameDay,
    handlePrevMonth, handleNextMonth,
    today
  };
};
