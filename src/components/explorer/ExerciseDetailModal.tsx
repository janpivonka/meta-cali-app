import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Info, Heart, Share2, Bookmark, Plus } from 'lucide-react';
import { ExerciseDefinition, UserProfile } from '../../types';
import { cn } from '../../lib/utils';
import { MediaRenderer } from '../MediaRenderer';

interface ExerciseDetailModalProps {
  exercise: ExerciseDefinition | null;
  onClose: () => void;
  profile: UserProfile;
  toggleFavorite: (id: string, e: React.MouseEvent) => void;
  onAddExercise: (ex: ExerciseDefinition) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise, onClose, profile, toggleFavorite, onAddExercise
}) => {
  return (
    <AnimatePresence>
      {exercise && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
            className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-[40px] border-white/10 shadow-2xl relative"
          >
            <div className="relative aspect-video bg-black overflow-hidden group">
              {exercise.videoUrl ? (
                <MediaRenderer
                  url={exercise.videoUrl}
                  type="video"
                  className="w-full h-full"
                  autoPlay
                  controls
                  playsInline
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-800"><Play size={80} /></div>
              )}
              <div className="absolute top-0 px-8 py-8 bg-gradient-to-b from-black/80 to-transparent w-full">
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{exercise.name}</h2>
              </div>
              <button onClick={onClose} className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white hover:text-black transition-all z-20">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-10">
                <p className="text-slate-400 text-sm italic">{exercise.description}</p>
                <div className="space-y-4">
                  {exercise.technicalPoints.map((p, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 italic text-slate-300 text-xs">
                      {p}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <button 
                  onClick={(e) => toggleFavorite(exercise.id, e)}
                  className={cn("w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border", profile.favoriteExercises.includes(exercise.id) ? "bg-pink-500/10 text-pink-500 border-pink-500/20" : "bg-white/5 border-white/10 text-white")}
                >
                  <Heart size={16} className="inline mr-2" fill={profile.favoriteExercises.includes(exercise.id) ? "currentColor" : "none"} />
                  {profile.favoriteExercises.includes(exercise.id) ? 'In Favorites' : 'Add to Favorites'}
                </button>
                <button onClick={() => { onAddExercise(exercise); onClose(); }} className="w-full py-4 bg-cyan-500 text-black rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
                  <Plus size={16} className="inline mr-2" /> Add to Workout
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
