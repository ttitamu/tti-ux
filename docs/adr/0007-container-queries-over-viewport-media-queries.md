# ADR 0007 — Container queries over viewport media queries

- **Date**: 2026-04-27
- **Status**: Accepted

## Context

Tux components get embedded at varying widths. Same `<TuxPageHeader>`
might land at:

- Full page width (~64rem) — the home/landing surface.
- Inside a 720px component-demo wrapper — the style guide itself.
- Inside a sidebar tile (~22rem) — a PECAN dashboard panel.
- Inside a modal body (~28rem) — a confirmation flow.
- Inside a narrow article column (~36rem) — a marcom blog post.

With viewport-based media queries, a component embedded in a 600px
column inside a 1200px viewport thinks it has 1200px of inline space.
It renders a two-column layout that overlaps because the actual
container is half that width.

We hit this concretely on `/components/page-header` while rendering
the "two-column with quick fact" demo. The viewport was wide enough
to satisfy `@media (min-width: 48rem)`, but the demo wrapper around
the component was much narrower — the title and the `TuxBigStat`
collided.

## Decision

Every layout-shifting Tux component declares its own container and
queries it. Pattern:

```css
.tux-component {
  container-type: inline-size;
  container-name: tux-component;
  /* base styles, mobile-first */
}

@container tux-component (min-width: 44rem) {
  .tux-component__layout {
    grid-template-columns: 1.4fr 1fr;
  }
}
```

For typography that should scale smoothly between breakpoints, use
`clamp()` with `cqi` (container-query inline) units:

```css
font-size: clamp(2rem, 1.2rem + 4.5cqi, 3.5rem);
```

The container is named per component (`tux-page-header`,
`tux-card-slab`, `tux-cta`, etc.) so nested containers — say, a
TuxCTA inside a TuxPageHeader — don't accidentally satisfy each
other's queries.

### When viewport queries are still right

When the component does something inherently page-layout-relative —
breaking out of the article column with negative margins, floating
into the page gutter — the breakout needs to know the *parent's*
width, not its own. `TuxCaptionedMedia`'s `align="wide"` and
`align="right"` modes are the canonical exception; both keep
`@media` queries with an explanatory comment.

This is one component out of 34. The rest are container-query.

## Consequences

- Components render correctly at any width. The same `<TuxPageHeader>`
  works at full-page, in a sidebar tile, and inside a 600px demo
  wrapper without manual responsive tuning per consumer.
- Hover/floating UI inside a bounded canvas (treemap tooltips,
  popovers) gets the same treatment: anchor with `right`/`bottom`
  past the canvas midpoint, not just `left`/`top` from the corner.
  See `TuxTreemap`'s tooltip handler for the canonical pattern.
- Browser support: Chrome 105+, Safari 16+, Firefox 110+
  (October 2022 onward). All evergreen browsers support container
  queries; tux's three downstream consumers (PECAN, tti-ai-studio,
  marcom) target current Chrome / Edge / Firefox / Safari, so no
  fallback is required.
- The convention is enforced in two places: `design/components.md`
  guidance section (for human contributors) and the gitignored
  repo-level `CLAUDE.md` (for AI-agent sessions). Memory carries it
  across sessions.

## What we considered and rejected

- **Tailwind responsive prefixes (`md:`, `lg:`, `xl:`).** They're
  viewport-keyed; same problem. Tailwind v4 supports container
  queries via `@container` directive, but mixing approaches per
  component is more confusing than committing to native CSS.
- **JS-driven measurement** (e.g. ResizeObserver + computed
  classes). Works, but reintroduces hydration mismatches, breaks
  print mode, and adds runtime cost for behavior CSS handles
  natively now.
- **Container queries everywhere, no exceptions.** Tried for
  `TuxCaptionedMedia` `align="wide"`. The breakout pattern (negative
  margins extending past the article column) requires the figure to
  know the column's outer width, which it can't from inside its own
  container scope. Accepted the inconsistency and documented it
  inline.
