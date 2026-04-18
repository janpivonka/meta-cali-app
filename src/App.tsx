import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Explorer } from './components/Explorer';
import { WorkoutForm } from './components/WorkoutForm';
import { AiInsights } from './components/AiInsights';
import { Profile } from './components/Profile';
import { ExerciseLog, UserProfile } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Twitter, Instagram, Sun, Moon } from 'lucide-react';
import { EXERCISE_LIBRARY } from './data/exerciseLibrary';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Karel Operator',
  weight: 82,
  height: 185,
  bio: 'Kalisthenický operativec se zaměřením na statické prvky a progresivní telemetrii.',
  posts: 124,
  followers: 1204,
  following: 85,
  favoriteExercises: ['pullups', 'planche'],
  goals: [
    { exercise: 'Shyby', targetValue: 15, currentValue: 12, progress: 80, metric: 'opak' },
    { exercise: 'Kliky', targetValue: 40, currentValue: 35, progress: 87, metric: 'opak' },
    { exercise: 'Dipy', targetValue: 20, currentValue: 18, progress: 90, metric: 'opak' },
    { exercise: 'Planche', targetValue: 5, currentValue: 2, progress: 40, metric: 'sec' },
    { exercise: 'Front Lever', targetValue: 5, currentValue: 3, progress: 60, metric: 'sec' }
  ],
  trophies: ['🥇 SHYBY PRO', '🎖️ PLANCHE SURVIVOR', '⚡ MUSCLEUP ELITE', '🛡️ IRON CORE']
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isDark, setIsDark] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('meta-cali-logs');
    const savedProfile = localStorage.getItem('meta-cali-profile');
    const savedTheme = localStorage.getItem('meta-cali-theme');
    
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Failed to parse logs", e);
      }
    }

    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        // Migrace cílů z objektu na pole, pokud je potřeba
        if (parsedProfile && parsedProfile.goals && !Array.isArray(parsedProfile.goals)) {
          parsedProfile.goals = DEFAULT_PROFILE.goals;
        }
        setProfile(parsedProfile);
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }

    if (savedTheme !== null) {
      setIsDark(savedTheme === 'true');
    }
  }, []);

  // Sync theme class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('meta-cali-theme', String(isDark));
  }, [isDark]);

  // Save data to localStorage on change
  useEffect(() => {
    localStorage.setItem('meta-cali-logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('meta-cali-profile', JSON.stringify(profile));
  }, [profile]);

  const handleSaveLog = (log: ExerciseLog) => {
    setLogs((prev) => [...prev, log]);
    setActiveTab('dashboard');
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard logs={logs} />;
      case 'explorer':
        return <Explorer profile={profile} onUpdateProfile={handleUpdateProfile} />;
      case 'log':
        return <WorkoutForm onSave={handleSaveLog} />;
      case 'stats':
        return (
          <div className="space-y-6 max-w-4xl mx-auto pb-20">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Operační Historie</h2>
            <div className="grid gap-4">
              {logs.length > 0 ? (
                [...logs].reverse().map((log) => {
                  const exercise = EXERCISE_LIBRARY.find(e => e.id === log.exerciseId);
                  return (
                    <div key={log.id} className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between border-white/5 bg-white/5 group hover:border-cyan-500/20 transition-all gap-6">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-black text-white uppercase tracking-tight italic">{exercise?.name || log.type}</p>
                          {log.execution && (
                            <span className="text-[9px] font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 uppercase tracking-widest">
                              {log.execution}
                            </span>
                          )}
                          {log.grip && (
                            <span className="text-[8px] font-black bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 uppercase tracking-tighter shadow-sm">
                              {log.grip} {log.thumb && `(${log.thumb})`}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <p className="text-[9px] text-[#94a3b8] font-bold uppercase tracking-[0.25em]">{new Date(log.timestamp).toLocaleString()}</p>
                          <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-widest text-slate-500">
                            {log.equipment && <span>• {log.equipment}</span>}
                            {log.position && <span>• {log.position}</span>}
                          </div>
                        </div>
                        {log.assistance && log.assistance.type !== 'None' && (
                          <div className="flex items-center gap-1.5 bg-orange-500/5 px-2 py-1 rounded-lg border border-orange-500/10 w-fit">
                             <div className="w-1 h-1 rounded-full bg-orange-500" />
                             <span className="text-[8px] font-black text-orange-400 uppercase tracking-widest">Asistence: {log.assistance.type} {log.assistance.value && `(${log.assistance.value})`}</span>
                          </div>
                        )}
                        {log.notes && (
                          <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed max-w-md">"{log.notes}"</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end sm:max-w-[40%]">
                        {log.sets.map((s, i) => (
                          <div key={i} className="flex flex-col items-center px-4 py-2 bg-black/40 rounded-2xl border border-white/5 min-w-[60px] shadow-inner group-hover:border-cyan-500/10 transition-colors">
                            <div className="flex items-baseline gap-0.5">
                              <span className="text-lg font-black text-cyan-400 font-mono leading-none">
                                {s.reps || s.time}
                              </span>
                              <span className="text-[8px] font-black text-cyan-800 uppercase">
                                {s.reps ? 'R' : 'S'}
                              </span>
                            </div>
                            {s.weight ? (
                              <span className="text-[9px] text-purple-400 font-black mt-1 leading-none">+{s.weight}KG</span>
                            ) : s.rpe ? (
                              <span className="text-[7px] text-slate-600 font-black mt-1">RPE {s.rpe}</span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
                  <p className="text-slate-500 font-black uppercase tracking-widest italic">Systémový archiv je prázdný</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'ai':
        return <AiInsights logs={logs} />;
      case 'profile':
        return <Profile profile={profile} onSave={handleUpdateProfile} />;
      default:
        return <Dashboard logs={logs} />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col lg:flex-row font-sans overflow-x-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full flex flex-col min-h-screen pb-32 lg:pb-12 relative overflow-x-hidden">
        {/* Decorative Grid Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#22d3ee08,transparent)]"></div>
        </div>
        <header className="mb-8 lg:mb-12 flex justify-between items-start md:items-end">
          <div className="flex-1">
            <div className="flex items-center gap-3 lg:hidden mb-4">
              <h1 className="text-xl font-extrabold tracking-tighter bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent italic">
                META-CALI
              </h1>
              <span className="text-[8px] uppercase tracking-widest text-[#94a3b8] font-bold border border-white/10 px-1 rounded">v2.4</span>
            </div>
            <h2 className="text-cyan-500 text-[10px] font-extrabold uppercase tracking-[0.3em] mb-2 px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 w-fit rounded-md">Meta-Tactical OS</h2>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              {activeTab === 'dashboard' ? 'Monitor' : 
               activeTab === 'explorer' ? 'Explorer' :
               activeTab === 'log' ? 'Operační log' : 
               activeTab === 'stats' ? 'Analýza dat' : 
               activeTab === 'profile' ? 'Konfigurace' : 'Meta-Processing'}
            </h1>
          </div>
          <div className="flex flex-col items-end gap-3">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-3 bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl hover:bg-white transition-all shadow-sm"
              title="Přepnout režim"
            >
              {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-purple-600" />}
            </button>
            <div className="hidden md:block glass-card px-4 py-2 border-cyan-500/20">
              <p className="text-[#94a3b8] text-[9px] uppercase font-bold tracking-widest leading-none mb-1">Status</p>
              <div className="flex items-center gap-2 text-cyan-500 text-xs font-black">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                AKTIVNÍ
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="mt-20 pt-8 border-t border-black/5 dark:border-white/5 pb-10 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 hover:opacity-100 transition-opacity relative z-10">
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-[#94a3b8] font-black uppercase tracking-widest hidden lg:inline">System-Status: Optimal</span>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors"><Twitter size={18} /></a>
              <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors"><Instagram size={18} /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github size={18} /></a>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
              by @PEONY_PRODUCTION
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-700 mt-1 uppercase tracking-tighter font-black">
              &copy; 2026 Meta-Cali Platform • Protocol-X Ready
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
