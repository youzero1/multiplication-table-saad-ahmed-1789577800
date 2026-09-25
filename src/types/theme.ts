export type ThemeColor = 'yellow' | 'green' | 'pink';
export type ThemeMode = 'light' | 'dark';

export type ThemePreference = {
  colorTheme: ThemeColor;
  mode: ThemeMode;
};

export type ThemeContextValue = {
  colorTheme: ThemeColor;
  mode: ThemeMode;
  setColorTheme: (color: ThemeColor) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

export type ThemeColorOption = {
  value: ThemeColor;
  label: string;
  /** Static swatch color shown in the switcher, independent of the active theme. */
  swatchClassName: string;
};

export const THEME_COLORS: readonly ThemeColorOption[] = [
  { value: 'yellow', label: 'Yellow', swatchClassName: 'bg-yellow-400' },
  { value: 'green', label: 'Green', swatchClassName: 'bg-emerald-400' },
  { value: 'pink', label: 'Pink', swatchClassName: 'bg-pink-400' },
] as const;
