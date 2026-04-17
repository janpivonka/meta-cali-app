import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { WorkoutForm } from './components/WorkoutForm';
import { AiInsights } from './components/AiInsights';
import { Profile } from './components/Profile';
import { ExerciseLog, UserProfile } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Twitter, Instagram } from 'lucide-react';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Karel',
  weight: 75,
  height: 180,
  goals: {
    pullups: 15,
    pushups: 40,
    dips: 20
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('meta-cali-logs');
    const savedProfile = localStorage.getItem('meta-cali-profile');
    
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Failed to parse logs", e);
      }
    }

    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }
  }, []);

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
      case 'log':
        return <WorkoutForm onSave={handleSaveLog} />;
      case 'stats':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Historie tréninků</h2>
            <div className="grid gap-4">
              {logs.length > 0 ? (
                [...logs].reverse().map((log) => (
                  <div key={log.id} className="glass-card p-4 flex items-center justify-between border-white/5 bg-white/5">
                    <div>
                      <p className="text-sm font-bold text-white">{log.type}</p>
                      <p className="text-[10px] text-[#94a3b8] uppercase tracking-widest">{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      {log.sets.map((s, i) => (
                        <div key={i} className="px-2 py-1 bg-black/20 rounded text-xs font-mono text-cyan-400 border border-white/5">
                          {s.reps}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic">Zatím žádná historie.</p>
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
    <div className="min-h-screen bg-transparent flex font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8 lg:p-12 max-w-6xl mx-auto w-full flex flex-col min-h-screen">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-cyan-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-2 px-2 py-0.5 bg-cyan-400/10 border border-cyan-400/20 w-fit rounded">Meta-Tactical OS</h2>
            <h1 className="text-4xl font-extrabold text-white tracking-tighter">
              {activeTab === 'dashboard' ? `Vítej zpět, ${profile.name}` : 
               activeTab === 'log' ? 'Operační log' : 
               activeTab === 'stats' ? 'Analýza dat' : 
               activeTab === 'profile' ? 'Konfigurace Profilu' : 'Meta-Processing'}
            </h1>
          </div>
          <div className="glass-card px-4 py-2 border-cyan-500/20">
            <p className="text-[#94a3b8] text-[10px] uppercase font-bold tracking-widest leading-none mb-1">Status</p>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
              AKTIVNÍ
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

        <footer className="mt-20 pt-8 border-t border-white/5 pb-10 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors"><Twitter size={18} /></a>
            <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors"><Instagram size={18} /></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github size={18} /></a>
          </div>
          <div className="text-center md:text-right">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              by @PEONY_PRODUCTION
            </p>
            <p className="text-[10px] text-slate-700 mt-1 uppercase tracking-tighter font-medium">
              &copy; 2026 Meta-Cali Platform • v2.4.0-Stable
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
