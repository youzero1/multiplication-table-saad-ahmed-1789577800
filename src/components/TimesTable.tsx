import { buildMultiplicationTable } from '@/lib/multiplication';

type TimesTableProps = {
  multiplier: number;
  upTo?: number;
  title?: string;
};

export function TimesTable({ multiplier, upTo = 10, title }: TimesTableProps) {
  const rows = buildMultiplicationTable(multiplier, upTo);
  const heading = title ?? `Multiplication Table of ${multiplier}`;

  return (
    <section className="w-full">
      <h2 className="mb-6 text-center text-xl font-semibold tracking-tight text-yellow-50 sm:text-2xl">
        {heading}
      </h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <li
            key={row.multiplier}
            className="flex items-center justify-center gap-2 rounded-2xl border border-yellow-400/15 bg-yellow-400/5 px-5 py-4 text-lg shadow-sm transition hover:-translate-y-0.5 hover:border-yellow-400/60 hover:bg-yellow-400/10 hover:shadow-lg hover:shadow-yellow-500/10"
          >
            <span className="tabular-nums text-yellow-100/80">{row.multiplicand}</span>
            <span className="text-yellow-200/40">×</span>
            <span className="tabular-nums text-yellow-100/80">{row.multiplier}</span>
            <span className="text-yellow-200/40">=</span>
            <span className="text-xl font-bold tabular-nums text-yellow-300">{row.product}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
