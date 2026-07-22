/*
 * AggieChartFoundations2.jsx — shared primitives for the chart-expansion batch
 *
 * Exports on window:
 *   Exhibit           — formal figure wrapper (eyebrow / number / title / signature / caption / cite / footnote)
 *                       supports tone="default" | "dark" | "print"
 *   ExhibitGrid       — 2-up grid that respects the exhibit's tone
 *   CompareGoodBad    — side-by-side "do / don't" frame
 *   ChartLegend2      — legend with optional values, sized for both light + dark
 *   AnnotationDot     — annotation marker (circled letter) — shared across charts
 *   MAP_PALETTE       — sequential ramp for choropleths (5-step + diverging 7-step)
 *   HatchDefs         — <defs> block of hatch patterns for grayscale / print mode
 *   PR_PATTERNS       — names of the hatch patterns ['hatch-1' .. 'hatch-6']
 *
 * Helper prefix: CF.
 *
 * Tone behavior:
 *   default — surface-raised bg, normal palette, normal type colors
 *   dark    — near-black bg, brighter tints of palette, white type. For decks.
 *   print   — pure white bg, hatch-pattern fills via PR_PATTERNS, black type. For grayscale PDF.
 */

// ═══════════════════════════════════════════════════════════════════════
// Tone tokens
// ═══════════════════════════════════════════════════════════════════════

const TONE_TOKENS = {
  default: {
    bg: "var(--surface-raised)",
    border: "var(--surface-border)",
    text: "var(--text-primary)",
    textMuted: "var(--text-muted)",
    textSecondary: "var(--text-secondary)",
    grid: "color-mix(in srgb, currentColor 12%, transparent)",
    sigStart: "var(--brand-primary)",
    sigEnd: "transparent",
    isDark: false,
    isPrint: false,
  },
  dark: {
    bg: "#0E1216",
    border: "#2A323A",
    text: "#F4F1EC",
    textMuted: "#8A949E",
    textSecondary: "#C2C9D1",
    grid: "rgba(255,255,255,0.10)",
    sigStart: "#E3A66A",                 // warmer maroon→amber for dark mode
    sigEnd: "transparent",
    isDark: true,
    isPrint: false,
  },
  print: {
    bg: "#ffffff",
    border: "#222",
    text: "#000",
    textMuted: "#444",
    textSecondary: "#222",
    grid: "rgba(0,0,0,0.18)",
    sigStart: "#000",
    sigEnd: "transparent",
    isDark: false,
    isPrint: true,
  },
};

window.TONE_TOKENS = TONE_TOKENS;
window.useToneTokens = (tone = "default") => TONE_TOKENS[tone] || TONE_TOKENS.default;

// ═══════════════════════════════════════════════════════════════════════
// Map / sequential ramps + dark/print equivalents
// ═══════════════════════════════════════════════════════════════════════

// Maroon-led sequential ramp (light → saturated). Use for choropleth.
const MAP_PALETTE = {
  sequentialMaroon: ["#F1E4E0", "#DDB7AC", "#C58675", "#9E483A", "#500000"],
  sequentialSlate:  ["#E2E7EC", "#B7C2CC", "#7E94A4", "#52677A", "#283544"],
  divergingMaroonTeal: ["#3F5A6F", "#7E94A4", "#B7C2CC", "#EFE9DD", "#DDB7AC", "#C58675", "#500000"],
  // High-contrast variants for dark mode
  sequentialMaroonDark:  ["#3D1110", "#702C28", "#A14A3D", "#C97058", "#E89B7E"],
  sequentialSlateDark:   ["#1A2129", "#3F5A6F", "#6F8294", "#9CADBD", "#C2D0DE"],
  // Print: 5 levels via hatch density
  hatchedSequential: ["hatch-1", "hatch-2", "hatch-3", "hatch-4", "hatch-5"],
};

window.MAP_PALETTE = MAP_PALETTE;

// ═══════════════════════════════════════════════════════════════════════
// Print-mode hatch patterns (SVG defs)
// ═══════════════════════════════════════════════════════════════════════

// Names referenced as fill="url(#hatch-N)"
const PR_PATTERNS = ["hatch-1", "hatch-2", "hatch-3", "hatch-4", "hatch-5", "hatch-6"];
window.PR_PATTERNS = PR_PATTERNS;

