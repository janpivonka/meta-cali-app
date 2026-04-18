import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Plus, 
  Edit3, 
  Target, 
  Trophy, 
  Activity, 
  TrendingUp,
  Save,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

interface ProfileProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const mockChartData = [
  { day: 'Po', value: 74.5 },
  { day: 'Út', value: 74.8 },
  { day: 'St', value: 74.2 },
  { day: 'Čt', value: 74.6 },
  { day: 'Pá', value: 75.1 },
  { day: 'So', value: 75.0 },
  { day: 'Ne', value: 74.9 },
];

export const Profile: React.FC<ProfileProps> = ({ profile, onSave }) => {
  const [activeTab, setActiveTab] = useState<'zaklad' | 'osobni' | 'verejne'>('zaklad');
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setShowSuccess(true);
    setIsEditing(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const tabs = [
    { id: 'zaklad', label: 'Základ' },
    { id: 'osobni', label: 'Osobní' },
    { id: 'verejne', label: 'Veřejné' },
  ];

  return (
    <div id="profile-view" className="space-y-8 max-w-lg mx-auto pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
            <Activity size={20} />
          </motion.div>
        </div>
        <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/10">
          <Settings size={20} />
        </button>
      </div>

      {/* Main Navigation Tabs */}
      <div className="px-2">
        <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === tab.id 
                  ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]" 
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Header Section */}
      <div className="flex flex-col items-center space-y-6 pt-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative w-32 h-32 rounded-full border-2 border-white/10 overflow-hidden bg-slate-900 flex items-center justify-center">
            <User size={64} className="text-slate-700" />
            <button className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-cyan-500 text-black flex items-center justify-center border-4 border-[#020617] shadow-lg">
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">{formData.name}</h2>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2 mx-auto hover:text-purple-300 transition-colors"
          >
            <Edit3 size={12} /> Upravit Profil
          </button>
        </div>

        <div className="flex justify-center gap-12 sm:gap-16 w-full py-4 border-y border-white/5">
          <div className="text-center">
            <p className="text-lg font-black text-white leading-none">{formData.posts}</p>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Příspěvky</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-white leading-none">{formData.followers}</p>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Sledující</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-white leading-none">{formData.following}</p>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Sleduji</p>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="px-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Bio</span>
        </div>
        {isEditing ? (
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-all min-h-[80px]"
          />
        ) : (
          <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
            {formData.bio}
          </p>
        )}
      </div>

      {/* Goals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-cyan-500" />
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Moje Cíle</span>
          </div>
          <ChevronRight size={14} className="text-slate-600" />
        </div>
        <div className="overflow-x-auto no-scrollbar flex gap-4 px-4 pb-2">
          {Object.entries(formData.goals).map(([key, val], idx) => (
            <div key={key} className="glass-card min-w-[140px] p-4 border-white/5 bg-white/5 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center text-cyan-500 mb-3 border border-white/5 shadow-inner">
                <span className="text-xs font-black uppercase">{key.substring(0, 2)}</span>
              </div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{key}</h4>
              <p className="text-[9px] font-bold text-slate-500 uppercase mb-3">Cíl: {val} {key === 'planche' || key === 'frontlever' ? 'sec' : 'reps'}</p>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${30 + idx * 10}%` }}
                  className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                />
              </div>
              <span className="text-[8px] font-black text-cyan-500 mt-2">{30 + idx * 10}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trophies Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-yellow-500" />
            <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.3em]">Trofeje</span>
          </div>
          <ChevronRight size={14} className="text-slate-600" />
        </div>
        <div className="overflow-x-auto no-scrollbar flex gap-4 px-4 pb-2">
          {formData.trophies.map((trophy, idx) => (
            <div key={idx} className="flex flex-col items-center min-w-[80px]">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border border-yellow-500/30 flex items-center justify-center text-2xl shadow-lg mb-2 group cursor-pointer hover:border-yellow-400 transition-all">
                <Trophy size={24} className="text-yellow-500 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[7px] font-black text-slate-500 uppercase tracking-tighter text-center max-w-[70px]">{trophy}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tracked Values (Charts) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-purple-500" />
            <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.3em]">Hlídané Hodnoty</span>
          </div>
          <ChevronRight size={14} className="text-slate-600" />
        </div>
        <div className="overflow-x-auto no-scrollbar flex gap-4 px-4 pb-2">
          {[
            { label: 'Hmotnost', color: '#8b5cf6' },
            { label: 'Body Fat', color: '#ec4899' },
            { label: 'Muscle Mass', color: '#10b981' }
          ].map((item, idx) => (
            <div key={idx} className="glass-card min-w-[200px] h-[120px] p-3 border-white/5 bg-white/5 relative flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{item.label}</span>
              <div className="flex-1 w-full translate-x-[-10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData}>
                    <defs>
                      <linearGradient id={`colorValue-${idx}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={item.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={item.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={item.color} 
                      fillOpacity={1} 
                      fill={`url(#colorValue-${idx})`} 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute top-3 right-3 text-[10px] font-black text-white italic">74.9 kg</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Section Placeholder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.3em]">Aktivita</span>
          </div>
        </div>
        <div className="px-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-3 border-white/5 bg-white/3 flex items-center justify-between opacity-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                  <CheckCircle size={14} />
                </div>
                <div>
                  <div className="w-24 h-2 bg-white/10 rounded-full mb-1"></div>
                  <div className="w-16 h-1.5 bg-white/5 rounded-full"></div>
                </div>
              </div>
              <div className="w-8 h-2 bg-white/5 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button (Conditional) */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-50 px-4"
          >
            <button 
              onClick={handleSubmit}
              className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <Save size={16} /> Potvrdit Změny
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-green-500 text-black px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-[0_0_30px_rgba(34,197,94,0.4)] z-[100] flex items-center gap-3"
          >
            <CheckCircle size={16} /> Data synchronizována
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
