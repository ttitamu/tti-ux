# ChatGPT UI Kit, AI Chat (Community)

**Source:** Figma file `tJG7ljkBW5zPFkFHRo8TQZ`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-21
**Priority:** medium
**Status:** absorbed — 0 new components; one empty-state taxonomy note

![cover](./cover.png)

## What it is

A near-complete ChatGPT product clone — ~80 screens across Guest /
Authenticated / Settings flows: Start chat, Chat, Search chats,
Library, Explore GPTs, Voice chat, Temporary chat, Create an image,
Search the web, Write or code, Research, Tools, plus 7 Settings
sub-screens. Polished + dark-mode parity throughout.

For TUX absorption, this is **breadth > depth** — the product is
specific (OpenAI's flagship), but a handful of structural patterns
are worth calling out.

## Pages (5)

- `665:2049` — 🟪 ChatGPT Web Client _(3 frames; the screen-flow chart)_
- `0:1` — 🟪 ChatGPT UI Kit _(3 frames: Navigation, New chat ×2)_
- `609:5682` — 🟡 Design system _(2 frames; tokens, skip)_
- `501:3138` — ❄️ Made with SnowUI _(upsell, skip)_
- `1:9655` — 🔶 Cover _(thumbnail)_

## Frames inspected

`screens/`:
- `chatgpt-web.png` — the full Authenticated / Guest / Settings
  flow chart (~80 screens at thumbnail scale)
- `new-chat.png` — Start-chat empty state: 3-column Examples /
  Capabilities / Limitations grid + composer at bottom + left
  sidebar with chat history + "Clear conversations" / "Light mode"
  / "My account" / "Updates & FAQ" / "Log out"
- `navigation.png` — upsell banner (skip)

## Existing TUX surface (audit before proposing)

Already covered before this absorption:
- **Chat thread** — `TuxChatMessage` + `UChatMessage`/`UChatMessages`
- **Composer** — `TuxComposer` + `UChatPrompt`/`UChatPromptSubmit`
- **Conversation sidebar** — `TuxConversationList`
- **Suggestion chips above composer** — `TuxSuggestionChips`
  (Vercel absorption)
- **Branch nav for alt responses** — `TuxBranchNav`
- **Inline citations** — `TuxInlineCitation` / `TuxCitations`
- **Context budget visualization** — `TuxContextMeter` /
  `TuxContextPanel`
- **First-run empty state** — `TuxEmptyState` with
  `kind="first-run"` preset
- **Sidebar shell** — `app/layouts/sidebar.vue`

## Skip

- **The screen catalog itself.** 80 polished screens of OpenAI's
  product, but the *components* underneath are all things TUX
  already has. No need to drill into each.
- **Voice-chat orb/sphere animation.** Full-screen voice mode is
  not a TTI surface today; the orb is a stylistic choice that
  doesn't map to editorial chrome.
- **"Create an image" / "Search the web" sub-product views.** These
  are tool-launcher landing pages — for tti-ai-studio, the
  equivalent surface composes `TuxSuggestionChips` + a tool-
  invocation slot, not a dedicated route per tool.
- **Settings screens.** Generic profile / data-controls / security
  panels — same pattern any product has. TUX doesn't ship "settings
  page" as a top-level component; consumers compose with
  `TuxPageHeader` + `UFormField` + `UInput` + sections.

## Absorb

1. **First-run empty-state taxonomy: "Examples / Capabilities /
   Limitations."** ChatGPT's New-chat splash uses three explicit
   columns to set expectations before the user types their first
   prompt:
   - **Examples** — "what should I ask?" (concrete prompt suggestions)
   - **Capabilities** — "what can it do?" (system strengths)
   - **Limitations** — "what should I not trust?" (advisory caveats)

   This is a **disciplined three-part framing** worth documenting.
   tti-ai-studio's first-run state today is a single `TuxEmptyState
   kind="first-run"` block — adequate, but flat. The three-column
   taxonomy gives users a faster mental model. **Capture as
   convention** in `design/components.md`, not a new component:
   the existing `TuxFactoid density="3"` (or a 3-up grid of
   `TuxCard` blocks) composes this cleanly.

2. **Sidebar bottom utility cluster.** Left rail has a footer
   region with "Clear conversations · Light mode · My account ·
   Updates & FAQ · Log out." Our `sidebar.vue` already provides a
   `#rail-footer` slot that supports this exact pattern (used in
   sidebar-shell.vue + landscape-dashboard.vue for the user chip).
   No change needed; this is confirmation.

3. **"What's new" / changelog entry in the rail footer.** A small
   "Updates & FAQ" item with a NEW dot is a nice affordance for
   a long-running product. Worth a note for consumers; TUX has
   `TuxAnnouncementBanner` (page-level) but no in-rail "new"
   indicator. Compose with a small badge in the rail entry; don't
   ship a new component.

## Tension

- **Sprawl vs editorial restraint.** ChatGPT's surface keeps
  growing (Library, Explore GPTs, Tools, Connected apps). Every
  new capability becomes a new sidebar item. tti-ai-studio should
  resist this — research-IT users want fewer, more focused
  surfaces. The sidebar shape we have (Sessions / Corpora /
  Models / API keys / Settings) is close to right; don't expand.
- **Empty-state polish vs research-utility.** ChatGPT's empty
  state is a marketing surface — big logo, polished cards, "Hi,
  what's on your mind today?" tone. Research-IT empty states
  should be quieter and more functional ("Last session was about
  X · Recently used corpus: Y · Pick up where you left off").
  Don't import the marketing tone.

## Decisions

- **No new components.** The chat surface remains saturated.
- **One convention to capture in `design/components.md`:** the
  three-part first-run taxonomy ("Examples / Capabilities /
  Limitations") — when an AI-product surface needs a first-run
  splash, this is the canonical division. Compose via TuxFactoid
  or a 3-up TuxCard grid, not a new component.

## Open follow-ups

- Add a **"First-run taxonomy for AI surfaces"** subsection to
  `design/components.md` Conventions (sibling to "Chat-message
  actions" and "Form validation"). Three columns: Examples
  (suggested prompts) · Capabilities (system strengths) ·
  Limitations (caveats). Reference frame: this file's
  `new-chat.png`. Defer until tti-ai-studio explicitly needs a
  richer first-run surface — single-line `TuxEmptyState
  kind="first-run"` is still adequate for most cases.
