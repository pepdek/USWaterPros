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
