# @tti/tti-ux-desk

Visual document builder, rich text editor, headless database schemas, and publishing engine for the Texas A&M Transportation Institute design system (TUX).

## Installation

```bash
npm install @tti/tti-ux @tti/tti-ux-desk
```

## Nuxt Layer Setup

Add `@tti/tti-ux-desk` to `extends` in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: [
    "@tti/tti-ux",
    "@tti/tti-ux-desk",
  ],
});
```

## Features

- **`<TuxDeskWebBuilder>`**: Complete visual document and web authoring canvas with device previews (desktop/tablet/mobile), outline navigation, property inspectors, and MDC bidirectional conversion.
- **`<TuxDeskEditor>` & `<TuxRichTextEditor>`**: Production-grade TipTap WYSIWYG editors with table tools, task lists, code blocks, typography substitutions, and link/embed dialogs.
- **`<TuxDeskArticle>`**: High-fidelity published document view with inline TUX module blocks, staleness banners, and feedback triggers.
- **Headless Backend & REST API**: Full editorial workflow engine with revision rollback, audit logs, issue tracking, and feedback capture.
- **Database Engine**: Multi-mode persistence supporting in-memory / local embedded SQLite/PGlite (`@electric-sql/pglite`) for development and client-side demos, or enterprise Postgres (`postgres` + `drizzle-orm`) with automatic migrations.
- **Security & Validation**: Zod-validated request schemas (`server/utils/desk-schemas.ts`), sliding-window rate limiting, role-based actor extraction, and XSS sanitization.
