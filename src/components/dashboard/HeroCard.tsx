import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Share2 } from 'lucide-react';

export const HeroCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group cursor-pointer"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-600 to-cyan-500 rounded-[40px] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 animate-gradient-x"></div>
      <div className="relative glass-card overflow-hidden h-[400px] flex flex-col justify-end p-8 md:p-14 border-white/10 bg-black/40 rounded-[40px]">
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
               <Heart size={20} className="text-slate-500 group-hover/icon: Pink-500 transition-colors" />
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
  );
};
