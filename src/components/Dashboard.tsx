import React, { useState } from 'react';
import { ExerciseLog } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Flame, 
  Heart, 
  ArrowRight, 
  Bookmark, 
  Clock, 
  Share2, 
  MoreHorizontal, 
  Play,
  Zap,
  Target,
  Plus,
  Compass,
  Bell,
  MessageSquare,
  Check,
  Circle,
  Square,
  Calendar as CalendarIcon,
  X
} from 'lucide-react';
import { cn, formatDate } from '../lib/utils';

interface DashboardProps {
  logs: ExerciseLog[];
}

export const Dashboard: React.FC<DashboardProps> = ({ logs }) => {
  const [activeTab, setActiveTab] = useState<'zaklad' | 'osobni' | 'verejne'>('zaklad');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDayDetail, setSelectedDayDetail] = useState<number | null>(null);

  // Dummy data for visual representation based on sketch
  const dailyChallenges = [
    { id: 1, title: 'Planche Flow', difficulty: 'EXTRÉMNÍ', time: '12 min', image: 'https://picsum.photos/seed/planche/400/200' },
    { id: 2, title: 'Explosive Power', difficulty: 'POKROČILÉ', time: '45 min', image: 'https://picsum.photos/seed/explosive/400/200' },
  ];

  const todayPlans = [
    { id: 1, title: 'Basics Strength', difficulty: 'STŘEDNÍ', sets: '5 Sérií', image: 'https://picsum.photos/seed/strength/400/200' },
  ];

  const recommended = [
    { id: 1, title: 'Muscle-Up Mastery', author: 'By Meta-Cali Specialist', image: 'https://picsum.photos/seed/muscleup/400/200' },
  ];

  // Calendar logic: Last 7 days
  const days = ['PO', 'ÚT', 'ST', 'ČT', 'PÁ', 'SO', 'NE'];
  const today = new Date();
  
  // Calculate Monday of the current week
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

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getDate() === d2.getDate();

  const getStatus = (date: Date) => {
    const hasLog = logs.some(l => isSameDay(new Date(l.timestamp), date));
    
    if (hasLog) return 'trained';
    if (date.getDay() === 0) return 'rest'; // Sunday as Rest
    if (date.getTime() > today.getTime()) return 'planned';
    return 'nothing';
  };

  // History Calendar State
  const [historyYear, setHistoryYear] = useState(today.getFullYear());
  const [historyMonth, setHistoryMonth] = useState(today.getMonth());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Map Sunday (0) to 6, Monday (1) to 0
  };

  const monthNames = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
  
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
    <div id="monitor-view" className="space-y-8 max-w-5xl mx-auto pb-20 relative">
      {/* Sketch Header Simulation */}
      <div className="flex items-center justify-between px-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-black font-black italic shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            M
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white italic">META-CALI</h1>
            <span className="text-[8px] uppercase tracking-[0.4em] text-slate-500 font-black block leading-none">Tactical Unit OS</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="relative w-10 h-10 ring-1 ring-white/10 rounded-full flex items-center justify-center hover:bg-white/5 transition-all text-slate-400 dark:text-slate-500 hover:text-cyan-500">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
          </button>
          <button className="w-10 h-10 ring-1 ring-white/10 rounded-full flex items-center justify-center hover:bg-white/5 transition-all text-slate-400 dark:text-slate-500 hover:text-cyan-500">
            <MessageSquare size={18} />
          </button>
        </div>
      </div>

      {/* Floating Instagram-style Plus Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-6 sm:right-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 text-black shadow-lg shadow-cyan-500/20 flex items-center justify-center z-[70] border border-white/20"
      >
        <Plus size={28} />
      </motion.button>

      {/* Top Tabs Navigation */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center sm:justify-start gap-4 md:gap-8 px-2">
          {[
            { id: 'zaklad', label: 'Základ' },
            { id: 'osobni', label: 'Osobní' },
            { id: 'verejne', label: 'Veřejné' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "text-xs font-black uppercase tracking-[0.2em] pb-2 transition-all relative",
                activeTab === tab.id 
                  ? "text-cyan-500 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-cyan-500 after:shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
                  : "text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex justify-center sm:justify-start px-2">
          <button className="text-[10px] font-black uppercase text-purple-400 hover:text-purple-300 transition-colors tracking-widest border border-purple-400/20 px-3 py-1 rounded-full">
            Upravit Selekci
          </button>
        </div>
      </div>

      {/* Motivational Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative glass-card overflow-hidden h-64 md:h-80 flex flex-col justify-end p-6 md:p-10 border-white/10">
          {/* Simulated Video/Image Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://picsum.photos/seed/motivation/1200/600?blur=4" 
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              alt="Motivace"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>
          
          <div className="relative z-10 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">Dnešní Axiom</span>
            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight max-w-2xl italic tracking-tight">
              "Limity existují pouze tam, kde končí tvoje <span className="text-cyan-400">představivost</span>. Tělo je jen nástroj."
            </h2>
          </div>

          <div className="relative z-10 mt-8 flex items-center justify-between border-t border-white/10 pt-4">
            <div className="flex gap-4">
              <Heart size={18} className="text-white/60 hover:text-pink-500 cursor-pointer transition-colors" />
              <Share2 size={18} className="text-white/60 hover:text-cyan-500 cursor-pointer transition-colors" />
              <ArrowRight size={18} className="text-white/60 hover:text-purple-500 cursor-pointer transition-colors" />
              <MoreHorizontal size={18} className="text-white/60 hover:text-white cursor-pointer transition-colors" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-white/40 tracking-widest">Ben J.</span>
              <Bookmark size={18} className="text-white/60 hover:text-yellow-500 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Consistency & Stats Bar */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-4 glass-card bg-black/5 dark:bg-white/5 border-none">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner">
              <Flame size={20} fill="currentColor" className="animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 dark:text-white leading-none">5</span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">STREAK</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Zap size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 dark:text-white leading-none">21</span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">SÉRIE</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
              <Target size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 dark:text-white leading-none">10</span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">CÍLY</span>
            </div>
          </div>
        </div>
        <div className="h-8 w-px bg-black/5 dark:bg-white/10 hidden md:block mx-4" />
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-green-500" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Consistency: <span className="text-green-500">OPTIMAL</span></span>
        </div>
      </div>

      {/* Weekly Calendar View */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Týdenní Scan</span>
          <button 
            onClick={() => setShowCalendarModal(true)}
            className="text-[10px] text-slate-400 hover:text-cyan-500 font-black uppercase tracking-widest flex items-center gap-2"
          >
            <CalendarIcon size={12} /> Historie
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
                
                {/* Status Indicators */}
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
      </div>

      {/* Daily Challenges Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.25em]">Dnešní Výzvy</h3>
          <ArrowRight size={16} className="text-slate-400" />
        </div>
        <div className="space-y-4">
          {dailyChallenges.map((challenge) => (
            <motion.div
              whileHover={{ x: 5 }}
              key={challenge.id}
              className="glass-card p-4 sm:p-5 flex items-center gap-4 sm:gap-6 group border-white/5"
            >
              <div className="w-20 h-16 sm:w-32 sm:h-20 rounded-2xl overflow-hidden relative flex-shrink-0">
                <img 
                  src={challenge.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt={challenge.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={20} className="text-white fill-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white truncate uppercase italic tracking-tight">{challenge.title}</h4>
                  <Clock size={12} className="text-slate-400" />
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{challenge.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-purple-500 uppercase tracking-widest">{challenge.difficulty}</span>
                  <div className="h-3 w-px bg-slate-200 dark:bg-white/10" />
                  <span className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-widest">Budík: 08:30</span>
                </div>
                <div className="flex gap-3 mt-3">
                  <Heart size={14} className="text-slate-400 hover:text-pink-500 cursor-pointer" />
                  <Bookmark size={14} className="text-slate-400 hover:text-yellow-500 cursor-pointer" />
                </div>
              </div>
              <button className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-cyan-500 hover:text-black transition-all">
                <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Today's Plan Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.25em]">Dnešní Plán</h3>
          <ArrowRight size={16} className="text-slate-400" />
        </div>
        <div className="space-y-4">
          {todayPlans.map((plan) => (
            <div
              key={plan.id}
              className="glass-card p-5 flex items-center gap-6 border-white/5"
            >
              <div className="w-32 h-20 rounded-2xl overflow-hidden glass-card p-0 border-none bg-black/20">
                <div className="w-full h-full flex items-center justify-center">
                   <Zap size={24} className="text-cyan-500 opacity-20" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase italic truncate tracking-tight mb-1">{plan.title}</h4>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">{plan.difficulty}</span>
                  <div className="h-3 w-px bg-white/10" />
                  <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">{plan.sets}</span>
                </div>
                <div className="flex gap-3 mt-3">
                  <Heart size={14} className="text-white/20" />
                  <Bookmark size={14} className="text-white/20" />
                </div>
              </div>
              <button className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-purple-600 transition-all">
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Stuff Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.25em]">Doporučeno</h3>
          <ArrowRight size={16} className="text-slate-400" />
        </div>
        <div className="space-y-4">
          {recommended.map((item) => (
            <div
              key={item.id}
              className="glass-card p-4 flex items-center gap-6 border-white/5 relative group"
            >
              <div className="w-24 h-16 rounded-xl overflow-hidden">
                 <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={item.title} referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{item.title}</h4>
                <p className="text-[10px] text-slate-500 font-medium">Informace: {item.author}</p>
                <div className="flex gap-2 mt-2">
                   <Heart size={12} className="text-white/10" />
                   <Bookmark size={12} className="text-white/10" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-cyan-500 hover:text-black transition-all">
                  <Plus size={14} />
                </button>
                <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Bottom Bar (Miniature Simulation of the sketch's bottom nav) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass-card p-4 flex items-center justify-around md:hidden border-cyan-500/20 shadow-2xl py-5 rounded-3xl z-[60]">
        <div className="p-2 bg-cyan-500/10 rounded-2xl text-cyan-500 shadow-lg shadow-cyan-500/20">
          <Compass size={24} />
        </div>
        <div className="p-2 text-slate-400">
           <Zap size={24} />
        </div>
        <div className="p-2 text-slate-400">
           <Activity size={24} />
        </div>
      </div>

      {/* Calendar History Modal */}
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
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Operační Historie</h2>
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

              {/* Legend */}
              <div className="flex flex-wrap gap-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Odcvičeno</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plánováno</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full border border-green-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rest Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bez záznamu</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Day Detail Modal */}
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
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">Detail dne</span>
                <h3 className="text-4xl font-black text-white italic">{formatDate(selectedDayDetail)}</h3>
                
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Stav tréninku</span>
                    <span className="text-green-500 font-black uppercase">DOKONČENO</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Objem logu</span>
                    <span className="text-white font-black italic">140 OPAKOVÁNÍ</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                   <button className="w-full py-4 bg-cyan-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                      Upravit data
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