function HatchDefs({ idPrefix = "" }) {
  // Six hatch densities + 1 dotted. Stroke is currentColor so they invert correctly.
  const hatches = [
    { id: "hatch-1", angle: 45,  spacing: 8, sw: 0.8 },   // sparse \\\\
    { id: "hatch-2", angle: 45,  spacing: 5, sw: 1.0 },   // medium \\\\
    { id: "hatch-3", angle: 45,  spacing: 3, sw: 1.0 },   // dense  \\\\
    { id: "hatch-4", angle: -45, spacing: 4, sw: 1.2 },   // medium ////
    { id: "hatch-5", angle: 0,   spacing: 4, sw: 1.0 },   // horizontal lines
    { id: "hatch-6", angle: 90,  spacing: 4, sw: 1.0 },   // vertical lines
  ];
  return (
    <defs>
      {hatches.map(h => (
        <pattern key={h.id} id={`${idPrefix}${h.id}`} patternUnits="userSpaceOnUse" width={h.spacing * 2} height={h.spacing * 2} patternTransform={`rotate(${h.angle})`}>
          <rect width={h.spacing * 2} height={h.spacing * 2} fill="white" />
          <line x1="0" y1="0" x2="0" y2={h.spacing * 2} stroke="black" strokeWidth={h.sw} />
        </pattern>
      ))}
      <pattern id={`${idPrefix}dot-1`} patternUnits="userSpaceOnUse" width="6" height="6">
        <rect width="6" height="6" fill="white" />
        <circle cx="3" cy="3" r="1" fill="black" />
      </pattern>
    </defs>
  );
}

window.HatchDefs = HatchDefs;

// ═══════════════════════════════════════════════════════════════════════
// Exhibit — formal figure wrapper
// ═══════════════════════════════════════════════════════════════════════
//
// Header anatomy (top → bottom):
//   FIGURE 4.07 · TXDOT MOBILITY REPORT 2025  ← exhibit number + collection
//   Average corridor delay by hour of day      ← title (display font)
//   ─────────────────────────                  ← signature rule (style-aware)
//   [chart body]
//   FIG-CAP — figure caption                   ← long-form description
//   Source · TTI Urban Mobility Report 2024.   ← formal source line
//   Notes · Whiskers show 95% CI...            ← methodology notes
//   doi:10.5555/abcd · CC BY 4.0               ← citation footer

