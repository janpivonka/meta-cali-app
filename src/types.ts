export type PredefinedExercise = 'Shyby' | 'Kliky' | 'Dipy' | 'Dřepy' | 'Výpady' | 'Plank' | 'Muscle-ups' | 'Přednosy' | 'Angličáky';
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
