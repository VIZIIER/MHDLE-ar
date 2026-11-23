import type { Monster } from '../data';
import { dayNumber } from '../utils/day';
import { hashString, mulberry32, seededShuffle } from '../utils/random';

export function pickDaily(pool: readonly Monster[], day: string, salt: string): Monster | null {
  if (!pool.length) return null;
  const sorted = [...pool].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const n = dayNumber(day);
  const len = sorted.length;
  const cycle = Math.floor(n / len);
  const position = ((n % len) + len) % len;
  const order = seededShuffle(sorted, hashString(`${salt}|cycle|${cycle}|${len}`));
  return order[position];
}

export function pickInfinite(pool: readonly Monster[], avoid: readonly string[], seed = Math.random() * 2 ** 32): Monster | null {
  if (!pool.length) return null;
  const fresh = pool.filter((m) => !avoid.includes(m.id));
  const from = fresh.length ? fresh : pool;
  const rand = mulberry32(seed >>> 0);
  return from[Math.floor(rand() * from.length)];
}
