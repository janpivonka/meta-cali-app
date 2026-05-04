import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ExplorerHeaderProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (v: string | null) => void;
  categories: string[];
}

export const ExplorerHeader: React.FC<ExplorerHeaderProps> = ({ 
  searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categories 
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search size={22} className="text-slate-500" />
        </div>
        <input
          type="text"
          placeholder="Search in operative database..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-[30px] py-5 pl-14 pr-6 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all italic tracking-tight"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === 'All' ? null : cat)}
            className={cn(
              "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border shrink-0",
              ((selectedCategory === null && cat === 'All') || selectedCategory === cat)
                ? "bg-cyan-500 border-cyan-400 text-black shadow-lg shadow-cyan-500/20"
                : "bg-white/5 border-white/5 text-slate-500 hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
