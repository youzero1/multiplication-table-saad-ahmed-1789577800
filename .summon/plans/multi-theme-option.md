---
status: implemented
title: Multi-theme option (Yellow / Green / Pink + light & dark mode)
---

Context: the app currently hardcodes `yellow-*` and `neutral-950` Tailwind utilities in
`src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/times-table.tsx` and
`src/components/TimesTable.tsx`. The goal is three selectable color themes (Yellow = default,
Green, Pink), an independent light/dark mode switch, a floating corner theme switcher, and
persistence with no flash of the wrong theme.

Note: `src/routes/__root.tsx` and `src/styles/global.css` could not be read during planning
(not found by the reader). Step 1 covers confirming their current contents before editing.

1. Read `src/routes/__root.tsx`, `src/styles/global.css`, `src/main.tsx`, `index.html` and
   `vite.config.ts` to confirm the shell markup, the existing nav classes, that
   `src/styles/global.css` begins with the Tailwind import and is imported once in
   `src/main.tsx`, and that the `@/` alias resolves to `src/`.
   Expected outcome: a confirmed list of every hardcoded `yellow-*` / `neutral-*` utility that
   must be replaced, plus the exact `<html>` tag location in `index.html`.

2. Define the shared theme types in `src/types/theme.ts`: a union type for the color theme
   (`yellow` | `green` | `pink`), a union type for the mode (`light` | `dark`), a combined
   theme-preference object type, and the shape of the theme context value (current color theme,
   current mode, a setter for the color theme, a toggle/setter for the mode). Also export a
   readonly ordered list of the three color themes with a human label for each, used by the
   switcher UI.
   Expected outcome: a single source of truth for theme naming that both the provider and the
   switcher import; no string literals duplicated elsewhere.

