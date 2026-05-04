import React from 'react';

export const OperatorStatus: React.FC = () => {
  return (
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
  );
};
