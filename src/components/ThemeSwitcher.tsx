import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { THEME_COLORS } from '@/types/theme';

export function ThemeSwitcher() {
  const { colorTheme, mode, setColorTheme, setMode } = useTheme();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    panelRef.current?.querySelector<HTMLButtonElement>('button')?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  const modeButton =
    'flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition motion-reduce:transition-none';

  return (
    <div ref={wrapperRef} className="fixed bottom-4 right-4 z-50">
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Theme settings"
          className="absolute bottom-16 right-0 w-56 rounded-2xl border border-border bg-background/95 p-4 shadow-xl shadow-accent-shadow backdrop-blur"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Color</p>
          <div className="mb-4 flex items-center gap-2">
            {THEME_COLORS.map((option) => {
              const active = option.value === colorTheme;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColorTheme(option.value)}
                  aria-pressed={active}
                  aria-label={`${option.label} theme`}
                  title={option.label}
                  className={`h-9 w-9 rounded-full border-2 transition motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${option.swatchClassName} ${
                    active ? 'border-accent scale-110' : 'border-transparent hover:scale-105'
                  }`}
                />
              );
            })}
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Mode</p>
          <div className="flex items-center gap-2 rounded-full border border-border p-1">
            <button
              type="button"
              onClick={() => setMode('light')}
              aria-pressed={mode === 'light'}
              className={`${modeButton} ${
                mode === 'light'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted hover:bg-surface-hover'
              }`}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => setMode('dark')}
              aria-pressed={mode === 'dark'}
              className={`${modeButton} ${
                mode === 'dark'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted hover:bg-surface-hover'
              }`}
            >
              Dark
            </button>
          </div>
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Change theme"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent-shadow transition hover:bg-accent-hover motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span aria-hidden="true" className="text-lg">
          🎨
        </span>
      </button>
    </div>
  );
}
