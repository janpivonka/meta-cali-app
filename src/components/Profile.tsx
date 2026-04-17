import React, { useState } from 'react';
import { User, Weight, Ruler, Target, Save, CheckCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export const Profile: React.FC<ProfileProps> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div id="profile-view" className="space-y-8">
      <div className="glass-card p-8 border-cyan-500/10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Váš Profil</h2>
            <p className="text-sm text-slate-500 font-medium">Správa osobních biometrik a cílů</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <User size={14} className="text-cyan-400" /> Jméno
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40 transition-colors"
                placeholder="Jan Novák"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Weight size={14} className="text-cyan-400" /> Váha (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Ruler size={14} className="text-cyan-400" /> Výška (cm)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Target size={20} className="text-purple-400" /> Hlavní fitness cíle
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Cíl Shybů (reps)</label>
                <input
                  type="number"
                  value={formData.goals.pullups}
                  onChange={(e) => setFormData({ ...formData, goals: { ...formData.goals, pullups: parseInt(e.target.value) || 0 } })}
                  className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/40 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Cíl Kliků (reps)</label>
                <input
                  type="number"
                  value={formData.goals.pushups}
                  onChange={(e) => setFormData({ ...formData, goals: { ...formData.goals, pushups: parseInt(e.target.value) || 0 } })}
                  className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/40 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Cíl Dipů (reps)</label>
                <input
                  type="number"
                  value={formData.goals.dips}
                  onChange={(e) => setFormData({ ...formData, goals: { ...formData.goals, dips: parseInt(e.target.value) || 0 } })}
                  className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/40 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2 shadow-xl shadow-white/5"
            >
              <Save size={18} /> Uložit nastavení
            </button>

            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-2 text-green-400 text-sm font-bold"
                >
                  <CheckCircle size={16} /> Data úspěšně uložena
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>

      <div className="glass-card p-6 border-purple-500/20">
        <h4 className="text-white font-bold mb-2">Jak vypočítat cíle?</h4>
        <p className="text-sm text-slate-400 leading-relaxed">
          Vaše cíle by měly být ambiciózní, ale dosažitelné. Doporučujeme nastavit si cíl o 20-30 % vyšší, 
          než je vaše aktuální maximum. AI Meta-analýza vám pomůže tyto cíle postupně upravovat na základě 
          vašeho skutečného výkonu v operativním logu.
        </p>
      </div>
    </div>
  );
};
