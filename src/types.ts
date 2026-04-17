export type PredefinedExercise = 
  | 'Shyby' | 'Kliky' | 'Dipy' | 'Dřepy' | 'Výpady' | 'Plank' | 'Muscle-ups' | 'Přednosy' | 'Angličáky'
  | 'Scapula pushups' | 'Planche lean' | 'Tuck planche' | 'Straddle planche' | 'Full planche'
  | 'Frontlever' | 'Backlever' | 'Victorian' | 'Dragon flag' | 'L-Sit' | 'V-Sit'
  | 'HSPU' | '90° HSPU' | 'Pike press' | 'Bentarm press' | 'Handstand press'
  | 'Hollowback' | 'Iron Cross' | 'Maltese' | 'Hefesto' | 'Pelican' | 'Muscleups'
  | 'Pullovers' | 'Výmyky' | 'Korean dips' | 'Russian dips' | 'Archer pushups'
  | 'Typewriters' | 'Yguana pushups' | 'Tigerbent pushups' | 'High pull-ups'
  | 'Australian pull-ups';
export type ExerciseType = PredefinedExercise | string;

export interface WorkoutSet {
  reps: number;
  weight?: number; // extra weight in kg
}

export interface ExerciseLog {
  id: string;
  type: ExerciseType;
  sets: WorkoutSet[];
  timestamp: number;
}

export interface UserProfile {
  name: string;
  weight: number;
  height: number;
  goals: {
    pullups: number;
    pushups: number;
    dips: number;
  };
}

export interface UserStats {
  logs: ExerciseLog[];
  profile?: UserProfile;
}
