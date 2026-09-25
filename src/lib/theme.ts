import type { ThemeColor, ThemeMode, ThemePreference } from '@/types/theme';

export const THEME_STORAGE_KEY = 'app-theme-preference';

const COLORS: ThemeColor[] = ['yellow', 'green', 'pink'];
const MODES: ThemeMode[] = ['light', 'dark'];

export const DEFAULT_THEME: ThemePreference = { colorTheme: 'yellow', mode: 'dark' };

function isColor(value: unknown): value is ThemeColor {
  return typeof value === 'string' && COLORS.includes(value as ThemeColor);
}

function isMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && MODES.includes(value as ThemeMode);
}

/** Mode preferred by the OS, used when nothing has been stored yet. */
export function getPreferredMode(): ThemeMode {
  if (typeof window === 'undefined' || !window.matchMedia) return DEFAULT_THEME.mode;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function readThemePreference(): ThemePreference {
  const fallback: ThemePreference = { colorTheme: DEFAULT_THEME.colorTheme, mode: getPreferredMode() };
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return fallback;
    const candidate = parsed as Partial<ThemePreference>;
    return {
      colorTheme: isColor(candidate.colorTheme) ? candidate.colorTheme : fallback.colorTheme,
      mode: isMode(candidate.mode) ? candidate.mode : fallback.mode,
    };
  } catch {
    return fallback;
  }
}

export function writeThemePreference(preference: ThemePreference): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(preference));
  } catch {
    /* private browsing / storage disabled — ignore */
  }
}

export function applyThemePreference(element: HTMLElement, preference: ThemePreference): void {
  element.setAttribute('data-theme', preference.colorTheme);
  element.setAttribute('data-mode', preference.mode);
}
