# MCP Apps for Claude (Community)

**Source:** Figma file `ElAkut7BJMOJTUnD5LGi2z`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-21
**Priority:** medium — **escalated** (Claude/Anthropic official; high relevance to tti-ai-studio)
**Status:** absorbed — 0 components built; 3 roadmap follow-ups for MCP integration

![cover](./cover.png)

## What it is

Anthropic's official **MCP (Model Context Protocol) Apps UI kit v1.1**
— the design system for *third-party apps embedded inside Claude*.
17 pages: foundations (color, typography, layout, icons), three
display modes (inline card / inline carousel / full screen),
Claude-themed components (forms, UI, app chrome), separate desktop
+ mobile builds, plus promotional assets.

**Highest tti-ai-studio relevance** in the medium-signal bucket.
If/when tti-ai-studio integrates MCP, this is the canonical
reference for *how Claude renders third-party tool output*.

## Pages (17)

- `0:1` — 🖼️ Cover _(thumbnail)_
- Foundations: 🖌️ Color · 🔠 Typography · 📐 Layout · 🖋️ Icons
  (Desktop + Mobile)
- Displays: ⬜️ Inline card · 🎠 Inline carousel · ↔ Full screen
  (each with desktop + mobile + shimmers variants)
- Claude Components _(parent group: Forms / UI / App)_
- 🖥️ Desktop web components: Forms · UI · App
- 📱 Mobile components: UI ×3 · App
- 📣 Promotional assets

## Frames inspected

`frames/`:
- `claude-ui.png` — **Navigation & core chat** anatomy: main nav
  (New chat / Chats / Projects / Artifacts / Code, Starred,
  Recents, user chip), Chat input ("Reply to Claude" + "+ Sonnet
  4.5 ↑" or "Ask App ↑"), Chat titlebar, User message (right-
  aligned no-avatar), Claude response (left-aligned with 5-icon
  action row), **Thinking strip** ("Thinking deeply, slowly…"),
  and the **App chrome** (App name / App header / App skeleton /
  App container)
- `inline-card-desktop.png` — 10 inline-card states (light + dark):
  skeleton, text response, card-with-actions, mini chart, full
  chart embedded in the chat conversation
- `inline-carousel-desktop.png` — multi-card horizontal scroll
  ("Find 4 nearby hikes in App"): 3 visible cards + ">" next,
  with a "Reply to Claude" composer below. Light + dark.
- `full-screen-desktop.png` — full-takeover views: skeleton,
  generic content, big heatmap viz, table view. Light + dark.

## The three-tier MCP display pattern

The kit's organizing insight: **MCP apps embed at three densities**
in the chat. Same data, different surface:

| Tier | Use when | Visual |
|---|---|---|
| **Inline card** | Single result fits in a card (a place, a result, a chart) | Compact, takes chat width, scrolls with chat |
| **Inline carousel** | Multiple comparable results (3+ items) | Horizontal scroll of cards, "n nearby X in App" header |
| **Full screen** | Rich interaction needed (large data, multi-step) | Takeover view; chat is paused / docked |

Each tier has a **shimmers / skeleton state** while the MCP tool is
still computing.

## Existing TUX surface (audit)

- **`TuxArtifact`** — closest analog to the **inline-card** tier.
  Already ships with: title / meta / icon header, copy / download /
  regenerate / share actions, `busy` state, custom `#actions` slot,
  default body slot. Standalone (no container assumptions).
- **`TuxSlideover`** — could host the **full-screen** tier (right/
  left/bottom side panels, native `<dialog>`, focus trap).
- **`TuxModal`** — alternate host for full-screen takeover (centered
  modal with focus trap).
- **No carousel primitive** in TUX today. We deliberately
  [deferred a carousel](../shadcn-ui-design-system/NOTES.md) in the
  shadcn absorption — no consumer needed it. **MCP integration
  would be the trigger** to revisit.

## Skip

