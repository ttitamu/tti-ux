# ADR 0013 — an operational status ramp, separate from the semantic palette

- **Date**: 2026-09-08
- **Status**: Accepted

## Context

`color.semantic` is a five-slot **sentiment** palette — `success`, `warning`,
`danger`, `error`, `info` — tuned for editorial and BI surfaces. It maps cleanly
onto Power BI's `good` / `neutral` / `bad`, and onto the "this form field is
wrong" class of UI. It has served every consumer so far.

Building the Nagios Core overlay (`nagios-stack`) showed it cannot serve a
**monitoring** surface, for two reasons that are properties of the palette
rather than of that consumer:

1. **`semantic.success` is `#3D5328`**, a deep low-chroma olive chosen to clear
   AAA as *text on white*. Used as a cell tint it loses its hue almost
   entirely and reads grey-green. On a status table it stops saying "healthy".
2. **There is no orange.** A monitoring surface needs UNKNOWN — the check
   produced no verdict — to be distinct from both WARNING and CRITICAL. With no
   orange available, that consumer reached for `chart.5` `#8C5A3C`, a clay
   brown, which reads as a weak red and collides with CRITICAL. PENDING's
   neutral grey then sat too close to that near-grey brown, so PENDING read as
   UNKNOWN.

Both failures survived review because the code looked entirely reasonable: it
referenced canonical tokens throughout and passed every contrast check. What it
failed was legibility *as a ramp*, which nothing in the system was measuring.

The gap is not Nagios-specific. Any operational surface — Atlas control state,
Landscape host inventory, a Fabric operations report — needs the same five
states, and today each would invent its own colours.

## Decision

**Add `themes.<theme>.status`, a five-state operational ramp, as a first-class
token family alongside `semantic`.** It is not a rename of the semantic palette
and does not replace it: sentiment answers "is this good or bad", status answers
"what state is this system in".

### The five states, and where the hues come from

Hues track the colours **Nagios Core itself ships** (`html/stylesheets/status.css`):

| State | Nagios | Meaning |
|---|---|---|
| `ok` | `#33FF00` green | healthy / up |
| `warning` | `#FFFF00` yellow | degraded, still serving |
| `unknown` | `#FF9900` orange | the check produced no verdict |
| `critical` | `#F83838` red | failed / down |
| `pending` | `#ACACAC` grey | not yet checked |

That ordering — green → yellow → orange → red — is decades of operator muscle
memory. Inventing a prettier ramp would be a legibility regression dressed as a
brand win, so the hues are inherited and only the *rendering* is TTI's.

### Three roles per state

| Role | Token | Where it goes |
|---|---|---|
| base | `--status-<s>` | text, edges, the identity colour |
| fill | `--status-<s>-fill` | a status chip |
| ink | `--status-<s>-ink` | the word inside that fill |

Three roles rather than one because on a light surface the two jobs pull apart:
a colour dark enough to be legible *as text on white* is necessarily dark, and
dark yellow is olive while dark orange is brown. Hue has to live in the fill,
which is exactly how Core itself works — `.statusOK` carries a
`background-color`, not a text colour.

`tti-hc` renders **outlined** chips: fill is the page surface and ink is the
base, so no state depends on a colour-on-colour pair, and every base clears AAA.

### The rules, and the guard

Values were derived in OKLCH — hue fixed per state, lightness solved for
contrast, chroma pushed as far as sRGB allows under a cap — and are now
authored in `tokens.json` like every other token. `scripts/audit-status-palette.mjs`
(`npm run audit:status`) re-derives the constraints from the authored values:

1. **Hue identity** within 14° of the Nagios hue. UNKNOWN carries a documented
   −12.6° offset: stock sits at 64.6°, brand gold at ~80°, and in dark mode a
   stock-hue UNKNOWN chip read as a cousin of the gold keyline.
2. **Separation** — any two chips ≥ 0.075 apart in OKLab. A flat chip lightness
   once left UNKNOWN and CRITICAL 0.043 apart: pale orange beside pale salmon.
3. **Severity order** — chip lightness descends across the **warm hues**,
   warning → unknown → critical, so severity reads as *weight* as well as hue.
   That second channel is what carries the ramp for a reader who cannot
   separate the hues at all.

   It deliberately stops short of `ok`. The rule was first written as
   ok → warning → unknown → critical, and that was wrong: sRGB gives each hue a
   very different lightness at full chroma (yellow ~0.97, green ~0.87, orange
   ~0.77, red ~0.64), so a monotonic ramp across all four forces yellow *below*
   green — where it stops being yellow and turns olive. Hue identity outranks
   weight ordering. The ordering exists to keep adjacent warm hues apart, which
   is where the collision actually was; green is far enough away in hue that
   its weight does not matter.
4. **Brand distance** — no status colour within 0.10 OKLab of brand maroon. An
   unconstrained solve put CRITICAL at `#77020b`, 0.076 from maroon: it painted
   "down" the colour of the chrome. Gold proximity is advisory only — WARNING is
   yellow and TTI's yellow is gold, which is a coincidence of hue, not of
   meaning.
5. **WCAG 2.2** — AA (4.5:1) is the floor for ink-on-fill and base-on-page;
   `tti-hc` is held to AAA (7:1). AAA elsewhere is reported, not enforced: the
   heaviest chips cannot reach 7:1 without lightening enough to break rule 3.
   That trade is deliberate and visible in the audit output rather than silent.

`1.4.11` (non-text contrast) is why consumers pair every chip with an edge in
its base colour: the chip is a graphical object carrying meaning, so it must
work as a shape. `1.4.1` (use of colour) is satisfied by consumers always
rendering the state's word alongside — which is what makes it safe to lean on
hue this hard.

## Consequences

### Positive

- Operational surfaces stop inventing colours. `nagios-stack` was about to ship
  a locally-minted palette; it now consumes `--status-*` like anything else.
- The ramp is measured, not asserted. `audit:status` runs without a browser or
  a Nuxt build, so it can gate every commit — unlike `audit:contrast`, which
  needs both and only sees pairs the audit page happens to render.
- The failure modes are written down where the next person will hit them.

### Negative

- **Five more slots per theme × three themes = 45 new tokens.** Real growth in
  `tokens.json`. Justified because the alternative is each consumer minting
  five colours privately, which is the drift class the kit exists to end.
- **Two families that look similar from a distance.** `semantic.error` and
  `status.critical` are the same value in `tti` and deliberately diverge in
  `tti-dark`. Consumers must pick by *role*, not by which hex looks right. The
  `$description` on `status.critical` says so explicitly.

### Deliberately not done

**Power BI's `good` / `neutral` / `bad` still resolve to the semantic palette,
not to status.** Re-pointing them would change the appearance of every report
already built on `tti-theme.json`, and sentiment is arguably the right frame for
a KPI card anyway. If an operations-focused Fabric report needs the status ramp,
the better move is a `tti-theme-ops.json` lane rather than redefining `good` for
everyone. Left as an open decision, not an oversight.

## Related

- [ADR 0005](0005-three-theme-palette.md) — the three-theme system this extends
- [ADR 0009](0009-bi-design-system-source-of-truth.md) — tti-ux as the single
  source of truth for TTI's visual identity, including the BI surface; this ADR
  is that principle applied to a consumer that would otherwise have forked
- [`design/palette.md`](../../design/palette.md) — palette doctrine
- `nagios-stack` — the first consumer; its `docs/CONTRACT.md` records how the
  ramp is applied to stock Nagios Core CGI
