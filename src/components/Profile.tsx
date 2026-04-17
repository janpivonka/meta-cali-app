import React, { useState } from 'react';
import { User, Weight, Ruler, Target, Save, CheckCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ProfileProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export const Profile: React.FC<ProfileProps> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(formDataWrapper(profile));
  const [showSuccess, setShowSuccess] = useState(false);

  // Ensure default structure
  function formDataWrapper(p: UserProfile): UserProfile {
    return {
      ...p,
      goals: p.goals || { pullups: 0, pushups: 0, dips: 0, planche: 0, frontlever: 0 }
    };
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div id="profile-view" className="space-y-6 md:space-y-10 max-w-4xl mx-auto pb-10">
      <div className="glass-card p-6 md:p-10 border-cyan-500/10">
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-cyan-500/20 relative animate-float">
            <User size={36} />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-lg border-4 border-[#f8fafc] dark:border-[#020617] flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Profil Operátora</h2>
            <p className="text-xs text-[#94a3b8] font-bold uppercase tracking-[0.2em] mt-1">Biometrická konfigurace Meta-Cali</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] flex items-center gap-2">
                Identifikátor
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-cyan-500/40 transition-all shadow-sm"
                placeholder="Jméno..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  Hmotnost (KG)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-cyan-500/40 transition-all shadow-sm"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  Výška (CM)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-cyan-500/40 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-black/5 dark:border-white/10 pt-10">
            <div className="flex items-center gap-3 mb-8">
              <Target size={20} className="text-purple-500" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Strategické Cíle</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Shyby', key: 'pullups', unit: 'REPS', color: 'border-cyan-500/20' },
                { label: 'Kliky', key: 'pushups', unit: 'REPS', color: 'border-purple-500/20' },
                { label: 'Dipy', key: 'dips', unit: 'REPS', color: 'border-pink-500/20' },
                { label: 'Planche', key: 'planche', unit: 'SEC', color: 'border-orange-500/20' },
                { label: 'Frontlever', key: 'frontlever', unit: 'SEC', color: 'border-emerald-500/20' }
              ].map((goal) => (
                <div key={goal.key} className={cn("glass-card p-4 bg-white/20 dark:bg-black/10 transition-all hover:scale-105", goal.color)}>
                  <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-3 block">
                    {goal.label} <span className="text-[8px] opacity-40">({goal.unit})</span>
                  </label>
                  <input
                    type="number"
                    value={formData.goals[goal.key as keyof typeof formData.goals]}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      goals: { ...formData.goals, [goal.key]: parseInt(e.target.value) || 0 } 
                    })}
                    className="bg-transparent text-3xl font-black text-slate-900 dark:text-white w-full focus:outline-none font-mono"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.3em] text-xs rounded-2xl hover:bg-cyan-500 dark:hover:bg-cyan-400 hover:text-black transition-all shadow-2xl shadow-cyan-500/10"
            >
              Uložit konfiguraci
            </button>

            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="flex items-center gap-2 text-green-500 text-xs font-black uppercase tracking-widest"
                >
                  <CheckCircle size={16} /> Data synchronizována
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 bg-cyan-500/5 border-cyan-500/10">
          <h4 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest mb-3">Analytická poznámka</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Vaše biometrické údaje slouží neuronové síti k přesnému výpočtu relativní síly. 
            Doporučujeme aktualizovat váhu alespoň jednou měsíčně.
          </p>
        </div>
        <div className="glass-card p-6 bg-purple-500/5 border-purple-500/10">
          <h4 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest mb-3">Meta-Ověření</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Data jsou šifrována v lokálním uzlu vašeho prohlížeče. Žádná biometrika neopouští 
            tento terminál bez vašeho vědomí.
          </p>
        </div>
      </div>
    </div>
  );
};
