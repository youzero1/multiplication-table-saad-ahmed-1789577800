---
status: pending
title: Multiplication Table of 2 Page
---

Context: the project listing returned no files, so the standard scaffold (Vite + React + TypeScript + TanStack Router file-based routing + Tailwind v4) is assumed to exist or be created as part of step 1. Match whatever conventions are present once files are visible.

1. Verify/establish baseline scaffold: `index.html`, `src/main.tsx` (imports `@/styles/global.css` once, creates the router from `src/routeTree.gen.ts`), `vite.config.ts` (with `@tailwindcss/vite` and `@tanstack/router-plugin/vite`, `@/` alias to `src/`), and `src/styles/global.css` containing exactly `@import "tailwindcss";`. Outcome: app boots with routing and Tailwind working.

2. Ensure `src/routes/__root.tsx` exists as the app shell: page background, centered max-width container, and a simple nav with links to Home (`/`) and Times Table (`/times-table`), plus the router `Outlet`. Outcome: shared layout and navigation available to all routes.

3. Add `src/types/multiplication.ts` exporting a `MultiplicationRow` type describing one line (multiplicand, multiplier, product). Outcome: shared typing for the table data.

4. Add `src/lib/multiplication.ts` exporting a helper that takes a multiplier and an optional upper bound (default 10) and returns an array of `MultiplicationRow` built from `Array.from({ length })`. No hardcoded rows. Outcome: data-driven generation reusable for any multiplier.

5. Add `src/components/TimesTable.tsx`: a presentational component with props `{ multiplier: number; upTo?: number; }`. It calls the lib helper and maps the result to rows. Each row renders as a card/list item showing `2 × 3 = 6` with the operands and the product visually distinct (product emphasized, e.g. bolder/accent color). Use a responsive Tailwind grid (1 column on mobile, 2 on `sm`, 3+ on `lg`), rounded borders, subtle shadow, hover state, and consistent spacing. Include a heading prop-driven title such as "Multiplication Table of 2". Outcome: reusable, multiplier-agnostic table component.

6. Add `src/routes/times-table.tsx` exporting a TanStack Router file route for `/times-table`. It defines a single `const MULTIPLIER = 2` constant and renders `TimesTable` with that value inside a centered, padded container with a clear `h1` and short subtitle. Outcome: `/times-table` renders 2 × 1 through 2 × 10.

7. Update `src/routes/index.tsx` (home): add a short intro and a prominent link/button to `/times-table` using the router `Link`. If a nav already exists in `__root.tsx`, ensure the entry is added there too and styled as active when on the route. Outcome: the page is discoverable from home and nav.

8. Verify: `src/routeTree.gen.ts` regenerates automatically (never edit it manually), run the dev server, confirm ten rows render with correct products, layout centers and reflows at mobile/tablet/desktop widths, and there are no TypeScript errors.
