import { ExerciseDefinition } from '../types';

export const EXERCISE_LIBRARY: ExerciseDefinition[] = [
  {
    id: 'pullups',
    name: 'Pull-ups',
    category: 'Pull',
    description: 'Basic pulling exercise on the bar for developing back and arm strength. Includes variations from basic pull-ups to scapula activations and challenging Korean pull-ups.',
    videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
    technicalPoints: [
      'Scapula activation before the pull.',
      'Full range of motion from straight arms to chin over the bar.',
      'Controlled movement without excessive swinging.',
      'Engaged core throughout the entire movement.'
    ],
    commonVariations: ['Wide Grip', 'Narrow Grip', 'Pronated', 'Supinated', 'Archer', 'L-Sit', 'Scapula', 'Korean', 'Australian']
  },
  {
    id: 'pushups',
    name: 'Push-ups',
    category: 'Push',
    description: 'Basic pressing exercise on the floor focusing on chest muscles and triceps.',
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    technicalPoints: [
      'Body in one straight line (hollow body).',
      'Elbows pointing slightly backward, not to the sides.',
      'Full range of motion – chest touching the floor.',
      'Active pushing away from the ground.'
    ],
    commonVariations: ['Diamond', 'Wide', 'Archer', 'Pseudo-planche', 'Clapping']
  },
  {
    id: 'dips',
    name: 'Dips',
    category: 'Push',
    description: 'Pressing exercise on parallel bars for building triceps and lower chest strength.',
    videoUrl: 'https://www.youtube.com/embed/2z8JmcrW-As',
    technicalPoints: [
      'Slight forward lean for better chest engagement.',
      'Deep descent to at least 90 degrees at the elbows.',
      'Full extension at the top phase.',
      'Stable shoulders, do not push them toward ears.'
    ],
    commonVariations: ['On Rings', 'Russian Dips', 'Straight Bar Dips', 'Weighted']
  },
  {
    id: 'muscleups',
    name: 'Muscle-ups',
    category: 'Dynamic',
    description: 'A combined exercise connecting pull-up and dip through a transition phase.',
    videoUrl: 'https://www.youtube.com/embed/guS0VatR_D8',
    technicalPoints: [
      'Explosive pull-up toward the waist.',
      'Quick elbow transition over the bar/rings.',
      'Strong press to full arm extension.',
      'Use of slight kiping for beginners.'
    ],
    commonVariations: ['Strict', 'Kipping', 'On Rings', 'Weighted']
  },
  {
    id: 'planche',
    name: 'Planche',
    category: 'Statics',
    description: 'A static element requiring extreme shoulder and core strength, with the body horizontal on the hands.',
    videoUrl: 'https://www.youtube.com/embed/XqfNo-MAsH4',
    technicalPoints: [
      'Locked elbows.',
      'Scapular protraction and depression.',
      'Maximum forward lean.',
      'Tensed legs and pointed toes.'
    ],
    commonVariations: ['L-Sit', 'Tuck', 'Adv Tuck', 'Straddle', 'Full']
  },
  {
    id: 'frontlever',
    name: 'Front Lever',
    category: 'Statics',
    description: 'A static pulling element where the body hangs horizontally below the bar.',
    videoUrl: 'https://www.youtube.com/embed/m62pDIn-A4w',
    technicalPoints: [
      'Locked arms.',
      'Scapular retraction and depression.',
      'Body in one straight line parallel to the floor.',
      'Strong activation of back muscles and core.'
    ],
    commonVariations: ['Tuck', 'Adv Tuck', 'Straddle', 'Full']
  }
];
