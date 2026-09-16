import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

const navLink =
  'rounded-full px-4 py-2 text-sm font-medium text-yellow-100/70 transition hover:bg-yellow-400/10 hover:text-yellow-100';
const navLinkActive = 'bg-yellow-400 text-yellow-950 shadow-sm hover:bg-yellow-300 hover:text-yellow-950';

function RootLayout() {
  return (
    <div className="min-h-screen bg-neutral-950 text-yellow-50">
      <header className="border-b border-yellow-400/15 bg-neutral-950/80 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="text-base font-semibold tracking-tight text-yellow-300">
            Times Tables
          </Link>
          <div className="flex items-center gap-1">
            <Link to="/" className={navLink} activeProps={{ className: `${navLink} ${navLinkActive}` }} activeOptions={{ exact: true }}>
              Home
            </Link>
            <Link to="/times-table" className={navLink} activeProps={{ className: `${navLink} ${navLinkActive}` }}>
              Times Table
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <Outlet />
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <p className="text-lg">This page does not exist.</p>
      <Link to="/" className="text-sm text-yellow-300 underline underline-offset-4 hover:text-yellow-200">
        Go to the home page
      </Link>
    </div>
  );
}
