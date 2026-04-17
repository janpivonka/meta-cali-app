import React, { useState, useEffect } from 'react';
import { ExerciseLog } from '../types';
import { getWorkoutAdvice } from '../services/geminiService';
import { BrainCircuit, Loader2, Sparkles, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AiInsightsProps {
  logs: ExerciseLog[];
}

export const AiInsights: React.FC<AiInsightsProps> = ({ logs }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    const result = await getWorkoutAdvice(logs);
    setAdvice(result);
    setLoading(false);
  };

  useEffect(() => {
    if (logs.length > 0 && !advice) {
      fetchAdvice();
    }
  }, [logs]);

  return (
    <div id="ai-insights-section" className="glass-card p-8 overflow-hidden relative border-purple-500/20 bg-gradient-to-br from-cyan-500/5 to-purple-500/5">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <BrainCircuit size={120} className="text-purple-400" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <BrainCircuit size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Meta-vrstva</h2>
              <span className="bg-purple-600/20 text-purple-400 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">Analysis Mode</span>
            </div>
          </div>
          <button 
            onClick={fetchAdvice}
            disabled={loading}
            className="p-2 hover:bg-white/5 rounded-lg text-[#94a3b8] transition-colors disabled:opacity-50"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center justify-center text-[#94a3b8]"
            >
              <Loader2 className="animate-spin mb-4 text-purple-400" size={32} />
              <p className="text-sm font-medium animate-pulse">Dešifruji vzorce biologického výkonu...</p>
            </motion.div>
          ) : advice ? (
            <motion.div 
              key="advice"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-slate-200 font-medium italic">
                  "{advice}"
                </p>
              </div>
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider bg-purple-600/10 w-fit px-3 py-1 rounded-full border border-purple-600/20">
                <Sparkles size={12} />
                Systémová analýza Gemini Meta
              </div>
            </motion.div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-slate-600 italic">
              <p>Odcvičte alespoň jeden trénink pro získání AI rad.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
