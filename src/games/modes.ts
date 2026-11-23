import { MONSTERS, hasMedia, type Monster } from '../data';

import type { ModeId } from '../types';
export type { ModeId };
export const MODE_IDS: ModeId[] = ['classic', 'compendium', 'surveyor', 'roar'];

export interface ModeDef {
  id: ModeId;
  salt: string;
  emoji: string;
  eligible: (m: Monster) => boolean;
  hintThresholds: number[];
}

export const MODES: Record<ModeId, ModeDef> = {
  classic: { id: 'classic', salt: 'classic', emoji: '🗡️', eligible: () => true, hintThresholds: [] },
  compendium: { id: 'compendium', salt: 'compendium', emoji: '📜', eligible: () => true, hintThresholds: [5, 10] },
  surveyor: { id: 'surveyor', salt: 'surveyor', emoji: '📷', eligible: (m) => hasMedia('images', m.id), hintThresholds: [] },
  roar: { id: 'roar', salt: 'roar', emoji: '🔊', eligible: (m) => hasMedia('audio', m.id), hintThresholds: [5, 10] },
};

export function poolFor(mode: ModeId, selectedGames: readonly string[]): Monster[] {
  const sel = new Set(selectedGames);
  return MONSTERS.filter((m) => m.games.some((g) => sel.has(g)) && MODES[mode].eligible(m));
}

export function searchPoolFor(selectedGames: readonly string[]): Monster[] {
  const sel = new Set(selectedGames);
  return MONSTERS.filter((m) => m.games.some((g) => sel.has(g)));
}

export function modeInstalled(mode: ModeId): boolean {
  return MONSTERS.some(MODES[mode].eligible);
}
export const installedModes = (): ModeId[] => MODE_IDS.filter(modeInstalled);
