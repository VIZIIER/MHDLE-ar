export type Lang = 'en' | 'ar';
export type Localized = { en: string; ar: string };

export type ModeId = 'classic' | 'compendium' | 'surveyor' | 'roar';

export interface Monster {
  id: string;
  name: Localized;
  titles: Localized[];
  description: Localized;
  classes: string[];
  elements: string[];
  ailments: string[];
  weaknesses: string[];
  size: { min: number | null; max: number | null };
  threat: { min: number; max: number } | null;
  firstGame: string;
  generation: number;
  games: string[];
  unknown?: string[];
}

export interface GameInfo extends Localized {
  id: string;
  year: number;
  gen: number;
  short: string;
}

export type MediaKind = 'images' | 'icons' | 'audio';

export interface Round {
  day: string;
  answerId: string;
  guesses: string[];
  won: boolean;
  revealed: number[];
  infinite: boolean;
}

export interface Settings {
  games: string[];
  configured: boolean;
}
