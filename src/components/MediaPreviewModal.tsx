import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExerciseMedia } from '../types';
import { MediaRenderer } from './MediaRenderer';
import { cn } from '../lib/utils';

interface MediaPreviewModalProps {
  media: ExerciseMedia[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectThumbnail?: (media: ExerciseMedia, thumbnail: string) => void;
}

export const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({ 
  media, 
  initialIndex, 
  isOpen, 
  onClose,
  onSelectThumbnail
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
  };

  const handleCaptureFrame = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current || !onSelectThumbnail) return;

    const video = videoRef.current;
    
    // Ensure video is ready
    if (video.readyState < 2) {
      alert('Video se nestihlo načíst pro snímek. Zkuste to prosím znovu za sekundu.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    if (canvas.width === 0 || canvas.height === 0) {
      alert('Chyba při čtení rozměrů videa.');
      return;
    }

    // Resize
    const MAX_THUMB = 420; 
    let { width, height } = canvas;
    if (width > height) {
      if (width > MAX_THUMB) {
        height *= MAX_THUMB / width;
        width = MAX_THUMB;
      }
    } else {
      if (height > MAX_THUMB) {
        width *= MAX_THUMB / height;
        height = MAX_THUMB;
      }
    }
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const thumbnail = canvas.toDataURL('image/jpeg', 0.9);

    onSelectThumbnail(media[currentIndex], thumbnail);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && media.length > 0 && media[currentIndex] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-10"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-[110]"
          >
            <X size={24} />
          </button>

          {media.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-[110]"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-[110]"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-5xl h-full flex flex-col items-center justify-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <MediaRenderer
                ref={videoRef}
                key={`${currentIndex}-${media[currentIndex].type}`}
                url={media[currentIndex].url}
                type={media[currentIndex].type}
                thumbnail={media[currentIndex].thumbnail}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                controls={media[currentIndex].type === 'video'}
                autoPlay={false}
                playsInline
                preload="auto"
                muted={false}
              />

              {media[currentIndex].type === 'video' && onSelectThumbnail && (
                <button
                  onClick={handleCaptureFrame}
                  className="absolute bottom-6 right-6 flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl z-[120]"
                >
                  <Camera size={16} />
                  Nastavit jako náhled
                </button>
              )}
            </div>

            <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-2">
              {media.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    idx === currentIndex ? "bg-cyan-500 w-4" : "bg-white/20"
                  )}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
