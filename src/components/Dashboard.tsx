import React, { useState } from 'react';
import { Workout } from '../types';
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
  workouts: Workout[];
}

export const Dashboard: React.FC<DashboardProps> = ({ workouts }) => {
  const [activeTab, setActiveTab] = useState<'zaklad' | 'osobni' | 'verejne'>('zaklad');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDayDetail, setSelectedDayDetail] = useState<number | null>(null);

  // Helper functions
  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getDate() === d2.getDate();

  const days = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  const today = new Date();

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
    const hasLog = workouts.some(w => isSameDay(new Date(w.timestamp), date));
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

  // Mock data for display
  const dailyChallenges = [
    { id: 1, title: 'Planche Flow', difficulty: 'EXTREME', time: '12 min', image: 'https://picsum.photos/seed/planche/400/200' },
    { id: 2, title: 'Explosive Power', difficulty: 'ADVANCED', time: '45 min', image: 'https://picsum.photos/seed/explosive/400/200' },
  ];

  const todayPlans = [
    { id: 1, title: 'Basics Strength', difficulty: 'MEDIUM', sets: '5 Sets', image: 'https://picsum.photos/seed/strength/400/200' },
  ];

  const recommended = [
    { id: 1, title: 'Muscle-Up Mastery', author: 'By Meta-Cali Specialist', image: 'https://picsum.photos/seed/muscleup/400/200' },
  ];

  // LIVE STATS CALCULATION
  const totalSets = Array.isArray(workouts) 
    ? workouts.reduce((acc, w) => acc + (w.exercises || []).reduce((exAcc, ex) => exAcc + (ex.sets || []).length, 0), 0)
    : 0;
  
  // Basic streak calculation
  const calculateStreak = () => {
    if (!Array.isArray(workouts) || workouts.length === 0) return 0;
    let streak = 0;
 
    // Check if there's a workout from today or yesterday to start
    const hasLogToday = workouts.some(w => w?.timestamp && isSameDay(new Date(w.timestamp), today));
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const hasLogYesterday = workouts.some(w => w?.timestamp && isSameDay(new Date(w.timestamp), yesterday));
 
    if (!hasLogToday && !hasLogYesterday) return 0;
 
    // Simplified streak: count consecutive days with at least one workout
    let checkDate = hasLogToday ? today : yesterday;
    while (true) {
      const dayLogs = workouts.filter(w => w?.timestamp && isSameDay(new Date(w.timestamp), checkDate));
      if (dayLogs.length > 0) {
        streak++;
        const prevDay = new Date(checkDate);
        prevDay.setDate(prevDay.getDate() - 1);
        checkDate = prevDay;
      } else {
        break;
      }
      // Safety break to prevent infinite loop
      if (streak > 3650) break;
    }
    return streak;
  };

  const streak = calculateStreak();

  // Legend
  const legend = [
    { label: 'Trained', color: 'bg-green-500', icon: Check },
    { label: 'Planned', color: 'bg-orange-500', icon: Square },
    { label: 'Rest', color: 'bg-white/10', icon: Circle },
  ];

  return (
    <div id="monitor-view" className="space-y-8 max-w-5xl mx-auto pb-20 relative">
      {/* Sketch Header Simulation */}
      <div className="flex items-center justify-between px-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-black font-black italic shadow-[0_0_20px_rgba(34,211,238,0.4)] relative">
            M
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white italic leading-none">META-CALI</h1>
            <span className="text-[10px] uppercase tracking-[0.4em] text-cyan-500 font-black block mt-1">Tactical Unit OS Terminal</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="relative w-12 h-12 ring-1 ring-white/10 rounded-2xl flex items-center justify-center hover:bg-white/5 transition-all text-slate-400 dark:text-slate-500 hover:text-cyan-500 bg-black/20">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-cyan-500 rounded-full"></span>
          </button>
          <button className="w-12 h-12 ring-1 ring-white/10 rounded-2xl flex items-center justify-center hover:bg-white/5 transition-all text-slate-400 dark:text-slate-500 hover:text-cyan-500 bg-black/20">
            <MessageSquare size={20} />
          </button>
        </div>
      </div>

      {/* Top Tabs Navigation */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-center sm:justify-start gap-8 px-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'zaklad', label: 'Monitor' },
            { id: 'osobni', label: 'Operations' },
            { id: 'verejne', label: 'Newsroom' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "text-[10px] font-black uppercase tracking-[0.3em] pb-3 transition-all relative whitespace-nowrap",
                activeTab === tab.id 
                  ? "text-cyan-500 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-cyan-500 after:shadow-[0_0_12px_rgba(34,211,238,0.6)]" 
                  : "text-slate-600 hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Motivational Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group cursor-pointer"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-600 to-cyan-500 rounded-[40px] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 animate-gradient-x"></div>
        <div className="relative glass-card overflow-hidden h-[400px] flex flex-col justify-end p-8 md:p-14 border-white/10 bg-black/40 rounded-[40px]">
          {/* Simulated Video/Image Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://picsum.photos/seed/training/1600/900?grayscale" 
              className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-all duration-1000 scale-105 group-hover:scale-100" 
              alt="Motivace"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-cyan-500 rounded-full"></div>
               <span className="text-[12px] font-black uppercase tracking-[0.5em] text-cyan-400">Tactical Wisdom</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-3xl italic tracking-tighter uppercase">
              "Discipline is nothing more than <span className="text-cyan-400 underline decoration-cyan-500/30 underline-offset-8">victory</span> over your own comfort."
            </h2>
          </div>

          <div className="relative z-10 mt-12 flex items-center justify-between border-t border-white/5 pt-8">
            <div className="flex gap-6 items-center">
              <div className="flex items-center gap-2 group/icon">
                 <Heart size={20} className="text-slate-500 group-hover/icon:text-pink-500 transition-colors" />
                 <span className="text-[10px] font-black text-slate-500 group-hover/icon:text-slate-300">1.2K</span>
              </div>
              <div className="flex items-center gap-2 group/icon">
                <MessageSquare size={20} className="text-slate-500 group-hover/icon:text-cyan-500 transition-colors" />
                <span className="text-[10px] font-black text-slate-500 group-hover/icon:text-slate-300">84</span>
              </div>
              <Share2 size={20} className="text-slate-500 hover:text-purple-500 cursor-pointer transition-colors" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-slate-800 overflow-hidden ring-2 ring-white/5">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                   </div>
                 ))}
              </div>
              <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">+2.4k OTHERS</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Consistency & Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 bg-white/5 border-white/5 flex items-center gap-6 group hover:border-orange-500/20 transition-all rounded-[32px]">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
            <Flame size={32} fill="currentColor" />
          </div>
          <div>
            <span className="text-4xl font-black text-white italic leading-none">{streak}</span>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-1">Daily Streak</p>
          </div>
        </div>

        <div className="glass-card p-8 bg-white/5 border-white/5 flex items-center gap-6 group hover:border-purple-500/20 transition-all rounded-[32px]">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
            <Zap size={32} />
          </div>
          <div>
            <span className="text-4xl font-black text-white italic leading-none">{totalSets}</span>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-1">Total Sets</p>
          </div>
        </div>

        <div className="glass-card p-8 bg-white/5 border-white/5 flex items-center gap-6 group hover:border-cyan-500/20 transition-all rounded-[32px]">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
            <Target size={32} />
          </div>
          <div>
            <span className="text-4xl font-black text-white italic leading-none">12%</span>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-1">Module Progress</p>
          </div>
        </div>
      </div>

      {/* Operator Status - NEW */}
      <div className="glass-card border-white/5 bg-white/2 p-6 rounded-[32px] overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
              <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest">System Online</span>
           </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
           <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Operator ID</span>
              <p className="text-xs font-black text-white tracking-widest">#USR-229-ALPHA</p>
           </div>
           <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Current Rank</span>
              <p className="text-xs font-black text-cyan-500 tracking-widest uppercase italic">Advanced Scout</p>
           </div>
           <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Next Milestone</span>
              <p className="text-xs font-black text-white tracking-widest uppercase">100 Sets Logged</p>
           </div>
           <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Security Clearance</span>
              <p className="text-xs font-black text-purple-500 tracking-widest uppercase">Level 4</p>
           </div>
        </div>
      </div>

      {/* Weekly Calendar View */}
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
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.25em]">Today's Challenges</h3>
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
                  <span className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-widest">Alarm: 08:30</span>
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
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.25em]">Today's Plan</h3>
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
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.25em]">Recommended</h3>
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

              {/* Legend */}
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
