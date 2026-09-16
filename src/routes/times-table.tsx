import { createFileRoute } from '@tanstack/react-router';
import { TimesTable } from '@/components/TimesTable';

export const Route = createFileRoute('/times-table')({
  component: TimesTablePage,
});

const MULTIPLIER = 2;

function TimesTablePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center">
      <h1 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Multiplication Table of {MULTIPLIER}
      </h1>
      <p className="mt-3 mb-10 max-w-md text-center text-sm text-slate-400 sm:text-base">
        The {MULTIPLIER} times table from {MULTIPLIER} × 1 through {MULTIPLIER} × 10.
      </p>
      <TimesTable multiplier={MULTIPLIER} title={`${MULTIPLIER} × 1 to ${MULTIPLIER} × 10`} />
    </div>
  );
}
