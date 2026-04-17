import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ExerciseLog } from '../types';
import { formatDate } from '../lib/utils';
import { motion } from 'motion/react';
import { Activity, Zap, Target } from 'lucide-react';

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

  const stats = [
    { label: 'Celkem opakování', value: totalReps, icon: Activity, color: 'text-cyan-400' },
    { label: 'Počet tréninků', value: workoutCount, icon: Zap, color: 'text-purple-400' },
    { label: 'Poslední log', value: lastWorkout, icon: Target, color: 'text-pink-400' },
  ];

  return (
    <div id="dashboard-view" className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon size={24} className={stat.color} />
              <span className="text-[10px] uppercase tracking-widest text-[#94a3b8] font-bold">Lifetime Stats</span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-[#94a3b8] mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-bold text-white">Pracovní objem</h2>
            <p className="text-xs text-[#94a3b8]">Vizualizace celkového počtu opakování za poslední dny</p>
          </div>
          <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-[10px] text-cyan-400 font-bold uppercase tracking-tighter">
            Live Analytics
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          {logs.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorReps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '10px', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="reps" stroke="#22d3ee" fillOpacity={1} fill="url(#colorReps)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-700 border border-dashed border-white/5 rounded-xl">
              <Activity size={32} className="mb-2 opacity-20" />
              <p className="text-sm">Nedostatek dat pro graf</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></span>
            Dnešní trénink
          </h3>
          <div className="space-y-4">
            {logs.filter(l => formatDate(l.timestamp) === formatDate(Date.now())).length > 0 ? (
              logs.filter(l => formatDate(l.timestamp) === formatDate(Date.now())).map(log => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                  <span className="text-slate-300 font-medium">{log.type}</span>
                  <span className="text-white font-bold">{log.sets.reduce((s, set) => s+set.reps, 0)} reps</span>
                </div>
              ))
            ) : (
              <p className="text-[#94a3b8] text-sm italic">Dnes jsi ještě nelogoval žádný cvik.</p>
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
            Týdenní progres
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-[#94a3b8] mb-2">
              <span>Cíl: 500 opakování / týden</span>
              <span className="text-white font-bold">{Math.min(100, Math.round((totalReps / 500) * 100))}%</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (totalReps / 500) * 100)}%` }}
                className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full shadow-[0_0_10px_rgba(34,211,238,0.3)]"
              />
            </div>
            <p className="text-slate-500 text-[10px] uppercase tracking-tighter">AI-Optimalizovaný plán progresivního přetížení</p>
          </div>
        </div>
      </div>
    </div>
  );
};
