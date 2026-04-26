import React, { useEffect, useState } from 'react';

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

export const MediaRenderer: React.FC<MediaRendererProps> = ({
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
}) => {
  const [objectUrl, setObjectUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!url) {
      setObjectUrl(undefined);
      return;
    }

    if (typeof url === 'string') {
      setObjectUrl(url);
      return;
    }

    // It's a File or Blob
    try {
      // Check cache first
      if (blobUrlCache.has(url)) {
        setObjectUrl(blobUrlCache.get(url));
        return;
      }

      const generatedUrl = URL.createObjectURL(url);
      blobUrlCache.set(url, generatedUrl);
      setObjectUrl(generatedUrl);
      
      // Note: We don't revoke it here because we cached it for potentially other instances
      // The browser will revoke them when the page is closed or we could implement a more complex cleanup
      // But typically Blob URLs for user-uploaded session files are fine to persist for the session lifetime
    } catch (e) {
      console.error('Failed to create object URL for media:', e);
      setObjectUrl(undefined);
    }
  }, [url]);

  if (!objectUrl && !thumbnail) return null;

  if (type === 'image') {
    return (
      <img
        src={objectUrl || thumbnail}
        className={className}
        alt={alt}
        referrerPolicy={referrerPolicy}
        onClick={onClick}
      />
    );
  }

  return (
    <video
      id={id}
      src={objectUrl}
      poster={poster || thumbnail}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      playsInline={playsInline}
      preload={preload}
      muted={muted}
      onClick={onClick}
    />
  );
};
