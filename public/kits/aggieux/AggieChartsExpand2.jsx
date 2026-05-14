/*
 * AggieChartsExpand2.jsx — Radar, Slope/Dumbbell/Lollipop, Annotation system
 *
 * Helper prefix: EX2.
 */

function EX2SectionLabel({ children }) {
  return <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 14, marginTop: 28 }}>{children}</div>;
}

function EX2Intro({ children }) {
  return <div style={{ background: "var(--surface-raised)", borderLeft: "3px solid var(--brand-primary)", padding: "16px 20px", marginBottom: 30, fontSize: "0.92rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>{children}</div>;
}

function EX2Box({ label, dark, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      {label && <div style={{ fontSize: "0.66rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>{label}</div>}
      <div style={{ background: dark ? "#0E1216" : "var(--surface-base)", border: "1px solid var(--surface-border)", padding: 24, borderRadius: "var(--radius-md)" }}>{children}</div>
    </div>
  );
}

function EX2Spec({ label, value, note }) {
  return (
    <div style={{ padding: "16px 18px", borderRight: "1px solid var(--surface-border)" }}>
      <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: "0.82rem", fontFamily: "var(--font-body-bold)", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{value}</div>
      {note && <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.45 }}>{note}</div>}
    </div>
  );
}

function EX2SpecRow({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-raised)" }}>{children}</div>;
}

// ═══════════════════════════════════════════════════════════════════════
// RADAR / SPIDER
// ═══════════════════════════════════════════════════════════════════════
//
// N axes radiate from center; values 0-1 along each.
// Series = polygon. Multi-series = stacked polygons.

function RadarChart({ axes, series, size = 360, max = 100, tone = "default" }) {
  const t = window.useToneTokens(tone);
  const palette = tone === "dark"
    ? ["#A14A3D", "#3F5A6F", "#A78444", "#5C7A55"]
    : ["var(--brand-primary)", "#3F5A6F", "#A78444", "#5C7A55"];

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.36;
  const N = axes.length;

  const angleFor = (i) => -Math.PI / 2 + (i / N) * Math.PI * 2;
  const pointFor = (i, v) => ({
    x: cx + (r * v / max) * Math.cos(angleFor(i)),
    y: cy + (r * v / max) * Math.sin(angleFor(i)),
  });

  // Concentric grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <div style={{ display: "grid", gridTemplateColumns: `${size}px 1fr`, gap: 32, alignItems: "center" }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        {/* Concentric polygon grid */}
        {rings.map((ring, ri) => {
          const pts = axes.map((_, i) => {
            const x = cx + r * ring * Math.cos(angleFor(i));
            const y = cy + r * ring * Math.sin(angleFor(i));
            return `${x},${y}`;
          }).join(" ");
          return <polygon key={ri} points={pts} fill="none" stroke={t.grid} strokeWidth={ri === rings.length - 1 ? 1 : 0.6} strokeDasharray={ri === rings.length - 1 ? "0" : "2 3"} />;
        })}

        {/* Axis spokes */}
        {axes.map((_, i) => {
          const x = cx + r * Math.cos(angleFor(i));
          const y = cy + r * Math.sin(angleFor(i));
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={t.grid} strokeWidth="0.6" />;
        })}

        {/* Series polygons (back to front, larger first) */}
        {series.map((s, si) => {
          const pts = s.values.map((v, i) => {
            const p = pointFor(i, v);
            return `${p.x},${p.y}`;
          }).join(" ");
          const color = s.color || palette[si % palette.length];
          return (
            <g key={si}>
              <polygon points={pts} fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.6" />
              {/* Vertices */}
              {s.values.map((v, i) => {
                const p = pointFor(i, v);
                return <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} stroke={t.bg} strokeWidth="1" />;
              })}
            </g>
          );
        })}

        {/* Axis labels */}
        {axes.map((label, i) => {
          const labelR = r + 16;
          const x = cx + labelR * Math.cos(angleFor(i));
          const y = cy + labelR * Math.sin(angleFor(i));
          const a = angleFor(i);
          let anchor = "middle";
          if (Math.cos(a) > 0.3) anchor = "start";
          else if (Math.cos(a) < -0.3) anchor = "end";
          return (
            <text key={i} x={x} y={y + 3} textAnchor={anchor} fontSize="9" fill={t.textMuted} fontFamily="var(--font-body-bold)" letterSpacing="0.08em" fontWeight="700">{label.toUpperCase()}</text>
          );
        })}
      </svg>

      {/* Right legend with score table */}
      <div>
        <div style={{ display: "grid", gridTemplateColumns: `1fr ${series.map(() => "auto").join(" ")}`, gap: "0 16px", fontSize: "0.78rem" }}>
          <div />
          {series.map((s, si) => (
            <div key={si} style={{ fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.1em", color: s.color || palette[si % palette.length], fontFamily: "var(--font-body-bold)", fontWeight: 700, textAlign: "right" }}>{s.label}</div>
          ))}
          {axes.map((axis, i) => (
            <React.Fragment key={i}>
              <div style={{ padding: "5px 0", borderBottom: `1px dashed ${t.grid}`, color: t.textSecondary, fontSize: "0.78rem" }}>{axis}</div>
              {series.map((s, si) => (
                <div key={si} style={{ padding: "5px 0", borderBottom: `1px dashed ${t.grid}`, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", textAlign: "right", color: t.text, fontWeight: 600 }}>{s.values[i]}</div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SLOPE CHART — change between two time points across ranked items
// ═══════════════════════════════════════════════════════════════════════

function SlopeChart({ data, leftLabel, rightLabel, height = 360, tone = "default", valueFormat = (v) => v }) {
  const t = window.useToneTokens(tone);
  const colorUp = tone === "dark" ? "#5C9F7A" : "#2F7D4F";
  const colorDown = tone === "dark" ? "#D86F61" : "#B0382F";
  const colorNeutral = tone === "dark" ? "#8A949E" : "#6B7480";

  const all = data.flatMap(d => [d.left, d.right]);
  const max = Math.max(...all);
  const min = Math.min(...all);
  const padTop = 30;
  const padBot = 24;
  const W = 480;
  const xL = 130;
  const xR = W - 130;
  const chartH = height - padTop - padBot;
  const yFor = (v) => padTop + chartH * (1 - (v - min) / (max - min));

  return (
    <svg viewBox={`0 0 ${W} ${height}`} width="100%" height={height} style={{ display: "block" }}>
      {/* Anchor lines */}
      <line x1={xL} y1={padTop - 12} x2={xL} y2={padTop + chartH + 4} stroke={t.grid} strokeWidth="1" />
      <line x1={xR} y1={padTop - 12} x2={xR} y2={padTop + chartH + 4} stroke={t.grid} strokeWidth="1" />

      {/* Header labels */}
      <text x={xL} y={padTop - 16} textAnchor="middle" fontSize="9" fill={t.textMuted} fontFamily="var(--font-body-bold)" letterSpacing="0.12em" fontWeight="700">{leftLabel.toUpperCase()}</text>
      <text x={xR} y={padTop - 16} textAnchor="middle" fontSize="9" fill={t.textMuted} fontFamily="var(--font-body-bold)" letterSpacing="0.12em" fontWeight="700">{rightLabel.toUpperCase()}</text>

      {data.map((d, i) => {
        const yL = yFor(d.left);
        const yR = yFor(d.right);
        const delta = d.right - d.left;
        const color = delta > 0 ? colorUp : delta < 0 ? colorDown : colorNeutral;
        const opacity = d.muted ? 0.32 : 1.0;
        return (
          <g key={i} opacity={opacity}>
            <line x1={xL} y1={yL} x2={xR} y2={yR} stroke={color} strokeWidth="1.5" />
            <circle cx={xL} cy={yL} r="3.5" fill={color} />
            <circle cx={xR} cy={yR} r="3.5" fill={color} />
            {/* Left label */}
            <text x={xL - 8} y={yL + 3} textAnchor="end" fontSize="10" fill={t.text} fontFamily="var(--font-body-bold)" fontWeight={d.muted ? 400 : 600}>{d.label}</text>
            <text x={xL - 8} y={yL + 14} textAnchor="end" fontSize="9" fill={t.textMuted} fontFamily="var(--font-mono)" fontVariantNumeric="tabular-nums">{valueFormat(d.left)}</text>
            {/* Right label */}
            <text x={xR + 8} y={yR + 3} textAnchor="start" fontSize="10" fill={t.text} fontFamily="var(--font-body-bold)" fontWeight={d.muted ? 400 : 600}>{valueFormat(d.right)}</text>
            <text x={xR + 8} y={yR + 14} textAnchor="start" fontSize="9" fill={t.textMuted} fontFamily="var(--font-mono)" fontVariantNumeric="tabular-nums">{delta >= 0 ? "+" : ""}{valueFormat(delta)}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DUMBBELL CHART — gap between two values for each item
// ═══════════════════════════════════════════════════════════════════════

function DumbbellChart({ data, leftLabel, rightLabel, max, height = 280, tone = "default", valueFormat = (v) => v }) {
  const t = window.useToneTokens(tone);
  const colorL = tone === "dark" ? "#6F8294" : "#7E94A4";
  const colorR = tone === "dark" ? "#E89B7E" : "var(--brand-primary)";

  const W = 720;
  const padL = 160;
  const padR = 60;
  const rowH = (height - 50) / data.length;

  return (
    <div>
      {/* Legend */}
      <div style={{ display: "flex", gap: 18, marginBottom: 14 }}>
        {[
          { label: leftLabel, color: colorL },
          { label: rightLabel, color: colorR },
        ].map((it, i) => (
          <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "0.74rem", color: t.textSecondary, fontFamily: "var(--font-body-bold)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            <span style={{ width: 10, height: 10, background: it.color, borderRadius: "50%" }} />
            <span>{it.label}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${height}`} width="100%" height={height} style={{ display: "block" }}>
        {/* Vertical gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
          const x = padL + (W - padL - padR) * p;
          return (
            <g key={i}>
              <line x1={x} y1="20" x2={x} y2={height - 20} stroke={t.grid} strokeWidth={i === 0 ? 1 : 0.6} strokeDasharray={i === 0 ? "0" : "2 3"} />
              <text x={x} y={height - 6} textAnchor="middle" fontSize="9" fill={t.textMuted} fontFamily="var(--font-mono)" fontVariantNumeric="tabular-nums">{valueFormat(Math.round(max * p))}</text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const y = 28 + rowH * i;
          const xL = padL + ((W - padL - padR) * d.left) / max;
          const xR = padL + ((W - padL - padR) * d.right) / max;
          const minX = Math.min(xL, xR);
          const maxX = Math.max(xL, xR);
          return (
            <g key={i}>
              <text x={padL - 12} y={y + 4} textAnchor="end" fontSize="11" fill={t.text} fontFamily="var(--font-body-bold)" fontWeight="600">{d.label}</text>
              <line x1={minX} y1={y} x2={maxX} y2={y} stroke={t.textMuted} strokeWidth="2" opacity="0.4" />
              <circle cx={xL} cy={y} r="6" fill={colorL} />
              <circle cx={xR} cy={y} r="6" fill={colorR} />
              <text x={xR + 12} y={y + 3} fontSize="9" fill={t.textMuted} fontFamily="var(--font-mono)" fontVariantNumeric="tabular-nums">Δ {d.right > d.left ? "+" : ""}{valueFormat(d.right - d.left)}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// LOLLIPOP CHART — magnitude with thin stem + dot
// ═══════════════════════════════════════════════════════════════════════

function LollipopChart({ data, max, height = 280, tone = "default", valueFormat = (v) => v }) {
  const t = window.useToneTokens(tone);
  const W = 720;
  const padL = 160;
  const padR = 80;
  const rowH = (height - 50) / data.length;

  return (
    <svg viewBox={`0 0 ${W} ${height}`} width="100%" height={height} style={{ display: "block" }}>
      {/* Vertical gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
        const x = padL + (W - padL - padR) * p;
        return (
          <g key={i}>
            <line x1={x} y1="20" x2={x} y2={height - 20} stroke={t.grid} strokeWidth={i === 0 ? 1 : 0.6} strokeDasharray={i === 0 ? "0" : "2 3"} />
            <text x={x} y={height - 6} textAnchor="middle" fontSize="9" fill={t.textMuted} fontFamily="var(--font-mono)" fontVariantNumeric="tabular-nums">{valueFormat(Math.round(max * p))}</text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const y = 28 + rowH * i;
        const x = padL + ((W - padL - padR) * d.value) / max;
        const color = d.color || (tone === "dark" ? "#E89B7E" : "var(--brand-primary)");
        return (
          <g key={i}>
            <text x={padL - 12} y={y + 4} textAnchor="end" fontSize="11" fill={t.text} fontFamily="var(--font-body-bold)" fontWeight="600">{d.label}</text>
            <line x1={padL} y1={y} x2={x} y2={y} stroke={color} strokeWidth="1.5" />
            <circle cx={x} cy={y} r="5" fill={color} stroke={t.bg} strokeWidth="1.5" />
            <text x={x + 10} y={y + 3} fontSize="10" fill={t.text} fontFamily="var(--font-mono)" fontVariantNumeric="tabular-nums" fontWeight="600">{valueFormat(d.value)}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PAGE — chart-radar
// ═══════════════════════════════════════════════════════════════════════

function ChartRadarPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "chart-radar");

  // Sample: project evaluation across 6 axes
  const axes = ["Mobility impact", "Safety", "Cost effectiveness", "Constructability", "Equity", "Schedule"];
  const series = [
    { label: "Option A — Managed lanes",      values: [85, 60, 55, 70, 72, 65] },
    { label: "Option B — BRT corridor",       values: [70, 80, 78, 60, 88, 55] },
    { label: "Option C — Signal optimization", values: [40, 65, 92, 95, 60, 90] },
  ];

  // Single-series profile
  const profileAxes = ["Engineering", "Planning", "Outreach", "Data science", "Project mgmt", "Comms"];
  const profileSeries = [{ label: "Center capacity score", values: [88, 75, 62, 81, 70, 58] }];

  return (
    <PageShell item={item}>
      <EX2Intro>
        Radar charts work for <strong>multi-criteria scoring</strong> when the audience needs to feel the shape of strengths and weaknesses across a fixed set of axes. They're imperfect — area is misleading and axis order matters — but for proposal evaluation matrices they're the most legible single-figure summary. <strong>Cap at 8 axes</strong>; beyond that switch to a parallel-coordinates plot or a horizontal bar set.
      </EX2Intro>

      <EX2SectionLabel>Multi-series — option comparison</EX2SectionLabel>
      <EX2Box label="Three project alternatives scored across 6 evaluation criteria">
        <Exhibit
          number="Exhibit 8.04"
          title="I-35 corridor improvement alternatives — multi-criteria evaluation"
          source="TTI Corridor Study · 2025"
          notes="Axes scored 0-100 by a 12-member technical advisory committee. Higher is better on every axis. Equity composite per Texas EJ-30 framework."
          tone="default"
        >
          <RadarChart axes={axes} series={series} size={360} max={100} tone="default" />
        </Exhibit>
      </EX2Box>

      <EX2SectionLabel>Single series — capability profile</EX2SectionLabel>
      <EX2Box label="One series filled in — for showing the shape of an organization's capabilities">
        <Exhibit
          number="Exhibit 8.05"
          title="TTI core capability assessment, 2025"
          source="Internal capability audit · 2025"
          tone="default"
        >
          <RadarChart axes={profileAxes} series={profileSeries} size={320} max={100} tone="default" />
        </Exhibit>
      </EX2Box>

      <EX2SectionLabel>On dark</EX2SectionLabel>
      <EX2Box dark label="For slide decks where the radar is the centerpiece">
        <Exhibit
          number="Slide 23"
          title="Three options, six criteria"
          tone="dark"
        >
          <RadarChart axes={axes} series={series.slice(0, 2)} size={320} max={100} tone="dark" />
        </Exhibit>
      </EX2Box>

      <EX2SectionLabel>Don't do this</EX2SectionLabel>
      <CompareGoodBad
        goodTitle="Cap at 8 axes; order them logically"
        goodWhy="Few enough axes that the polygon's shape carries information. Axes ordered by domain (impact metrics, then process metrics) help the reader build mental groups."
        badTitle="Too many axes, randomly ordered"
        badWhy="More than 10 axes makes every series look like a circle. Random axis order means the polygon shape carries no story."
        good={<RadarChart axes={["Impact", "Cost", "Equity"]} series={[series[0]]} size={220} max={100} tone="default" />}
        bad={
          <svg viewBox="0 0 220 220" width="100%" height="220">
            <g transform="translate(110, 110)">
              {[0.25, 0.5, 0.75, 1.0].map((ring, ri) => {
                const pts = Array.from({ length: 14 }, (_, i) => {
                  const a = -Math.PI / 2 + (i / 14) * Math.PI * 2;
                  const r = 75 * ring;
                  return `${r * Math.cos(a)},${r * Math.sin(a)}`;
                }).join(" ");
                return <polygon key={ri} points={pts} fill="none" stroke="var(--surface-border)" strokeWidth="0.5" strokeDasharray="2 3" />;
              })}
              <polygon points={Array.from({ length: 14 }, (_, i) => {
                const a = -Math.PI / 2 + (i / 14) * Math.PI * 2;
                const v = 50 + Math.random() * 30;
                const r = 75 * (v / 100);
                return `${r * Math.cos(a)},${r * Math.sin(a)}`;
              }).join(" ")} fill="var(--brand-primary)" fillOpacity="0.18" stroke="var(--brand-primary)" strokeWidth="1.4" />
            </g>
          </svg>
        }
      />

      <EX2SectionLabel>Spec</EX2SectionLabel>
      <EX2SpecRow>
        <EX2Spec label="Axis count" value="3 to 8" note="below 3 use a stat block; above 8 use a parallel-coordinates plot or bar group" />
        <EX2Spec label="Series count" value="1 to 4" note="more than 4 polygons overlap so much that comparison becomes impossible" />
        <EX2Spec label="Scale" value="always 0 to max" note="never start the radial axis above 0 — the polygon area becomes meaningless" />
        <EX2Spec label="Companion table" value="always" note="radar shape is suggestive; the table at right gives the reader the exact numbers to cite" />
      </EX2SpecRow>
    </PageShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PAGE — chart-change (slope · dumbbell · lollipop)
// ═══════════════════════════════════════════════════════════════════════

function ChartChangePage() {
  const item = AGGIE_CATALOG.find(c => c.id === "chart-change");

  // Sample: county-level commute time change
  const slopeData = [
    { label: "Travis",     left: 28, right: 32 },
    { label: "Harris",     left: 31, right: 34 },
    { label: "Dallas",     left: 30, right: 31 },
    { label: "Bexar",      left: 26, right: 27 },
    { label: "Tarrant",    left: 28, right: 27 },
    { label: "Williamson", left: 32, right: 30 },
    { label: "El Paso",    left: 22, right: 22 },
    { label: "Collin",     left: 30, right: 28, muted: true },
  ];

  // Sample: gap between male/female cyclists
  const dumbbellData = [
    { label: "Houston",     left: 18, right: 41 },
    { label: "Dallas",      left: 15, right: 39 },
    { label: "Austin",      left: 22, right: 48 },
    { label: "San Antonio", left: 12, right: 35 },
    { label: "El Paso",     left: 9,  right: 28 },
  ];

  // Sample: project ranking
  const lollipopData = [
    { label: "I-35 cap", value: 87 },
    { label: "BRT phase II", value: 74 },
    { label: "Signal sync", value: 68 },
    { label: "Bridge retrofit", value: 61 },
    { label: "Bike network", value: 54 },
    { label: "Park & ride", value: 42 },
    { label: "Wayfinding", value: 28 },
  ];

  return (
    <PageShell item={item}>
      <EX2Intro>
        Three lightweight alternatives to a bar chart when the question is about <em>change</em>. <strong>Slope</strong> shows movement between two time points across many items. <strong>Dumbbell</strong> shows the gap between two values for each item — useful for inequality, before/after at scale. <strong>Lollipop</strong> is a quieter bar chart for ranked lists where the values matter more than the bars.
      </EX2Intro>

      <EX2SectionLabel>Slope chart — movement between two time points</EX2SectionLabel>
      <EX2Box label="Counties ranked by mean commute time. Lines colored by direction; flat lines are muted.">
        <Exhibit
          number="Exhibit 9.01"
          title="Mean commute time, eight Texas counties · 2019 vs 2024"
          source="ACS 5-year estimates · 2015–2019, 2020–2024"
          notes="Minutes, weighted average across census tracts. Collin County dropped from sample due to boundary change."
          tone="default"
        >
          <SlopeChart data={slopeData} leftLabel="2019" rightLabel="2024" height={400} tone="default" valueFormat={(v) => `${v}m`} />
        </Exhibit>
      </EX2Box>

      <EX2SectionLabel>Dumbbell chart — gap between two values</EX2SectionLabel>
      <EX2Box label="Each row is one metro; the dumbbell shows the gap between two cyclist subgroups.">
        <Exhibit
          number="Exhibit 9.02"
          title="Cycling mode share by gender, five Texas metros · 2024"
          source="TTI bicycle counter network · 2024"
          notes="Percent of total weekday cycling trips. Gap (Δ) shown at right; a wider gap indicates greater participation imbalance."
          tone="default"
        >
          <DumbbellChart data={dumbbellData} leftLabel="Female" rightLabel="Male" max={60} height={260} tone="default" valueFormat={(v) => `${v}%`} />
        </Exhibit>
      </EX2Box>

      <EX2SectionLabel>Lollipop chart — quieter bar</EX2SectionLabel>
      <EX2Box label="Ranked project priorities. Reader's eye goes to the dot, not the bar.">
        <Exhibit
          number="Exhibit 9.03"
          title="MIP project ranking, top 7 — composite score"
          source="TTI Mobility Investment Priorities · 2025"
          notes="Composite score 0–100. Weighted: 35% mobility, 25% safety, 20% cost effectiveness, 20% equity."
          tone="default"
        >
          <LollipopChart data={lollipopData} max={100} height={290} tone="default" />
        </Exhibit>
      </EX2Box>

      <EX2SectionLabel>On dark — slope chart</EX2SectionLabel>
      <EX2Box dark>
        <Exhibit number="Slide 17" title="Commute times shifted upward in five of eight counties" tone="dark" source="ACS · 2024">
          <SlopeChart data={slopeData} leftLabel="2019" rightLabel="2024" height={340} tone="dark" valueFormat={(v) => `${v}m`} />
        </Exhibit>
      </EX2Box>

      <EX2SectionLabel>Don't do this</EX2SectionLabel>
      <CompareGoodBad
        goodTitle="Use a slope chart for ≤ 12 ranked items, two time points"
        goodWhy="Each line is its own micro-comparison. Color-coding by direction (up/down) lets the reader see overall trend at a glance."
        badTitle="Bar chart for the same data"
        badWhy="With two grouped bars per item, you lose the sense of trajectory. The chart reads as a comparison, not a change."
        good={<SlopeChart data={slopeData.slice(0, 5)} leftLabel="2019" rightLabel="2024" height={220} tone="default" valueFormat={(v) => `${v}m`} />}
        bad={
          <svg viewBox="0 0 400 220" width="100%" height="220">
            {slopeData.slice(0, 5).map((d, i) => {
              const x = 40 + i * 70;
              const hL = (d.left / 40) * 160;
              const hR = (d.right / 40) * 160;
              return (
                <g key={i}>
                  <rect x={x} y={200 - hL} width={20} height={hL} fill="#7E94A4" />
                  <rect x={x + 22} y={200 - hR} width={20} height={hR} fill="var(--brand-primary)" />
                  <text x={x + 21} y={213} textAnchor="middle" fontSize="8" fill="var(--text-muted)">{d.label.slice(0, 5).toUpperCase()}</text>
                </g>
              );
            })}
          </svg>
        }
      />

      <EX2SectionLabel>Spec</EX2SectionLabel>
      <EX2SpecRow>
        <EX2Spec label="Slope" value="2 anchors only" note="for 3+ time points use a line chart; slope is for the start-vs-end story" />
        <EX2Spec label="Dumbbell" value="2 endpoints + connecting bar" note="connector dimmed; both endpoints colored to disambiguate" />
        <EX2Spec label="Lollipop" value="thin stem + 5px dot" note="stem stays at chart's primary color regardless of value sign" />
        <EX2Spec label="When NOT to use" value="more than 15 items" note="all three become tangled; switch to a small-multiples grid or a sortable table" />
      </EX2SpecRow>
    </PageShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PAGE — chart-annotation
// ═══════════════════════════════════════════════════════════════════════

function ChartAnnotationPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "chart-annotation");

  // Sample line data with annotations
  const traffic = [
    { label: "JAN", v: 142 }, { label: "FEB", v: 138 }, { label: "MAR", v: 145 },
    { label: "APR", v: 162 }, { label: "MAY", v: 168 }, { label: "JUN", v: 175 },
    { label: "JUL", v: 142 }, { label: "AUG", v: 130 }, { label: "SEP", v: 178 },
    { label: "OCT", v: 184 }, { label: "NOV", v: 172 }, { label: "DEC", v: 158 },
  ];

  // CI bands sample
  const forecast = traffic.map((d, i) => ({ ...d, lo: d.v * (0.92 - i * 0.005), hi: d.v * (1.08 + i * 0.005) }));

  return (
    <PageShell item={item}>
      <EX2Intro>
        The annotation system is a <strong>shared vocabulary</strong> overlaid on any chart in this kit. Six primitives: threshold lines, target bands, event callouts, value markers, confidence-interval bands, and trend arrows. Use them sparingly — three annotations max per chart — to direct the reader's attention without crowding the data.
      </EX2Intro>

      {/* ─── 1. Threshold line ─────────────────────────────── */}
      <EX2SectionLabel>1 · Threshold line</EX2SectionLabel>
      <EX2Box label="Horizontal dashed rule labelled with its value. For policy targets, statutory limits, capacity ceilings.">
        <Exhibit
          number="Exhibit 10.01"
          title="Monthly corridor delay against AASHTO target"
          source="TTI Performance Dashboard · 2024"
          tone="default"
        >
          <svg viewBox="0 0 720 280" width="100%" height="280" style={{ display: "block" }}>
            {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
              const y = 30 + (210 * (1 - p));
              return <line key={i} x1="40" y1={y} x2="710" y2={y} stroke="var(--surface-border)" strokeWidth={i === 0 ? 1 : 0.6} strokeDasharray={i === 0 ? "0" : "2 3"} />;
            })}
            {/* Threshold at 160 */}
            <g>
              <line x1="40" y1={30 + 210 * (1 - 160/200)} x2="710" y2={30 + 210 * (1 - 160/200)} stroke="#B0382F" strokeWidth="1.5" strokeDasharray="6 3" />
              <rect x={620} y={30 + 210 * (1 - 160/200) - 9} width="86" height="18" fill="#B0382F" />
              <text x={663} y={30 + 210 * (1 - 160/200) + 4} textAnchor="middle" fontSize="9" fill="white" fontFamily="var(--font-body-bold)" letterSpacing="0.08em" fontWeight="700">TARGET 160</text>
            </g>
            {/* Line */}
            <polyline fill="none" stroke="var(--brand-primary)" strokeWidth="2" points={traffic.map((d, i) => `${50 + (i * (660/11))},${30 + 210 * (1 - d.v/200)}`).join(" ")} />
            {traffic.map((d, i) => (
              <circle key={i} cx={50 + i * (660/11)} cy={30 + 210 * (1 - d.v/200)} r="3" fill={d.v > 160 ? "#B0382F" : "var(--brand-primary)"} />
            ))}
            {/* x-axis */}
            {traffic.map((d, i) => (
              <text key={i} x={50 + i * (660/11)} y={258} textAnchor="middle" fontSize="9" fill="var(--text-muted)" fontFamily="var(--font-body-bold)">{d.label}</text>
            ))}
            {/* y-axis tick labels */}
            {[0, 50, 100, 150, 200].map((v, i) => (
              <text key={i} x="34" y={30 + 210 * (1 - v/200) + 3} textAnchor="end" fontSize="9" fill="var(--text-muted)" fontFamily="var(--font-mono)">{v}s</text>
            ))}
          </svg>
        </Exhibit>
      </EX2Box>

      {/* ─── 2. Target band ─────────────────────────────────── */}
      <EX2SectionLabel>2 · Target band</EX2SectionLabel>
      <EX2Box label="A range rather than a single value. Acceptable performance is anywhere in the band.">
        <Exhibit
          number="Exhibit 10.02"
          title="Average travel-time index, with desired range"
          source="TTI Urban Mobility Report · 2024"
          tone="default"
        >
          <svg viewBox="0 0 720 280" width="100%" height="280" style={{ display: "block" }}>
            {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
              const y = 30 + 210 * (1 - p);
              return <line key={i} x1="40" y1={y} x2="710" y2={y} stroke="var(--surface-border)" strokeWidth={i === 0 ? 1 : 0.6} strokeDasharray={i === 0 ? "0" : "2 3"} />;
            })}
            {/* Target band 130-160 */}
            <rect x="40" y={30 + 210 * (1 - 160/200)} width="670" height={210 * ((160 - 130)/200)} fill="#2F7D4F" fillOpacity="0.10" />
            <line x1="40" y1={30 + 210 * (1 - 160/200)} x2="710" y2={30 + 210 * (1 - 160/200)} stroke="#2F7D4F" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="40" y1={30 + 210 * (1 - 130/200)} x2="710" y2={30 + 210 * (1 - 130/200)} stroke="#2F7D4F" strokeWidth="1" strokeDasharray="3 3" />
            <text x="46" y={30 + 210 * (1 - 145/200) + 3} fontSize="9" fill="#2F7D4F" fontFamily="var(--font-body-bold)" letterSpacing="0.1em" fontWeight="700">DESIRED RANGE 130–160</text>
            {/* Line */}
            <polyline fill="none" stroke="var(--brand-primary)" strokeWidth="2" points={traffic.map((d, i) => `${50 + i * (660/11)},${30 + 210 * (1 - d.v/200)}`).join(" ")} />
            {traffic.map((d, i) => (
              <circle key={i} cx={50 + i * (660/11)} cy={30 + 210 * (1 - d.v/200)} r="3" fill="var(--brand-primary)" />
            ))}
            {traffic.map((d, i) => (
              <text key={i} x={50 + i * (660/11)} y={258} textAnchor="middle" fontSize="9" fill="var(--text-muted)" fontFamily="var(--font-body-bold)">{d.label}</text>
            ))}
            {[0, 50, 100, 150, 200].map((v, i) => (
              <text key={i} x="34" y={30 + 210 * (1 - v/200) + 3} textAnchor="end" fontSize="9" fill="var(--text-muted)" fontFamily="var(--font-mono)">{v}s</text>
            ))}
          </svg>
        </Exhibit>
      </EX2Box>

      {/* ─── 3. Event callouts ──────────────────────────────── */}
      <EX2SectionLabel>3 · Event callouts</EX2SectionLabel>
      <EX2Box label="Numbered or lettered annotations point at specific data points; legend below explains each.">
        <Exhibit
          number="Exhibit 10.03"
          title="Corridor delay over 12 months, with significant events"
          source="TTI Performance Dashboard · 2024"
          tone="default"
        >
          <svg viewBox="0 0 720 280" width="100%" height="280" style={{ display: "block" }}>
            {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
              const y = 30 + 210 * (1 - p);
              return <line key={i} x1="40" y1={y} x2="710" y2={y} stroke="var(--surface-border)" strokeWidth={i === 0 ? 1 : 0.6} strokeDasharray={i === 0 ? "0" : "2 3"} />;
            })}
            <polyline fill="none" stroke="var(--brand-primary)" strokeWidth="2" points={traffic.map((d, i) => `${50 + i * (660/11)},${30 + 210 * (1 - d.v/200)}`).join(" ")} />
            {traffic.map((d, i) => (
              <circle key={i} cx={50 + i * (660/11)} cy={30 + 210 * (1 - d.v/200)} r="3" fill="var(--brand-primary)" />
            ))}
            {/* Annotation A: peak in May (index 4) */}
            <line x1={50 + 4 * (660/11)} y1={30 + 210 * (1 - 168/200) - 8} x2={50 + 4 * (660/11)} y2={30 + 210 * (1 - 168/200) - 24} stroke="var(--text-muted)" strokeWidth="0.8" />
            <AnnotationDot letter="A" x={50 + 4 * (660/11)} y={30 + 210 * (1 - 168/200) - 32} />
            {/* Annotation B: dip in Aug (index 7) */}
            <line x1={50 + 7 * (660/11)} y1={30 + 210 * (1 - 130/200) + 8} x2={50 + 7 * (660/11)} y2={30 + 210 * (1 - 130/200) + 24} stroke="var(--text-muted)" strokeWidth="0.8" />
            <AnnotationDot letter="B" x={50 + 7 * (660/11)} y={30 + 210 * (1 - 130/200) + 32} />
            {/* Annotation C: high in Oct (index 9) */}
            <line x1={50 + 9 * (660/11)} y1={30 + 210 * (1 - 184/200) - 8} x2={50 + 9 * (660/11)} y2={30 + 210 * (1 - 184/200) - 24} stroke="var(--text-muted)" strokeWidth="0.8" />
            <AnnotationDot letter="C" x={50 + 9 * (660/11)} y={30 + 210 * (1 - 184/200) - 32} />

            {traffic.map((d, i) => (
              <text key={i} x={50 + i * (660/11)} y={258} textAnchor="middle" fontSize="9" fill="var(--text-muted)" fontFamily="var(--font-body-bold)">{d.label}</text>
            ))}
            {[0, 50, 100, 150, 200].map((v, i) => (
              <text key={i} x="34" y={30 + 210 * (1 - v/200) + 3} textAnchor="end" fontSize="9" fill="var(--text-muted)" fontFamily="var(--font-mono)">{v}s</text>
            ))}
          </svg>
          {/* Annotation legend */}
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ width: 18, height: 18, background: "var(--brand-primary)", color: "white", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, fontFamily: "var(--font-body-bold)", flexShrink: 0 }}>A</span>
              <span><strong>May peak.</strong> SXSW closures plus US 290 reconstruction kickoff.</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ width: 18, height: 18, background: "var(--brand-primary)", color: "white", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, fontFamily: "var(--font-body-bold)", flexShrink: 0 }}>B</span>
              <span><strong>Summer dip.</strong> Reduced commuter volume and TxDOT rest-period.</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ width: 18, height: 18, background: "var(--brand-primary)", color: "white", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, fontFamily: "var(--font-body-bold)", flexShrink: 0 }}>C</span>
              <span><strong>October peak.</strong> Football traffic + State Fair + COTA.</span>
            </div>
          </div>
        </Exhibit>
      </EX2Box>

      {/* ─── 4. Confidence intervals ────────────────────────── */}
      <EX2SectionLabel>4 · Confidence intervals — band fill</EX2SectionLabel>
      <EX2Box label="Shaded band shows ±CI around a forecast or estimate. Less prominent than the central line.">
        <Exhibit
          number="Exhibit 10.04"
          title="Corridor delay forecast with 95% confidence band"
          source="TTI forecast model v3.2 · 2024"
          notes="Confidence band widens with forecast horizon. n = 92 corridors, 12 months training."
          tone="default"
        >
          <svg viewBox="0 0 720 280" width="100%" height="280" style={{ display: "block" }}>
            {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
              const y = 30 + 210 * (1 - p);
              return <line key={i} x1="40" y1={y} x2="710" y2={y} stroke="var(--surface-border)" strokeWidth={i === 0 ? 1 : 0.6} strokeDasharray={i === 0 ? "0" : "2 3"} />;
            })}
            {/* CI band */}
            <path d={
              `M ${forecast.map((d, i) => `${50 + i * (660/11)},${30 + 210 * (1 - d.hi/220)}`).join(" L ")}` +
              ` L ${forecast.slice().reverse().map((d, i) => `${50 + (11 - i) * (660/11)},${30 + 210 * (1 - d.lo/220)}`).join(" L ")} Z`
            } fill="var(--brand-primary)" fillOpacity="0.12" />
            {/* Central line */}
            <polyline fill="none" stroke="var(--brand-primary)" strokeWidth="2" points={forecast.map((d, i) => `${50 + i * (660/11)},${30 + 210 * (1 - d.v/220)}`).join(" ")} />
            {forecast.map((d, i) => (
              <circle key={i} cx={50 + i * (660/11)} cy={30 + 210 * (1 - d.v/220)} r="2.5" fill="var(--brand-primary)" />
            ))}
            {forecast.map((d, i) => (
              <text key={i} x={50 + i * (660/11)} y={258} textAnchor="middle" fontSize="9" fill="var(--text-muted)" fontFamily="var(--font-body-bold)">{d.label}</text>
            ))}
            {[0, 55, 110, 165, 220].map((v, i) => (
              <text key={i} x="34" y={30 + 210 * (1 - v/220) + 3} textAnchor="end" fontSize="9" fill="var(--text-muted)" fontFamily="var(--font-mono)">{v}s</text>
            ))}
          </svg>
          <div style={{ marginTop: 10, display: "flex", gap: 18, fontSize: "0.74rem", color: "var(--text-secondary)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 14, height: 14, background: "var(--brand-primary)", opacity: 0.16, borderRadius: 1 }} />
              <span>95% CI</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 18, height: 2, background: "var(--brand-primary)" }} />
              <span>Forecast mean</span>
            </div>
          </div>
        </Exhibit>
      </EX2Box>

      {/* ─── 5. Value marker ────────────────────────────────── */}
      <EX2SectionLabel>5 · Value markers — pin a single number</EX2SectionLabel>
      <EX2Box label="A boxed numeric callout with a leader line. For pinning a single value the reader needs to remember.">
        <Exhibit number="Exhibit 10.05" title="Year-end value highlighted" tone="default">
          <svg viewBox="0 0 720 240" width="100%" height="240" style={{ display: "block" }}>
            {[0, 0.5, 1].map((p, i) => {
              const y = 20 + 180 * (1 - p);
              return <line key={i} x1="40" y1={y} x2="710" y2={y} stroke="var(--surface-border)" strokeWidth={i === 0 ? 1 : 0.6} strokeDasharray={i === 0 ? "0" : "2 3"} />;
            })}
            <polyline fill="none" stroke="var(--brand-primary)" strokeWidth="2" points={traffic.map((d, i) => `${50 + i * (660/11)},${20 + 180 * (1 - d.v/200)}`).join(" ")} />
            {/* Marker on Dec value */}
            <circle cx={50 + 11 * (660/11)} cy={20 + 180 * (1 - 158/200)} r="5" fill="var(--brand-primary)" stroke="white" strokeWidth="2" />
            <line x1={50 + 11 * (660/11) - 4} y1={20 + 180 * (1 - 158/200) - 6} x2={580} y2={50} stroke="var(--text-muted)" strokeWidth="0.8" />
            <rect x={500} y={36} width="100" height="32" fill="white" stroke="var(--brand-primary)" strokeWidth="1" />
            <text x={550} y={51} textAnchor="middle" fontSize="9" fill="var(--text-muted)" fontFamily="var(--font-body-bold)" letterSpacing="0.1em" fontWeight="700">YEAR END</text>
            <text x={550} y={64} textAnchor="middle" fontSize="13" fill="var(--brand-primary)" fontFamily="var(--font-mono)" fontVariantNumeric="tabular-nums" fontWeight="700">158s</text>
            {traffic.map((d, i) => (
              <text key={i} x={50 + i * (660/11)} y={218} textAnchor="middle" fontSize="9" fill="var(--text-muted)" fontFamily="var(--font-body-bold)">{d.label}</text>
            ))}
          </svg>
        </Exhibit>
      </EX2Box>

      {/* ─── 6. Trend annotation ────────────────────────────── */}
      <EX2SectionLabel>6 · Trend annotation — direction arrow</EX2SectionLabel>
      <EX2Box label="A bold arrow with a percent value summarizes the overall trajectory. Used in stat strips, dashboards.">
        <Exhibit number="Exhibit 10.06" title="Cyclist counts, trending up" tone="default">
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }}>
            <svg viewBox="0 0 480 200" width="100%" height="200" style={{ display: "block" }}>
              {[0, 0.5, 1].map((p, i) => {
                const y = 20 + 150 * (1 - p);
                return <line key={i} x1="20" y1={y} x2="460" y2={y} stroke="var(--surface-border)" strokeWidth={i === 0 ? 1 : 0.6} strokeDasharray={i === 0 ? "0" : "2 3"} />;
              })}
              <polyline fill="none" stroke="var(--brand-primary)" strokeWidth="2" points={traffic.map((d, i) => `${30 + i * (420/11)},${20 + 150 * (1 - d.v/200)}`).join(" ")} />
              {/* Trend overlay arrow */}
              <line x1={40} y1={20 + 150 * (1 - 142/200)} x2={440} y2={20 + 150 * (1 - 178/200)} stroke="#2F7D4F" strokeWidth="2" markerEnd="url(#trendArrow)" />
              <defs>
                <marker id="trendArrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto">
                  <path d="M 0 0 L 12 6 L 0 12 z" fill="#2F7D4F" />
                </marker>
              </defs>
            </svg>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", fontWeight: 700, marginBottom: 6 }}>YoY Trend</div>
              <div style={{ fontSize: "2rem", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", color: "#2F7D4F", fontWeight: 700, lineHeight: 1 }}>+11%</div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", marginTop: 6 }}>p &lt; 0.05 (Mann–Kendall)</div>
            </div>
          </div>
        </Exhibit>
      </EX2Box>

      <EX2SectionLabel>Spec</EX2SectionLabel>
      <EX2SpecRow>
        <EX2Spec label="Threshold" value="dashed 1.5px + label tag" note="color from semantic scale (red = limit; green = target)" />
        <EX2Spec label="Target band" value="10% fill + dashed edges" note="green fill, very low alpha; never compete visually with the data" />
        <EX2Spec label="Event callouts" value="circled letter A · B · C" note="3 max per chart; legend explains each below the figure" />
        <EX2Spec label="CI band" value="12% primary fill" note="band always behind the central line; legend always names CI level" />
      </EX2SpecRow>
    </PageShell>
  );
}

window.ChartRadarPage = ChartRadarPage;
window.ChartChangePage = ChartChangePage;
window.ChartAnnotationPage = ChartAnnotationPage;
window.RadarChart = RadarChart;
window.SlopeChart = SlopeChart;
window.DumbbellChart = DumbbellChart;
window.LollipopChart = LollipopChart;
