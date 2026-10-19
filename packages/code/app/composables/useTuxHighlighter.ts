// useTuxHighlighter — singleton Shiki highlighter for the whole app.
//
// Uses `shiki/core` with oniguruma wasm and explicit language / theme imports
// instead of importing the full 346-language bundle, keeping build output
// and bundle size lean.
//
// Usage:
//
//   const { highlight } = useTuxHighlighter();
//   const html = await highlight(code, { lang: "ts", theme: "github-light" });
//
// Top-level `await` in `<script setup>` works — the promise resolves
// during SSR so the rendered HTML ships in the initial document. No
// flash of unhighlighted code on initial paint.

import type { BundledTheme } from "shiki";
import type { HighlighterCore } from "shiki/core";

const THEMES = [
  import("shiki/themes/github-light.mjs"),
  import("shiki/themes/github-dark.mjs"),
  import("shiki/themes/github-light-high-contrast.mjs"),
];

const LANGS = [
  import("shiki/langs/typescript.mjs"),
  import("shiki/langs/javascript.mjs"),
  import("shiki/langs/vue.mjs"),
  import("shiki/langs/html.mjs"),
  import("shiki/langs/css.mjs"),
  import("shiki/langs/scss.mjs"),
  import("shiki/langs/csharp.mjs"),
  import("shiki/langs/razor.mjs"),
  import("shiki/langs/tsx.mjs"),
  import("shiki/langs/json.mjs"),
  import("shiki/langs/yaml.mjs"),
  import("shiki/langs/markdown.mjs"),
  import("shiki/langs/bash.mjs"),
  import("shiki/langs/shellscript.mjs"),
  import("shiki/langs/python.mjs"),
  import("shiki/langs/go.mjs"),
  import("shiki/langs/rust.mjs"),
  import("shiki/langs/sql.mjs"),
  import("shiki/langs/swift.mjs"),
  import("shiki/langs/kotlin.mjs"),
  import("shiki/langs/php.mjs"),
];

let highlighterPromise: Promise<HighlighterCore> | null = null;
let loadedLangs = new Set<string>();

async function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const [{ createHighlighterCore }, { createOnigurumaEngine }] = await Promise.all([
        import("shiki/core"),
        import("shiki/engine/oniguruma"),
      ]);
      const highlighter = await createHighlighterCore({
        themes: THEMES,
        langs: LANGS,
        engine: createOnigurumaEngine(import("shiki/wasm")),
      });
      loadedLangs = new Set(highlighter.getLoadedLanguages());
      return highlighter;
    })();
  }
  return highlighterPromise;
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
    if (!loadedLangs.has(opts.lang)) {
      // Lang not in core set — fall back to plain text.
      return `<pre><code>${escape(code)}</code></pre>`;
    }
    return highlighter.codeToHtml(code, {
      lang: opts.lang,
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
