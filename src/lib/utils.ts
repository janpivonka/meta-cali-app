import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('cs-CZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};
