/*
 * AggieChartsExpand1.jsx — Treemap, Sunburst, Waterfall
 *
 * Helper prefix: EX1.
 */

// ─── Local helpers ───────────────────────────────────────────────────

function EX1SectionLabel({ children }) {
  return <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 14, marginTop: 28 }}>{children}</div>;
}

function EX1Intro({ children }) {
  return <div style={{ background: "var(--surface-raised)", borderLeft: "3px solid var(--brand-primary)", padding: "16px 20px", marginBottom: 30, fontSize: "0.92rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>{children}</div>;
}

function EX1Box({ label, dark, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      {label && <div style={{ fontSize: "0.66rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>{label}</div>}
      <div style={{ background: dark ? "#0E1216" : "var(--surface-base)", border: "1px solid var(--surface-border)", padding: 24, borderRadius: "var(--radius-md)" }}>{children}</div>
    </div>
  );
}

function EX1Spec({ label, value, note }) {
  return (
    <div style={{ padding: "16px 18px", borderRight: "1px solid var(--surface-border)" }}>
      <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: "0.82rem", fontFamily: "var(--font-body-bold)", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{value}</div>
      {note && <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.45 }}>{note}</div>}
    </div>
  );
}

function EX1SpecRow({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-raised)" }}>{children}</div>;
}

// ═══════════════════════════════════════════════════════════════════════
// TREEMAP — squarified-ish (slice-and-dice with split heuristic)
// ═══════════════════════════════════════════════════════════════════════
//
// Simple slice-and-dice algorithm: alternate horizontal/vertical splits
// proportional to subtree value. Adequate for editorial-scale treemaps
// (≤ 20 leaves). For larger we'd switch to squarified.

function layoutTreemap(items, x, y, w, h, vertical) {
  const total = items.reduce((s, it) => s + it.value, 0);
  let cursor = vertical ? y : x;
  const rects = [];
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const frac = it.value / total;
    if (vertical) {
      const ih = h * frac;
      rects.push({ ...it, x, y: cursor, w, h: ih });
      cursor += ih;
    } else {
      const iw = w * frac;
      rects.push({ ...it, x: cursor, y, w: iw, h });
      cursor += iw;
    }
  }
  return rects;
}

function TreemapChart({ data, width = 720, height = 360, tone = "default", showSubdivisions = true }) {
  const t = window.useToneTokens(tone);
  const palette = tone === "dark"
    ? ["#A14A3D", "#3F5A6F", "#6F8294", "#A78444", "#5C7A55", "#7C5566", "#8B6F3D", "#5F5F5F"]
    : ["var(--brand-primary)", "#3F5A6F", "#A78444", "#5C7A55", "#7C5566", "#8B6F3D", "#9C8C7A", "#5F5F5F"];

  // Layer 1 — split top-level groups by total value, alternating
  // direction by index (slice & dice).
  const totals = data.map(d => ({ ...d, value: d.children.reduce((s, c) => s + c.value, 0) }));
  const topRects = layoutTreemap(totals, 0, 0, width, height, false); // horizontal split first

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ display: "block" }}>
        {topRects.map((r, i) => {
          const childRects = showSubdivisions ? layoutTreemap(r.children, r.x, r.y, r.w, r.h, true) : [];
          const fill = palette[i % palette.length];
          return (
            <g key={i}>
              {/* Group fill (will be overdrawn by children if subdivisions) */}
              <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={fill} stroke={t.bg} strokeWidth="2" />
              {showSubdivisions && childRects.map((c, ci) => (
                <g key={ci}>
                  <rect x={c.x + 0.5} y={c.y + 0.5} width={c.w - 1} height={c.h - 1} fill={fill} fillOpacity={0.55 + (ci / childRects.length) * 0.45} stroke={t.bg} strokeWidth="1" />
                  {c.w > 80 && c.h > 28 && (
                    <>
                      <text x={c.x + 8} y={c.y + 16} fontSize="10" fill={tone === "dark" ? "#F4F1EC" : "#fff"} fontFamily="var(--font-body-bold)" fontWeight="600">{c.label}</text>
                      {c.h > 42 && <text x={c.x + 8} y={c.y + 30} fontSize="11" fill={tone === "dark" ? "#F4F1EC" : "#fff"} fontFamily="var(--font-mono)" fontVariantNumeric="tabular-nums">${c.value}M</text>}
                    </>
                  )}
                </g>
              ))}
              {/* Group label — bottom-left of group */}
              {r.w > 90 && (
                <g>
                  <text x={r.x + 8} y={r.y + r.h - 16} fontSize="9" fill="rgba(255,255,255,0.85)" fontFamily="var(--font-body-bold)" textTransform="uppercase" letterSpacing="0.1em" fontWeight="700">{r.label.toUpperCase()}</text>
                  <text x={r.x + 8} y={r.y + r.h - 4} fontSize="11" fill="rgba(255,255,255,0.95)" fontFamily="var(--font-mono)" fontVariantNumeric="tabular-nums" fontWeight="600">${r.value}M</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SUNBURST — radial hierarchical
// ═══════════════════════════════════════════════════════════════════════
//
// 2-ring sunburst: inner ring = top-level groups, outer ring = children.
// Each arc's angular extent ∝ value share.

function arcPath(cx, cy, rIn, rOut, a0, a1) {
  const x0o = cx + rOut * Math.cos(a0);
  const y0o = cy + rOut * Math.sin(a0);
  const x1o = cx + rOut * Math.cos(a1);
  const y1o = cy + rOut * Math.sin(a1);
  const x0i = cx + rIn * Math.cos(a0);
  const y0i = cy + rIn * Math.sin(a0);
  const x1i = cx + rIn * Math.cos(a1);
  const y1i = cy + rIn * Math.sin(a1);
  const large = (a1 - a0) > Math.PI ? 1 : 0;
  return `M ${x0o} ${y0o} A ${rOut} ${rOut} 0 ${large} 1 ${x1o} ${y1o} L ${x1i} ${y1i} A ${rIn} ${rIn} 0 ${large} 0 ${x0i} ${y0i} Z`;
}

function SunburstChart({ data, size = 320, tone = "default" }) {
  const t = window.useToneTokens(tone);
  const palette = tone === "dark"
    ? ["#A14A3D", "#3F5A6F", "#A78444", "#5C7A55", "#7C5566", "#8B6F3D"]
    : ["var(--brand-primary)", "#3F5A6F", "#A78444", "#5C7A55", "#7C5566", "#8B6F3D"];

  const cx = size / 2;
  const cy = size / 2;
  const rIn = size * 0.18;
  const rMid = size * 0.32;
  const rOut = size * 0.49;

  const total = data.reduce((s, d) => s + d.children.reduce((cs, c) => cs + c.value, 0), 0);

  let theta = -Math.PI / 2; // start at top (12 o'clock)
  const groupArcs = [];
  const childArcs = [];

  data.forEach((g, gi) => {
    const groupTotal = g.children.reduce((s, c) => s + c.value, 0);
    const groupExtent = (groupTotal / total) * Math.PI * 2;
    const groupStart = theta;
    const groupEnd = theta + groupExtent;
    groupArcs.push({ start: groupStart, end: groupEnd, color: palette[gi % palette.length], label: g.label, value: groupTotal, share: groupTotal / total });
    let inner = groupStart;
    g.children.forEach((c, ci) => {
      const ext = (c.value / total) * Math.PI * 2;
      childArcs.push({
        start: inner,
        end: inner + ext,
        color: palette[gi % palette.length],
        opacity: 0.4 + (ci / g.children.length) * 0.5,
        label: c.label,
        value: c.value,
        share: c.value / total,
      });
      inner += ext;
    });
    theta = groupEnd;
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: `${size}px 1fr`, gap: 32, alignItems: "center" }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        {/* Outer ring */}
        {childArcs.map((a, i) => (
          <path key={`c-${i}`} d={arcPath(cx, cy, rMid, rOut, a.start, a.end)} fill={a.color} fillOpacity={a.opacity} stroke={t.bg} strokeWidth="1" />
        ))}
        {/* Inner ring */}
        {groupArcs.map((a, i) => (
          <path key={`g-${i}`} d={arcPath(cx, cy, rIn, rMid, a.start, a.end)} fill={a.color} stroke={t.bg} strokeWidth="1.5" />
        ))}
        {/* Center label */}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="9" fill={t.textMuted} fontFamily="var(--font-body-bold)" letterSpacing="0.1em">TOTAL</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="14" fill={t.text} fontFamily="var(--font-mono)" fontVariantNumeric="tabular-nums" fontWeight="700">${total}M</text>
      </svg>

      {/* Legend at right */}
      <div>
        {data.map((g, gi) => {
          const groupTotal = g.children.reduce((s, c) => s + c.value, 0);
          const share = (groupTotal / total) * 100;
          return (
            <div key={gi} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ width: 12, height: 12, background: palette[gi % palette.length], borderRadius: 1, flexShrink: 0 }} />
                <span style={{ fontSize: "0.78rem", fontFamily: "var(--font-body-bold)", fontWeight: 600, color: t.text, textTransform: "uppercase", letterSpacing: "0.06em" }}>{g.label}</span>
                <span style={{ fontSize: "0.74rem", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", color: t.textMuted, marginLeft: "auto" }}>${groupTotal}M · {share.toFixed(0)}%</span>
              </div>
              <div style={{ paddingLeft: 20, fontSize: "0.74rem", color: t.textSecondary, lineHeight: 1.7 }}>
                {g.children.map((c, ci) => (
                  <div key={ci} style={{ display: "flex", justifyContent: "space-between", borderBottom: ci < g.children.length - 1 ? `1px dashed ${t.grid}` : "none", padding: "3px 0" }}>
                    <span>{c.label}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", color: t.textMuted }}>${c.value}M</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// WATERFALL — contribution analysis
// ═══════════════════════════════════════════════════════════════════════
//
// Steps: { label, value, type } where type ∈ "start" | "delta" | "end" | "subtotal"
// Bars connect with thin connector lines.

function WaterfallChart({ steps, height = 280, tone = "default", valueFormat = (v) => `$${v.toLocaleString()}` }) {
  const t = window.useToneTokens(tone);
  const colorPos = tone === "dark" ? "#5C9F7A" : "#2F7D4F";
  const colorNeg = tone === "dark" ? "#D86F61" : "#B0382F";
  const colorBase = tone === "dark" ? "#A14A3D" : "var(--brand-primary)";
  const colorSubtotal = tone === "dark" ? "#6F8294" : "#3F5A6F";

  // Compute running balance + bar tops
  let running = 0;
  const computed = steps.map(s => {
    if (s.type === "start" || s.type === "end" || s.type === "subtotal") {
      const before = running;
      running = s.value;
      return { ...s, top: s.value, bottom: 0, before };
    } else {
      const before = running;
      running = before + s.value;
      return { ...s, top: Math.max(before, running), bottom: Math.min(before, running), before };
    }
  });

  const max = Math.max(...computed.map(c => c.top));
  const min = Math.min(0, ...computed.map(c => c.bottom));
  const range = max - min;
  const padTop = 32;
  const padBot = 50;
  const chartH = height - padTop - padBot;
  const W = 720;
  const padL = 20;
  const padR = 20;
  const stepW = (W - padL - padR) / steps.length;
  const barW = stepW * 0.6;

  const yFor = (v) => padTop + chartH * (1 - (v - min) / range);

  return (
    <svg viewBox={`0 0 ${W} ${height}`} width="100%" height={height} style={{ display: "block" }}>
      {/* Gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
        const v = min + range * p;
        const y = yFor(v);
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke={t.grid} strokeWidth={Math.abs(v) < 0.0001 ? 1.2 : 0.8} strokeDasharray={Math.abs(v) < 0.0001 ? "0" : "2 3"} />
            <text x={padL - 4} y={y + 3} textAnchor="end" fontSize="9" fill={t.textMuted} fontFamily="var(--font-mono)" fontVariantNumeric="tabular-nums">{valueFormat(Math.round(v))}</text>
          </g>
        );
      })}

      {/* Bars + connectors */}
      {computed.map((c, i) => {
        const cx = padL + stepW * (i + 0.5);
        const xLeft = cx - barW / 2;

        let fill;
        if (c.type === "start" || c.type === "end") fill = colorBase;
        else if (c.type === "subtotal") fill = colorSubtotal;
        else fill = c.value >= 0 ? colorPos : colorNeg;

        const yTop = yFor(c.top);
        const yBot = yFor(c.bottom);
        const h = yBot - yTop;

        // Connector to next bar (running value at end of this step → start of next)
        const next = computed[i + 1];
        const connector = next ? (
          <line
            x1={xLeft + barW}
            y1={yFor(running !== c.value && (c.type === "start" || c.type === "subtotal" || c.type === "end") ? c.value : (c.value >= 0 ? c.top : c.bottom))}
            x2={padL + stepW * (i + 1 + 0.5) - barW / 2}
            y2={yFor(running !== c.value && (c.type === "start" || c.type === "subtotal" || c.type === "end") ? c.value : (c.value >= 0 ? c.top : c.bottom))}
            stroke={t.textMuted}
            strokeWidth="0.8"
            strokeDasharray="3 3"
            opacity="0.5"
          />
        ) : null;

        // Compute end-of-bar y (the running balance at this point)
        const balance = (c.type === "start" || c.type === "end" || c.type === "subtotal") ? c.value : c.before + c.value;
        const yEndOfBar = yFor(balance);

        return (
          <g key={i}>
            {next && (
              <line
                x1={xLeft + barW}
                y1={yEndOfBar}
                x2={padL + stepW * (i + 1 + 0.5) - barW / 2}
                y2={yEndOfBar}
                stroke={t.textMuted}
                strokeWidth="0.8"
                strokeDasharray="3 3"
                opacity="0.5"
              />
            )}
            <rect x={xLeft} y={yTop} width={barW} height={h} fill={fill} />
            {/* Value label above bar */}
            <text x={cx} y={yTop - 6} textAnchor="middle" fontSize="10" fill={t.text} fontFamily="var(--font-mono)" fontVariantNumeric="tabular-nums" fontWeight="600">
              {c.type === "delta" ? (c.value >= 0 ? "+" : "") : ""}{valueFormat(c.value)}
            </text>
            {/* Category label below */}
            <text x={cx} y={height - 32} textAnchor="middle" fontSize="9" fill={t.textMuted} fontFamily="var(--font-body-bold)" letterSpacing="0.06em">{c.label.toUpperCase()}</text>
            {(c.type === "start" || c.type === "end" || c.type === "subtotal") && (
              <text x={cx} y={height - 18} textAnchor="middle" fontSize="8" fill={t.textMuted} fontFamily="var(--font-body-bold)" letterSpacing="0.1em">{c.type.toUpperCase()}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PAGE — chart-hierarchy (treemap + sunburst)
// ═══════════════════════════════════════════════════════════════════════

function ChartHierarchyPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "chart-hierarchy");

  // Sample: TTI program-area budget ($M)
  const programs = [
    { label: "Mobility", children: [
      { label: "Urban congestion", value: 18 },
      { label: "Freight & logistics", value: 12 },
      { label: "Rural mobility", value: 6 },
    ]},
    { label: "Safety", children: [
      { label: "Behavioral research", value: 9 },
      { label: "Roadway design", value: 8 },
      { label: "Crash analytics", value: 5 },
    ]},
    { label: "Infrastructure", children: [
      { label: "Pavement", value: 11 },
      { label: "Bridge structures", value: 7 },
    ]},
    { label: "Workforce", children: [
      { label: "Training & cert", value: 4 },
      { label: "Outreach", value: 3 },
    ]},
    { label: "Policy", children: [
      { label: "Federal grants", value: 5 },
      { label: "State coord", value: 2 },
    ]},
  ];

  return (
    <PageShell item={item}>
      <EX1Intro>
        <strong>Treemap</strong> for budget breakdowns and resource allocation — the eye reads area as quantity. <strong>Sunburst</strong> for the same data when the audience needs to feel the radial structure of a program. Both work well as one-page proposal exhibits where the question is "where does the money go." <strong>Don't use either for ranked lists</strong> — bars are far easier to read.
      </EX1Intro>

      <EX1SectionLabel>Treemap — slice and dice</EX1SectionLabel>
      <EX1Box label="Top-level groups split horizontally; sub-areas stack within each group">
        <Exhibit
          number="Exhibit 6.02"
          title="TTI program area budget allocation, FY 2026"
          source="TTI Operating Plan · 2026"
          notes="Budget in $M. Sub-areas shown for groups ≥ $10M; smaller groups rolled to a single fill."
          tone="default"
        >
          <TreemapChart data={programs} width={720} height={360} tone="default" />
        </Exhibit>
      </EX1Box>

      <EX1Box label="On dark — same chart for slide-deck use" dark>
        <Exhibit
          number="Slide 8"
          title="Where FY26 funds go"
          source="TTI Operating Plan · 2026"
          tone="dark"
        >
          <TreemapChart data={programs} width={720} height={320} tone="dark" />
        </Exhibit>
      </EX1Box>

      <EX1SectionLabel>Sunburst — radial</EX1SectionLabel>
      <EX1Box label="Inner ring = program areas; outer ring = sub-areas; legend at right shows the full hierarchy">
        <Exhibit
          number="Exhibit 6.03"
          title="TTI program area structure, FY 2026"
          source="TTI Operating Plan · 2026"
          notes="Identical data as Exhibit 6.02 — radial encoding emphasizes proportional structure rather than absolute value."
          tone="default"
        >
          <SunburstChart data={programs} size={320} tone="default" />
        </Exhibit>
      </EX1Box>

      <EX1SectionLabel>Don't do this</EX1SectionLabel>
      <CompareGoodBad
        goodTitle="Use a treemap when the question is 'how does the total split?'"
        goodWhy="Areas are proportional to value; viewer can compare slices at a glance and read the top three categories without effort."
        badTitle="Treemap with depth > 2 levels"
        badWhy="Tiny tiles below ~3% of the total become unreadable. Switch to a sortable table or roll smaller categories into 'Other'."
        good={<TreemapChart data={programs} width={400} height={220} tone="default" />}
        bad={
          <svg viewBox="0 0 400 220" width="100%" height="220" style={{ display: "block" }}>
            {/* Way too many tiny tiles */}
            {Array.from({ length: 28 }, (_, i) => {
              const cols = 7;
              const w = 400 / cols;
              const h = 220 / 4;
              const x = (i % cols) * w;
              const y = Math.floor(i / cols) * h;
              const palette = ["var(--brand-primary)", "#3F5A6F", "#A78444", "#5C7A55"];
              return (
                <g key={i}>
                  <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={h - 1} fill={palette[Math.floor(i / cols)]} fillOpacity={0.3 + ((i % 7) / 14)} stroke="white" strokeWidth="1" />
                  <text x={x + 4} y={y + 12} fontSize="7" fill="rgba(255,255,255,0.7)" fontFamily="var(--font-mono)">{i < 9 ? `Item ${i+1}` : ""}</text>
                </g>
              );
            })}
          </svg>
        }
      />

      <EX1SectionLabel>Spec</EX1SectionLabel>
      <EX1SpecRow>
        <EX1Spec label="Layout" value="slice-and-dice" note="alternates horizontal/vertical splits; sufficient for ≤ 20 leaves" />
        <EX1Spec label="Min tile size" value="3% of total" note="below this, roll into an 'Other' tile" />
        <EX1Spec label="Sunburst rings" value="2 max" note="3+ rings get unreadable; switch to a tree diagram if you have deeper hierarchy" />
        <EX1Spec label="Labels" value="≥ 80×28 px" note="tiles below this size get no label; rely on legend or tooltip" />
      </EX1SpecRow>
    </PageShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PAGE — chart-waterfall
// ═══════════════════════════════════════════════════════════════════════

function ChartWaterfallPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "chart-waterfall");

  // Sample: FY24 → FY25 budget reconciliation
  const fyReconciliation = [
    { label: "FY24 Base",        value: 47.2, type: "start" },
    { label: "Federal grants",   value: 8.4,  type: "delta" },
    { label: "State approps",    value: 2.1,  type: "delta" },
    { label: "Industry support", value: 1.8,  type: "delta" },
    { label: "Workforce attr.",  value: -3.2, type: "delta" },
    { label: "Equip. depr.",     value: -1.5, type: "delta" },
    { label: "FY25 Total",       value: 54.8, type: "end" },
  ];

  // Sample: project budget contribution analysis
  const projectContribution = [
    { label: "Awarded",          value: 1250, type: "start" },
    { label: "Personnel",        value: -540, type: "delta" },
    { label: "Travel & equip.",  value: -180, type: "delta" },
    { label: "Subcontracts",     value: -290, type: "delta" },
    { label: "Subtotal",         value: 240,  type: "subtotal" },
    { label: "Overhead",         value: -180, type: "delta" },
    { label: "Net to org.",      value: 60,   type: "end" },
  ];

  return (
    <PageShell item={item}>
      <EX1Intro>
        Waterfall charts show <strong>how a starting value becomes an ending value</strong> through a series of positive and negative steps. Use them for budget reconciliation, contribution-margin analysis, and any narrative where the audience needs to follow a chain of increments. The first and last bars are tied to the y-axis; intermediate bars float at their running balance.
      </EX1Intro>

      <EX1SectionLabel>Standard waterfall — budget reconciliation</EX1SectionLabel>
      <EX1Box label="FY base + 3 positive deltas, 2 negative, FY total. Connector lines show running balance.">
        <Exhibit
          number="Exhibit 7.01"
          title="FY24 to FY25 operating budget reconciliation"
          source="TTI Annual Report · 2025"
          notes="Values in $M. Connector dashes show running balance. Workforce attrition reflects mid-year departures from the Mobility Division."
          tone="default"
        >
          <WaterfallChart steps={fyReconciliation} height={300} tone="default" valueFormat={(v) => `$${v.toFixed(1)}M`} />
        </Exhibit>
      </EX1Box>

      <EX1SectionLabel>Waterfall with subtotal — multi-stage analysis</EX1SectionLabel>
      <EX1Box label="A subtotal pin in the middle lets you separate direct costs from overhead — useful for project cost breakdowns.">
        <Exhibit
          number="Exhibit 7.02"
          title="Awarded contract → net contribution: typical large research project"
          source="TTI Project Accounting · 2025"
          notes="Values in $K (thousands). Subtotal at midpoint represents direct contribution before overhead allocation."
          tone="default"
        >
          <WaterfallChart steps={projectContribution} height={300} tone="default" valueFormat={(v) => `$${v.toLocaleString()}K`} />
        </Exhibit>
      </EX1Box>

      <EX1SectionLabel>On dark</EX1SectionLabel>
      <EX1Box dark label="For slide decks. Positive deltas in green, negative in salmon — both warmed for projection.">
        <Exhibit
          number="Slide 11"
          title="Where the budget went"
          tone="dark"
          source="TTI Annual Report · 2025"
        >
          <WaterfallChart steps={fyReconciliation} height={280} tone="dark" valueFormat={(v) => `$${v.toFixed(1)}M`} />
        </Exhibit>
      </EX1Box>

      <EX1SectionLabel>Don't do this</EX1SectionLabel>
      <CompareGoodBad
        goodTitle="Pin the start and end to zero; float the middle"
        goodWhy="The reader's eye follows the running balance via the connector dashes. Start and end on the baseline anchor the chart's narrative."
        badTitle="All bars from baseline (a regular bar chart)"
        badWhy="Loses the contribution narrative. The audience can't tell which bars represent additions vs subtractions, or what the running balance is at any point."
        good={<WaterfallChart steps={fyReconciliation.slice(0, 5)} height={180} tone="default" valueFormat={(v) => `$${v.toFixed(0)}M`} />}
        bad={
          <svg viewBox="0 0 400 180" width="100%" height="180">
            {fyReconciliation.slice(0, 5).map((s, i) => {
              const x = 30 + i * 70;
              const v = Math.abs(s.value);
              const h = (v / 50) * 130;
              const fill = s.value >= 0 ? "var(--brand-primary)" : "#3F5A6F";
              return (
                <g key={i}>
                  <rect x={x} y={170 - h} width={40} height={h} fill={fill} />
                  <text x={x + 20} y={175} textAnchor="middle" fontSize="8" fill="var(--text-muted)" fontFamily="var(--font-body-bold)">{s.label.split(" ")[0].toUpperCase()}</text>
                </g>
              );
            })}
            <line x1="20" y1="170" x2="380" y2="170" stroke="var(--text-muted)" strokeWidth="1" />
          </svg>
        }
      />

      <EX1SectionLabel>Spec</EX1SectionLabel>
      <EX1SpecRow>
        <EX1Spec label="Bar types" value="start · delta · subtotal · end" note="start and end pin to baseline; deltas float; subtotal pins to running total" />
        <EX1Spec label="Color" value="positive green / negative red" note="dimmer than primary maroon — the chart's emphasis is on direction, not category" />
        <EX1Spec label="Connectors" value="dashed 0.8px" note="from end of bar N to start of bar N+1, at the running balance height" />
        <EX1Spec label="Step count" value="5 to 12 max" note="more than 12 → split into multiple charts or roll smaller deltas together" />
      </EX1SpecRow>
    </PageShell>
  );
}

window.ChartHierarchyPage = ChartHierarchyPage;
window.ChartWaterfallPage = ChartWaterfallPage;
window.TreemapChart = TreemapChart;
window.SunburstChart = SunburstChart;
window.WaterfallChart = WaterfallChart;
