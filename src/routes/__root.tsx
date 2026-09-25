import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from '@/hooks/useTheme';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

const navLink =
  'rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-hover hover:text-text';
const navLinkActive = 'bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover hover:text-accent-foreground';

function RootLayout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-text">
        <header className="border-b border-border bg-background/80 backdrop-blur">
          <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Link to="/" className="text-base font-semibold tracking-tight text-accent">
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
        <ThemeSwitcher />
      </div>
    </ThemeProvider>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <p className="text-lg">This page does not exist.</p>
      <Link to="/" className="text-sm text-accent underline underline-offset-4 hover:text-accent-hover">
        Go to the home page
      </Link>
    </div>
  );
}
