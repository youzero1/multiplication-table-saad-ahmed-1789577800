import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center py-10 text-center sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-text sm:text-5xl">
        Learn your times tables
      </h1>
      <p className="mt-4 max-w-lg text-base text-muted">
        A clean, easy-to-read multiplication table. Start with the 2 times table — every line from
        2 × 1 all the way up to 2 × 10.
      </p>
      <Link
        to="/times-table"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent-shadow transition hover:bg-accent-hover"
      >
        View the 2 times table
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
