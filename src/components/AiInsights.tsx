import React, { useState, useEffect } from 'react';
import { Workout } from '../types';
import { getWorkoutAdvice } from '../services/geminiService';
import { BrainCircuit, Loader2, Sparkles, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AiInsightsProps {
  workouts: Workout[];
}

export const AiInsights: React.FC<AiInsightsProps> = ({ workouts }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    const result = await getWorkoutAdvice(workouts);
    setAdvice(result);
    setLoading(false);
  };

  useEffect(() => {
    if (workouts.length > 0 && !advice) {
      fetchAdvice();
    }
  }, [workouts]);

  return (
    <div id="ai-insights-section" className="glass-card p-6 md:p-10 overflow-hidden relative border-purple-500/20 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 min-h-[400px] flex flex-col">
      <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
        <BrainCircuit size={240} className="text-purple-400" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.4)] relative">
              <BrainCircuit size={28} className="text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-75"></span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Meta-Core</h2>
              <div className="flex items-center gap-2">
                <span className="bg-purple-600/20 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border border-purple-500/20">Neural Engine v3.0</span>
                <span className="w-1 h-1 rounded-full bg-purple-500 animate-pulse"></span>
              </div>
            </div>
          </div>
          <button 
            onClick={fetchAdvice}
            disabled={loading}
            className="w-12 h-12 flex items-center justify-center bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl text-slate-500 hover:text-purple-500 transition-all shadow-sm"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center text-[#94a3b8]"
              >
                <div className="relative mb-6">
                  <Loader2 className="animate-spin text-purple-500" size={48} />
                  <div className="absolute inset-0 blur-xl bg-purple-500/20 animate-pulse"></div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Dekóduji biologickou databázi...</p>
              </motion.div>
            ) : advice ? (
              <motion.div 
                key="advice"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className="relative">
                  <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full opacity-30"></div>
                  <p className="text-xl md:text-3xl leading-[1.3] text-slate-800 dark:text-slate-100 font-bold italic tracking-tight">
                    "{advice}"
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-widest bg-purple-600/10 w-fit px-4 py-2 rounded-xl border border-purple-600/20">
                    <Sparkles size={14} />
                    Gemini Meta-Processing Complete
                  </div>
                  <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest bg-cyan-600/10 w-fit px-4 py-2 rounded-xl border border-cyan-600/20">
                    Confidence: 99.8%
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 text-center">
                <BrainCircuit size={48} className="mb-4 opacity-10" />
                <p className="text-sm font-bold uppercase tracking-widest opacity-40 italic">Inaktivní stav: Vyžaduji vstupní data k analýze</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/10 flex justify-between items-center opacity-40">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-3 bg-purple-500 rounded-full"></div>)}
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest">Protocol-X: Enabled</span>
        </div>
      </div>
    </div>
  );
};
