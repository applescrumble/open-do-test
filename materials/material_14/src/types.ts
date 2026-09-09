export type Phase = 'A' | 'B' | 'C' | 'D'; // A: 商, B: かけ算, C: ひき算, D: おろす

export type GameModeId = '2_div_1' | '3_div_1' | '2_div_2' | '3_div_2' | '4_div_2';

export interface GameModeConfig {
  id: GameModeId;
  name: string;
  sub: string;
  badge: string;
  color: string;
  dividendDigits: number;
  divisorDigits: number;
}

export interface HissanStep {
  quotientDigit: number;
  quotientCol: number; // 1-indexed column
  currentValue: number;
  product: number;
  productSpan: [number, number]; // [startCol, endCol] (1-indexed)
  value: number; // remainder after subtraction
  valueSpanAlone: [number, number];
  hasNext: boolean;
  bringDownDigit: string | null;
  combinedValue: number | null;
  combinedSpan: [number, number] | null;
  
  // Progress states
  qRevealed: boolean;
  productRevealed: boolean;
  valueRevealed: boolean;
  broughtDown: boolean;
  justBroughtDown?: boolean;
}

export interface Problem {
  dividend: number;
  divisor: number;
  dividendStr: string;
  dividendDigits: string[];
}

export interface SolvedHistoryItem {
  id: string;
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
  modeId: GameModeId;
  modeName: string;
  isPerfect: boolean;
  mistakes: number;
  solvedAt: number; // timestamp
}

export interface GameState {
  screen: 'menu' | 'game' | 'complete';
  modeId: GameModeId;
  problemCount: number;
  starCount: number;
  problem: Problem | null;
  steps: HissanStep[];
  stepIdx: number;
  phase: Phase;
  inputSlots: string[];
  activeSlotIdx: number;
  wrongCount: number;
  mistakesThisProblem: number;
  bubbleHint: string;
  flashState: 'none' | 'correct' | 'wrong';
}

