import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ExerciseLog } from '../types';
import { formatDate } from '../lib/utils';
import { motion } from 'motion/react';
import { Activity, Zap, Target, TrendingUp, Plus } from 'lucide-react';

interface DashboardProps {
  logs: ExerciseLog[];
}

export const Dashboard: React.FC<DashboardProps> = ({ logs }) => {
  const chartData = logs.slice(-14).map(log => ({
    date: formatDate(log.timestamp),
    reps: log.sets.reduce((sum, set) => sum + set.reps, 0),
    type: log.type
  }));

  const totalReps = logs.reduce((sum, log) => sum + log.sets.reduce((s, set) => s + set.reps, 0), 0);
  const workoutCount = logs.length;
  const lastWorkout = logs.length > 0 ? formatDate(logs[logs.length - 1].timestamp) : 'Žádný';

  return (
    <div id="dashboard-view" className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
      {/* Primary Status Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="md:col-span-2 lg:col-span-3 glass-card p-6 md:p-8 relative overflow-hidden flex flex-col justify-between min-h-[240px]"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity size={180} className="text-cyan-500" />
        </div>
        <div className="relative z-10">
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-cyan-500/60 mb-2 block">Biometrický Audit</span>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-4">
            {totalReps} <span className="text-xl md:text-2xl text-[#94a3b8] font-medium tracking-normal">reps</span>
          </h3>
          <p className="max-w-[200px] text-xs text-[#94a3b8] leading-relaxed font-medium">
            Celkový objem mechanické práce vykonané od začátku operace Meta-Cali.
          </p>
        </div>
        <div className="flex items-center gap-4 relative z-10 mt-6 md:mt-0">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">Tempo</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">+12% vs min. týden</span>
          </div>
          <div className="w-12 h-6 rounded bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <TrendingUp size={12} className="text-cyan-500" />
          </div>
        </div>
      </motion.div>

      {/* Secondary Quick Stats */}
      <div className="md:col-span-2 lg:col-span-3 grid grid-cols-2 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 flex flex-col justify-between border-purple-500/10"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
            <Zap size={20} className="text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{workoutCount}</p>
            <p className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-widest">Relace</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 flex flex-col justify-between border-pink-500/10"
        >
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4">
            <Target size={20} className="text-pink-500" />
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 dark:text-white truncate">{lastWorkout}</p>
            <p className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-widest">Poslední akce</p>
          </div>
        </motion.div>
      </div>

      {/* Analytics Chart - Large */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="md:col-span-4 lg:col-span-4 glass-card p-6 md:p-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Vizuální telemetrie</h2>
            <p className="text-xs text-[#94a3b8] font-medium">Dynamické mapování intenzity tréninkových cyklů</p>
          </div>
          <div className="flex gap-2">
            <div className="px-2 py-1 bg-cyan-500/10 rounded-md border border-cyan-500/20 text-[9px] font-black text-cyan-500 uppercase tracking-widest">Live</div>
            <div className="px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-md text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">14 DNŮ</div>
          </div>
        </div>
        
        <div className="h-[280px] w-full">
          {logs.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorReps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={document.documentElement.classList.contains('dark') ? "#22d3ee" : "#0891b2"} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={document.documentElement.classList.contains('dark') ? "#22d3ee" : "#0891b2"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tickMargin={10} />
                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tickMargin={10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--glass-bg)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: '16px', 
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: 'var(--text-main)', fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  cursor={{ stroke: 'rgba(34,211,238,0.2)', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="reps" stroke="#0891b2" className="dark:stroke-[#22d3ee]" fillOpacity={1} fill="url(#colorReps)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[#94a3b8] border-2 border-dashed border-black/5 dark:border-white/5 rounded-3xl">
              <Activity size={32} className="mb-2 opacity-10" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Telemetrie nedostupná</p>
              <p className="text-[10px] mt-1">Odcvičte alespoň 2 tréninky</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Progress & Goals Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="md:col-span-4 lg:col-span-2 glass-card p-6 md:p-8 flex flex-col"
      >
        <div className="flex items-center gap-2 mb-6">
          <Target size={18} className="text-purple-500" />
          <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Kvartální Cíle</h2>
        </div>
        
        <div className="flex-1 space-y-6">
          <div>
            <div className="flex justify-between items-center text-[10px] font-bold mb-2">
              <span className="text-[#94a3b8] uppercase tracking-widest">TÝDENNÍ OBJEM</span>
              <span className="text-slate-900 dark:text-white">{Math.min(100, Math.round((totalReps / 500) * 100))}%</span>
            </div>
            <div className="w-full bg-black/5 dark:bg-white/5 h-1.5 rounded-full overflow-hidden border border-black/5 dark:border-white/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (totalReps / 500) * 100)}%` }}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 h-full"
              />
            </div>
          </div>

          <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl">
            <p className="text-[#94a3b8] text-[9px] font-bold uppercase tracking-widest mb-1">Doporučení systému</p>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
              "Udržuj včerejší tempo pro dosažení kvartálního rekordu v objemu Shybů."
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/10">
          <div className="flex items-center justify-between group cursor-pointer">
            <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em]">Otevřít detaily</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-all">
              <Plus size={14} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Today's Log Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="md:col-span-4 lg:col-span-6 glass-card p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Dnešní stream dat</h2>
            <p className="text-xs text-[#94a3b8] font-medium">Reálný čas zachycených tréninkových aktivit</p>
          </div>
          <Zap size={20} className="text-cyan-500 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {logs.filter(l => formatDate(l.timestamp) === formatDate(Date.now())).length > 0 ? (
            logs.filter(l => formatDate(l.timestamp) === formatDate(Date.now())).map((log, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + (i * 0.1) }}
                key={log.id} 
                className="flex items-center justify-between p-4 bg-white/40 dark:bg-black/20 rounded-2xl border border-black/5 dark:border-white/5 group hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <Activity size={14} className="text-cyan-500" />
                  </div>
                  <span className="text-slate-900 dark:text-slate-300 font-bold text-sm tracking-tight">{log.type}</span>
                </div>
                <span className="text-slate-900 dark:text-white font-black text-sm">{log.sets.reduce((s, set) => s+set.reps, 0)}</span>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-[#94a3b8] italic text-xs border border-dashed border-black/5 dark:border-white/5 rounded-3xl">
              Nebyly detekovány žádné dnešní logy. Čekám na vstup...
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
