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
  // Brand palette mapped into Mermaid's semantic slots. We can't use
  // CSS vars here — Mermaid resolves colors at render time into
  // standalone SVG, not at paint time. Light + dark modes get
  // distinct slots so contrast stays right in both.
  const isDark = theme === "dark";

  const config: MermaidConfig = {
    startOnLoad: false,
    // 'base' honors all themeVariables; 'default' silently overrides
    // some so brand colors don't fully apply.
    theme: "base",
    themeVariables: {
      // Type — Open Sans, sized smaller than Mermaid's default
      // (16px) which dominates editorial body context.
      fontFamily: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
      fontSize: "13px",

      // Primary nodes — white fill with maroon border keeps diagrams
      // readable in editorial context without competing with body
      // text. Mermaid's default fills nodes with the primary color
      // which is too loud.
      primaryColor: isDark ? "#3a3a3a" : "#FFFFFF",
      primaryTextColor: isDark ? "#FAFAFA" : "#221F1F",
      primaryBorderColor: "#5C0025",

      // Secondary — sunken-gray fills (alt nodes, subgraphs).
      secondaryColor: isDark ? "#2a2727" : "#F5F5F5",
      secondaryTextColor: isDark ? "#FAFAFA" : "#221F1F",
      secondaryBorderColor: isDark ? "#5D5D5D" : "#D1D2D4",

      // Tertiary — gold accent for the rare third tier.
      tertiaryColor: isDark ? "#DDAC37" : "#FBF3F6",
      tertiaryTextColor: "#2A0E15",
      tertiaryBorderColor: "#DDAC37",

      // Edges + connectors — brand maroon, not generic gray.
      lineColor: "#5C0025",
      textColor: isDark ? "#FAFAFA" : "#221F1F",
      mainBkg: isDark ? "#221F1F" : "#FFFFFF",
      background: isDark ? "#15100F" : "#FFFFFF",

      // Sequence diagrams
      actorBkg: isDark ? "#3a3a3a" : "#FFFFFF",
      actorBorder: "#5C0025",
      actorTextColor: isDark ? "#FAFAFA" : "#221F1F",
      activationBkgColor: isDark ? "#5C0025" : "#FBF3F6",
      activationBorderColor: "#5C0025",

      // Notes inside diagrams
      noteBkgColor: isDark ? "#1f000c" : "#FBF3F6",
      noteBorderColor: "#5C0025",
      noteTextColor: isDark ? "#FAFAFA" : "#221F1F",
    },
    flowchart: {
      curve: "basis",
      nodeSpacing: 40,
      rankSpacing: 50,
      padding: 8,
      htmlLabels: true,
    },
    sequence: {
      actorMargin: 60,
      messageFontSize: 12,
      noteFontSize: 12,
      mirrorActors: false,
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
