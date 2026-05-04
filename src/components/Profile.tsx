import React from 'react';
import { Settings, Activity, CheckCircle, Save, Heart, Trophy, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import { useProfileLogic } from '../hooks/useProfileLogic';
import { ProfileHeader } from './profile/ProfileHeader';
import { ProfileGoals } from './profile/ProfileGoals';
import { ProfileMetrics } from './profile/ProfileMetrics';

interface ProfileProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export const Profile: React.FC<ProfileProps> = ({ profile, onSave }) => {
  const {
    activeTab, setActiveTab,
    formData, setFormData,
    showSuccess,
    isEditing, setIsEditing,
    handleSubmit,
    tabs
  } = useProfileLogic(profile, onSave);

  return (
    <div id="profile-view" className="space-y-8 max-w-lg mx-auto pb-24">
      <div className="flex items-center justify-between px-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
          <Activity size={20} />
        </div>
        <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 border border-white/10"><Settings size={20} /></button>
      </div>

      <div className="px-2">
        <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === tab.id ? "bg-cyan-500 text-black shadow-lg" : "text-slate-500")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <ProfileHeader formData={formData} isEditing={isEditing} setIsEditing={setIsEditing} setFormData={setFormData} />

      <div className="px-4 space-y-3">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Bio</span>
        {isEditing ? (
          <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white min-h-[80px]" />
        ) : (
          <p className="text-xs text-slate-400 italic leading-relaxed">{formData.bio}</p>
        )}
      </div>

      <ProfileGoals goals={Array.isArray(formData.goals) ? formData.goals : []} />

      <div className="space-y-4 px-4">
         <div className="flex items-center gap-2"><Heart size={14} className="text-pink-500"/><span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Favorites</span></div>
         <div className="grid grid-cols-2 gap-3">
            {(formData.favoriteExercises || []).map(exId => {
              const ex = EXERCISE_LIBRARY.find(e => e.id === exId);
              return <div key={exId} className="glass-card p-4 border-white/5 bg-white/5 flex items-center gap-2 text-[9px] font-black uppercase tracking-tighter text-slate-300 truncate transition-all hover:border-pink-500/20 group"><Activity size={12} className="group-hover:text-pink-500" /> {ex?.name || exId}</div>
            })}
         </div>
      </div>

      <ProfileMetrics />

      <AnimatePresence>
        {isEditing && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-50 px-4">
            <button onClick={handleSubmit} className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"><Save size={16} /> Confirm Changes</button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-24 left-1/2 -translate-x-1/2 bg-green-500 text-black px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest z-[100] flex items-center gap-2 shadow-2xl"><CheckCircle size={16} /> Synchronized</motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
