
export interface ExerciseInfo {
  id: string;
  title: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';
  category: 'Pull' | 'Push' | 'Legs' | 'Statics' | 'Core' | 'Dynamics';
  image: string;
  tags: string[];
}

export const EXERCISES: ExerciseInfo[] = [
  // PULL
  { id: 'pull-01', title: 'Overhand Pull-ups', difficulty: 'INTERMEDIATE', category: 'Pull', tags: ['back', 'biceps'], image: 'https://picsum.photos/seed/pull1/400/300' },
  { id: 'pull-02', title: 'Underhand Pull-ups (Chin-ups)', difficulty: 'BEGINNER', category: 'Pull', tags: ['biceps', 'back'], image: 'https://picsum.photos/seed/pull2/400/300' },
  { id: 'pull-03', title: 'Wide Grip Pull-ups', difficulty: 'INTERMEDIATE', category: 'Pull', tags: ['back width', 'lats'], image: 'https://picsum.photos/seed/pull3/400/300' },
  { id: 'pull-04', title: 'Close Grip Pull-ups', difficulty: 'INTERMEDIATE', category: 'Pull', tags: ['middle back', 'biceps'], image: 'https://picsum.photos/seed/pull4/400/300' },
  { id: 'pull-05', title: 'Archer Pull-ups', difficulty: 'ADVANCED', category: 'Pull', tags: ['unilateral strength'], image: 'https://picsum.photos/seed/pull5/400/300' },
  { id: 'pull-06', title: 'Typewriter Pull-ups', difficulty: 'ADVANCED', category: 'Pull', tags: ['control', 'lats'], image: 'https://picsum.photos/seed/pull6/400/300' },
  { id: 'pull-07', title: 'Explosive Pull-ups (to waist)', difficulty: 'ADVANCED', category: 'Pull', tags: ['explosiveness'], image: 'https://picsum.photos/seed/pull7/400/300' },
  { id: 'pull-08', title: 'L-sit Pull-ups', difficulty: 'ADVANCED', category: 'Pull', tags: ['core', 'back'], image: 'https://picsum.photos/seed/pull8/400/300' },
  { id: 'pull-09', title: 'One Arm Pull-up', difficulty: 'ELITE', category: 'Pull', tags: ['limit strength'], image: 'https://picsum.photos/seed/pull9/400/300' },
  { id: 'pull-10', title: 'Australian Pull-ups', difficulty: 'BEGINNER', category: 'Pull', tags: ['basics'], image: 'https://picsum.photos/seed/pull10/400/300' },
  { id: 'pull-11', title: 'Muscle-up', difficulty: 'ADVANCED', category: 'Pull', tags: ['pull', 'push'], image: 'https://picsum.photos/seed/pull11/400/300' },
  { id: 'pull-12', title: 'Strict Muscle-up', difficulty: 'ELITE', category: 'Pull', tags: ['technique'], image: 'https://picsum.photos/seed/pull12/400/300' },
  { id: 'pull-13', title: 'Ring Muscle-up', difficulty: 'ELITE', category: 'Pull', tags: ['rings'], image: 'https://picsum.photos/seed/pull13/400/300' },
  
  // PUSH
  { id: 'push-01', title: 'Classic Push-ups', difficulty: 'BEGINNER', category: 'Push', tags: ['chest', 'triceps'], image: 'https://picsum.photos/seed/push1/400/300' },
  { id: 'push-02', title: 'Diamond Push-ups', difficulty: 'BEGINNER', category: 'Push', tags: ['triceps'], image: 'https://picsum.photos/seed/push2/400/300' },
  { id: 'push-03', title: 'Wide Push-ups', difficulty: 'BEGINNER', category: 'Push', tags: ['chest'], image: 'https://picsum.photos/seed/push3/400/300' },
  { id: 'push-04', title: 'Parallel Bar Dips', difficulty: 'INTERMEDIATE', category: 'Push', tags: ['triceps', 'chest'], image: 'https://picsum.photos/seed/push4/400/300' },
  { id: 'push-05', title: 'Deep Dips', difficulty: 'ADVANCED', category: 'Push', tags: ['mobility', 'triceps'], image: 'https://picsum.photos/seed/push5/400/300' },
  { id: 'push-06', title: 'Handstand Push-ups (HSPU)', difficulty: 'ADVANCED', category: 'Push', tags: ['shoulders'], image: 'https://picsum.photos/seed/push6/400/300' },
  { id: 'push-07', title: 'Pike Push-ups', difficulty: 'INTERMEDIATE', category: 'Push', tags: ['shoulders'], image: 'https://picsum.photos/seed/push7/400/300' },
  { id: 'push-08', title: 'Pseudo Planche Push-ups', difficulty: 'ADVANCED', category: 'Push', tags: ['planche', 'shoulders'], image: 'https://picsum.photos/seed/push8/400/300' },
  { id: 'push-09', title: 'Archer Push-ups', difficulty: 'ADVANCED', category: 'Push', tags: ['unilateral strength'], image: 'https://picsum.photos/seed/push9/400/300' },
  { id: 'push-10', title: 'One Arm Push-ups', difficulty: 'ELITE', category: 'Push', tags: ['limit strength'], image: 'https://picsum.photos/seed/push10/400/300' },
  { id: 'push-11', title: 'Impossible Dip', difficulty: 'ELITE', category: 'Push', tags: ['triceps', 'elbows'], image: 'https://picsum.photos/seed/push11/400/300' },
  { id: 'push-12', title: 'Tigerbend Push-ups', difficulty: 'ADVANCED', category: 'Push', tags: ['handstand', 'triceps'], image: 'https://picsum.photos/seed/push12/400/300' },

  // LEGS
  { id: 'leg-01', title: 'Classic Squats', difficulty: 'BEGINNER', category: 'Legs', tags: ['quads', 'glutes'], image: 'https://picsum.photos/seed/leg1/400/300' },
  { id: 'leg-02', title: 'Bulgarian Split Squats', difficulty: 'INTERMEDIATE', category: 'Legs', tags: ['quads', 'balance'], image: 'https://picsum.photos/seed/leg2/400/300' },
  { id: 'leg-03', title: 'Pistol Squats', difficulty: 'ADVANCED', category: 'Legs', tags: ['strength', 'mobility'], image: 'https://picsum.photos/seed/leg3/400/300' },
  { id: 'leg-04', title: 'Shrimp Squats', difficulty: 'ADVANCED', category: 'Legs', tags: ['coordination'], image: 'https://picsum.photos/seed/leg4/400/300' },
  { id: 'leg-05', title: 'Side Lunges', difficulty: 'BEGINNER', category: 'Legs', tags: ['adductors'], image: 'https://picsum.photos/seed/leg5/400/300' },
  { id: 'leg-06', title: 'Box Jumps', difficulty: 'INTERMEDIATE', category: 'Legs', tags: ['plyometrics'], image: 'https://picsum.photos/seed/leg6/400/300' },

  // STATICS
  { id: 'stat-01', title: 'Planche Lean', difficulty: 'INTERMEDIATE', category: 'Statics', tags: ['planche', 'shoulders'], image: 'https://picsum.photos/seed/stat1/400/300' },
  { id: 'stat-02', title: 'Tuck Planche', difficulty: 'ADVANCED', category: 'Statics', tags: ['core', 'planche'], image: 'https://picsum.photos/seed/stat2/400/300' },
  { id: 'stat-03', title: 'Straddle Planche', difficulty: 'ELITE', category: 'Statics', tags: ['planche'], image: 'https://picsum.photos/seed/stat3/400/300' },
  { id: 'stat-04', title: 'Full Planche', difficulty: 'ELITE', category: 'Statics', tags: ['limit'], image: 'https://picsum.photos/seed/stat4/400/300' },
  { id: 'stat-05', title: 'Front Lever Hold', difficulty: 'ADVANCED', category: 'Statics', tags: ['back', 'core'], image: 'https://picsum.photos/seed/stat5/400/300' },
  { id: 'stat-06', title: 'Tuck Front Lever', difficulty: 'INTERMEDIATE', category: 'Statics', tags: ['back'], image: 'https://picsum.photos/seed/stat6/400/300' },
  { id: 'stat-07', title: 'Back Lever', difficulty: 'ADVANCED', category: 'Statics', tags: ['biceps', 'back'], image: 'https://picsum.photos/seed/stat7/400/300' },
  { id: 'stat-08', title: 'Handstand Hold', difficulty: 'INTERMEDIATE', category: 'Statics', tags: ['balance', 'shoulders'], image: 'https://picsum.photos/seed/stat8/400/300' },
  { id: 'stat-09', title: 'Human Flag', difficulty: 'ADVANCED', category: 'Statics', tags: ['obliques'], image: 'https://picsum.photos/seed/stat9/400/300' },
  { id: 'stat-10', title: 'Iron Cross', difficulty: 'ELITE', category: 'Statics', tags: ['rings', 'shoulders'], image: 'https://picsum.photos/seed/stat10/400/300' },
  { id: 'stat-11', title: 'Maltese hold', difficulty: 'ELITE', category: 'Statics', tags: ['planche pro'], image: 'https://picsum.photos/seed/stat11/400/300' },
  { id: 'stat-12', title: 'Dragon Flag hold', difficulty: 'ADVANCED', category: 'Statics', tags: ['core'], image: 'https://picsum.photos/seed/stat12/400/300' },

  // CORE
  { id: 'core-01', title: 'Hanging Leg Raises', difficulty: 'INTERMEDIATE', category: 'Core', tags: ['abs'], image: 'https://picsum.photos/seed/core1/400/300' },
  { id: 'core-02', title: 'Floor L-Sit', difficulty: 'INTERMEDIATE', category: 'Core', tags: ['triceps', 'core'], image: 'https://picsum.photos/seed/core2/400/300' },
  { id: 'core-03', title: 'V-Sit', difficulty: 'ADVANCED', category: 'Core', tags: ['flexibility'], image: 'https://picsum.photos/seed/core3/400/300' },
  { id: 'core-04', title: 'Windshield Wipers', difficulty: 'ADVANCED', category: 'Core', tags: ['rotation'], image: 'https://picsum.photos/seed/core4/400/300' },
  { id: 'core-05', title: 'Windshield Wipers (Alt)', difficulty: 'ADVANCED', category: 'Core', tags: ['rotation'], image: 'https://picsum.photos/seed/core5/400/300' },
  { id: 'core-06', title: 'Ab Wheel Rollout', difficulty: 'INTERMEDIATE', category: 'Core', tags: ['lower abs'], image: 'https://picsum.photos/seed/core6/400/300' },

  // DYNAMICS
  { id: 'dyn-01', title: '360 Pull-up', difficulty: 'ELITE', category: 'Dynamics', tags: ['corkscrew'], image: 'https://picsum.photos/seed/dyn1/400/300' },
  { id: 'dyn-02', title: 'Swing 360', difficulty: 'ADVANCED', category: 'Dynamics', tags: ['bar'], image: 'https://picsum.photos/seed/dyn2/400/300' },
  { id: 'dyn-03', title: 'Back Flip', difficulty: 'ELITE', category: 'Dynamics', tags: ['acrobatics'], image: 'https://picsum.photos/seed/dyn3/400/300' },
  { id: 'dyn-04', title: 'Front Flip', difficulty: 'ELITE', category: 'Dynamics', tags: ['acrobatics'], image: 'https://picsum.photos/seed/dyn4/400/300' },
];