- **The whole Claude/Anthropic visual identity.** Cream surfaces,
  rust/orange (#D97757-ish) accent, Tiempos Text serif body. TUX
  stays TTI maroon + paper grain. We're absorbing the *anatomy*,
  not the chrome.
- **Mobile-first variants.** TUX desktop-first; if a future mobile
  surface emerges we re-evaluate then.
- **Promotional assets** — marketing collateral, not a design
  pattern.
- **The "Projects / Artifacts / Code" sidebar items.** These are
  Claude-product-specific. tti-ai-studio's sidebar shape
  (Sessions / Corpora / Models / API keys) is correct for
  research-IT use.

## Absorb

1. **The three-tier MCP display taxonomy.** Even before TUX builds
   any MCP-specific component, the *taxonomy itself* is a
   discipline worth recording. When tti-ai-studio integrates tool
   output rendering, the question "inline card / inline carousel /
   full screen" gives consumers a clean decision tree.

2. **The "Thinking…" strip.** Between user message and Claude's
   final response, a small italic "Thinking deeply, slowly…"
   strip with a dot indicator. Nuxt UI 4 ships `UChatReasoning` /
   `UChatShimmer` for this — already wired into
   `tti-ai-studio-session.vue` (per CHANGELOG). Confirmation that
   the existing approach matches Claude's canonical UX.

3. **App chrome anatomy (App name / App header / App skeleton /
   App container).** A consistent header strip identifying *which
   MCP app* produced the output is a real affordance. TuxArtifact's
   `title` + `icon` covers it ("Hikes in App"), but if MCP becomes
   first-class in tti-ai-studio we might want a thinner
   **`TuxMcpEmbed`** variant that emphasizes the app-name + collapse
   /expand /exit chrome (Claude's design) over the standard
   artifact actions (copy/download/share don't always apply to
   interactive app embeds).

4. **The composer pivot to "Ask App ↑"** when an App is active.
   When a user is interacting with an embedded MCP app, the
   composer affordance changes from "Reply to Claude" to "Ask
   App." Worth noting — TuxComposer's `placeholder` prop already
   supports this swap; the *behavior* is a host-driven state
   machine.

## Tension

- **Chat-as-shell vs app-as-shell.** Claude's design lets MCP apps
  *take over* the surface (full-screen tier). For tti-ai-studio,
  a research-IT product, full-screen takeover may not be the right
  default — research users want chat + outputs side-by-side, not
  context-switching into a sub-app. The inline-card and inline-
  carousel tiers transfer well; the full-screen tier needs more
  thought.
- **Action affordances drift.** Claude shows 5 actions under each
  response (copy, share, like/dislike, regenerate, dropdown). Our
  documented standard is also 5 (Copy · Regenerate · Share ·
  Helpful · Off — see `design/components.md` Conventions). The
  *order* differs; ours puts feedback at the end, Claude's groups
  it in the middle. Both are defensible; ours predates this
  absorption.

## Decisions

- **No components built in this pass.** MCP is hypothetical for
  tti-ai-studio today; building speculatively would be inventory
  work. Wait for the consumer surface to force the question.
- **Three roadmap follow-ups captured** below, sized for when MCP
  becomes real.
- **Existing TuxArtifact stays.** It's the correct shape for the
  inline-card tier. Don't refactor preemptively.

## Open follow-ups

When tti-ai-studio integrates MCP-tool output (or another consumer
surface forces it):

- **`TuxMcpEmbed`** (new component, ~150 LOC) — thinner artifact
  variant for *interactive* third-party app output (vs
  TuxArtifact's generated-content emphasis). Anatomy: app icon +
  app name + collapse caret + expand button + exit X + skeleton +
  container slot. Build only when MCP integration is real.
- **`TuxCardCarousel`** (new component, ~200 LOC) — horizontal-
  scroll list of cards with prev/next affordances, optional
  pagination dots. Use case: MCP inline carousel (n results from
  a tool), but also: featured-projects / image galleries / etc.
  This re-opens the carousel question we deferred in the shadcn
  absorption — MCP is the trigger.
- **Full-screen MCP takeover pattern** — document in
  `design/components.md` Conventions whether full-takeover is
  appropriate for tti-ai-studio or whether docked-side-panel via
  `TuxSlideover` is preferred. Decision deferred to integration
  time.
- **Add three-tier MCP display taxonomy** to `design/components.md`
  Conventions as "MCP tool output — when to use which" (sibling to
  the existing form-validation + chat-message-actions docs).
  Capture before the build so the build follows the doctrine.
