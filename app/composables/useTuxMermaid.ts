// useTuxMermaid — singleton Mermaid renderer for the whole app.
//
// Mermaid is a real ~3MB dependency, so per-component lazy imports
// were both: (a) loading the same module repeatedly across instances
// (wasteful), and (b) producing a multi-stage layout shift as
// diagrams arrived one by one. This composable consolidates both:
//
// - one Mermaid bootstrap per page session (initialize() runs once)
// - one render pipeline coordinating concurrent renders so diagrams
//   commit in roughly the order their components mounted
//
// Server-side, this composable returns a no-op `render` (Mermaid is
// DOM-dependent — running it in Nitro would need jsdom and isn't
// worth the bundle cost for a chart). Server consumers should reserve
// vertical space via the `estimateHeight` helper so the client-side
// commit doesn't trigger a layout shift.

import type { MermaidConfig } from "mermaid";

let mermaidPromise: Promise<typeof import("mermaid").default> | null = null;
let lastTheme: "default" | "dark" | null = null;

async function getMermaid(theme: "default" | "dark") {
  if (!mermaidPromise) {
    mermaidPromise = (async () => {
      const mermaid = (await import("mermaid")).default;
      applyConfig(mermaid, theme);
      lastTheme = theme;
      return mermaid;
    })();
    return mermaidPromise;
  }

  const m = await mermaidPromise;
  if (theme !== lastTheme) {
    applyConfig(m, theme);
    lastTheme = theme;
  }
  return m;
}

function applyConfig(m: typeof import("mermaid").default, theme: "default" | "dark") {
  const config: MermaidConfig = {
    startOnLoad: false,
    theme,
    themeVariables: {
      // Brand palette mapped into Mermaid's semantic slots. We can't
      // use CSS vars here — Mermaid resolves colors at render time
      // into standalone SVG, not at paint time.
      fontFamily: "var(--font-body), Open Sans, sans-serif",
      primaryColor: "#5C0025",
      primaryTextColor: "#ffffff",
      primaryBorderColor: "#3d0018",
      secondaryColor: "#DDAC37",
      secondaryTextColor: "#2A0E15",
      lineColor: "#5C0025",
      textColor: "#221F1F",
      background: "#ffffff",
    },
    securityLevel: "strict",
  };
  m.initialize(config);
}

export function useTuxMermaid() {
  /**
   * Render a Mermaid source string to an SVG string. Returns null
   * when called server-side (Mermaid needs the DOM); consumers should
   * reserve space via `estimateHeight()` for SSR and re-render on
   * mount.
   */
  async function render(
    code: string,
    opts: { id: string; theme: "default" | "dark" }
  ): Promise<string | null> {
    if (typeof document === "undefined") return null;
    const m = await getMermaid(opts.theme);
    const result = await m.render(opts.id, code);
    return result.svg;
  }

  /**
   * Estimate the rendered height of a Mermaid diagram from its
   * source — used to reserve space at SSR time so the client-side
   * commit doesn't shift layout. Heuristic: count nodes-ish (lines
   * with content) and multiply by typical Mermaid row height.
   */
  function estimateHeight(code: string): number {
    const meaningfulLines = code
      .split("\n")
      .filter(l => l.trim() && !l.trim().startsWith("%%"))
      .length;
    // Mermaid's flowchart rows render ~50px tall on average; sequence
    // diagrams are denser (~40px); ER diagrams looser (~70px). Picking
    // 56px as a midpoint, plus 80px of padding/edges, capped to a
    // reasonable range.
    const estimate = meaningfulLines * 56 + 80;
    return Math.max(140, Math.min(estimate, 720));
  }

  return { render, estimateHeight };
}
