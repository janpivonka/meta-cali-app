import React, { useEffect, useState } from 'react';
import { cn, isMediaVideo } from '../lib/utils';

// Global cache for object URLs to prevent multiple creations for the same File/Blob reference
// uses a WeakMap to let GC collect them when the File/Blob is no longer referenced elsewhere
const blobUrlCache = new WeakMap<any, string>();

interface MediaRendererProps {
  url: any;
  type: 'image' | 'video';
  thumbnail?: string;
  className?: string;
  alt?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  autoPlay?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  preload?: string;
  poster?: string;
  muted?: boolean;
  id?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const MediaRenderer = React.forwardRef<HTMLImageElement | HTMLVideoElement, MediaRendererProps>(({
  url,
  type,
  thumbnail,
  className,
  alt = '',
  referrerPolicy,
  autoPlay,
  controls,
  playsInline = true,
  preload = 'metadata',
  poster,
  muted = true,
  id,
  onClick
}, ref) => {
  const [objectUrl, setObjectUrl] = useState<string | undefined>(() => {
    if (!url) return undefined;
    if (typeof url === 'string') return url;
    if (url !== null && typeof url === 'object') {
      return blobUrlCache.get(url);
    }
    return undefined;
  });

  useEffect(() => {
    if (!url) {
      setObjectUrl(undefined);
      return;
    }

    if (typeof url === 'string') {
      setObjectUrl(url);
      return;
    }

    // It's a File or Blob or other object
    try {
      // Check cache first (only if it's an object)
      const isObject = url !== null && typeof url === 'object';
      let currentUrl = isObject ? blobUrlCache.get(url) : undefined;
      
      if (!currentUrl) {
        try {
          if (url instanceof Blob || url instanceof File) {
            currentUrl = URL.createObjectURL(url);
            if (isObject) {
              blobUrlCache.set(url, currentUrl);
            }
          } else if (typeof url === 'string') {
             currentUrl = url;
          }
        } catch (err) {
          console.error('Failed to create object URL:', err);
        }
      }
      
      setObjectUrl(currentUrl);
    } catch (e) {
      console.error('Failed to create object URL for media:', e);
      setObjectUrl(undefined);
    }
  }, [url]);

  const isYouTube = typeof objectUrl === 'string' && (objectUrl.includes('youtube.com') || objectUrl.includes('youtu.be') || objectUrl.includes('/embed/'));
  
  // Infer type if missing or if it's a known video URL
  const effectiveType = isMediaVideo({ type, url: objectUrl || url }) ? 'video' : 'image';
  
  const getYouTubeUrl = (baseUrl: string) => {
    try {
      let embedUrl = baseUrl;
      if (baseUrl.includes('watch?v=')) {
        embedUrl = baseUrl.replace('watch?v=', 'embed/');
      } else if (baseUrl.includes('youtu.be/')) {
        embedUrl = baseUrl.replace('youtu.be/', 'youtube.com/embed/');
      }
      
      const urlObj = new URL(embedUrl);
      if (autoPlay) {
        urlObj.searchParams.set('autoplay', '1');
        urlObj.searchParams.set('mute', '1'); 
      }
      if (playsInline) {
        urlObj.searchParams.set('playsinline', '1');
      }
      return urlObj.toString();
    } catch (e) {
      return baseUrl;
    }
  };

  if (!objectUrl && !thumbnail) return null;

  if (isYouTube && effectiveType === 'video') {
    return (
      <div className={cn("relative overflow-hidden bg-black", className)}>
        {/* We use a container that attempts to fill the space provided by the parent or defaults to aspect-video */}
        <div className="w-full h-full aspect-video">
          <iframe
            src={getYouTubeUrl(objectUrl as string)}
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={alt || 'Video player'}
          />
        </div>
      </div>
    );
  }

  if (effectiveType === 'image') {
    return (
      <img
        ref={ref as React.Ref<HTMLImageElement>}
        key={objectUrl || thumbnail || 'empty-img'}
        src={objectUrl || thumbnail}
        className={className}
        alt={alt}
        referrerPolicy={referrerPolicy || "no-referrer"}
        onClick={onClick}
      />
    );
  }

  return (
    <video
      ref={ref as React.Ref<HTMLVideoElement>}
      key={objectUrl || 'empty-video'}
      id={id}
      src={objectUrl}
      poster={poster || thumbnail}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      playsInline={playsInline}
      preload={preload}
      muted={autoPlay ? true : muted} 
      onClick={onClick}
    />
  );
});

MediaRenderer.displayName = 'MediaRenderer';
