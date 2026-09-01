# The Power BI kit — how TUX reaches Fabric

> Shipped v2.1.0 (2026-09-01). The first framework target to grow past
> tokens into actual components. Companion to
> [kit-pipeline.md](./kit-pipeline.md), which sets the two-tier doctrine
> this obeys.

Power BI is where a lot of TTI's analytics output actually lands, and
until v2.1.0 the system reached it through a 901-byte file carrying ten
colours and four font names. Everything a report looked like beyond that
was re-decided per report.

`kit/powerbi/` now carries the rest. The consumer-facing procedure —
what to copy where, in what order — lives in
[`kit/powerbi/README.md`](https://code.tti.tamu.edu/tti/tti-ux/src/branch/main/kit/powerbi/README.md)
and ships inside the npm package. This page is the *why*, and what a TUX
maintainer needs to know before touching it.

---

## The constraint that shapes everything

**Power BI has no native dark mode for report content.** Not in Desktop,
not in the service, not on mobile — verified 2026-08-31 against
Microsoft's own documentation, which states that Desktop's dark mode
"is not applied to the Report view Canvas, including the Filter Pane and
Wallpaper." The theme schema has no `colorScheme` key and is
`additionalProperties: false`, so it cannot be extended to add one. The
feature has been on the roadmap as *planned* for years.

That single fact splits the kit in two, and explains a structure that
otherwise looks over-engineered:

- **What a theme file can do** — colour, type, and per-visual style.
  Static. Applies everywhere with zero tooling.
- **What it cannot do** — anything conditional. Microsoft is explicit:
  "You can't add conditional formatting rules to a custom theme." So
  chrome that responds to *state* has to be expressed in the report's own
  PBIR JSON, bound to DAX measures.

A report that responds to a viewer at all does it the second way. That is
not a workaround pending a platform fix; for the foreseeable future it is
the mechanism.

### The trap

Power BI shipped *named theme colors* in 2025–26: a measure can return
`"background"` instead of `#FFFFFF`, and the visual resolves it from the
applied theme. It reads like the clean refactor for our 30 hex-pair
measures.

It is not. A named colour resolves against **the single currently applied
theme**, and a report has exactly one. Both branches of
`IF(mode = "Dark", …, …)` would collapse to the same value and the toggle
would silently stop working — silently, because nothing errors. Named
theme colours make a report *theme-portable*; they cannot make it
*switchable*. `tests/tux-kit-targets.test.ts` asserts every measure still
carries exactly two hex literals, so this can't be "simplified" in later.

---

## What's in the kit

| Artifact | Tier | What it is |
|---|---|---|
| `tti-theme{,-dark,-hc}.json` | 1 | Full report themes — 25 colour keys, `visualStyles` for 26 visual types |
| `pbir/schema-lock.json` | 1 | Every pinned `$schema` URL and format version |
| `pbir/geometry.json` | 1 | Chrome bands, content area, pill stride, z-order |
| `pbir/fragments/` | 1 | Card / table / chart chrome, four colour lanes |
| `pbir/tmdl/` + `pbir/dax/` | 1 | `ThemeMode` + 30 `TuxThemeColors` measures |
| `pbir/shell/{classic,fluent2}/` | 1 | 15 drop-in visuals per canvas |

All Tier 1 — every literal resolves from `design/tokens.json` through the
same `palette()` the theme emitter uses, so a theme and its fragments
cannot drift apart. Committed output, byte-locked by
`tests/tux-kit-targets.test.ts`.

That "all Tier 1" is worth pausing on. The shell *looks* like Tier-2
work: geometry, layering, a nav system. But because the geometry is
derived and the colours are token-resolved, the whole thing is a pure
function of `tokens.json` — so it gets deterministic emission and byte
locks rather than the port-ledger treatment.

### Two colour lanes

`fragments/tti`, `tti-dark`, `tti-hc` carry **static hex** and have no
semantic-model dependency. `fragments/themed` binds to `TuxThemeColors`
measures and follows an in-report slicer. High contrast is not a toggle
state — it's a separately applied theme, so it lives in the static lane.

### Two behaviours that fall out of the token graph

Neither is special-cased; both are consequences of how TTI's tokens are
shaped, which is the strongest argument that the port is faithful:

- **`Shell*` roles are theme-invariant.** `brand.fill` resolves to
  `#5C0025` in both light and dark, so the masthead stays maroon when a
  viewer flips to dark — the on-brand rule, for free.
- **`Tooltip*` roles invert.** `text.primary` is near-black in light and
  near-white in dark, so binding a tooltip's *background* to it produces
  the inversion a tooltip wants automatically.

---

## Version pinning is the maintenance burden

PBIR pins a `$schema` URL in every file it writes, and those URLs are
versioned with **no `latest` alias**. Desktop's failure mode for a stale
one is a generic *"There's a problem with the definition content in your
Power BI Project"* that names no file.

So every URL and version literal lives in `scripts/pbir-schema-lock.mjs`,
once. `npm run verify:pbir` re-checks them all against the live
endpoints. Run it before every release — `visualContainer` moved 2.7.0 →
2.8.0 → 2.9.0 on a roughly monthly cadence before the current pre-GA
freeze.

Three facts worth carrying:

- **`reportVersionAtImport` is an object, not a string.** Report schema
  3.0.0 changed it, and Microsoft's own published example *still* shows
  the obsolete flat `"5.53"` form. Anything copied from the docs produces
  an invalid `report.json`.
- **`platformProperties` lives under `gitIntegration/`**, not
  `item/report/`. The most common wrong URL in circulation.
- **PBIR is still public preview** as of 2026-09-01 — GA slipped past its
  Q3 2026 target — but it has been the default for new reports in the
  service since January 2026 and in Desktop since March, and Microsoft
  has said it becomes the *only* supported format at GA.

### Fluent 2 moved the floor

Fluent 2 GA'd in August 2026 and is the base theme for new reports. It
changed the default canvas to 1920×1080, added padding and corner radius,
and turned visual titles on by default. A component baselined against
Classic renders differently under it.

Hence two canvas variants in `geometry.json`, and hence the emitted
themes pin `baseTheme: "Fluent2-CY26SU08"` explicitly — a custom theme
layers *on top of* a base theme and inherits anything it doesn't define,
so leaving it unpinned means inheriting whatever the consuming report
happens to carry.

---

## Parity with the web charts

The Power BI `visualStyles` emitter had to make every axis, gridline and
legend decision concrete. Those decisions are now the shared contract in
[chart-foundations.md §2](./chart-foundations#_2-axis-grid-and-legend-tokens),
which is what makes "a Power BI report and a TUX page render the same
system" a checkable claim rather than a slogan.

The one deliberate divergence: web gridlines are `--surface-border` at
50% opacity, while the Power BI theme uses `surface.border-subtle`,
because a theme's `gridlineColor` has no alpha channel. Same intent, two
mechanisms.

---

## Where the detail came from

Ported from the Power BI & Fabric documentation tree in
`docs-tti-tamu-edu` — roughly 15,000 lines across 70 files, authored
against a real Tableau→Power BI migration that generated ~1,100 visuals.
The port re-tokenised it from TAMU/AggieBI branding to TTI and re-pinned
every schema version.

What was worth taking was the **non-googleable** part: that `0L` and `1D`
are different values and the wrong one is silently ignored; that a
slicer needs `mode: 'Basic'` *and* `orientation: "1D"` together to render
as tiles; that `syncGroup` lives inside `visual`; that a nav pill must be
three layered visuals because `actionButton` text rendering is unreliable
and its `fontColor` can't take a measureRef at all; that paragraph text
colour can't be measure-bound, so theme-responsive labels have to be
rendered through the visual's *title* instead.

What was left behind: the PowerShell generator (ported the logic to a
`.mjs` emitter — Microsoft's own report-authoring guidance now recommends
"a deterministic Node.js generator"), and everything data-platform-shaped
— Graph ingestion, capacity sizing, semantic-model naming standards.
That's a data-platform concern, not a design-system one.

---

## Known gaps

- **Nothing here has been opened in Power BI Desktop.** 30/30 shell
  visuals validate against the live `visualContainer/2.9.0` schema with
  its five remote `$ref`s resolved, and all three themes against
  `reportThemeSchema-2.157` — but structural validity does not imply a
  correct render, precisely because Power BI ignores a wrong literal type
  rather than rejecting it. The smoke test needs Windows.
- **`nav_pill_inactive_hit` ships without its `navigationSection`
  binding.** The value is a destination page slug that only exists once a
  report has pages, and the source docs never showed the property's JSON
  shape — so it's left to Desktop rather than invented.
- **No deep validation in CI.** `verify:pbir` checks URL reachability
  only. Schema validation needs `ajv`, which is currently just a
  transitive dependency; wiring CI to an undeclared transitive dep is how
  builds break six months later. Microsoft's own
  `@microsoft/powerbi-report-authoring-cli validate` is the sanctioned
  deep check.
- **Not yet built:** the report scaffold, a `tux-pbir` injector that
  mints conforming IDs and renumbers z-order on drop-in, and named style
  presets (the closest thing Power BI has to component variants).