3. Add theme constants and storage helpers in `src/lib/theme.ts`:
   - the localStorage key (e.g. a single key storing a JSON object with `colorTheme` and `mode`),
   - the default preference (yellow + dark, matching today's look),
   - a validating read helper that returns the default when storage is empty, unparsable, or
     holds an unknown value,
   - a write helper that swallows storage errors (private-browsing safety),
   - a helper that applies a preference to a given `HTMLElement` by setting `data-theme` to the
     color theme and `data-mode` to the mode,
   - a helper that resolves the initial mode from `prefers-color-scheme` when nothing is stored.
   Expected outcome: all localStorage and DOM-attribute logic lives in one testable module with
   no React imports.

4. Rework `src/styles/global.css` to be token-driven. Keep `@import "tailwindcss";` as the very
   first line. Below it:
   - Use a Tailwind v4 `@theme` block to register semantic color tokens that map to CSS custom
     properties: background, surface, surface-hover, border, border-strong, text, text-muted,
     accent, accent-hover, accent-foreground, and a ring/shadow accent. Registering them in
     `@theme` is what makes `bg-background`, `text-muted`, `border-border`, `bg-accent`,
     `text-accent-foreground` etc. available as utilities.
   - Declare the default custom-property values on `:root` (yellow + dark, visually identical to
     the current design).
   - Add attribute-selector blocks on the `html` element that override those custom properties
     for each combination: `[data-theme="yellow"][data-mode="dark"]`,
     `[data-theme="yellow"][data-mode="light"]`, and the same pairs for `green` and `pink` —
     six blocks total. Each block only redefines the custom properties; no utility classes
     change.
   - Set `color-scheme: dark` / `color-scheme: light` per mode block so native form controls and
     scrollbars match.
   - Apply `background-color` and `color` from the tokens on `body`, plus a short
     `transition` on background/color so switching themes is not jarring.
   Expected outcome: changing `data-theme` or `data-mode` on `<html>` restyles the whole app
   with no component re-render required.

5. Choose and document the concrete color values used in step 4 (inline as CSS comments is not
   required, but the palette must be deliberate):
   - Dark variants: near-black backgrounds with a faint hue tint, light tinted text, and a
     bright 300/400-level accent with a very dark accent-foreground.
   - Light variants: near-white tinted backgrounds, dark tinted text, and a deeper 500/600-level
     accent with a white or near-white accent-foreground — pink and yellow especially need a
     darkened accent in light mode to keep button text readable.
   Expected outcome: body text meets at least 4.5:1 contrast against its background, and text on
   accent fills meets 4.5:1, in all six combinations.

6. Create the theme provider and hook. Put the context, provider component and `useTheme` hook in
   `src/hooks/useTheme.tsx` (or `src/components/ThemeProvider.tsx` plus `src/hooks/useTheme.ts`
   if the builder prefers separation — pick one and be consistent). The provider must:
   - initialise state lazily from the step-3 read helper so the first render already matches
     what the inline script applied,
   - apply the preference to `document.documentElement` and persist it whenever it changes,
   - expose `colorTheme`, `mode`, `setColorTheme`, `setMode` and `toggleMode`,
   - throw a clear error if `useTheme` is used outside the provider.
   Expected outcome: any component can read and change the theme; the DOM attributes and
   localStorage stay in sync.

7. Prevent the flash of wrong theme: add a small blocking inline script in the `<head>` of
   `index.html`, before the module script, that reads the same localStorage key, falls back to
   `prefers-color-scheme` for mode and yellow for color, and sets `data-theme` / `data-mode` on
   `document.documentElement` immediately. Also set the default attributes statically on the
   `<html>` tag as a no-JS fallback.
   Expected outcome: on hard reload with a non-default theme stored, the first painted frame
   already uses the correct colors — no yellow/dark flash.

8. Build the floating switcher in `src/components/ThemeSwitcher.tsx`:
   - A fixed-position trigger button in the bottom-right corner (`fixed bottom-4 right-4 z-50`,
     rounded-full, accent-tinted, with a visible focus ring), labelled via `aria-label`
     ("Change theme") and carrying `aria-expanded` and `aria-haspopup="dialog"`.
   - A popover panel anchored above the button, rendered only when open, using the semantic
     surface/border tokens. It contains: a "Color" group of three swatch buttons (yellow, green,
     pink) rendered from the list exported in step 2, each showing its color and marked with
     `aria-pressed` for the active one; and a "Mode" row with a light/dark toggle (two labelled
     buttons or a single toggle button reflecting current state).
   - Interaction: close on Escape, close on click/pointerdown outside the panel, return focus to
     the trigger on close, and move focus into the panel when it opens. Use a ref to the wrapper
     for outside-click detection and clean up all listeners on unmount.
   - Respect `motion-reduce` for any open/close transition.
   Expected outcome: a keyboard- and screen-reader-usable switcher that is visible on every page
   and never overlaps critical content on small screens.

9. Wire it up in `src/routes/__root.tsx`: wrap the shell (nav + `<Outlet />`) in the theme
   provider from step 6 and render `<ThemeSwitcher />` once inside it, after the main content so
   it is last in tab order. Replace the root's hardcoded utilities — page background
   `bg-neutral-950` → `bg-background`, header border → `border-border`, brand text →
   `text-accent`, nav link colors → `text-muted` with `hover:bg-surface-hover`, active pill →
   `bg-accent text-accent-foreground`, NotFound link → `text-accent`.
   Expected outcome: the switcher appears on both routes and the shell follows the active theme.

10. Replace hardcoded colors in `src/routes/index.tsx`: h1 → `text-text` (or the token name
    chosen in step 4), subtitle → `text-muted`, CTA → `bg-accent text-accent-foreground` with
    `hover:bg-accent-hover` and an accent-tinted shadow token. Keep all layout, spacing and copy
    exactly as they are.
    Expected outcome: home page is visually identical in yellow+dark, and fully recolors in the
    other five combinations.

11. Replace hardcoded colors in `src/routes/times-table.tsx`: h1 → primary text token, subtitle →
    muted text token. No other changes.
    Expected outcome: page heading follows the theme.

12. Replace hardcoded colors in `src/components/TimesTable.tsx`: heading → primary text token,
    card `border-yellow-400/15 bg-yellow-400/5` → `border-border bg-surface`, hover state →
    `hover:border-border-strong hover:bg-surface-hover` plus the accent shadow token, operands →
    muted/primary text token, operators → a faint muted token, product → `text-accent`. Keep the
    grid, spacing, transition and `tabular-nums` untouched.
    Expected outcome: the ten cards recolor per theme while keeping the current dark-yellow look
    as the default.

13. Grep the whole of `src/` for any remaining `yellow-`, `neutral-`, `slate-` or other literal
    Tailwind color utilities and convert or justify each one (deliberate swatch colors inside
    `ThemeSwitcher.tsx` are the expected exception, since the swatches must always show their own
    color).
    Expected outcome: zero unintended hardcoded colors outside the switcher swatches.

14. Verify: run `npm run typecheck` and the production build, then check `checkRuntimeErrors`.
    Manually exercise all six combinations (yellow/green/pink × light/dark) on both `/` and
    `/times-table`, confirm the selection survives a hard reload with no flash, confirm Escape
    and outside-click close the popover, confirm the switcher is reachable and operable by
    keyboard alone, and confirm nothing writes to `src/routeTree.gen.ts`.
    Expected outcome: typecheck and build exit 0, no runtime errors, all six combinations legible
    and persistent.

15. Update this plan's frontmatter `status` to `implemented` and save.
    Expected outcome: plan file reflects completion.
