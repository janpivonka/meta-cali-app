import { ExerciseDefinition } from '../types';

export const EXERCISE_LIBRARY: ExerciseDefinition[] = [
  {
    id: 'pullups',
    name: 'Shyby',
    category: 'Pull',
    description: 'Základní tahový cvik na hrazdě pro rozvoj síly zad a paží.',
    videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
    technicalPoints: [
      'Aktivace lopatek před samotným tahem.',
      'Plný rozsah pohybu od propnutých paží po bradu nad hrazdu.',
      'Kontrolovaný pohyb bez nadměrného kmitu.',
      'Zpevněné jádro (core) po celou dobu.'
    ],
    commonVariations: ['Široký úchop', 'Úzký úchop', 'Nadhmat', 'Podhmat', 'Archer', 'L-Sit']
  },
  {
    id: 'scapulapullups',
    name: 'Scapula Shyby',
    category: 'Pull',
    description: 'Izolovaný pohyb lopatek pro posílení stabilizátorů a zlepšení techniky shybů.',
    videoUrl: 'https://www.youtube.com/embed/S2p2nNRsFvE',
    technicalPoints: [
      'Propnuté paže po celou dobu pohybu.',
      'Maximální deprese a retrakce lopatek.',
      'Kontrolované uvolnění (deprese).',
      'Hlava v neutrální pozici.'
    ],
    commonVariations: ['Hrazda', 'Kruhy', 'L-Sit', 'Jednoruč']
  },
  {
    id: 'pushups',
    name: 'Kliky',
    category: 'Push',
    description: 'Základní tlakový cvik na zemi zaměřený na prsní svaly a tricepsy.',
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    technicalPoints: [
      'Tělo v jedné přímce (hollow body).',
      'Lokty směřují mírně dozadu, ne do stran.',
      'Plný rozsah pohybu – dotek hrudníku o zem.',
      'Aktivní odtlačování od země.'
    ],
    commonVariations: ['Diamantové', 'Široké', 'Archer', 'Pseudo-planche', 'S tlesknutím']
  },
  {
    id: 'dips',
    name: 'Dipy',
    category: 'Push',
    description: 'Tlakový cvik na bradlech pro budování síly tricepsů a spodní části prsu.',
    videoUrl: 'https://www.youtube.com/embed/2z8JmcrW-As',
    technicalPoints: [
      'Mírný náklon vpřed pro větší zapojení prsou.',
      'Hluboký pokles minimálně do pravého úhlu v loktech.',
      'Plné propnutí v horní fázi.',
      'Stabilní ramena, netlačit je k uším.'
    ],
    commonVariations: ['Na kruzích', 'Ruské dipy', 'Straight bar dips', 'S váhou']
  },
  {
    id: 'muscleups',
    name: 'Muscle-upy',
    category: 'Dynamic',
    description: 'Kombinovaný cvik spojující shyb a dip prostřednictvím přechodové fáze.',
    videoUrl: 'https://www.youtube.com/embed/guS0VatR_D8',
    technicalPoints: [
      'Explosivní shyb směřující k pasu.',
      'Rychlé překlopení loktů nad hrazdu/kruhy.',
      'Silný dotlak do propnutých paží.',
      'Využití mírného kmitu (kipping) u začátečníků.'
    ],
    commonVariations: ['Strict', 'Kipping', 'Na kruzích', 'Weighted']
  },
  {
    id: 'planche',
    name: 'Planche',
    category: 'Statics',
    description: 'Statický prvek vyžadující extrémní sílu ramen a jádra, tělo je v horizontále na rukou.',
    videoUrl: 'https://www.youtube.com/embed/XqfNo-MAsH4',
    technicalPoints: [
      'Propnuté lokty (locked elbows).',
      'Protrakce a deprese lopatek.',
      'Maximální lean (náklon) vpřed.',
      'Napnuté nohy a špičky.'
    ],
    commonVariations: ['L-Sit', 'Tuck', 'Adv Tuck', 'Straddle', 'Full']
  },
  {
    id: 'frontlever',
    name: 'Frontlever',
    category: 'Statics',
    description: 'Statický tahový prvek, kde tělo visí vodorovně pod hrazdou.',
    videoUrl: 'https://www.youtube.com/embed/m62pDIn-A4w',
    technicalPoints: [
      'Propnuté paže.',
      'Retrakce a deprese lopatek.',
      'Tělo v jedné přímce s podlahou.',
      'Silná aktivace zádových svalů a jádra.'
    ],
    commonVariations: ['Tuck', 'Adv Tuck', 'Straddle', 'Full']
  },
  {
    id: 'koreanpullups',
    name: 'Korean Shyby',
    category: 'Pull',
    description: 'Náročný variant shybů prováděný s hrazdou za zády, vyžadující vysokou mobilitu ramen a sílu zad.',
    videoUrl: 'https://www.youtube.com/embed/fD_fV8jS9Y8',
    technicalPoints: [
      'Úchop za zády v šíři ramen.',
      'Aktivní lopatková protiakce.',
      'Tah směřující k bedrům.',
      'Udržení vertikální polohy těla bez nadměrného prohnutí.'
    ],
    commonVariations: ['Standard', 'L-Sit', 'Weighted']
  }
];
