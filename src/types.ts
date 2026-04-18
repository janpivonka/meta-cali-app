export type PredefinedExercise = 
  | 'Shyby' | 'Kliky' | 'Dipy' | 'Dřepy' | 'Výpady' | 'Plank' | 'Muscleups' | 'Přednosy' | 'Angličáky'
  | 'Planche lean' | 'Tuck planche' | 'Advtuck planche' | 'Straddle planche' | 'Full planche'
  | 'Frontlever' | 'Backlever' | 'Victorian' | 'Dragon flag' | 'L-Sit' | 'V-Sit'
  | 'HSPU' | '90° HSPU' | 'Pike press' | 'Bentarm press' | 'Handstand press' | 'Deep HSPU'
  | 'Hollowback' | 'Iron Cross' | 'Maltese' | 'Hefesto' | 'Pelican' | 'Muscle-ups'
  | 'Pullovers' | 'Výmyky' | 'Korean dips' | 'Russian dips' | 'Archer pushups'
  | 'Typewriters' | 'Yguana pushups' | 'Tigerbent pushups' | 'High pull-ups'
  | 'Australian pull-ups' | 'Scapula pushups' | 'Scapula pull-ups' | 'Shoulder shrugs'
  | 'Tuck frontlever raises' | 'Halflay frontlever raises' | 'Frontlever raises'
  | 'Ice cream makers' | 'Upside down deadlift' | 'Pike float pushups'
  | 'Tornado 360' | '540 try' | '360 pull-up' | 'Shrimpflip' | 'Alleyhoop'
  | 'Hefesto negatives' | 'Entrada deadhang' | 'Backlever pull-ups'
  | 'Heavily weighted dips' | 'Weighted pull-ups' | 'Impossible dip' | 'Human flag'
  | 'Chin ups' | 'Australian rows' | 'Pistol squats' | 'Deadlift' | 'Sit ups'
  | 'Swing' | 'Giant' | 'Salto' | 'Stojka' | 'Handstand walkthrough'
  | 'Stall bars leg raises' | 'Frontlever hold' | 'Planche hold';
export type ExerciseType = PredefinedExercise | string;

export interface WorkoutSet {
  reps: number;
  weight?: number; // extra weight in kg
}

export interface ExerciseLog {
  id: string;
  type: ExerciseType;
  block?: string; // e.g. PLANCHE, PULL BASICS
  sets: WorkoutSet[];
  timestamp: number;
}

export interface UserProfile {
  name: string;
  weight: number;
  height: number;
  bio: string;
  posts: number;
  followers: number;
  following: number;
  goals: {
    pullups: number;
    pushups: number;
    dips: number;
    planche: number; // in seconds
    frontlever: number; // in seconds
  };
  trophies: string[];
}

export interface UserStats {
  logs: ExerciseLog[];
  profile?: UserProfile;
}
