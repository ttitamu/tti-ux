/* global React, PageShell, AGGIE_CATALOG, LucideIcon,
   CHART_PALETTE, CH_TYPE, CHIntro, CHSectionLabel, CHBox, CHSpecRow, CHSpec,
   ChartFrame, Legend */
/*
 * AggieChartsViz.jsx — Batch 22 part 2:
 *   Scatter & bubble · Trend strips · Stat comparison
 *
 * Builds on tokens and helpers from AggieCharts.jsx.
 *
 * Helper prefix (local to this file, none needed — using shared CH* helpers).
 */

const { useState: _cvUseState } = React;

// ════════════════════════════════════════════════════════════════════════
// 1 — Scatter & bubble
// ════════════════════════════════════════════════════════════════════════

function ScatterChart({ data, xLabel, yLabel, xRange, yRange, height = 300, bubble = false, quadrants = false, xAvg, yAvg }) {
  const W = 640, padL = 56, padR = 16, padT = 22, padB = 38;
  const chartH = height - padT - padB;
  const chartW = W - padL - padR;
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;

  const xPos = (v) => padL + ((v - xMin) / (xMax - xMin)) * chartW;
  const yPos = (v) => padT + chartH - ((v - yMin) / (yMax - yMin)) * chartH;

  const sizeMax = bubble ? Math.max(...data.map(d => d.r || 1)) : 1;
  const radius = (d) => {
    if (!bubble) return 4.5;
    const minR = 5, maxR = 22;
    return minR + ((d.r || 1) / sizeMax) * (maxR - minR);
  };

  return (
    <svg viewBox={`0 0 ${W} ${height}`} width="100%" height={height} style={{ display: "block" }}>
      {/* Quadrant fills */}
      {quadrants && xAvg != null && yAvg != null && (
        <g>
          <rect x={padL} y={padT} width={xPos(xAvg) - padL} height={yPos(yAvg) - padT}
            fill={CHART_PALETTE[1]} opacity={0.04} />
          <rect x={xPos(xAvg)} y={yPos(yAvg)} width={(W - padR) - xPos(xAvg)} height={(padT + chartH) - yPos(yAvg)}
            fill={CHART_PALETTE[0]} opacity={0.04} />
        </g>
      )}
      {/* Y-gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
        const v = yMin + (yMax - yMin) * p;
        const y = yPos(v);
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="var(--surface-border)" strokeWidth={p === 0 ? 1 : 0.5} strokeDasharray={p === 0 ? "" : "2 4"} />
            <text x={padL - 8} y={y + 3} textAnchor="end" fill="var(--text-muted)" style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}>{Math.round(v)}</text>
          </g>
        );
      })}
      {/* X-gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
        const v = xMin + (xMax - xMin) * p;
        const x = xPos(v);
        return (
          <g key={i}>
            <line x1={x} y1={padT} x2={x} y2={padT + chartH} stroke="var(--surface-border)" strokeWidth={p === 0 ? 1 : 0.5} strokeDasharray={p === 0 ? "" : "2 4"} />
            <text x={x} y={height - 18} textAnchor="middle" fill="var(--text-muted)" style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}>{Math.round(v)}</text>
          </g>
        );
      })}
      {/* Quadrant divider lines */}
      {quadrants && xAvg != null && yAvg != null && (
        <g>
          <line x1={xPos(xAvg)} y1={padT} x2={xPos(xAvg)} y2={padT + chartH} stroke="var(--text-muted)" strokeWidth={1} strokeDasharray="4 3" opacity={0.5} />
          <line x1={padL} y1={yPos(yAvg)} x2={W - padR} y2={yPos(yAvg)} stroke="var(--text-muted)" strokeWidth={1} strokeDasharray="4 3" opacity={0.5} />
        </g>
      )}
      {/* Points */}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={xPos(d.x)} cy={yPos(d.y)} r={radius(d)} fill={d.color || CHART_PALETTE[0]} fillOpacity={bubble ? 0.55 : 0.85} stroke={d.color || CHART_PALETTE[0]} strokeWidth={1} />
          {d.label && bubble && radius(d) > 12 && (
            <text x={xPos(d.x)} y={yPos(d.y) + 3} textAnchor="middle" fill="#fff" style={{ fontSize: 9, fontFamily: "var(--font-body-bold)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{d.label}</text>
          )}
        </g>
      ))}
      {/* Axis titles */}
      <text x={padL + chartW / 2} y={height - 4} textAnchor="middle" fill="var(--text-muted)" style={{ fontSize: 10, fontFamily: "var(--font-body-bold)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
        {xLabel} →
      </text>
      <text x={14} y={padT + chartH / 2} textAnchor="middle" fill="var(--text-muted)" transform={`rotate(-90 14 ${padT + chartH / 2})`} style={{ fontSize: 10, fontFamily: "var(--font-body-bold)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
        ↑ {yLabel}
      </text>
    </svg>
  );
}

function ChartScatterPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "chart-scatter");

  // Density vs delay — 60 randomish points clustered
  const seed = (i) => {
    // Deterministic pseudo-random
    return (Math.sin(i * 12.9898) * 43758.5453) % 1;
  };
  const correlation = Array.from({ length: 60 }, (_, i) => {
    const x = 20 + (i % 12) * 6 + seed(i) * 5;
    const y = x * 0.9 + seed(i + 100) * 30 - 5;
    return { x: Math.max(15, Math.min(95, x)), y: Math.max(10, Math.min(110, y)) };
  });

  // Bubble — investment vs delay reduction, sized by lane-miles
  const corridors = [
    { label: "I-35",   x: 240, y: 18, r: 28 },
    { label: "I-45",   x: 180, y: 24, r: 22 },
    { label: "I-635",  x: 320, y: 31, r: 19 },
    { label: "US-290", x: 90,  y: 12, r: 14 },
    { label: "SH-130", x: 150, y: 8,  r: 9  },
    { label: "SH-71",  x: 60,  y: 5,  r: 7  },
    { label: "SH-99",  x: 410, y: 38, r: 31 },
    { label: "I-10",   x: 200, y: 21, r: 24 },
    { label: "US-59",  x: 130, y: 14, r: 17 },
  ].map((c, i) => ({ ...c, color: CHART_PALETTE[i % CHART_PALETTE.length] }));

  // Quadrant — speed reliability vs ridership
  const quadrant = [
    { label: "Houston METRORail",  x: 18, y: 42 },
    { label: "DART Light Rail",    x: 22, y: 52 },
    { label: "Austin CapMetro",    x: 28, y: 31 },
    { label: "VIA San Antonio",    x: 12, y: 19 },
    { label: "El Paso Sun Metro",  x: 9,  y: 12 },
    { label: "Brazos Transit",     x: 15, y: 11 },
    { label: "Fort Worth TRE",     x: 24, y: 25 },
    { label: "Trinity Metro",      x: 17, y: 28 },
    { label: "Corpus Christi RTA", x: 10, y: 9 },
    { label: "Hill Country MTA",   x: 6,  y: 7 },
  ].map((p) => ({ ...p, color: CHART_PALETTE[0] }));

  return (
    <PageShell item={item}>
      <CHIntro>
        Scatter plots are the right choice when you're showing <strong>correlation between two continuous variables</strong>. Bubble adds a third dimension by size — but never use it for the most-important encoding; people read X/Y position more accurately than radius. Quadrant overlays help when the chart is also a strategy framework.
      </CHIntro>

      <CHSectionLabel>Scatter — correlation between two metrics</CHSectionLabel>
      <CHBox label="60 corridor segments — density vs delay">
        <ChartFrame eyebrow="exhibit 5.03" title="Vehicle density vs peak-hour delay" source="TTI corridor segments dataset · 2024" footnote={<>Each point represents one urban-corridor segment. Density (vehicles per lane per mile) plotted against peak delay (seconds per vehicle).</>}>
          <ScatterChart data={correlation} xLabel="Density (veh/lane/mi)" yLabel="Delay (sec/veh)" xRange={[0, 100]} yRange={[0, 120]} />
        </ChartFrame>
      </CHBox>

      <CHSectionLabel>Bubble — three-dimensional encoding</CHSectionLabel>
      <CHBox label="bubble size encodes lane-miles invested">
        <ChartFrame eyebrow="exhibit 5.06" title="Corridor investment vs delay reduction" source="TTI Mobility Investment Priorities · 2025" footnote="Bubble area scales with lane-miles improved. Larger investments cluster upper-right; small projects in the lower-left starter zone.">
          <ScatterChart data={corridors} xLabel="Investment ($M)" yLabel="Delay reduction (%)" xRange={[0, 450]} yRange={[0, 50]} bubble height={320} />
        </ChartFrame>
      </CHBox>

      <CHSectionLabel>Quadrant overlay — strategy framework</CHSectionLabel>
      <CHBox label="dashed crosshair at the population mean">
        <ChartFrame eyebrow="exhibit 5.11" title="Texas transit agencies · reliability vs ridership" source="National Transit Database · 2023" footnote={<><strong>Upper-right:</strong> high ridership + high reliability — model agencies. <strong>Lower-left:</strong> emerging service areas. Dashed line shows population mean.</>}>
          <ScatterChart data={quadrant} xLabel="On-time performance (%)" yLabel="Annual riders (M)" xRange={[0, 32]} yRange={[0, 60]} quadrants xAvg={16} yAvg={23} height={320} />
        </ChartFrame>
      </CHBox>

      <CHSpecRow>
        <CHSpec label="point size"   value="4.5px scatter"   note="Bubble ranges 5–22px. Outliers stay distinguishable; clusters don't blob." />
        <CHSpec label="opacity"      value="55% bubble"      note="Half-transparent so overlapping bubbles hint at density. Plain scatter stays at 85% for crispness." />
        <CHSpec label="quadrants"    value="dashed cross"    note="Crosshair drawn at mean; quadrant fills tinted at 4% — barely visible but readable." />
        <CHSpec label="axis titles"  value="oriented arrows" note="X-axis title with → · Y-axis title with ↑ · Both uppercase Work Sans tracked at 0.14em." />
      </CHSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 2 — Trend strips (sparklines)
// ════════════════════════════════════════════════════════════════════════

function Sparkline({ points, color = CHART_PALETTE[0], width = 120, height = 32, area = true, dot = true }) {
  const max = Math.max(...points), min = Math.min(...points);
  const range = max - min || 1;
  const stepX = width / (points.length - 1);
  const yPos = (v) => height - 4 - ((v - min) / range) * (height - 8);
  const path = points.map((v, i) => `${i * stepX},${yPos(v)}`).join(" ");
  const last = points[points.length - 1];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} style={{ display: "block" }}>
      {area && <polygon points={`0,${height} ${path} ${width},${height}`} fill={color} opacity={0.15} />}
      <polyline points={path} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      {dot && <circle cx={width} cy={yPos(last)} r={2.5} fill={color} />}
    </svg>
  );
}

function KPIStrip({ eyebrow, label, value, unit, points, delta, deltaGood = "down", color = CHART_PALETTE[0] }) {
  // delta = signed number (e.g. -12.4)
  const isImprovement = (delta < 0 && deltaGood === "down") || (delta > 0 && deltaGood === "up");
  const tone = isImprovement ? "var(--color-success)" : "var(--color-danger)";
  const arrow = delta < 0 ? "arrow-down-right" : "arrow-up-right";

  return (
    <div style={{ padding: "20px 22px", borderRight: "1px solid var(--surface-border)", display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ ...CH_TYPE.axis }}>{eyebrow}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
        <div>
          <div style={{ ...CH_TYPE.numeral, fontSize: "1.85rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1 }}>
            {value}
            {unit && <span style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginLeft: 4 }}>{unit}</span>}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 4 }}>{label}</div>
        </div>
        <Sparkline points={points} color={color} width={88} height={28} />
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 4, color: tone, fontSize: "0.74rem", fontFamily: "var(--font-body-bold)", fontWeight: 700, marginTop: 4 }}>
        <LucideIcon name={arrow} size={13} />
        <span style={CH_TYPE.numeral}>{Math.abs(delta).toFixed(1)}%</span>
        <span style={{ color: "var(--text-muted)", fontWeight: 400, fontFamily: "var(--font-body)", marginLeft: 4 }}>vs. last quarter</span>
      </div>
    </div>
  );
}

function ChartTrendPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "chart-trend");

  const corridor1 = [62, 65, 68, 71, 75, 78, 81, 79, 76, 72, 68, 66];
  const ridership = [120, 124, 119, 128, 134, 142, 151, 156, 161, 168, 174, 181];
  const fatalities = [342, 338, 351, 346, 332, 327, 312, 305, 298, 289, 281, 273];
  const wfh = [7, 8, 9, 11, 14, 18, 22, 24, 22, 21, 22, 23];

  return (
    <PageShell item={item}>
      <CHIntro>
        Trend strips are <strong>chart-ettes</strong> — sparkline + KPI in a strip beside the bigger story. They show <em>direction</em> at a glance without competing for attention with the headline number. Use them in dashboards, executive summaries, and the top of every research report.
      </CHIntro>

      <CHSectionLabel>Inline sparkline — minimal trend cell</CHSectionLabel>
      <CHBox label="for tables, lists, and inline-text">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--surface-border)" }}>
              <th style={{ padding: "10px 8px", textAlign: "left", ...CH_TYPE.axis }}>Corridor</th>
              <th style={{ padding: "10px 8px", textAlign: "right", ...CH_TYPE.axis }}>Latest</th>
              <th style={{ padding: "10px 8px", textAlign: "left", ...CH_TYPE.axis }}>12-mo trend</th>
              <th style={{ padding: "10px 8px", textAlign: "right", ...CH_TYPE.axis }}>Δ YoY</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "I-35 (Austin)",   latest: "66s", points: corridor1, delta: "+5.4%", up: true },
              { name: "I-45 (Houston)",  latest: "62s", points: [58, 61, 63, 66, 70, 74, 76, 75, 73, 69, 65, 62], delta: "+6.7%", up: true },
              { name: "I-635 (Dallas)",  latest: "57s", points: [55, 57, 60, 62, 66, 70, 72, 71, 68, 64, 60, 57], delta: "+3.2%", up: true },
              { name: "US-290 (HOU)",    latest: "40s", points: [38, 40, 42, 45, 48, 51, 53, 52, 50, 47, 43, 40], delta: "+5.1%", up: true },
              { name: "SH-130 (Austin)", latest: "12s", points: [18, 17, 16, 15, 14, 14, 13, 13, 13, 12, 12, 12], delta: "−33.3%", up: false },
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: i === 4 ? "none" : "1px solid var(--surface-border)" }}>
                <td style={{ padding: "12px 8px", fontSize: "0.88rem", color: "var(--text-primary)" }}>{row.name}</td>
                <td style={{ padding: "12px 8px", textAlign: "right", ...CH_TYPE.numeral, fontSize: "0.88rem", fontWeight: 600 }}>{row.latest}</td>
                <td style={{ padding: "12px 8px" }}>
                  <Sparkline points={row.points} color={row.up ? CHART_PALETTE[0] : CHART_PALETTE[3]} />
                </td>
                <td style={{ padding: "12px 8px", textAlign: "right", ...CH_TYPE.numeral, fontSize: "0.86rem", fontWeight: 600, color: row.up ? "var(--color-danger)" : "var(--color-success)" }}>{row.delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CHBox>

      <CHSectionLabel>KPI strip — top-of-page summary row</CHSectionLabel>
      <CHBox label="four headline metrics for an executive summary">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-raised)" }}>
          <KPIStrip eyebrow="Q4 · 2024" label="Avg corridor delay (sec/veh)" value="68.4" points={corridor1} delta={5.4} deltaGood="down" color={CHART_PALETTE[0]} />
          <KPIStrip eyebrow="Q4 · 2024" label="Statewide transit ridership (M)" value="181" points={ridership} delta={4.2} deltaGood="up" color={CHART_PALETTE[3]} />
          <KPIStrip eyebrow="2024 YTD" label="Roadway fatalities (running 12-mo)" value="273" points={fatalities} delta={-8.1} deltaGood="down" color={CHART_PALETTE[1]} />
          <KPIStrip eyebrow="Q4 · 2024" label="Work-from-home share (%)" value="23" unit="%" points={wfh} delta={4.5} deltaGood="up" color={CHART_PALETTE[2]} />
        </div>
      </CHBox>

      <CHSectionLabel>Inline-text sparkline</CHSectionLabel>
      <CHBox label="run sparklines inline with prose for compact reports">
        <div style={{ fontSize: "0.95rem", lineHeight: 1.85, color: "var(--text-secondary)", maxWidth: 720 }}>
          Statewide vehicle-miles traveled climbed steadily through 2024
          <span style={{ display: "inline-block", verticalAlign: "middle", margin: "0 8px" }}>
            <Sparkline points={[3.2, 3.4, 3.6, 3.7, 3.9, 4.1, 4.3, 4.2, 4.0, 3.9, 3.7, 3.5]} width={84} height={20} dot={false} />
          </span>
          peaking in July before settling near 350M mi/day. By contrast, peak-hour delay on I-35
          <span style={{ display: "inline-block", verticalAlign: "middle", margin: "0 8px" }}>
            <Sparkline points={corridor1} width={84} height={20} dot={false} color={CHART_PALETTE[6]} />
          </span>
          continued its upward climb across the year — a sign of recovering travel demand without proportionate capacity gains.
        </div>
      </CHBox>

      <CHSpecRow>
        <CHSpec label="size"      value="120 × 32 default"  note="Inline-text variant: 84 × 20. Always sized to fit the surrounding line-height." />
        <CHSpec label="end dot"   value="2.5px"             note="Marks the latest data point. Omit when running inside body text to stay quiet." />
        <CHSpec label="area"      value="15% opacity"       note="Adds magnitude cue without competing with the headline number that sits beside the sparkline." />
        <CHSpec label="when"      value="direction over precision" note="Sparklines show shape, not values. Pair with a precise number; never replace the number." />
      </CHSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 3 — Stat comparison
