import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyYear: number;
  historyMonth: number;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  setHistoryMonth: (m: number) => void;
  setHistoryYear: (y: number) => void;
  getStatus: (date: Date) => string;
  setSelectedDayDetail: (t: number) => void;
  onViewHistory: () => void;
  today: Date;
  isSameDay: (d1: Date, d2: Date) => boolean;
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  return firstDay === 0 ? 6 : firstDay - 1;
};

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen, onClose, historyYear, historyMonth, handlePrevMonth, handleNextMonth,
  setHistoryMonth, setHistoryYear, getStatus, setSelectedDayDetail, onViewHistory,
  today, isSameDay
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass-card w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Operation History</h2>
              <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-cyan-500"><ArrowRight size={20} className="rotate-180" /></button>
                <div className="flex gap-2">
                  <select value={historyMonth} onChange={(e) => setHistoryMonth(parseInt(e.target.value))} className="bg-transparent text-white font-black uppercase text-xs outline-none cursor-pointer hover:text-cyan-500 appearance-none text-center">
                    {monthNames.map((m, i) => <option key={m} value={i} className="bg-slate-900 text-white">{m}</option>)}
                  </select>
                  <select value={historyYear} onChange={(e) => setHistoryYear(parseInt(e.target.value))} className="bg-transparent text-white font-black uppercase text-xs outline-none cursor-pointer hover:text-cyan-500 appearance-none text-center">
                    {Array.from({ length: 10 }, (_, i) => today.getFullYear() - 5 + i).map(y => <option key={y} value={y} className="bg-slate-900 text-white">{y}</option>)}
                  </select>
                </div>
                <button onClick={handleNextMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-cyan-500"><ArrowRight size={20} /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {days.map(d => <div key={d} className="text-[10px] font-black text-[#94a3b8] text-center uppercase py-2">{d}</div>)}
              {Array.from({ length: getFirstDayOfMonth(historyYear, historyMonth) }).map((_, i) => <div key={`empty-${i}`} className="aspect-square opacity-0" />)}
              {Array.from({ length: getDaysInMonth(historyYear, historyMonth) }).map((_, i) => {
                const day = i + 1;
                const date = new Date(historyYear, historyMonth, day);
                const status = getStatus(date);
                const isDayToday = isSameDay(date, today);
                return (
                  <motion.div key={day} whileHover={{ scale: 1.05 }} onClick={() => { setSelectedDayDetail(date.getTime()); onClose(); }} className={cn("aspect-square glass-card flex flex-col items-center justify-center gap-1 text-xs font-black border-white/5 cursor-pointer relative", isDayToday ? "border-cyan-500/40 bg-cyan-500/10" : "hover:border-white/20")}>
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
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trained</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-orange-500" /><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Planned</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full border border-green-500" /><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rest Day</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-700" /><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Record</span></div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <button onClick={() => { onClose(); onViewHistory(); }} className="w-full py-4 bg-white/5 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all border border-white/10">View Operational History</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
