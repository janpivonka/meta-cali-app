import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Settings2, 
  Heart, 
  Plus, 
  ChevronRight,
  Filter,
  Play,
  Info,
  X,
  Copy,
  Share2,
  Bookmark
} from 'lucide-react';
import { cn } from '../lib/utils';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import { ExerciseDefinition, UserProfile } from '../types';

interface ExplorerProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const Explorer: React.FC<ExplorerProps> = ({ profile, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'zaklad' | 'osobni' | 'verejne'>('zaklad');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDefinition | null>(null);

  const categories = ['Pull', 'Push', 'Statics', 'Legs', 'Core', 'Dynamic'];

  const filteredResults = useMemo(() => {
    return EXERCISE_LIBRARY.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFavorite = profile.favoriteExercises.includes(id);
    let newFavorites: string[];
    if (isFavorite) {
      newFavorites = profile.favoriteExercises.filter(favId => favId !== id);
    } else {
      newFavorites = [...profile.favoriteExercises, id];
    }
    onUpdateProfile({ ...profile, favoriteExercises: newFavorites });
  };

  return (
    <div id="explorer-view" className="space-y-8 max-w-5xl mx-auto pb-24 px-4 sm:px-0">
      {/* Search & Tabs */}
      <div className="flex flex-col gap-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search size={22} className="text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Vyhledat v národní databázi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-[30px] py-5 pl-14 pr-6 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all italic tracking-tight"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
          {['Vše', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'Vše' ? null : cat)}
              className={cn(
                "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border shrink-0",
                ((selectedCategory === null && cat === 'Vše') || selectedCategory === cat)
                  ? "bg-cyan-500 border-cyan-400 text-black shadow-lg shadow-cyan-500/20"
                  : "bg-white/5 border-white/5 text-slate-500 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Výsledky Analýzy</h3>
        <div className="h-px flex-1 mx-6 bg-gradient-to-r from-white/5 to-transparent" />
        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{filteredResults.length} objektů</span>
      </div>

      {/* Library Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResults.map((item) => (
          <motion.div
            layout
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative cursor-pointer"
            onClick={() => setSelectedExercise(item)}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-[32px] blur opacity-0 group-hover:opacity-20 transition duration-500" />
            <div className="relative glass-card overflow-hidden border-white/5 group-hover:border-cyan-500/30 transition-all flex flex-col h-full bg-black/20 p-6 rounded-[32px]">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-500 ring-1 ring-white/10 group-hover:ring-cyan-500/30 transition-all">
                  <Play size={20} />
                </div>
                <button 
                  onClick={(e) => toggleFavorite(item.id, e)}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    profile.favoriteExercises.includes(item.id) 
                      ? "bg-pink-500/10 text-pink-500" 
                      : "bg-white/5 text-slate-600 hover:text-pink-500 hover:bg-pink-500/5"
                  )}
                >
                  <Heart size={18} fill={profile.favoriteExercises.includes(item.id) ? "currentColor" : "none"} />
                </button>
              </div>
              
              <div className="flex-1">
                <h4 className="text-xl font-black text-white italic tracking-tighter mb-2 group-hover:text-cyan-400 transition-colors">
                  {item.name}
                </h4>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-2 py-0.5 rounded border border-white/5">{item.category}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed line-clamp-2 italic">
                  {item.description}
                </p>
              </div>
              
              <div className="mt-6 flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-slate-600">
                <span className="flex items-center gap-1"><Info size={10} /> Detail protokolu</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Exercise Detail Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-[40px] border-white/10 shadow-2xl relative"
            >
              {/* Modal Header/Video */}
              <div className="relative aspect-video bg-black overflow-hidden group">
                {selectedExercise.videoUrl ? (
                  <iframe 
                    src={selectedExercise.videoUrl} 
                    className="w-full h-full border-none opacity-80"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-800">
                    <Play size={80} />
                  </div>
                )}
                <div className="absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                   <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-black font-black italic shadow-lg shadow-cyan-500/20">M</div>
                        <div>
                          <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{selectedExercise.name}</h2>
                          <span className="text-[8px] text-slate-400 uppercase tracking-widest font-black">Procedurální UKÁZKA</span>
                        </div>
                      </div>
                   </div>
                </div>
                <button 
                  onClick={() => setSelectedExercise(null)}
                  className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white hover:text-black transition-all z-20 pointer-events-auto"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">
                  <section className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500">Technická Specifikace</h5>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium italic">
                      {selectedExercise.description}
                    </p>
                  </section>

                  <section className="space-y-6">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500">Klíčové Body Rozhraní</h5>
                    <div className="grid gap-4">
                      {selectedExercise.technicalPoints.map((point, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 items-start group hover:border-purple-500/20 transition-all">
                          <div className="mt-1 w-5 h-5 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[10px] font-black text-purple-500">{i + 1}</div>
                          <p className="text-xs text-slate-300 font-bold leading-relaxed">{point}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-10">
                  <section className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Varianty</h5>
                    <div className="flex flex-wrap gap-2">
                       {selectedExercise.commonVariations.map(v => (
                         <span key={v} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                           {v}
                         </span>
                       ))}
                    </div>
                  </section>

                  <div className="pt-8 border-t border-white/5 space-y-4">
                    <button 
                       onClick={(e) => toggleFavorite(selectedExercise.id, e)}
                       className={cn(
                         "w-full py-4 flex items-center justify-center gap-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                         profile.favoriteExercises.includes(selectedExercise.id)
                          ? "bg-pink-500/10 text-pink-500 border border-pink-500/20"
                          : "bg-white/5 border border-white/10 text-white hover:bg-pink-500 hover:text-white"
                       )}
                    >
                      <Heart size={16} fill={profile.favoriteExercises.includes(selectedExercise.id) ? "currentColor" : "none"} />
                      {profile.favoriteExercises.includes(selectedExercise.id) ? 'Uloženo v Oblíbených' : 'Přidat do Oblíbených'}
                    </button>

                    <button className="w-full py-4 bg-cyan-500 text-black flex items-center justify-center gap-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/10">
                       <Plus size={16} /> Přidat do Tréninku
                    </button>

                    <div className="flex gap-3">
                      <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest">
                         <Share2 size={14} /> Sdílet
                      </button>
                      <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest">
                         <Bookmark size={14} /> Kolekce
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