// ════════════════════════════════════════════════════════════════════════

function StatBlock({ value, unit, label, supporting, accent = false, dim = false, size = "md" }) {
  const sizes = {
    md: { num: "3.4rem", lab: "0.74rem", sup: "0.78rem" },
    lg: { num: "5.2rem", lab: "0.78rem", sup: "0.82rem" },
  }[size];

  const numColor = accent ? "var(--brand-primary)" : dim ? "var(--text-muted)" : "var(--text-primary)";

  return (
    <div style={{ padding: "30px 26px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ ...CH_TYPE.numeral, fontSize: sizes.num, fontWeight: 600, color: numColor, lineHeight: 0.95, letterSpacing: "-0.01em" }}>
        {value}
        {unit && <span style={{ fontSize: "0.55em", color: "var(--text-muted)", marginLeft: 6, fontWeight: 500 }}>{unit}</span>}
      </div>
      <div style={{ fontSize: sizes.lab, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      {supporting && <div style={{ fontSize: sizes.sup, color: "var(--text-secondary)", lineHeight: 1.55 }}>{supporting}</div>}
    </div>
  );
}

function DeltaIndicator({ delta, unit = "%", deltaGood = "down", supporting }) {
  const isImprovement = (delta < 0 && deltaGood === "down") || (delta > 0 && deltaGood === "up");
  const tone = isImprovement ? "var(--color-success)" : "var(--color-danger)";
  const arrow = delta < 0 ? "trending-down" : "trending-up";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 20px", borderLeft: "1px dashed var(--surface-border)", borderRight: "1px dashed var(--surface-border)" }}>
      <div style={{ color: tone, marginBottom: 8 }}><LucideIcon name={arrow} size={26} /></div>
      <div style={{ ...CH_TYPE.numeral, fontSize: "1.65rem", fontWeight: 600, color: tone, lineHeight: 1 }}>
        {delta > 0 ? "+" : ""}{delta}{unit}
      </div>
      <div style={{ ...CH_TYPE.axis, marginTop: 6, color: tone }}>{isImprovement ? "Improvement" : "Regression"}</div>
      {supporting && <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 6, textAlign: "center", maxWidth: 140 }}>{supporting}</div>}
    </div>
  );
}

function StatComparisonPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "stat-comparison");

  return (
    <PageShell item={item}>
      <CHIntro>
        Stat blocks are the closing argument of a research finding — the <strong>headline number</strong> and its supporting context. Use them in executive summaries, findings panels, and the top of public-facing dashboards. Numbers stay tabular mono; labels uppercase tracked. Never round so aggressively that the precision claim becomes false.
      </CHIntro>

      <CHSectionLabel>Single hero stat — one number is the story</CHSectionLabel>
      <CHBox label="for the cover of a fact sheet or report">
        <ChartFrame eyebrow="exhibit 6.01" title="Corridor improvements in fiscal year 2024">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 40, alignItems: "center" }}>
            <StatBlock value="$2.84" unit="B" label="Capital invested" supporting="Across 47 corridor projects in 14 districts statewide." accent size="lg" />
            <div style={{ fontSize: "1.02rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
              Texas DOT and TTI partner agencies completed <strong>47 corridor improvement projects</strong> in fiscal year 2024 — the largest year-over-year capital deployment in the program's history. These projects together reduced peak-hour delay by an aggregate <strong>14.2 million vehicle-hours</strong>.
            </div>
          </div>
        </ChartFrame>
      </CHBox>

      <CHSectionLabel>Side-by-side — paired metrics</CHSectionLabel>
      <CHBox label="three or four supporting facts in one strip">
        <ChartFrame eyebrow="exhibit 6.04" title="Mobility Investment Priorities · 2025 program impact" footnote="All figures are aggregate across the 47 corridor projects completed in FY2024.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-raised)" }}>
            <StatBlock value="14.2" unit="M" label="Vehicle-hours saved" supporting="Per year, peak-hour aggregate." accent />
            <div style={{ borderLeft: "1px solid var(--surface-border)" }}>
              <StatBlock value="187" unit="lane-mi" label="New capacity" supporting="Across the 47 completed corridors." />
            </div>
            <div style={{ borderLeft: "1px solid var(--surface-border)" }}>
              <StatBlock value="$2.84" unit="B" label="Capital invested" supporting="State, federal, and local sources combined." />
            </div>
            <div style={{ borderLeft: "1px solid var(--surface-border)" }}>
              <StatBlock value="$0.20" unit="/hr" label="Cost per hour saved" supporting="Lifetime cost over a 30-year amortization." />
            </div>
          </div>
        </ChartFrame>
      </CHBox>

      <CHSectionLabel>Before & after — paired with delta indicator</CHSectionLabel>
      <CHBox label="for impact studies and pilot evaluations">
        <ChartFrame eyebrow="exhibit 6.07" title="I-35 corridor improvements · before vs after" source="TTI corridor performance reports · 2022 vs 2025" footnote="Measurements taken on the Round Rock to Buda segment during typical weekday peak hours.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-raised)" }}>
            <StatBlock value="78" unit="s" label="Before · 2022" supporting="Average peak-hour delay, vehicle-seconds per mile." dim />
            <DeltaIndicator delta={-44} unit="%" deltaGood="down" supporting="A 34-second reduction in average per-vehicle delay." />
            <StatBlock value="44" unit="s" label="After · 2025" supporting="Following capacity expansion and managed-lane operations." accent />
          </div>
        </ChartFrame>
      </CHBox>

      <CHSectionLabel>Small-multiples grid — many comparable stats</CHSectionLabel>
      <CHBox label="when each metric tells the same kind of story across many subjects">
        <ChartFrame eyebrow="exhibit 6.11" title="Top corridors by delay reduction" source="TTI Mobility Investment Priorities · 2025">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-raised)" }}>
            {[
              { name: "I-35 · Round Rock",  before: 78, after: 44, delta: -44 },
              { name: "I-635 · Dallas",     before: 92, after: 61, delta: -34 },
              { name: "US-290 · Houston",   before: 64, after: 41, delta: -36 },
              { name: "SH-130 · Austin",    before: 18, after: 12, delta: -33 },
              { name: "I-10 · San Antonio", before: 56, after: 39, delta: -30 },
              { name: "I-45 · Houston",     before: 71, after: 52, delta: -27 },
            ].map((c, i) => {
              const col = i % 3, row = Math.floor(i / 3);
              return (
                <div key={i} style={{
                  padding: "20px 22px",
                  borderRight: col < 2 ? "1px solid var(--surface-border)" : "none",
                  borderBottom: row < 1 ? "1px solid var(--surface-border)" : "none",
                  display: "flex", flexDirection: "column", gap: 8,
                }}>
                  <div style={{ ...CH_TYPE.axis, color: "var(--text-secondary)", fontSize: "0.74rem", letterSpacing: "0.06em" }}>{c.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                    <span style={{ ...CH_TYPE.numeral, color: "var(--text-muted)", fontSize: "1rem", textDecoration: "line-through" }}>{c.before}s</span>
                    <span style={{ ...CH_TYPE.numeral, color: "var(--brand-primary)", fontSize: "2rem", fontWeight: 600 }}>{c.after}<span style={{ fontSize: "0.55em", color: "var(--text-muted)", marginLeft: 4 }}>s</span></span>
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--color-success)", fontSize: "0.8rem", fontFamily: "var(--font-body-bold)", fontWeight: 700 }}>
                    <LucideIcon name="trending-down" size={14} />
                    <span style={CH_TYPE.numeral}>{c.delta}%</span>
                    <span style={{ color: "var(--text-muted)", fontWeight: 400, fontFamily: "var(--font-body)" }}>delay reduction</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartFrame>
      </CHBox>

      <CHSpecRow>
        <CHSpec label="hero stat"   value="3.4–5.2rem"     note="Always tabular mono. Letter-spacing tightens to -0.01em at large sizes." />
        <CHSpec label="delta tone"  value="green · red"    note="Green for improvement, red for regression. Direction follows deltaGood prop — lower delay is good, higher ridership is good." />
        <CHSpec label="before/after" value="strikethrough"  note="Old value shown muted with strikethrough; new value in maroon at full weight." />
        <CHSpec label="precision"   value="don't over-round" note="If the number is 14.2M vehicle-hours, don't claim 14M. The decimal carries the credibility." />
      </CHSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Export
// ════════════════════════════════════════════════════════════════════════

Object.assign(window, {
  ChartScatterPage,
  ChartTrendPage,
  StatComparisonPage,
});
