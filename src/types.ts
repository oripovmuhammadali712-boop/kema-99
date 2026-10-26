export type FingerType =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface KeyDefinition {
  code: string;
  key: string;
  shiftKey?: string;
  label: string;
  shiftLabel?: string;
  width?: number; // relative width in units (1 = 1u, 1.5 = 1.5u, etc.)
  finger?: FingerType;
  isModifier?: boolean;
}

export type ThemeId =
  | 'serika-dark'
  | 'matrix'
  | 'carbon'
  | 'dracula'
  | 'nord'
  | 'cyberpunk'
  | 'chalk-light';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bg: string;
  cardBg: string;
  subBg: string;
  text: string;
  subText: string;
  accent: string;
  accentHover: string;
  accentText: string;
  error: string;
  keyBg: string;
  keyCap: string;
  keyActiveBg: string;
  keyActiveText: string;
  keyBorder: string;
  keyShadow: string;
}

export type SoundType = 'thock' | 'clicky' | 'soft' | 'off';

export type TypingMode = 'words' | 'custom' | 'free';

export type WordCountOption = 10 | 25 | 50 | 100;

export type TimeOption = 15 | 30 | 60 | 120 | 0; // 0 = unlimited / cheksiz

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  cpm: number;
  accuracy: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  errorKeystrokes: number;
  wordCount: number;
  charCount: number;
  elapsedSeconds: number;
  wpmHistory: { time: number; wpm: number; rawWpm: number }[];
}
