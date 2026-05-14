/*
 * AggieChartTreatments.jsx — Treatment system page (chart-treatments)
 *
 * The same chart, four ways:
 *   1. Standard       — surface-raised, normal type
 *   2. On dark        — for slide decks
 *   3. Print-ready    — grayscale + hatch fills
 *   4. Formal exhibit — figure number, full caption, source, notes, DOI, license
 *
 * Plus a "Don't do this" comparison block.
 *
 * Helper prefix: TR.
 */

// ─── Local helpers ───────────────────────────────────────────────────

function TRSectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 14, marginTop: 28 }}>
      {children}
    </div>
  );
}

function TRIntro({ children }) {
  return (
    <div style={{ background: "var(--surface-raised)", borderLeft: "3px solid var(--brand-primary)", padding: "16px 20px", marginBottom: 30, fontSize: "0.92rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

function TRBox({ label, children, dark }) {
  return (
    <div style={{ marginBottom: 32 }}>
      {label && (
        <div style={{ fontSize: "0.66rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>
          {label}
        </div>
      )}
      <div style={{
        background: dark ? "#0E1216" : "var(--surface-base)",
        border: "1px solid var(--surface-border)",
        padding: 24,
        borderRadius: "var(--radius-md)",
      }}>
        {children}
      </div>
    </div>
  );
}

function TRSpec({ label, value, note }) {
  return (
    <div style={{ padding: "16px 18px", borderRight: "1px solid var(--surface-border)" }}>
      <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: "0.82rem", fontFamily: "var(--font-body-bold)", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{value}</div>
      {note && <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.45 }}>{note}</div>}
    </div>
  );
}

// ─── Sample chart used four ways ─────────────────────────────────────
//
// Vertical bar — peak-hour delay reduction by metro

const TR_SAMPLE = [
  { label: "Houston", before: 56, after: 41 },
  { label: "Dallas",  before: 49, after: 38 },
  { label: "Austin",  before: 44, after: 35 },
  { label: "S.A.",    before: 38, after: 31 },
  { label: "El Paso", before: 28, after: 25 },
];

function TRDualBarChart({ tone = "default", height = 220 }) {
  const t = window.useToneTokens(tone);
  const max = 60;
  const padTop = 24;

  // For print mode, we use hatch fills instead of color
  const colorBefore = tone === "dark" ? "#6F8294" : tone === "print" ? "url(#tr-hatch-2)" : "#7E94A4";
  const colorAfter  = tone === "dark" ? "#E89B7E" : tone === "print" ? "url(#tr-hatch-3)" : "var(--brand-primary)";

  return (
    <div>
      {/* Legend */}
      <div style={{ display: "flex", gap: 20, marginBottom: 14 }}>
        {[
          { label: "Before · 2022", swatch: colorBefore, hatched: tone === "print" ? "hatch-2" : null },
          { label: "After · 2025",  swatch: colorAfter, hatched: tone === "print" ? "hatch-3" : null },
        ].map((it, i) => (
          <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "0.74rem", color: t.textSecondary, fontFamily: "var(--font-body-bold)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            <svg width="14" height="14" style={{ flexShrink: 0 }}>
              {tone === "print" && (
                <defs>
                  <pattern id={`tr-legend-${i}`} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                    <rect width="6" height="6" fill="white" />
                    <line x1="0" y1="0" x2="0" y2="6" stroke="black" strokeWidth={i === 0 ? 1 : 1.4} />
                  </pattern>
                </defs>
              )}
              <rect width="14" height="14" fill={tone === "print" ? `url(#tr-legend-${i})` : it.swatch} stroke={tone === "print" ? "black" : "none"} strokeWidth="0.5" />
            </svg>
            <span>{it.label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <svg viewBox={`0 0 480 ${height}`} width="100%" height={height} style={{ display: "block" }}>
        {tone === "print" && (
          <defs>
            <pattern id="tr-hatch-2" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
              <rect width="6" height="6" fill="white" />
              <line x1="0" y1="0" x2="0" y2="6" stroke="black" strokeWidth="1" />
            </pattern>
            <pattern id="tr-hatch-3" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
              <rect width="4" height="4" fill="white" />
              <line x1="0" y1="0" x2="0" y2="4" stroke="black" strokeWidth="1.4" />
            </pattern>
          </defs>
        )}

        {/* Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
          const y = padTop + (height - padTop - 28) * (1 - p);
          return (
            <g key={i}>
              <line x1="40" y1={y} x2="480" y2={y} stroke={t.grid} strokeWidth={i === 0 ? 1 : 0.8} strokeDasharray={i === 0 ? "0" : "2 3"} />
              <text x="34" y={y + 3} textAnchor="end" fontSize="9" fill={t.textMuted} fontFamily="var(--font-mono)">{Math.round(max * p)}s</text>
            </g>
          );
        })}

        {/* Bars */}
        {TR_SAMPLE.map((d, i) => {
          const groupW = (480 - 50) / TR_SAMPLE.length;
          const x = 45 + i * groupW;
          const barW = (groupW - 16) / 2;
          const chartH = height - padTop - 28;
          const hBefore = (d.before / max) * chartH;
          const hAfter  = (d.after / max) * chartH;
          return (
            <g key={i}>
              <rect x={x} y={padTop + chartH - hBefore} width={barW} height={hBefore} fill={colorBefore} stroke={tone === "print" ? "black" : "none"} strokeWidth="0.75" />
              <rect x={x + barW + 4} y={padTop + chartH - hAfter} width={barW} height={hAfter} fill={colorAfter} stroke={tone === "print" ? "black" : "none"} strokeWidth="0.75" />
              <text x={x + barW + 2} y={padTop + chartH + 14} textAnchor="middle" fontSize="9" fill={t.textMuted} fontFamily="var(--font-body-bold)" letterSpacing="0.06em" textTransform="uppercase">{d.label.toUpperCase()}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────

function ChartTreatmentsPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "chart-treatments");

  return (
    <PageShell item={item}>
      <TRIntro>
        Every chart in this kit ships in four delivery contexts. The data, encoding, and layout don't change — only the surface treatment does. Pick the one that matches the medium: <strong>standard</strong> for the web; <strong>on dark</strong> for slide decks projected in dim rooms; <strong>print-ready</strong> for grayscale PDF reports that may be photocopied; <strong>formal exhibit</strong> for peer-reviewed publications and proposal appendices that require figure numbers, sources, and citation metadata.
      </TRIntro>

      {/* ─── 1. Standard ─────────────────────────────────────── */}
      <TRSectionLabel>1 · Standard</TRSectionLabel>
      <TRBox label="default web treatment — the one you'll use 80% of the time">
        <Exhibit
          number="Exhibit 4.07"
          title="Peak-hour delay reduction after corridor improvements"
          source="TTI Mobility Investment Priorities · 2025"
          tone="default"
        >
          <TRDualBarChart tone="default" />
        </Exhibit>
      </TRBox>

      {/* ─── 2. On Dark ──────────────────────────────────────── */}
      <TRSectionLabel>2 · On Dark — for slide decks</TRSectionLabel>
      <TRBox label="presented from a stage in a dim room — palette warmed to read against near-black" dark>
        <Exhibit
          number="Exhibit 4.07"
          title="Peak-hour delay reduction after corridor improvements"
          source="TTI Mobility Investment Priorities · 2025"
          tone="dark"
        >
          <TRDualBarChart tone="dark" />
        </Exhibit>
      </TRBox>

      {/* ─── 3. Print ────────────────────────────────────────── */}
      <TRSectionLabel>3 · Print-ready — grayscale + hatch fills</TRSectionLabel>
      <TRBox label="for grayscale PDF reports that may be photocopied — every fill distinguishable without color">
        <Exhibit
          number="Figure 4.07"
          title="Peak-hour delay reduction after corridor improvements"
          source="TTI Mobility Investment Priorities · 2025"
          tone="print"
        >
          <TRDualBarChart tone="print" />
        </Exhibit>
      </TRBox>

      {/* ─── 4. Formal exhibit ──────────────────────────────── */}
      <TRSectionLabel>4 · Formal exhibit — peer-review &amp; proposal appendix</TRSectionLabel>
      <TRBox label="figure number, full caption, methodology notes, DOI, license — every metadata cell that a journal or RFP reviewer will check">
        <Exhibit
          number="Figure 4.07"
          collection="TxDOT Mobility Report 2025 · Vol. III"
          title="Peak-hour delay reduction after corridor improvements, five Texas metros"
          caption="Five major Texas metropolitan areas show consistent reductions in peak-hour vehicle delay following targeted corridor improvements completed between 2022 and 2025. Houston shows the largest absolute reduction (15 s/veh); El Paso the smallest (3 s/veh)."
          source="TTI Mobility Investment Priorities · 2025; TxDOT Performance Dashboard, retrieved 2025-08-14."
          notes="Peak-hour weighted by AM and PM congestion factors per HCM 7th edition. Sample: weekday observations Sept–Nov 2024. Reductions are statistically significant at the 95% level (paired t-test, n = 92 corridors)."
          doi="10.5555/tti.mip.2025.4.7"
          license="CC BY 4.0"
          tone="default"
        >
          <TRDualBarChart tone="default" />
        </Exhibit>
      </TRBox>

      {/* ─── Don't do this ─────────────────────────────────── */}
      <TRSectionLabel>Treatment errors — don't do this</TRSectionLabel>

      <div style={{ marginBottom: 30 }}>
        <CompareGoodBad
          goodTitle="Use the on-dark variant for projection"
          goodWhy="Maroon-on-near-black has poor contrast at projection brightness; the on-dark palette warms the primary into amber range and brightens secondaries so they survive 4-meter throw distances."
          badTitle="Standard variant on a dark slide"
          badWhy="The standard maroon disappears against black backgrounds. Don't just invert the surface — pull the on-dark variant which has a re-balanced palette."
          good={
            <Exhibit number="Slide 14" title="Delay reduction" tone="dark" source="TTI MIP 2025">
              <TRDualBarChart tone="dark" height={160} />
            </Exhibit>
          }
          bad={
            <div style={{ background: "#0E1216", padding: 16, borderRadius: 4 }}>
              <div style={{ color: "#F4F1EC", fontSize: "0.85rem", marginBottom: 8, fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.02em" }}>Delay reduction</div>
              <svg viewBox="0 0 280 130" width="100%" height="130" style={{ display: "block" }}>
                {TR_SAMPLE.map((d, i) => {
                  const x = 14 + i * 54;
                  return (
                    <g key={i}>
                      <rect x={x} y={130 - d.before * 1.6} width={20} height={d.before * 1.6} fill="#7E94A4" />
                      <rect x={x + 22} y={130 - d.after * 1.6} width={20} height={d.after * 1.6} fill="#500000" />
                      <text x={x + 21} y={128} textAnchor="middle" fontSize="8" fill="#5A6470">{d.label.toUpperCase()}</text>
                    </g>
                  );
                })}
              </svg>
              <div style={{ fontSize: "0.62rem", color: "#5A6470", marginTop: 6 }}>Maroon bars vanish against the dark surface.</div>
            </div>
          }
        />
      </div>

      <div style={{ marginBottom: 30 }}>
        <CompareGoodBad
          goodTitle="Hatch fills, no color, in print"
          goodWhy="Print-ready uses crosshatch density to encode series. The reader can distinguish series even from a black-and-white photocopy."
          badTitle="Color-only encoding in print"
          badWhy="Maroon and slate become near-identical mid-grays when photocopied. Series collapse together; the chart becomes unreadable."
          good={
            <Exhibit number="Fig. 4.07" title="Delay reduction" tone="print" source="TTI MIP 2025">
              <TRDualBarChart tone="print" height={160} />
            </Exhibit>
          }
          bad={
            <div style={{ background: "white", padding: 16, border: "1px solid #ccc" }}>
              <div style={{ color: "#000", fontSize: "0.85rem", marginBottom: 8, fontFamily: "Georgia, serif", fontWeight: 700 }}>Delay reduction</div>
              <svg viewBox="0 0 280 130" width="100%" height="130" style={{ display: "block", filter: "grayscale(1)" }}>
                {TR_SAMPLE.map((d, i) => {
                  const x = 14 + i * 54;
                  return (
                    <g key={i}>
                      <rect x={x} y={130 - d.before * 1.6} width={20} height={d.before * 1.6} fill="#7E94A4" />
                      <rect x={x + 22} y={130 - d.after * 1.6} width={20} height={d.after * 1.6} fill="#500000" />
                      <text x={x + 21} y={128} textAnchor="middle" fontSize="8" fill="#666">{d.label.toUpperCase()}</text>
                    </g>
                  );
                })}
              </svg>
              <div style={{ fontSize: "0.62rem", color: "#666", marginTop: 6 }}>Both series read as ambiguous mid-gray when photocopied.</div>
            </div>
          }
        />
      </div>

      <div style={{ marginBottom: 30 }}>
        <CompareGoodBad
          goodTitle="Full citation block on submitted figures"
          goodWhy="Reviewers and procurement officers cite figures by number and DOI. Including this metadata up front cuts back-and-forth during proposal evaluation."
          badTitle="Bare title, no metadata"
          badWhy="A figure with no exhibit number, source line, or methodology cannot be referenced or replicated. RFP reviewers will downgrade for missing citation."
          good={
            <Exhibit
              number="Figure 4.07"
              collection="TxDOT MIP 2025"
              title="Delay reduction"
              caption="Five metros, before & after corridor improvements."
              source="TTI MIP 2025"
              notes="n = 92 corridors. p < 0.05."
              doi="10.5555/tti.mip.2025.4.7"
              license="CC BY 4.0"
              tone="default"
            >
              <TRDualBarChart tone="default" height={160} />
            </Exhibit>
          }
          bad={
            <div style={{ background: "var(--surface-raised)", border: "1px solid var(--surface-border)", padding: "20px 22px", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "1.05rem", fontFamily: "var(--font-display)", marginBottom: 14, textTransform: "uppercase" }}>Delay reduction</div>
              <TRDualBarChart tone="default" height={160} />
            </div>
          }
        />
      </div>

      {/* ─── Spec row ──────────────────────────────────────── */}
      <TRSectionLabel>Spec</TRSectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-raised)" }}>
        <TRSpec label="Standard surface" value="surface-raised" note="bg + 1px border, no fill change to chart palette" />
        <TRSpec label="On-dark surface" value="#0E1216" note="palette warmed: maroon → amber, slate brightened" />
        <TRSpec label="Print fills" value="6 hatch patterns" note="hatch-1 (sparse) through hatch-6 (dense vertical)" />
        <TRSpec label="Citation" value="number · DOI · license" note="Figure number, source, notes, DOI, CC license — all optional but recommended for RFP work" />
      </div>
    </PageShell>
  );
}

window.ChartTreatmentsPage = ChartTreatmentsPage;
