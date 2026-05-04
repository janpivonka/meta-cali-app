import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Check, Square, Circle } from 'lucide-react';
import { Workout } from '../../types';
import { cn, formatDate } from '../../lib/utils';
import { useCalendarLogic } from '../../hooks/useCalendarLogic';
import { CalendarModal } from './CalendarModal';
import { DayDetailModal } from './DayDetailModal';

interface WeeklyCalendarProps {
  workouts: Workout[];
  onViewHistory: () => void;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ workouts, onViewHistory }) => {
  const {
    showCalendarModal, setShowCalendarModal,
    selectedDayDetail, setSelectedDayDetail,
    historyYear, setHistoryYear,
    historyMonth, setHistoryMonth,
    getStatus, isSameDay,
    handlePrevMonth, handleNextMonth,
    today
  } = useCalendarLogic(workouts);

  const days = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

  const getMonday = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const monday = getMonday(today);
  const calendarDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Weekly Scan</span>
        <button onClick={() => setShowCalendarModal(true)} className="text-[10px] text-slate-400 hover:text-cyan-500 font-black uppercase tracking-widest flex items-center gap-2"><CalendarIcon size={12} /> History</button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((date, index) => {
          const status = getStatus(date);
          const dayLabel = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
          const isToday = formatDate(date.getTime()) === formatDate(today.getTime());

          return (
            <motion.div key={index} whileHover={{ y: -5 }} onClick={() => setSelectedDayDetail(date.getTime())} className={cn("glass-card p-3 flex flex-col items-center justify-center gap-2 border-white/5 bg-white/30 dark:bg-white/5 relative cursor-pointer", isToday ? "border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.1)]" : "")}>
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-black text-[#94a3b8] uppercase tracking-tighter mb-0.5">{dayLabel}</span>
                <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{date.getDate()}</span>
              </div>
              <div className="w-6 h-6 flex items-center justify-center">
                {status === 'trained' && <Check size={18} className="text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.4)]" />}
                {status === 'planned' && <Square size={14} className="text-orange-500 fill-orange-500/20" />}
                {status === 'nothing' && <Circle size={14} className="text-red-500 opacity-40 hover:opacity-100 transition-opacity" />}
                {status === 'rest' && <Circle size={14} className="text-green-500 fill-green-500/20" />}
              </div>
            </motion.div>
          );
        })}
      </div>

      <CalendarModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        historyYear={historyYear}
        historyMonth={historyMonth}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
        setHistoryMonth={setHistoryMonth}
        setHistoryYear={setHistoryYear}
        getStatus={getStatus}
        setSelectedDayDetail={setSelectedDayDetail}
        onViewHistory={onViewHistory}
        today={today}
        isSameDay={isSameDay}
      />

      <DayDetailModal timestamp={selectedDayDetail} onClose={() => setSelectedDayDetail(null)} />
    </div>
  );
};

