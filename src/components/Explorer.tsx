import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  ArrowUpDown, 
  Settings2, 
  Heart, 
  Plus, 
  ChevronRight,
  Filter,
  Dumbbell,
  Target,
  Maximize2,
  Hand,
  ArrowRightLeft
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Explorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'zaklad' | 'osobni' | 'verejne'>('zaklad');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('Cviky');

  const mainTabs = [
    { id: 'zaklad', label: 'Základ' },
    { id: 'osobni', label: 'Osobní' },
    { id: 'verejne', label: 'Veřejné' },
  ];

  const sections = ['Cviky', 'Tréninky', 'Programy', 'Follow along-s'];
  const filters = [
    { label: 'Vybavení', icon: Dumbbell },
    { label: 'Úhel', icon: Target },
    { label: 'Pozice', icon: Maximize2 },
    { label: 'Prsty', icon: Hand },
    { label: 'Šířka', icon: ArrowRightLeft },
  ];

  const results = [
    { id: 1, title: 'Front Lever Hold', difficulty: 'POKROČILÉ', image: 'https://picsum.photos/seed/frontlever/300/200' },
    { id: 2, title: 'Straddle Planche', difficulty: 'EXTRÉMNÍ', image: 'https://picsum.photos/seed/planche/300/200' },
    { id: 3, title: 'Muscle Up', difficulty: 'POKROČILÉ', image: 'https://picsum.photos/seed/muscleup/300/200' },
    { id: 4, title: 'Handstand Press', difficulty: 'STŘEDNÍ', image: 'https://picsum.photos/seed/handstand/300/200' },
    { id: 5, title: 'Human Flag', difficulty: 'EXTRÉMNÍ', image: 'https://picsum.photos/seed/flag/300/200' },
    { id: 6, title: 'Pistol Squat', difficulty: 'STŘEDNÍ', image: 'https://picsum.photos/seed/pistol/300/200' },
  ];

  return (
    <div id="explorer-view" className="space-y-6 max-w-5xl mx-auto pb-24">
      {/* Search & Sort Bar */}
      <div className="flex gap-3 px-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Zadej hledaný výraz"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all italic"
          />
        </div>
        <button className="glass-card px-4 flex flex-col items-center justify-center gap-0.5 border-white/10 group hover:border-cyan-500/50 transition-all">
          <ArrowUpDown size={18} className="text-slate-400 group-hover:text-cyan-500" />
          <span className="text-[8px] font-black uppercase tracking-tighter text-slate-500 group-hover:text-cyan-500">Řazení</span>
        </button>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between px-2">
        <div className="flex gap-4 sm:gap-8 bg-white/5 p-1 rounded-2xl border border-white/5">
          {mainTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === tab.id 
                  ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]" 
                  : "text-slate-400 hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-4">
          <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.3em]">Sekce</span>
          <button className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-1">
             <Settings2 size={12} /> Upravit
          </button>
        </div>
        <div className="overflow-x-auto no-scrollbar scroll-smooth flex gap-3 px-2 pb-2">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={cn(
                "px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border",
                selectedSection === section
                  ? "bg-white/10 border-cyan-500/50 text-cyan-500"
                  : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
              )}
            >
              {section}
            </button>
          ))}
          <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 flex-shrink-0">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Filters Selector */}
      <div className="space-y-3">
        <div className="flex items-center px-4">
          <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.3em]">Filtry</span>
        </div>
        <div className="overflow-x-auto no-scrollbar flex gap-3 px-2 pb-2">
          {filters.map((filter) => (
            <button
              key={filter.label}
              className="glass-card flex items-center gap-3 px-5 py-3 border-white/5 bg-white/5 text-slate-400 hover:text-white hover:border-white/20 transition-all group whitespace-nowrap"
            >
              <filter.icon size={14} className="group-hover:text-cyan-500 transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-widest">{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-4 mt-8">
        <h3 className="text-sm font-black text-white uppercase tracking-[0.25em]">Výsledky</h3>
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">354 nalezeno</span>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 gap-4 px-2">
        {results.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative glass-card overflow-hidden border-white/5 group-hover:border-white/10 transition-all flex flex-col h-full">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <button className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center text-white/40 hover:text-cyan-500 transition-colors">
                    <Heart size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-black shadow-lg shadow-cyan-500/20">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-end bg-gradient-to-t from-black/20 to-transparent">
                <h4 className="text-xs sm:text-sm font-black text-white uppercase italic tracking-tight mb-1 group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-cyan-500"></div>
                   <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{item.difficulty}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
