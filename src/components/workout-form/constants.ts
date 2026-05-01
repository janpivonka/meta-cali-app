import { 
  GripType, 
  GripWidth, 
  ThumbPosition, 
  EquipmentType, 
  ExecutionStyle, 
  ExecutionMethod, 
  BodyPosition, 
  LegProgression, 
  BandPlacement, 
  BandLoopType, 
  SingleLegPosition, 
  OneArmHandPosition 
} from "../../types";

export const GRIPS: GripType[] = [
  "pronated",
  "supinated",
  "neutral",
  "mixed",
  "alternating",
];

export const GRIP_WIDTHS: GripWidth[] = [
  "narrow",
  "shoulder-width",
  "wide",
  "alternating",
];

export const THUMBS: { val: ThumbPosition; label: string }[] = [
  { val: "under", label: "Under" },
  { val: "over", label: "Over" },
  { val: "alternating", label: "Alternating" },
];

export const EQUIPMENTS: EquipmentType[] = [
  "pull-up bar",
  "low bar",
  "dip bars",
  "rings",
  "floor",
  "parallelettes",
  "stall bars",
];

export const EXECUTION_STYLES: ExecutionStyle[] = [
  "basic",
  "one arm",
  "archer",
  "typewriter",
  "commando",
  "high",
  "korean",
  "korean archer",
  "korean typewriter",
];

export const EXECUTION_METHODS: ExecutionMethod[] = [
  "standard",
  "explosive",
  "partial",
  "negative",
  "scapula",
  "controlled",
];

export const POSITIONS: BodyPosition[] = [
  "neutral",
  "hollow body",
  "arch back",
  "L-sit",
];

export const LEG_PROGRESSIONS: LegProgression[] = [
  "tuck",
  "adv tuck",
  "straddle",
  "one leg",
  "halflay",
  "full",
  "australian (bent legs)",
  "australian (straight legs)",
];

export const BAND_PLACEMENTS: BandPlacement[] = [
  "both feet",
  "one foot",
  "knees",
  "buttocks",
  "waist",
  "chest",
];

export const LOOP_TYPES: { val: BandLoopType; label: string }[] = [
  { val: "single", label: "Single" },
  { val: "double", label: "Double (wrapped)" },
  { val: "half", label: "1/2" },
];

export const SINGLE_LEG_POSITIONS: SingleLegPosition[] = [
  "tuck",
  "adv tuck",
  "halflay",
  "full",
];

export const ONE_ARM_POSITIONS: { val: OneArmHandPosition; label: string }[] = [
  { val: "wrist", label: "Wrist" },
  { val: "forearm", label: "Forearm" },
  { val: "elbow", label: "Elbow" },
  { val: "biceps", label: "Biceps/Triceps" },
  { val: "shoulder", label: "Shoulder" },
  { val: "horizontal", label: "Horizontal/Chest" },
  { val: "free", label: "Free along body" },
];
