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

**How it works (ratified 2026-08-19, first piece SHIPPED — owner
decision: build on existing access only, no new BFF endpoints or
tokens minted):**

The estate already has the judgment infrastructure: this repo's CI
calls the **TTI AI BFF** (`/v1/review`) on every PR — a multi-model
superPOD panel with per-actor attribution. So the pipeline doesn't
need generation *access*; it needs drift *detection* and a PR for
the panel to judge. That's cheap and deterministic:

1. **Detect (SHIPPED — `ports-sync.yml` + `scripts/ports-manifest.mjs`):**
   every merge to main touching `app/components/Tux*.vue` updates the
   port ledger (`kit/ports/manifest.json`: source hash per component,
   last-ported hash per target) and the human-readable
   `kit/ports/QUEUE.md`, on a bot branch (`bots/ports-sync`), as a PR.
   Auth reuses the job token (git push) and the existing ai-review
   bot PAT (PR creation). `--check` mode runs in the test suite so a
   component can't land without the ledger following it.
2. **Judge with the bots we already have:** the bot PR flows through
   the SAME gates as any human PR — baseline-security, the full test
   suite, and the ai-review superPOD panel. When port code appears in
   these PRs, the panel debates *that code* with zero pipeline
   changes.
3. **Generate — the slot the ledger feeds, in maturity order:**
   (a) hand/session-authored ports working down QUEUE.md;
   (b) a mechanical Vue→target scaffolder for the template+CSS-heavy
   components (most of the catalog), output landing in the same bot
   PR; (c) agent-authored ports if/when a generation endpoint ever
   earns its keep. Each stage rides the identical PR shape, so
   upgrading the generator never changes the pipeline contract.
4. **Verify mechanically, not rhetorically:** ports must pass a
   behavior-lock harness — prop/emit vocabulary conformance against
   the components.md table, rendered-output snapshots, axe. Panels
   argue; tests decide.
5. **Deliver as a PR, never a direct publish; publish rides the tag
   train.** Auto-merge on all-green is a *policy dial* the owner can
   turn later — start with human merge, earn the automation.

**Why the PR gate is load-bearing:** the deterministic tier can ship
unreviewed because it cannot be wrong in new ways. Generated
component code can be — and a port that subtly breaks a keyboard
contract damages the system's core promise (accessible by default).
The gate is what makes "automatically review and publish" honest:
automatic *generation*, automatic *verification*, automatic
*delivery to a merge decision* — with the merge itself starting
human and becoming automatic only when the harness has earned trust.

**Where ports live (owner-ratified 2026-08-20): in THIS repo — a
multi-language monorepo.** npm workspaces; the root stays the Nuxt
layer (`@tti/tti-ux`), `packages/react/` is `@tti/tti-ux-react`
(version-locked to the root, published by the same tag train), and a
future `packages/dotnet/` follows the same shape. First port shipped
as proof: `TuxBigStat` — same props, same BEM classes, byte-equivalent
CSS, port-fidelity tests, ledger entry recording the source hash it
was generated against.

**The port-writer bot (owner-ratified direction, account pending):**
generation gets its own **service account** — working name
`tux-port-bot` — that leverages the superPOD models through the BFF
exactly the way the existing bots do (dedicated PAT, `X-TTI-Actor`
attribution). Scopes: repo content write (push to `bots/ports-sync`)
+ PR create; BFF access for generation calls. It writes port drafts
into the same bot-PR shape the drift bot already opens, where the
ai-review panel and the port-fidelity harness judge them. Creating
the account and its PAT is an owner/admin action; the workflow reads
it as a `PORT_BOT_TOKEN` secret and degrades to detection-only when
absent.

**Platform direction (recorded for the forgejo-stack workstream):**
once the port-writer proves out here, TTI Code should expose bots as
a per-repo capability — site/repo owners see the available bots
(review panel, port writer, …) and can toggle them, with the
**security review permanently non-optional**. This repo is the pilot.

**Remaining prerequisites before generated ports land:**
- The `tux-port-bot` service account + `PORT_BOT_TOKEN` secret
  (owner/admin).
- The `PACKAGE_TOKEN` secret (already required for the tag train).

## The rule of thumb

> If a target can be a function of `tokens.json`, it is tier 1 and
> ships this week. If it needs judgment, it is tier 2, the judgment
> gets a panel, the panel gets a harness, and the harness gets a PR.
