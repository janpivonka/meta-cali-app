export type GripType = 'pronated' | 'supinated' | 'neutral' | 'false' | 'mixed';
export type GripWidth = 'narrow' | 'shoulder-width' | 'wide';
export type ThumbPosition = 'top' | 'bottom';
export type EquipmentType = 'pull-up bar' | 'low bar' | 'dip bars' | 'rings' | 'floor' | 'parallelettes' | 'stall bars';
export type ExecutionType = 'standard' | 'one arm' | 'archer' | 'typewriter' | 'commando' | 'high' | 'negatives' | 'partials' | 'explosive' | 'controlled' | 'scapula' | 'korean' | 'australian';
export type BodyPosition = 'hollow body' | 'arch back' | 'L-sit' | 'tuck' | 'adv tuck' | 'halflay' | 'one leg' | 'straddle' | 'full' | 'australian (bent legs)' | 'australian (straight legs)';
export type OneArmHandPosition = 'wrist' | 'forearm' | 'elbow' | 'biceps' | 'shoulder' | 'horizontal' | 'free';
export type BandPlacement = 'both legs' | 'one leg' | 'waist' | 'knees' | 'back';
export type BandLoopType = 'single' | 'double';

export interface WorkoutSet {
  reps?: number;
  time?: number; // duration in seconds
  weight?: number; // extra weight in kg
  rpe?: number; // Rate of Perceived Exertion 1-10
}

export interface ExerciseMedia {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

export interface ExerciseLog {
  id: string;
  exerciseId: string; // reference to Library item
  type: string; // Keep string for UI display or custom ones
  grip?: GripType;
  gripWidth?: GripWidth;
  thumb?: ThumbPosition;
  equipment?: EquipmentType;
  execution?: ExecutionType | string;
  oneArmHandPosition?: OneArmHandPosition | string;
  position?: BodyPosition | string;
  assistance?: {
    type: 'Band' | 'Weight' | 'None';
    value?: string | number; // e.g. "Red", 10 (kg)
    placement?: BandPlacement[] | string;
    loopType?: BandLoopType;
    notes?: string;
  };
  sets: WorkoutSet[];
  notes?: string;
  media?: ExerciseMedia[];
  shared?: boolean;
  timestamp: number;
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  category: 'Pull' | 'Push' | 'Statics' | 'Legs' | 'Core' | 'Dynamic';
  description: string;
  videoUrl?: string;
  technicalPoints: string[];
  commonVariations: string[];
  isFavorite?: boolean;
}

export interface Goal {
  exercise: string;
  targetValue: number;
  currentValue: number;
  progress: number;
  metric: string;
}

export interface UserProfile {
  name: string;
  weight: number;
  height: number;
  bio: string;
  posts: number;
  followers: number;
  following: number;
  favoriteExercises: string[]; // List of IDs
  goals: Goal[];
  trophies: string[];
}

export interface UserStats {
  logs: ExerciseLog[];
  profile?: UserProfile;
}
