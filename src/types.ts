export type GripType = 'pronated' | 'supinated' | 'neutral' | 'mixed';
export type GripWidth = 'narrow' | 'shoulder-width' | 'wide';
export type ThumbPosition = 'top' | 'bottom';
export type EquipmentType = 'pull-up bar' | 'low bar' | 'dip bars' | 'rings' | 'floor' | 'parallelettes' | 'stall bars';
export type ExecutionStyle = 'basic' | 'one arm' | 'archer' | 'typewriter' | 'commando' | 'high' | 'korean';
export type ExecutionMethod = 'standard' | 'explosive' | 'partial' | 'negative' | 'scapula' | 'controlled';
export type BodyPosition = 'neutral' | 'hollow body' | 'arch back' | 'L-sit';
export type LegProgression = 'none' | 'tuck' | 'adv tuck' | 'straddle' | 'one leg' | 'halflay' | 'full' | 'australian (bent legs)' | 'australian (straight legs)';
export type SingleLegPosition = 'tuck' | 'adv tuck' | 'halflay' | 'full';
export type OneArmHandPosition = 'wrist' | 'forearm' | 'elbow' | 'biceps' | 'shoulder' | 'horizontal' | 'free';
export type BandPlacement = 'both legs' | 'one leg' | 'waist' | 'knees' | 'back';
export type BandLoopType = 'single' | 'double';

export interface WorkoutSet {
  reps?: number;
  time?: number; // duration in seconds
  weight?: number; // extra weight in kg
}

export type LoadType = 'bodyweight' | 'weighted' | 'assisted';

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
  falseGrip?: boolean;
  equipment?: EquipmentType;
  executionStyle?: ExecutionStyle | string;
  executionMethod?: ExecutionMethod | string;
  oneArmHandPosition?: OneArmHandPosition | string;
  oneLegPrimaryPosition?: SingleLegPosition;
  oneLegSecondaryPosition?: SingleLegPosition;
  position?: BodyPosition | string;
  legProgression?: LegProgression | string;
  loadType: LoadType;
  assistanceValue?: string | number; // e.g. "Red", 10 (kg)
  assistanceDetails?: {
    placement?: BandPlacement[] | string;
    loopType?: BandLoopType;
  };
  sets: WorkoutSet[];
  notes?: string;
  media?: ExerciseMedia[];
  timestamp: number;
}

export interface Workout {
  id: string;
  name?: string;
  exercises: ExerciseLog[];
  timestamp: number;
  shared?: boolean;
  notes?: string;
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
  workouts: Workout[];
  profile?: UserProfile;
}
