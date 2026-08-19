# The kit pipeline — how framework targets get made

> Ratified 2026-08-19 with the first framework-target batch (C# /
> React / WordPress). Answers the standing question: *how automatic
> is this, and where do the superPOD panels fit?*

TUX serves consumers on platforms that can't run the Nuxt layer —
.NET report generators, plain React apps, WordPress marcom sites,
Power BI. The kit (`kit/`, shipped inside the `@tti/tti-ux` npm
package) is how they consume the system. Two tiers, two very
different automation stories.

## Tier 1 — deterministic emitters (tokens & themes)

**What:** anything derivable from `design/tokens.json` by pure
computation. Today: `kit/css` (custom properties), `kit/scss`
(Bootstrap partial), `kit/env` (brand env), `kit/powerbi` (report
themes), `kit/csharp` (`TuxTokens.cs`), `kit/react`
(`tux-tokens.ts`), `kit/wp` (`theme.json`).

**How:** `npm run build:kit` runs the emitters
(`scripts/build-tokens.mjs`, `build-framework-targets.mjs`, …);
outputs are **committed**, and lock tests
(`tests/tux-kit-targets.test.ts`, `build-tokens --check`) fail CI if
a committed output drifts from its generator. Publishing is the tag
train: merge → tag `vX.Y.Z` → `publish-package.yml` ships the whole
kit to the Forgejo npm registry.

**Automation status: fully automatic, zero AI — by design.** Same
input, same bytes, forever. A token edit in `tokens.json` propagates
to every target in one `build:kit` run, and no model is ever asked to
transcribe a hex value. AI has negative value at this tier: the
failure mode of generative transcription (plausible-but-wrong
literals) is exactly what the lock tests exist to make impossible.

**Adding a target** (Compose-for-Android, iOS asset catalog, Figma
variables push, …) = one emitter function + one lock test + a README
consumption note. An ordinary minor release.

## Tier 2 — component ports (the BFF / superPOD panel tier)

**What:** actual component implementations on other frameworks — a
React `TuxCard`, a WPF chart family. These are *translations of
behavior*, not derivations of data: slots, a11y contracts, keyboard
models, container queries. No deterministic emitter can produce them.

**How it should work (proposed architecture, not yet built):**

The estate already has the pieces. This repo's CI calls the **TTI AI
BFF** (`/v1/review`) for the advisory PR panel — a multi-model
superPOD debate with per-actor attribution — and tti-ai-studio /
Landscape use the same debate-and-judge method interactively. The
component-port pipeline composes those proven parts:

1. **Trigger:** a Forgejo Actions workflow watches merged changes
   under `app/components/Tux*.vue` (path filter on push to main).
2. **Generate:** for each changed component, call a BFF generation
   endpoint with (a) the Vue source, (b) the target-framework port if
   one exists, (c) the doctrine docs (components.md vocabulary,
   chart-tooltip contract, four-family rule) as context. Multi-agent:
   one generator per target framework, a critic panel debating the
   draft (the ai-review method), a revision round.
3. **Verify mechanically, not rhetorically:** the port must pass a
   behavior-lock harness — the same prop/emit vocabulary (enforced
   against the components.md table), rendered-output snapshots for
   the deterministic parts, axe on the rendered port. Panels argue;
   tests decide.
4. **Deliver as a PR, never a direct publish.** The bot opens
   `port/<component>-<framework>` with the generated code + its test
   results; the normal gates run (baseline-security, ai-review,
   lock tests). Auto-merge on all-green is a *policy dial* the owner
   can turn later — start with human merge, earn the automation.
5. **Publish:** merged ports ride the same tag train as everything
   else. No separate publish path exists, on purpose.

**Why the PR gate is load-bearing:** the deterministic tier can ship
unreviewed because it cannot be wrong in new ways. Generated
component code can be — and a port that subtly breaks a keyboard
contract damages the system's core promise (accessible by default).
The gate is what makes "automatically review and publish" honest:
automatic *generation*, automatic *verification*, automatic
*delivery to a merge decision* — with the merge itself starting
human and becoming automatic only when the harness has earned trust.

**Prerequisites before building tier 2:**
- A BFF generation endpoint (today's `/v1/review` reviews; ports need
  a `/v1/generate`-shaped contract with repo-context upload).
- A React (first target) test harness in this repo or a sibling
  `tti-ux-react` repo — decide mono vs sibling before the first port.
- The `PACKAGE_TOKEN` secret (already required for the tag train).

## The rule of thumb

> If a target can be a function of `tokens.json`, it is tier 1 and
> ships this week. If it needs judgment, it is tier 2, the judgment
> gets a panel, the panel gets a harness, and the harness gets a PR.
