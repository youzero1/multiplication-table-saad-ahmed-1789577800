import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { TimesTable } from '@/components/TimesTable';

export const Route = createFileRoute('/times-table')({
  component: TimesTablePage,
});

const DEFAULT_MULTIPLIER = 2;
const MULTIPLIERS = Array.from({ length: 12 }, (_, i) => i + 1);

function TimesTablePage() {
  const [multiplier, setMultiplier] = useState<number>(DEFAULT_MULTIPLIER);

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center">
      <h1 className="text-center text-3xl font-bold tracking-tight text-text sm:text-4xl">
        The {multiplier} Times Table
      </h1>
      <p className="mt-3 mb-8 max-w-md text-center text-sm text-muted sm:text-base">
        Pick a number to see its times table from {multiplier} × 1 through {multiplier} × 10.
      </p>

      <div
        role="group"
        aria-label="Choose a times table"
        className="mb-10 grid w-full max-w-md grid-cols-6 gap-2 sm:max-w-lg sm:grid-cols-12"
      >
        {MULTIPLIERS.map((n) => {
          const isActive = n === multiplier;
          return (
            <button
              key={n}
              type="button"
              aria-pressed={isActive}
              onClick={() => setMultiplier(n)}
              className={
                isActive
                  ? 'flex h-10 items-center justify-center rounded-xl bg-accent text-base font-bold tabular-nums text-accent-foreground shadow-md shadow-accent-shadow transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                  : 'flex h-10 items-center justify-center rounded-xl border border-border bg-surface text-base font-medium tabular-nums text-muted transition hover:border-border-strong hover:bg-surface-hover hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background'
              }
            >
              {n}
            </button>
          );
        })}
      </div>

      <TimesTable multiplier={multiplier} title={`${multiplier} × 1 to ${multiplier} × 10`} />
    </div>
  );
}
