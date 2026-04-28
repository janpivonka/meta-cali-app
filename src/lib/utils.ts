import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

export function getMediaUrl(url: any): string | undefined {
  if (typeof url === 'string') return url || undefined;
  return undefined;
}

export const isHoldExercise = (id: string) => {
  return ['planche', 'frontlever', 'statics', 'isometric', 'hold', 'human flag', 'iron cross'].some(k => id?.toLowerCase().includes(k));
};
