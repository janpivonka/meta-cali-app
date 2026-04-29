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

/**
 * Shared utility to generate descriptive labels for a workout set
 */
export const getSetMetadata = (s: any, ex: any) => {
  const effectiveUnit = s.weightUnit || ex.weightUnit || 'kg';
  const effectiveLoadType = s.loadType || ex.loadType;
  const res = s.assistanceDetails?.resistance || ex.assistanceValue || (s.assistanceDetails?.resistance);

  const currentLoadLabel = (() => {
    if (effectiveLoadType === 'bodyweight') return 'BODYWEIGHT';
    if (s.weight && s.weight > 0) return `WEIGHTED (+${s.weight}${effectiveUnit.toUpperCase()})`;
    if (effectiveLoadType === 'assisted' && res) return `ASSISTED (-${res}${effectiveUnit.toUpperCase()})`;
    if (effectiveLoadType === 'weighted') return `WEIGHTED (+${res || 0}${effectiveUnit.toUpperCase()})`;
    return 'BODYWEIGHT';
  })();

  const orangeLine = [];
  const hasDipBarSupport = s.assistanceDetails?.dipBarFootSupport || ex.assistanceDetails?.dipBarFootSupport;
  
  if (effectiveLoadType === 'assisted' && res) {
    if (hasDipBarSupport) orangeLine.push('DIP BAR SUPPORT');
    orangeLine.push(`${res}${effectiveUnit.toUpperCase()} BAND`);
    
    const p = s.assistanceDetails?.placement || ex.assistanceDetails?.placement;
    const loopType = s.assistanceDetails?.loopType || ex.assistanceDetails?.loopType;
    
    if (loopType === 'double') {
      orangeLine.push('DOUBLE');
    } else if (loopType === 'half') {
      orangeLine.push('1/2');
    }

    if (p) {
      // If dip bar support is on, usually it's just waist. 
      // We filter out 'one foot' if dip bar support is on to satisfy user's "just waist" request
      const placements = Array.isArray(p) ? p : [p];
      const filteredPlacements = hasDipBarSupport ? placements.filter(item => item === 'waist') : placements;
      if (filteredPlacements.length > 0) {
        orangeLine.push(filteredPlacements.join('/').toUpperCase());
      } else if (hasDipBarSupport) {
        orangeLine.push('WAIST'); // Default fallback if filtered out but support is on
      }
    }
  }
  if (s.weight && s.weight > 0 && effectiveLoadType !== 'weighted') orangeLine.push(`+${s.weight}${effectiveUnit.toUpperCase()}`);

  const gripLine = [];
  const gWidth = s.gripWidth || ex.gripWidth || 'shoulder-width';
  const gType = s.grip || ex.grip || 'pronated';
  const gThumb = s.thumb || ex.thumb || 'under';
  const gFalse = (s.falseGrip !== undefined ? s.falseGrip : ex.falseGrip) ? 'FALSE GRIP' : null;
  const gEquip = s.equipment || ex.equipment || 'pull-up bar';
  const eStyle = s.executionStyle || ex.executionStyle || 'basic';

  if (eStyle !== 'commando') {
    if (eStyle !== 'one arm') gripLine.push(gWidth);
    if (gType === 'mixed') {
      const details = s.mixedGripDetails || ex.mixedGripDetails;
      if (details) {
        let mixedStr = `L:${details.left.toUpperCase()} / R:${details.right.toUpperCase()}`;
        if (details.isAlternating) mixedStr += ' (ALT-HANDS)';
        gripLine.push(mixedStr);
      } else {
        gripLine.push(gType);
      }
    } else {
      gripLine.push(gType);
    }
  }
  gripLine.push(`${gThumb} THUMB`);
  if (gFalse) gripLine.push(gFalse);
  gripLine.push(`@ ${gEquip}`);
  
  const equipLine: string[] = [];

  const armLine = [];
  const coreLine = [];
  const legLine = [];
  
  const eMethod = s.executionMethod || ex.executionMethod || 'standard';
  const ePos = s.position || ex.position || 'neutral';
  const eLeg = s.legProgression || ex.legProgression || 'full';
  const eHand = s.oneArmHandPosition || ex.oneArmHandPosition;
  const eSide = s.oneArmSide || ex.oneArmSide;

  if (eStyle === 'one arm' || eStyle === 'commando') {
    const sideLabel = eSide ? ` - ${eSide.toUpperCase()}` : '';
    const handLabel = (eStyle === 'one arm' && eHand && eHand !== 'free') ? ` (H:${eHand.toUpperCase()})` : '';
    const prefix = eStyle === 'one arm' ? 'ONE ARM' : 'COMMANDO';
    armLine.push(`${prefix}${sideLabel}${handLabel}`);
  } else {
    armLine.push(eStyle);
  }
  armLine.push(eMethod);

  coreLine.push(ePos);
  
  if (eLeg === 'one leg') {
    const sideLabel = eSide ? ` - ${eSide.toUpperCase()}` : '';
    const p1 = s.oneLegPrimaryPosition || ex.oneLegPrimaryPosition || 'full';
    const p2 = s.oneLegSecondaryPosition || ex.oneLegSecondaryPosition || 'tuck';
    legLine.push(`LEG ASSIST: ${sideLabel.replace(' - ', '') || 'N/A'} (${p1.toUpperCase()}/${p2.toUpperCase()})`);
  } else if (hasDipBarSupport) {
    let supportLabel = eLeg.toUpperCase();
    if (eLeg.includes('australian')) {
      supportLabel = eLeg.includes('bent') ? 'AUSTRALIAN (BENT)' : 'AUSTRALIAN (STRAIGHT)';
    }
    const sideLabel = eSide ? ` - ${eSide.toUpperCase()}` : '';
    legLine.push(`FLOATING LEG: ${supportLabel}${sideLabel}`);
  } else {
    const upperLeg = eLeg.toUpperCase();
    if (upperLeg.includes('AUSTRALIAN')) {
      // Ensure specific Australian labels in summary
      legLine.push(upperLeg.includes('BENT') ? 'AUSTRALIAN (BENT)' : 'AUSTRALIAN (STRAIGHT)');
    } else {
      legLine.push(upperLeg);
    }
  }

  return { currentLoadLabel, orangeLine, gripLine, equipLine, armLine, coreLine, legLine };
};

export const SHADED_COLORS = [
  '#64748b', // slate
  '#22d3ee', // cyan
  '#a855f7', // purple
  '#f97316', // orange
  '#ec4899', // pink
  '#10b981', // emerald
  '#f59e0b', // amber
  '#6366f1', // indigo
  '#3b82f6', // blue
  '#14b8a6', // teal
  '#f43f5e', // rose
];

export const getColorFromMeta = (metaKey: string) => {
  let hash = 0;
  for (let i = 0; i < metaKey.length; i++) {
    hash = metaKey.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % SHADED_COLORS.length;
  return SHADED_COLORS[index];
};
