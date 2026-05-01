import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Heart, Bookmark, Play } from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  difficulty: string;
  time: string;
  image: string;
}

interface DailyChallengeProps {
  challenge: Challenge;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({ challenge }) => {
  return (
    <motion.div
      whileHover={{ x: 5 }}
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
  );
};
