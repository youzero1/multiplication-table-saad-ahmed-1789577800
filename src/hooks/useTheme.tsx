import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  applyThemePreference,
  readThemePreference,
  writeThemePreference,
} from '@/lib/theme';
import type { ThemeColor, ThemeContextValue, ThemeMode, ThemePreference } from '@/types/theme';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(() => readThemePreference());

  useEffect(() => {
    applyThemePreference(document.documentElement, preference);
    writeThemePreference(preference);
  }, [preference]);

  const setColorTheme = useCallback((colorTheme: ThemeColor) => {
    setPreference((prev) => ({ ...prev, colorTheme }));
  }, []);

  const setMode = useCallback((mode: ThemeMode) => {
    setPreference((prev) => ({ ...prev, mode }));
  }, []);

  const toggleMode = useCallback(() => {
    setPreference((prev) => ({ ...prev, mode: prev.mode === 'dark' ? 'light' : 'dark' }));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colorTheme: preference.colorTheme,
      mode: preference.mode,
      setColorTheme,
      setMode,
      toggleMode,
    }),
    [preference, setColorTheme, setMode, toggleMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
