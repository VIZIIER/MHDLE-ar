import { expect, type Page } from '@playwright/test';

export async function start(page: Page, hash = '') {
  await page.goto(`./${hash}`);
  const dialog = page.locator('dialog[open]');
  if (await dialog.isVisible().catch(() => false)) {
    await dialog.locator('.btn-primary').click();
    await expect(dialog).toBeHidden();
  }
}

export async function setLanguage(page: Page, lang: 'en' | 'ar') {
  const current = await page.evaluate(() => document.documentElement.lang);
  if (current !== lang) await page.locator('.lang-btn').click();
  await expect(page.locator('html')).toHaveAttribute('lang', lang);
}

export async function guess(page: Page, id: string, query = id.replace(/-/g, ' ')) {
  const input = page.locator('.search-input');
  await input.fill(query);
  const option = page.locator(`[role="option"][data-id="${id}"]`);
  await expect(option).toBeVisible();
  await option.click();
  await page.waitForFunction(() => {
    const el = document.querySelector<HTMLInputElement>('.search-input');
    return !el || el.value === '';
  });
}

type Rounds = Record<string, { daily: { answerId: string; guesses: string[]; won: boolean } | null; infinite: { answerId: string } | null }>;
export async function rounds(page: Page): Promise<Rounds> {
  return JSON.parse((await page.evaluate(() => localStorage.getItem('mhdle:v1:rounds'))) ?? '{}');
}

export async function revealAnswer(page: Page, mode: string, probe = 'kirin'): Promise<string> {
  await guess(page, probe);
  const r = (await rounds(page))[mode];
  const round = r?.infinite ?? r?.daily;
  if (!round) throw new Error(`no saved round for ${mode}`);
  return round.answerId;
}

export const WRONG = ['zinogre', 'diablos', 'tigrex', 'nargacuga', 'rajang', 'lagiacrus', 'barroth', 'khezu', 'gypceros', 'basarios', 'monoblos', 'gravios', 'teostra'];
export const wrongFor = (answer: string, n: number) => WRONG.filter((w) => w !== answer).slice(0, n);
