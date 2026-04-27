# UI Kit — tti-ai-chat

Internal LLM chat for TTI research staff. Knowledge-grounded — every answer cites the corpus it pulled from. Not an external-facing product; lives inside the institute's SSO.

## What this exercises

The whole design system, in the single surface that uses it most heavily:

- **ChatSidebar** — scrollable conversation list grouped by day (`TODAY` / `YESTERDAY` / `THIS WEEK`). The active item has the signature 3px maroon left-border and 10%-tinted background.
- **ConversationHeader** — eyebrow + bold title on the left, `TuxBadge` tier chip (ITAR) + live corpus readout in the middle, `TuxButton` (Export) on the right.
- **Message** — two roles. User on page-white; assistant on sunken-grey. Avatars: user is a neutral grey initial, assistant is the maroon circle with the italic `tx` glyph in gold.
- **Citations** — every assistant answer ends with a sources block: 1-indexed, monospace rank tag, title + path, cosine score. Clicking a citation jumps to the doc (wired as preventDefault here).
- **AssistantToolbar** — copy / open / 👍 / 👎, rendered small and muted so they don't compete with the body copy.
- **Composer** — bordered 2px-maroon textarea with corpus attach + model select below. Full-width `TuxAlert` compliance block sits above the input on ITAR conversations so the user can't forget the scope.
- **ContextPanel** — right rail. `TuxSectionHeader` rhythm: CORPUS (three attached corpora with tier badges), RETRIEVAL (top-k / min-score / rerank / context window), USAGE (four `BigFigure` stats — italic display numerals in maroon / gold).

## The institutional voice, in one screen

Everything named in the demo conversation is specific on purpose: the classifier is called by its ID (`CLS-204`), the rubric by its section (§3.2), the GPU pool by its model (A100), the fault-analysis buckets by their paths (`grants-2024/dod-xr-contracts/`). That's the tti-ux "institutional, not instagrammable" principle in action.

## Files

| File | What's in it |
|---|---|
| `index.html` | Mount + the demo conversation (3 messages covering audit, scoped retrain proposal, ticket draft). |
| `TuxComponents.jsx` | Shared tux primitives (copied from `ui_kits/pecan/`). |
| `ChatParts.jsx` | `ChatSidebar`, `ConversationHeader`, `Message`, `Citations`, `AssistantToolbar`, `Composer`, `ContextPanel`, `Stat`, `BigFigure`. |

## What's cut

No streaming, no tool-call rendering, no real model — the demo response is static. The goal is to show how the tux primitives compose into a chat product, not to mock a full RAG runtime.
