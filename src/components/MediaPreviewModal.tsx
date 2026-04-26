import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExerciseMedia } from '../types';
import { MediaRenderer } from './MediaRenderer';

interface MediaPreviewModalProps {
  media: ExerciseMedia[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({ media, initialIndex, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  if (!isOpen || media.length === 0 || !media[currentIndex]) return null;

  const currentMedia = media[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-10"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
        >
          <X size={24} />
        </button>

        {media.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative max-w-full max-h-full flex items-center justify-center px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <MediaRenderer
            url={currentMedia.url}
            type={currentMedia.type}
            thumbnail={currentMedia.thumbnail}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            controls={currentMedia.type === 'video'}
            autoPlay={currentMedia.type === 'video'}
            playsInline
            preload="auto"
          />

          <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-2">
            {media.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-cyan-500 w-4' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
