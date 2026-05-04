import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Plus, MoreHorizontal, Heart, Bookmark, Zap } from 'lucide-react';
import { Workout } from '../../types';

interface DashboardContentProps {
  workouts: Workout[];
  onViewHistory: () => void;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ workouts, onViewHistory }) => {
  const dailyChallenges = [
    { id: 1, title: 'Planche Flow', difficulty: 'EXTREME', time: '12 min', image: 'https://picsum.photos/seed/planche/400/200' },
    { id: 2, title: 'Explosive Power', difficulty: 'ADVANCED', time: '45 min', image: 'https://picsum.photos/seed/explosive/400/200' },
  ];

  return (
    <>
      {workouts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.25em]">Recent Operations</h3>
            <button onClick={onViewHistory} className="text-[10px] text-slate-400 hover:text-cyan-500 font-black uppercase tracking-widest flex items-center gap-2">
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2 snap-x">
            {workouts.slice(0, 5).map((workout) => (
              <motion.div key={workout.id} whileHover={{ y: -5 }} className="glass-card min-w-[200px] p-6 border-white/5 bg-white/5 flex flex-col gap-4 snap-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 blur-2xl rounded-full group-hover:bg-cyan-500/10 transition-colors" />
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-500">
                    <Activity size={16} />
                  </div>
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">
                    {new Date(workout.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase italic tracking-tight truncate">{workout.exercises?.[0]?.type || "Unknown Mission"}</h4>
                  <p className="text-[8px] font-black text-cyan-500/60 uppercase tracking-widest mt-1">
                    {workout.exercises?.length || 0} Fragments • {workout.exercises?.reduce((acc, ex) => acc + (ex.sets?.length || 0), 0)} Units
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.25em]">Recommended</h3>
          <ArrowRight size={16} className="text-slate-400" />
        </div>
        <div className="space-y-4">
          {[
            { id: 1, title: 'Mastery', author: 'Specialist', image: 'https://picsum.photos/seed/muscleup/400/200' },
          ].map((item) => (
            <div key={item.id} className="glass-card p-4 flex items-center gap-6 border-white/5 relative group">
              <div className="w-24 h-16 rounded-xl overflow-hidden">
                 <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={item.title} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{item.title}</h4>
                <p className="text-[10px] text-slate-500 font-medium">Informace: {item.author}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-cyan-500 hover:text-black transition-all">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
