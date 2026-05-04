import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface DayDetailModalProps {
  timestamp: number | null;
  onClose: () => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({ timestamp, onClose }) => {
  return (
    <AnimatePresence>
      {timestamp && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <motion.div initial={{ scale: 0.9, x: 50 }} animate={{ scale: 1, x: 0 }} className="glass-card w-full max-w-lg p-10 relative">
             <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
            <div className="space-y-6">
              <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">Day Detail</span>
              <h3 className="text-4xl font-black text-white italic">{formatDate(timestamp)}</h3>
              
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
  );
};
