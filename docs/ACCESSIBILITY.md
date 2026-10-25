# Accessibility

Target: WCAG 2.2 level AA on desktop and mobile. Checked with axe-core in real Chrome plus the manual checks below.

## Run the audit
```
npm run build && npx next start -p 3500      # in one terminal
npm run a11y:flat                            # in another (or `npm run a11y` for the real-rendering pass)
```
It scans 12 page types and 7 interactive states (checkout wizard, header dropdown, mobile menu, quiz step, tool result, FAQ open) at 1440 and 390 wide.
`--flat` swaps gradients, the paper grain and translucency for their worst-case flat colors, so axe can compute contrast it would otherwise report as "incomplete". Run with and without `--flat`.
It also reports pages with more or fewer than one `h1` and any horizontal overflow. Results are written to `/tmp/a11y.json`.

## What the site does
- **Skip link** to `#main` on every page; every page has one `<main id="main">`, one `h1`, and headings that step down one level at a time.
- **Focus** is always visible: one 3px ring (`:focus-visible` in `globals.css`), blue on light surfaces and white on dark ones. Tab order follows reading order. The checkout wizard and the mobile menu move focus in, trap Tab, close on Escape and return focus.
- **Contrast**: body and small text 4.5:1 or better, large text and UI 3:1 or better. Small grey text uses `#5b6472` (5:1 on the paper tints). The footer's old `#86868b` (3.0:1) is gone.
- **Touch targets**: buttons 50px, small buttons 44px, chips and nav 44px, quiz tiles 64px.
- **Motion**: everything animated is off under `prefers-reduced-motion`. Nothing decorative keeps moving past 5 seconds (the stripe band moves once on load). The benefits ribbon scrolls on its own, so it has a **Pause** button and also stops on hover or focus (WCAG 2.2.2).
- **Forms**: every field has a visible label (or an `aria-label` on the compact ZIP/email fields), error messages use `role="alert"`, and `autocomplete` is set on name, email, phone, ZIP and address fields.
- **Links and buttons** that repeat on a page carry their context for screen readers ("Explore service: Reverse Osmosis", "Get Instant Price for Complete").
- **Scrolling tables** are keyboard-reachable (`tabindex="0"`, labelled region).
- **Reflow**: no horizontal scroll at 320px wide; content reflows at 200% and 400% browser zoom (a 320px-wide viewport).
- **Forced-colors / high-contrast mode**: buttons, chips, tiles and cards get real borders.
- **Not color alone**: selected quiz and wizard choices also change border weight and show a star mark.

## When you add something
1. Use the shared classes (`.btn`, `.tile`, `.chip`, `.eyebrow`): they already carry focus, press and reduced-motion behavior.
2. Text on a gradient or image: keep a solid or 90%+ opaque panel behind it (the hero price tag does).
3. Do not use `#86868b`-style light greys for text; use `#5b6472` or darker.
4. Anything that moves by itself for more than 5 seconds needs a pause control.
5. Re-run the audit.

## Known limits
- Automated tools find roughly a third of accessibility problems. A manual pass with VoiceOver (macOS and iOS) and TalkBack before a big launch is still worth doing.
- Copy on `/tools` ("Own Your Health", "what you're exposing your family to") is fear/health wording that conflicts with the content rules in `docs/POSITIONING.md`. It is an editorial issue, not a code one.
