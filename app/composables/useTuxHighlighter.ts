// useTuxHighlighter — singleton Shiki highlighter for the whole app.
//
// Shipped to fix the flash-of-unhighlighted-code that the
// per-component dynamic-import pattern caused. One instance per
// request (server) or per page session (client), shared across all
// TuxCodeBlock and TuxExample call sites. Pre-loads the common langs
// at first use; rare langs lazy-load on demand.
//
// Usage:
//
//   const { highlight } = useTuxHighlighter();
//   const html = await highlight(code, { lang: "ts", theme: "github-light" });
//
// Top-level `await` in `<script setup>` works — the promise resolves
// during SSR so the rendered HTML ships in the initial document. No
// flash of unhighlighted code on initial paint.

import type { Highlighter, BundledLanguage, BundledTheme } from "shiki";

// Common langs we pre-load. Anything outside this set adds maybe
// 10-30ms on first use to fetch + register the grammar.
const COMMON_LANGS: BundledLanguage[] = [
  "ts", "js", "vue", "html", "css", "scss",
  "json", "yaml", "md", "bash", "shell", "python", "go", "rust", "sql",
];

const THEMES: BundledTheme[] = [
  "github-light",
  "github-dark",
  "github-light-high-contrast",
];

// Module-scoped state. On the server, Nuxt re-evaluates the module
// per worker; on the client, this lives for the page session.
let highlighterPromise: Promise<Highlighter> | null = null;
const loadedLangs = new Set<string>(COMMON_LANGS);

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const { createHighlighter } = await import("shiki");
      return createHighlighter({
        themes: THEMES,
        langs: COMMON_LANGS,
      });
    })();
  }
  return highlighterPromise;
}

async function ensureLang(highlighter: Highlighter, lang: string) {
  if (loadedLangs.has(lang)) return;
  try {
    await highlighter.loadLanguage(lang as BundledLanguage);
    loadedLangs.add(lang);
  } catch {
    // Unknown lang — fall through to plain text rendering.
  }
}

export function useTuxHighlighter() {
  /**
   * Highlight code to HTML. Returns the wrapped <pre><code>…</code></pre>
   * Shiki produces, with theme tokens inlined as styles. Safe to use
   * with v-html on output.
   */
  async function highlight(
    code: string,
    opts: { lang: string; theme: BundledTheme }
  ): Promise<string> {
    if (opts.lang === "text") {
      // No highlighter needed. Escape minimally; consumer should use
      // v-html only if it controls the source.
      return `<pre><code>${escape(code)}</code></pre>`;
    }
    const highlighter = await getHighlighter();
    await ensureLang(highlighter, opts.lang);
    if (!loadedLangs.has(opts.lang)) {
      // Lang failed to load — fall back to plain text.
      return `<pre><code>${escape(code)}</code></pre>`;
    }
    return highlighter.codeToHtml(code, {
      lang: opts.lang as BundledLanguage,
      theme: opts.theme,
    });
  }

  return { highlight };
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
