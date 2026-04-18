
export interface ExerciseInfo {
  id: string;
  title: string;
  difficulty: 'ZAČÁTEČNÍK' | 'STŘEDNÍ' | 'POKROČILÉ' | 'EXTRÉMNÍ';
  category: 'Tah' | 'Tlak' | 'Nohy' | 'Statika' | 'Core' | 'Dynamika';
  image: string;
  tags: string[];
}

export const EXERCISES: ExerciseInfo[] = [
  // TAH (PULL)
  { id: 'pull-01', title: 'Shyby na nadhmat', difficulty: 'STŘEDNÍ', category: 'Tah', tags: ['záda', 'biceps'], image: 'https://picsum.photos/seed/pull1/400/300' },
  { id: 'pull-02', title: 'Shyby na podhmat (Chin-ups)', difficulty: 'ZAČÁTEČNÍK', category: 'Tah', tags: ['biceps', 'záda'], image: 'https://picsum.photos/seed/pull2/400/300' },
  { id: 'pull-03', title: 'Široké shyby', difficulty: 'STŘEDNÍ', category: 'Tah', tags: ['šířka zad', 'laty'], image: 'https://picsum.photos/seed/pull3/400/300' },
  { id: 'pull-04', title: 'Úzké shyby', difficulty: 'STŘEDNÍ', category: 'Tah', tags: ['střed zad', 'biceps'], image: 'https://picsum.photos/seed/pull4/400/300' },
  { id: 'pull-05', title: 'Archer shyby', difficulty: 'POKROČILÉ', category: 'Tah', tags: ['jednostranná síla'], image: 'https://picsum.photos/seed/pull5/400/300' },
  { id: 'pull-06', title: 'Typewriter shyby', difficulty: 'POKROČILÉ', category: 'Tah', tags: ['kontrola', 'laty'], image: 'https://picsum.photos/seed/pull6/400/300' },
  { id: 'pull-07', title: 'Explosivní shyby (k pasu)', difficulty: 'POKROČILÉ', category: 'Tah', tags: ['výbušnost'], image: 'https://picsum.photos/seed/pull7/400/300' },
  { id: 'pull-08', title: 'L-sit shyby', difficulty: 'POKROČILÉ', category: 'Tah', tags: ['core', 'záda'], image: 'https://picsum.photos/seed/pull8/400/300' },
  { id: 'pull-09', title: 'Shyby na jedné ruce (One arm pull-up)', difficulty: 'EXTRÉMNÍ', category: 'Tah', tags: ['limitní síla'], image: 'https://picsum.photos/seed/pull9/400/300' },
  { id: 'pull-10', title: 'Australiské přítahy', difficulty: 'ZAČÁTEČNÍK', category: 'Tah', tags: ['základy'], image: 'https://picsum.photos/seed/pull10/400/300' },
  { id: 'pull-11', title: 'Muscle-up', difficulty: 'POKROČILÉ', category: 'Tah', tags: ['tah', 'tlak'], image: 'https://picsum.photos/seed/pull11/400/300' },
  { id: 'pull-12', title: 'Strict Muscle-up', difficulty: 'EXTRÉMNÍ', category: 'Tah', tags: ['technika'], image: 'https://picsum.photos/seed/pull12/400/300' },
  { id: 'pull-13', title: 'Ring Muscle-up', difficulty: 'EXTRÉMNÍ', category: 'Tah', tags: ['kruhy'], image: 'https://picsum.photos/seed/pull13/400/300' },
  
  // TLAK (PUSH)
  { id: 'push-01', title: 'Klasické kliky', difficulty: 'ZAČÁTEČNÍK', category: 'Tlak', tags: ['prsa', 'triceps'], image: 'https://picsum.photos/seed/push1/400/300' },
  { id: 'push-02', title: 'Diamantové kliky', difficulty: 'ZAČÁTEČNÍK', category: 'Tlak', tags: ['triceps'], image: 'https://picsum.photos/seed/push2/400/300' },
  { id: 'push-03', title: 'Široké kliky', difficulty: 'ZAČÁTEČNÍK', category: 'Tlak', tags: ['prsa'], image: 'https://picsum.photos/seed/push3/400/300' },
  { id: 'push-04', title: 'Kliky na bradlech (Dipy)', difficulty: 'STŘEDNÍ', category: 'Tlak', tags: ['triceps', 'prsa'], image: 'https://picsum.photos/seed/push4/400/300' },
  { id: 'push-05', title: 'Hluboké dipy', difficulty: 'POKROČILÉ', category: 'Tlak', tags: ['mobilita', 'triceps'], image: 'https://picsum.photos/seed/push5/400/300' },
  { id: 'push-06', title: 'Kliky ve stojce (HSPU)', difficulty: 'POKROČILÉ', category: 'Tlak', tags: ['ramena'], image: 'https://picsum.photos/seed/push6/400/300' },
  { id: 'push-07', title: 'Pike pushups', difficulty: 'STŘEDNÍ', category: 'Tlak', tags: ['ramena'], image: 'https://picsum.photos/seed/push7/400/300' },
  { id: 'push-08', title: 'Pseudo planche kliky', difficulty: 'POKROČILÉ', category: 'Tlak', tags: ['planche', 'ramena'], image: 'https://picsum.photos/seed/push8/400/300' },
  { id: 'push-09', title: 'Archer kliky', difficulty: 'POKROČILÉ', category: 'Tlak', tags: ['jednostranná síla'], image: 'https://picsum.photos/seed/push9/400/300' },
  { id: 'push-10', title: 'Kliky na jedné ruce', difficulty: 'EXTRÉMNÍ', category: 'Tlak', tags: ['limitní síla'], image: 'https://picsum.photos/seed/push10/400/300' },
  { id: 'push-11', title: 'Impossible dip', difficulty: 'EXTRÉMNÍ', category: 'Tlak', tags: ['triceps', 'lokty'], image: 'https://picsum.photos/seed/push11/400/300' },
  { id: 'push-12', title: 'Tigerbend kliky', difficulty: 'POKROČILÉ', category: 'Tlak', tags: ['stojka', 'triceps'], image: 'https://picsum.photos/seed/push12/400/300' },

  // NOHY (LEGS)
  { id: 'leg-01', title: 'Klasické dřepy', difficulty: 'ZAČÁTEČNÍK', category: 'Nohy', tags: ['quads', 'glutes'], image: 'https://picsum.photos/seed/leg1/400/300' },
  { id: 'leg-02', title: 'Bulharské dřepy', difficulty: 'STŘEDNÍ', category: 'Nohy', tags: ['quads', 'balanc'], image: 'https://picsum.photos/seed/leg2/400/300' },
  { id: 'leg-03', title: 'Pistol dřepy', difficulty: 'POKROČILÉ', category: 'Nohy', tags: ['síla', 'mobilita'], image: 'https://picsum.photos/seed/leg3/400/300' },
  { id: 'leg-04', title: 'Shrimp dřepy', difficulty: 'POKROČILÉ', category: 'Nohy', tags: ['koordinace'], image: 'https://picsum.photos/seed/leg4/400/300' },
  { id: 'leg-05', title: 'Výpady do strany', difficulty: 'ZAČÁTEČNÍK', category: 'Nohy', tags: ['adduktory'], image: 'https://picsum.photos/seed/leg5/400/300' },
  { id: 'leg-06', title: 'Výskoky na bednu', difficulty: 'STŘEDNÍ', category: 'Nohy', tags: ['plyometrie'], image: 'https://picsum.photos/seed/leg6/400/300' },

  // STATIKA (STATICS)
  { id: 'stat-01', title: 'Planche Lean', difficulty: 'STŘEDNÍ', category: 'Statika', tags: ['planche', 'ramena'], image: 'https://picsum.photos/seed/stat1/400/300' },
  { id: 'stat-02', title: 'Tuck Planche', difficulty: 'POKROČILÉ', category: 'Statika', tags: ['střed těla', 'planche'], image: 'https://picsum.photos/seed/stat2/400/300' },
  { id: 'stat-03', title: 'Straddle Planche', difficulty: 'EXTRÉMNÍ', category: 'Statika', tags: ['planche'], image: 'https://picsum.photos/seed/stat3/400/300' },
  { id: 'stat-04', title: 'Full Planche', difficulty: 'EXTRÉMNÍ', category: 'Statika', tags: ['limit'], image: 'https://picsum.photos/seed/stat4/400/300' },
  { id: 'stat-05', title: 'Front Lever Hold', difficulty: 'POKROČILÉ', category: 'Statika', tags: ['záda', 'core'], image: 'https://picsum.photos/seed/stat5/400/300' },
  { id: 'stat-06', title: 'Tuck Front Lever', difficulty: 'STŘEDNÍ', category: 'Statika', tags: ['záda'], image: 'https://picsum.photos/seed/stat6/400/300' },
  { id: 'stat-07', title: 'Back Lever', difficulty: 'POKROČILÉ', category: 'Statika', tags: ['biceps', 'záda'], image: 'https://picsum.photos/seed/stat7/400/300' },
  { id: 'stat-08', title: 'Handstand (Stojka)', difficulty: 'STŘEDNÍ', category: 'Statika', tags: ['balanc', 'ramena'], image: 'https://picsum.photos/seed/stat8/400/300' },
  { id: 'stat-09', title: 'Human Flag', difficulty: 'POKROČILÉ', category: 'Statika', tags: ['šikmé břišní svaly'], image: 'https://picsum.photos/seed/stat9/400/300' },
  { id: 'stat-10', title: 'Iron Cross', difficulty: 'EXTRÉMNÍ', category: 'Statika', tags: ['kruhy', 'ramena'], image: 'https://picsum.photos/seed/stat10/400/300' },
  { id: 'stat-11', title: 'Maltese hold', difficulty: 'EXTRÉMNÍ', category: 'Statika', tags: ['planche pro'], image: 'https://picsum.photos/seed/stat11/400/300' },
  { id: 'stat-12', title: 'Dragon Flag hold', difficulty: 'POKROČILÉ', category: 'Statika', tags: ['core'], image: 'https://picsum.photos/seed/stat12/400/300' },

  // CORE
  { id: 'core-01', title: 'Přednosy ve visu', difficulty: 'STŘEDNÍ', category: 'Core', tags: ['břicho'], image: 'https://picsum.photos/seed/core1/400/300' },
  { id: 'core-02', title: 'L-Sit na zemi', difficulty: 'STŘEDNÍ', category: 'Core', tags: ['triceps', 'core'], image: 'https://picsum.photos/seed/core2/400/300' },
  { id: 'core-03', title: 'V-Sit', difficulty: 'POKROČILÉ', category: 'Core', tags: ['ohebnost'], image: 'https://picsum.photos/seed/core3/400/300' },
  { id: 'core-04', title: 'Windshield wipers', difficulty: 'POKROČILÉ', category: 'Core', tags: ['rotace'], image: 'https://picsum.photos/seed/core4/400/300' },
  { id: 'core-05', title: 'Stěrač (Windshield wipers)', difficulty: 'POKROČILÉ', category: 'Core', tags: ['rotace'], image: 'https://picsum.photos/seed/core5/400/300' },
  { id: 'core-06', title: 'Ab wheel rollout', difficulty: 'STŘEDNÍ', category: 'Core', tags: ['spodní břicho'], image: 'https://picsum.photos/seed/core6/400/300' },

  // DYNAMIKA
  { id: 'dyn-01', title: '360 Pull-up', difficulty: 'EXTRÉMNÍ', category: 'Dynamika', tags: ['vývrtka'], image: 'https://picsum.photos/seed/dyn1/400/300' },
  { id: 'dyn-02', title: 'Swing 360', difficulty: 'POKROČILÉ', category: 'Dynamika', tags: ['hrazda'], image: 'https://picsum.photos/seed/dyn2/400/300' },
  { id: 'dyn-03', title: 'Backward Salto', difficulty: 'EXTRÉMNÍ', category: 'Dynamika', tags: ['akrobacie'], image: 'https://picsum.photos/seed/dyn3/400/300' },
  { id: 'dyn-04', title: 'Front Flip', difficulty: 'EXTRÉMNÍ', category: 'Dynamika', tags: ['akrobacie'], image: 'https://picsum.photos/seed/dyn4/400/300' },
];

// Automatické generování variací pro doplnění do počtu 500+ (Simulace pro zobrazení)
const generateVariations = (baseList: ExerciseInfo[], count: number): ExerciseInfo[] => {
    const variations: ExerciseInfo[] = [...baseList];
    const difficultyLevels: ExerciseInfo['difficulty'][] = ['ZAČÁTEČNÍK', 'STŘEDNÍ', 'POKROČILÉ', 'EXTRÉMNÍ'];
    const categories: ExerciseInfo['category'][] = ['Tah', 'Tlak', 'Nohy', 'Statika', 'Core', 'Dynamika'];
    
    const prefixes = ['Vážený', 'Explosivní', 'Pomalý', 'Ring', 'Parallettes', 'Archer', 'Typewriter', 'Negative'];
    const suffixes = ['se stopkou', 'L-Sit', 'Tuck', 'Straddle', 'Full'];

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

export const ALL_EXERCISES = generateVariations(EXERCISES, 450); // Celkem ~500 cviků
