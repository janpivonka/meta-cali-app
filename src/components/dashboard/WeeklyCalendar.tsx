import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Check, Square, Circle, X, ArrowRight } from 'lucide-react';
import { Workout } from '../../types';
import { cn, formatDate } from '../../lib/utils';

interface WeeklyCalendarProps {
  workouts: Workout[];
  onViewHistory: () => void;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ workouts, onViewHistory }) => {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDayDetail, setSelectedDayDetail] = useState<number | null>(null);

  const days = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  const today = new Date();

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getDate() === d2.getDate();

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

  const getStatus = (date: Date) => {
    const hasLog = Array.isArray(workouts) && workouts.some(w => w && w.timestamp && isSameDay(new Date(w.timestamp), date));
    if (hasLog) return 'trained';
    if (date.getDay() === 0) return 'rest';
    if (date.getTime() > today.getTime()) return 'planned';
    return 'nothing';
  };

  // History Calendar State
  const [historyYear, setHistoryYear] = useState(today.getFullYear());
  const [historyMonth, setHistoryMonth] = useState(today.getMonth());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Weekly Scan</span>
        <button 
          onClick={() => setShowCalendarModal(true)}
          className="text-[10px] text-slate-400 hover:text-cyan-500 font-black uppercase tracking-widest flex items-center gap-2"
        >
          <CalendarIcon size={12} /> History
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((date, index) => {
          const status = getStatus(date);
          const dayLabel = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
          const isToday = formatDate(date.getTime()) === formatDate(today.getTime());

          return (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedDayDetail(date.getTime())}
              className={cn(
                "glass-card p-3 flex flex-col items-center justify-center gap-2 border-white/5 bg-white/30 dark:bg-white/5 relative cursor-pointer",
                isToday ? "border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.1)]" : ""
              )}
            >
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

      <AnimatePresence>
        {showCalendarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowCalendarModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Operation History</h2>
                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
                  <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-cyan-500">
                    <ArrowRight size={20} className="rotate-180" />
                  </button>
                  <div className="flex gap-2">
                    <select 
                      value={historyMonth} 
                      onChange={(e) => setHistoryMonth(parseInt(e.target.value))}
                      className="bg-transparent text-white font-black uppercase text-xs outline-none cursor-pointer hover:text-cyan-500 appearance-none text-center"
                    >
                      {monthNames.map((m, i) => (
                        <option key={m} value={i} className="bg-slate-900 text-white">{m}</option>
                      ))}
                    </select>
                    <select 
                      value={historyYear}
                      onChange={(e) => setHistoryYear(parseInt(e.target.value))}
                      className="bg-transparent text-white font-black uppercase text-xs outline-none cursor-pointer hover:text-cyan-500 appearance-none text-center"
                    >
                      {Array.from({ length: 10 }, (_, i) => today.getFullYear() - 5 + i).map(y => (
                        <option key={y} value={y} className="bg-slate-900 text-white">{y}</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={handleNextMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-cyan-500">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {days.map(d => (
                  <div key={d} className="text-[10px] font-black text-[#94a3b8] text-center uppercase py-2">{d}</div>
                ))}
                {Array.from({ length: getFirstDayOfMonth(historyYear, historyMonth) }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square opacity-0" />
                ))}
                {Array.from({ length: getDaysInMonth(historyYear, historyMonth) }).map((_, i) => {
                  const day = i + 1;
                  const date = new Date(historyYear, historyMonth, day);
                  const status = getStatus(date);
                  const isDayToday = isSameDay(date, today);

                  return (
                    <motion.div
                      key={day}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setSelectedDayDetail(date.getTime());
                        setShowCalendarModal(false);
                      }}
                      className={cn(
                        "aspect-square glass-card flex flex-col items-center justify-center gap-1 text-xs font-black border-white/5 cursor-pointer relative",
                        isDayToday ? "border-cyan-500/40 bg-cyan-500/10" : "hover:border-white/20"
                      )}
                    >
                      <span className={cn(isDayToday ? "text-cyan-400" : "text-white")}>{day}</span>
                      <div className="flex items-center justify-center">
                        {status === 'trained' && <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]" />}
                        {status === 'planned' && <div className="w-1 h-1 bg-orange-500" />}
                        {status === 'rest' && <div className="w-1 h-1 rounded-full border border-green-500" />}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trained</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Planned</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full border border-green-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rest Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Record</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <button 
                  onClick={() => {
                    setShowCalendarModal(false);
                    onViewHistory();
                  }}
                  className="w-full py-4 bg-white/5 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all border border-white/10"
                >
                  View Operational History
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDayDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, x: 50 }}
              animate={{ scale: 1, x: 0 }}
              className="glass-card w-full max-w-lg p-10 relative"
            >
               <button 
                onClick={() => setSelectedDayDetail(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
              <div className="space-y-6">
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">Day Detail</span>
                <h3 className="text-4xl font-black text-white italic">{formatDate(selectedDayDetail)}</h3>
                
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Training Status</span>
                    <span className="text-green-500 font-black uppercase">COMPLETED</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Log Volume</span>
                    <span className="text-white font-black italic">140 REPS</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                   <button className="w-full py-4 bg-cyan-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                      Edit Data
                   </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