function Exhibit({
  number,            // "Figure 4.07" — exhibit number
  collection,        // "TxDOT Mobility Report 2025" — what publication this exhibit belongs to
  title,             // chart title
  caption,           // figure caption — descriptive sentence
  source,            // "TTI Urban Mobility Report · 2024"
  notes,             // methodology / definitional notes
  doi,               // "10.5555/abcd"
  license,           // "CC BY 4.0"
  tone = "default",
  children,
  width,
  signature = "rule", // "rule" | "stack" | "hash" | "none"
}) {
  const t = TONE_TOKENS[tone] || TONE_TOKENS.default;

  const eyebrowStyle = {
    fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "0.16em", color: t.textMuted, fontFamily: "var(--font-body-bold)",
    marginBottom: 6, fontVariantNumeric: "tabular-nums",
  };

  const sigEl = signature === "none" ? null : (
    <div aria-hidden="true" style={{ marginBottom: 14, marginTop: 2 }}>
      {signature === "rule" && (
        <div style={{ height: 2, background: `linear-gradient(90deg, ${t.sigStart} 0%, ${t.sigStart} 32%, transparent 32%)` }} />
      )}
      {signature === "stack" && (
        <div style={{ display: "flex", gap: 4 }}>
          <div style={{ height: 6, width: "55%", background: t.sigStart, opacity: 1 }} />
          <div style={{ height: 6, width: "16%", background: t.sigStart, opacity: 0.55 }} />
          <div style={{ height: 6, width: "8%",  background: t.sigStart, opacity: 0.28 }} />
        </div>
      )}
      {signature === "hash" && (
        <div style={{
          height: 6,
          backgroundImage: `repeating-linear-gradient(135deg, ${t.sigStart} 0 1.5px, transparent 1.5px 4.5px)`,
          maskImage: "linear-gradient(90deg, currentColor, currentColor 35%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, currentColor, currentColor 35%, transparent)",
        }} />
      )}
    </div>
  );

  return (
    <div style={{
      background: t.bg,
      border: `1px solid ${t.border}`,
      borderRadius: t.isPrint ? 0 : "var(--radius-md)",
      padding: "26px 28px 22px",
      color: t.text,
      maxWidth: width,
      fontFamily: t.isPrint ? "Georgia, serif" : undefined,
    }}>
      {(number || collection) && (
        <div style={eyebrowStyle}>
          {number && <span style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>{number}</span>}
          {number && collection && <span style={{ opacity: 0.55, margin: "0 8px" }}>·</span>}
          {collection && <span>{collection}</span>}
        </div>
      )}
      {title && (
        <div style={{
          fontFamily: t.isPrint ? "Georgia, serif" : "var(--font-display)",
          fontSize: "1.18rem",
          fontWeight: t.isPrint ? 700 : 500,
          fontStyle: t.isPrint ? "normal" : undefined,
          textTransform: t.isPrint ? "none" : "uppercase",
          letterSpacing: t.isPrint ? "0" : "0.01em",
          color: t.text,
          marginBottom: 4,
          lineHeight: 1.25,
        }}>
          {title}
        </div>
      )}
      {sigEl}

      {/* chart body */}
      <div style={{ color: t.text }}>
        {children}
      </div>

      {/* footer block */}
      {(caption || source || notes || doi || license) && (
        <div style={{
          marginTop: 18,
          paddingTop: 14,
          borderTop: `1px solid ${t.border}`,
          fontSize: "0.74rem",
          lineHeight: 1.55,
          color: t.textSecondary,
          fontVariantNumeric: "tabular-nums",
        }}>
          {caption && (
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.14em", color: t.textMuted, marginRight: 8 }}>{number ? number.replace(/figure /i, "Fig. ") : "Caption"}</span>
              {caption}
            </div>
          )}
          {source && (
            <div style={{ marginBottom: notes ? 6 : 0 }}>
              <span style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.14em", color: t.textMuted, marginRight: 8 }}>Source</span>
              {source}
            </div>
          )}
          {notes && (
            <div style={{ marginBottom: (doi || license) ? 8 : 0 }}>
              <span style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.14em", color: t.textMuted, marginRight: 8 }}>Notes</span>
              {notes}
            </div>
          )}
          {(doi || license) && (
            <div style={{ display: "flex", gap: 14, fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: t.textMuted, marginTop: 4 }}>
              {doi && <span>doi:{doi}</span>}
              {license && <span>· {license}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CompareGoodBad — do/don't side-by-side
// ═══════════════════════════════════════════════════════════════════════

function CompareGoodBad({ goodTitle, goodWhy, badTitle, badWhy, good, bad }) {
  const labelStyle = (variant) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: "0.66rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    fontFamily: "var(--font-body-bold)",
    padding: "5px 10px",
    background: variant === "good" ? "color-mix(in srgb, #2F7D4F 14%, transparent)" : "color-mix(in srgb, #B0382F 14%, transparent)",
    color: variant === "good" ? "#2F7D4F" : "#B0382F",
    borderRadius: 1,
    marginBottom: 10,
  });

  const dotStyle = (variant) => ({
    width: 8, height: 8, borderRadius: "50%",
    background: variant === "good" ? "#2F7D4F" : "#B0382F",
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
      <div>
        <div style={labelStyle("good")}>
          <span style={dotStyle("good")} />
          Do · {goodTitle}
        </div>
        <div style={{ background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", padding: "20px" }}>
          {good}
        </div>
        {goodWhy && <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 10, lineHeight: 1.55 }}>{goodWhy}</div>}
      </div>
      <div>
        <div style={labelStyle("bad")}>
          <span style={dotStyle("bad")} />
          Don't · {badTitle}
        </div>
        <div style={{ background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", padding: "20px", position: "relative" }}>
          <div style={{ position: "absolute", top: 8, right: 8, fontSize: "0.6rem", fontWeight: 700, color: "#B0382F", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "var(--font-body-bold)" }}>✕ avoid</div>
          {bad}
        </div>
        {badWhy && <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 10, lineHeight: 1.55 }}>{badWhy}</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ChartLegend2 — tone-aware
// ═══════════════════════════════════════════════════════════════════════

function ChartLegend2({ items, tone = "default" }) {
  const t = TONE_TOKENS[tone] || TONE_TOKENS.default;
  return (
    <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 14 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "0.74rem", color: t.textSecondary, fontFamily: "var(--font-body-bold)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {it.shape === "line" ? (
            <span style={{ width: 18, height: 2, background: it.color, flexShrink: 0, position: "relative" }}>
              {it.dashed && <span style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(90deg, ${it.color} 0 4px, transparent 4px 7px)` }} />}
            </span>
          ) : (
            <span style={{ width: 12, height: 12, background: it.color, flexShrink: 0, borderRadius: 1, ...(it.pattern ? { backgroundImage: `url(#${it.pattern})` } : {}) }} />
          )}
          <span>{it.label}</span>
          {it.value != null && <span style={{ fontFamily: "var(--font-mono)", color: t.text, fontVariantNumeric: "tabular-nums", marginLeft: 4 }}>{it.value}</span>}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// AnnotationDot — circled-letter marker
// ═══════════════════════════════════════════════════════════════════════

function AnnotationDot({ letter, x, y, color = "var(--brand-primary)", radius = 9 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={radius} fill={color} stroke="white" strokeWidth="1.5" />
      <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="10" fontWeight="700" fontFamily="var(--font-body-bold)">{letter}</text>
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════════

Object.assign(window, {
  Exhibit,
  CompareGoodBad,
  ChartLegend2,
  AnnotationDot,
  HatchDefs,
});
