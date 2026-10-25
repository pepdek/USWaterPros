# Design system: "Clear Glass"

Quiet neutrals, one deep-lagoon accent, frosted surfaces, big tight type. Apple devices get real SF; everything else gets Inter (one family, no serif, no mono).
All tokens live in `app/globals.css` (`:root`) and `tailwind.config.js`. Change them there and the whole site follows.

## Color
| Token | Value | Use |
|---|---|---|
| `--ink` | #1d1d1f | text, primary button |
| `--gray` | #6e6e73 | secondary text (5.0:1 on white) |
| `--blue` (lagoon) | #00758a | links, `.eyebrow` (5.4:1 white, 4.9:1 on the grey tint) |
| `--navy` | #0e212b | dark surfaces (`.bg-surge`, `.bg-navy`) |
| `--ice` | #f5f7f8 | section tint (`.bg-ice`) |
| `--cta` | #ff6b35 | one warm spark: the dot after the wordmark and in `.eyebrow`. Never a button fill. |

## Type
SF/Inter, bold, tight tracking. `h1`/`h2` use `--fs-h1`/`--fs-h2`. The home hero sets its own larger size. Tailwind sizes: `text-xs/sm` = label, `base` = body, then `lg`..`3xl` step up, `4xl` = H2, `5xl` = H1. `font-serif` and `font-mono` map to the sans stack (mono keeps tabular numerals).

## Surfaces and buttons
- `.glass`: frosted white (blur 24, saturate 1.8), hairline white border, soft deep shadow, 28px radius. Header, hero price tag, dropdowns.
- `.card`: lighter frosted card with a soft shadow. On a dark hero (`.bg-surge`) it flips to dark glass automatically.
- `.btn` is a pill. `.btn-cta` = ink gradient (white on dark surfaces). `.btn-secondary` = frosted glass. `.btn-blue` = lagoon. `.btn-sm` for tight spots.
- `.orbs` = aqua + peach light behind the home hero. `.bg-surge` = deep-water mesh for dark heroes. `.eyebrow` = small lagoon lead-in label.

## Header
Floating frosted bar. The first block inside `<main>` slides up underneath it (`main > :first-child`, see `--hdr` in the CSS), so the glass sits over that section's background. On pages whose first block is `.bg-surge` the bar turns dark glass automatically (`:has`). Do not give a page a first block with its own top margin.

## Motion
Springy ease (`--ease`), small lifts, everything off under `prefers-reduced-motion`.

## Email
Email 1 (`lib/emails/orderConfirmed.ts`) follows the same language: big date, frosted card, ink pill, dark mode.
