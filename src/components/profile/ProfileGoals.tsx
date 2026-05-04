import React from 'react';
import { Target, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileGoalsProps {
  goals: any[];
}

export const ProfileGoals: React.FC<ProfileGoalsProps> = ({ goals }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Target size={14} className="text-cyan-500" />
          <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Operational Goals</span>
        </div>
      </div>
      <div className="space-y-3 px-4">
        {goals.map((goal, idx) => (
          <div key={idx} className="glass-card p-5 border-white/5 bg-white/5 flex flex-col gap-4 group hover:border-cyan-500/20 transition-all">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-cyan-500 border border-white/5">
                     <Target size={18} />
                  </div>
                  <div>
                     <h4 className="text-[11px] font-black text-white uppercase tracking-widest">{goal.exercise}</h4>
                     <p className="text-[9px] font-bold text-slate-500 uppercase">Target: {goal.targetValue}</p>
                  </div>
               </div>
               <span className="text-xs font-black text-cyan-500 italic">{goal.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
              <motion.div initial={{ width: 0 }} animate={{ width: `${goal.progress}%` }} className="h-full bg-cyan-500" />
            </div>
          </div>
        ))}
        <button className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-slate-700 hover:text-cyan-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
           <Plus size={14} /> Add New Goal
        </button>
      </div>
    </div>
  );
};