// Automatically generate variations to fill up to 500+ items (Simulation for display)
const generateVariations = (baseList: ExerciseInfo[], count: number): ExerciseInfo[] => {
    const variations: ExerciseInfo[] = [...baseList];
    const difficultyLevels: ExerciseInfo['difficulty'][] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ELITE'];
    const categories: ExerciseInfo['category'][] = ['Pull', 'Push', 'Legs', 'Statics', 'Core', 'Dynamics'];
    
    const prefixes = ['Weighted', 'Explosive', 'Slow', 'Ring', 'Parallettes', 'Archer', 'Typewriter', 'Negative'];
    const suffixes = ['with Pause', 'L-Sit', 'Tuck', 'Straddle', 'Full'];

    for (let i = 0; i < count; i++) {
        const base = baseList[Math.floor(Math.random() * baseList.length)];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        
        variations.push({
            id: `v-${i}`,
            title: `${prefix} ${base.title} ${suffix}`,
            difficulty: difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)],
            category: categories[Math.floor(Math.random() * categories.length)],
            image: `https://picsum.photos/seed/ex-${i}/400/300`,
            tags: [base.category.toLowerCase(), prefix.toLowerCase()]
        });
    }
    return variations;
};

export const ALL_EXERCISES = generateVariations(EXERCISES, 450); // Total ~500 exercises
