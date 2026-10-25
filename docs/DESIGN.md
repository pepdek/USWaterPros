# Design system: "Old Glory, Clear Water"

America's Water Professionals. Americana craft with a premium finish: navy ink on warm paper, flag red for the one thing to click, water-light behind it, frosted glass on top.
Tokens live in `app/globals.css` (`:root`) and `tailwind.config.js`. Change them there and the whole site follows.

## Type (three voices, loaded in `app/layout.tsx`)
| Voice | Font | Where |
|---|---|---|
| Display | Fraunces (soft, slightly wonky serif; italic for emphasis) | `h1`, `h2`, card titles. Tailwind `font-serif` |
| Text | Libre Franklin (the classic American gothic) | body, UI, `h3`. Tailwind `font-sans` |
| Sign | Barlow Condensed (highway-sign caps) | wordmark, eyebrows, prices, big numbers, footer headings. Tailwind `font-mono` (so every old `font-mono` label became sign type) |

## Color
| Token | Value | Use |
|---|---|---|
| `--ink` | #101c2e | text |
| `--gray` | #5b6472 | secondary text |
| `--navy` | #0b2545 | dark sections, badges |
| `--blue` | #1b4f8f | links, eyebrows |
| `--cta` | #b3202a flag red | primary button, stars, the italic "Done in a day." |
| `--paper` / `--ice` | #fbf8f1 / #f4efe4 | page and section tint |
| water | #00a0bf | focus rings and glow only |

## Motifs
- ★ stars: before eyebrows, in the wordmark, as list bullets, a faint star field on dark sections (`.bg-surge`).
- Stripe band `.stripes` (red, white, navy): footer top and the trust banner.
- `components/Seal.tsx`: round "licensed local plumbers, Tacoma, Washington" seal on the home hero.
- Tagline "America's Water Professionals": header (desktop), footer, hero eyebrow.

## Surfaces and buttons
`.glass` (frosted, warm), `.card`, `.btn` pills (`.btn-cta` red, `.btn-secondary` frosted with a navy edge, `.btn-blue`), `.eyebrow`, `.orbs` (sky blue + blush behind the hero), `.bg-surge` (navy + star field).

## Header
Floating frosted bar. The first block inside `<main>` slides up under it (`--hdr`), and on pages whose first block is `.bg-surge` the bar turns dark glass automatically (`:has`).

## Email
`lib/emails/orderConfirmed.ts` follows the same look with email-safe stand-in fonts (serif date, condensed caps where installed).

## Icons (`components/Icon.tsx`, `TierIcon.tsx`)
Our own set, drawn like a screen print: a 2px navy line drawing plus a flat color "spot" printed a hair off-register behind it. The spot is sky blue on light surfaces and flag red on dark ones (`.ico` in `globals.css`; put `ico-dark` on a dark wrapper). 32 x 32 grid. To add an icon, add a `[line, spot]` path pair to `ICONS`. No stock icon libraries.

## Motion (all off under `prefers-reduced-motion`)
- Hero: copy, buttons, stats and the price tag rise in on load (`.rise`, staggered by `--d`); the seal lands like a rubber stamp (`.stamp`). The H1 is not animated, to keep it the first thing painted.
- Cards and steps marked `data-rv` rise as they scroll into view (`ScrollFx`). Nothing is hidden until JavaScript adds `html.rv-on`, so no-JS and reduced-motion users see everything.
- The red-white-navy stripe band drifts slowly. The red button catches the light on hover. FAQ answers ease open. Service-card photos zoom a touch on hover. The benefits ribbon fades at its edges.
- Page texture: a faint paper grain on the cream background.
- Favicon: `app/icon.svg` (navy disc, red star).

## One interaction language
Everything you can press shares the same motion: `.btn` (all variants), `.tile` (quiz and wizard choices), `.chip` (link pills) and `.tap`. Hover = 1px lift and 1.5% scale; press = a small squash; 0.35s on the same spring curve. Filled and glass buttons also catch the light on hover. Arrow links (`.arrow-link`) nudge their arrow. One focus ring everywhere (3px blue, white on dark surfaces). All of it is off for `prefers-reduced-motion`. Use these classes for anything new rather than writing hover styles by hand.

## Share image
`app/opengraph-image.png` and `app/twitter-image.png` (1200 x 630, with alt text files). The source is `scripts/og/og.html`; re-render with `node scripts/og/render.mjs`, then copy `scripts/og/og.png` over both. Dollar amounts are left off on purpose so it never goes stale.
