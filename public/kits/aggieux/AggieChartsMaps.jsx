/*
 * AggieChartsMaps.jsx — Geographic charts (chart-maps)
 *
 * Texas county choropleths, TxDOT districts, US-state context, metro
 * insets, dot-density, and origin-destination flows.
 *
 * The Texas / county geometries here are stylized — a simplified hex
 * tessellation that matches county count (254) and approximate spatial
 * relations. For production reports, swap these `<path>` elements with
 * a real GeoJSON layer; the styling system stays identical.
 *
 * Helper prefix: MP.
 */

function MPSectionLabel({ children }) {
  return <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 14, marginTop: 28 }}>{children}</div>;
}

function MPIntro({ children }) {
  return <div style={{ background: "var(--surface-raised)", borderLeft: "3px solid var(--brand-primary)", padding: "16px 20px", marginBottom: 30, fontSize: "0.92rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>{children}</div>;
}

function MPBox({ label, dark, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      {label && <div style={{ fontSize: "0.66rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>{label}</div>}
      <div style={{ background: dark ? "#0E1216" : "var(--surface-base)", border: "1px solid var(--surface-border)", padding: 24, borderRadius: "var(--radius-md)" }}>{children}</div>
    </div>
  );
}

function MPSpec({ label, value, note }) {
  return (
    <div style={{ padding: "16px 18px", borderRight: "1px solid var(--surface-border)" }}>
      <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: "0.82rem", fontFamily: "var(--font-body-bold)", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{value}</div>
      {note && <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.45 }}>{note}</div>}
    </div>
  );
}

function MPSpecRow({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-raised)" }}>{children}</div>;
}

// ═══════════════════════════════════════════════════════════════════════
// Texas outline (highly simplified — recognizable silhouette)
// ═══════════════════════════════════════════════════════════════════════

const TEXAS_OUTLINE_PATH = "M 200 60 L 480 60 L 480 100 L 510 110 L 530 130 L 540 160 L 530 190 L 540 220 L 555 250 L 580 270 L 600 295 L 595 320 L 580 345 L 555 365 L 530 380 L 500 395 L 475 410 L 460 425 L 440 425 L 420 440 L 400 455 L 380 460 L 365 470 L 350 480 L 335 470 L 320 450 L 305 430 L 280 410 L 255 395 L 240 380 L 220 360 L 210 335 L 200 310 L 190 285 L 175 260 L 165 235 L 150 210 L 140 185 L 125 155 L 115 130 L 110 105 L 130 90 L 165 75 L 200 60 Z";

// ═══════════════════════════════════════════════════════════════════════
// Stylized Texas hex grid (proxy for 254 counties)
// ═══════════════════════════════════════════════════════════════════════

// Generate a hex grid clipped to a rough Texas-shape mask.
// We pre-compute hex centers and a value for each.

function generateTexasHexes(rows = 18, cols = 26, jitter = 0.6) {
  const hexes = [];
  const hexW = 22;
  const hexH = 26;
  const xOff = 100;
  const yOff = 60;

  // Rough Texas mask: distance from centerline, with panhandle on top
  function isInside(x, y) {
    // Panhandle (top)
    if (y < 100) {
      return x > 200 && x < 320;
    }
    // West Texas
    if (y < 250) {
      const t = (y - 100) / 150;
      const left = 200 - t * 80;
      const right = 470 + t * 30;
      return x > left && x < right;
    }
    // South / Central / coast
    if (y < 380) {
      const t = (y - 250) / 130;
      const left = 120 + t * 80;
      const right = 500 - t * 60;
      return x > left && x < right;
    }
    // Coast / Rio Grande tip
    if (y < 460) {
      const t = (y - 380) / 80;
      const left = 200 + t * 70;
      const right = 440 - t * 80;
      return x > left && x < right;
    }
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = xOff + c * hexW + (r % 2) * (hexW / 2);
      const y = yOff + r * (hexH * 0.78);
      if (isInside(x, y)) {
        // Seeded pseudo-random value in 0..1 for the demo data
        const val = (Math.sin(r * 7.13 + c * 3.71) * 0.5 + 0.5);
        hexes.push({ x, y, r, c, val });
      }
    }
  }
  return { hexes, hexW, hexH };
}

const TEXAS_HEXES = generateTexasHexes();

function hexPath(cx, cy, size) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    pts.push(`${cx + size * Math.cos(a)},${cy + size * Math.sin(a)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

// ═══════════════════════════════════════════════════════════════════════
// Texas county choropleth
// ═══════════════════════════════════════════════════════════════════════

function TexasChoropleth({
  width = 720, height = 460, tone = "default",
  ramp,                          // 5-step color array
  title, valueOf,                // valueOf(hex) → 0..1
  showLegend = true,
  legendLabel = "Value",
  legendStops = ["Low", "", "", "", "High"],
}) {
  const t = window.useToneTokens(tone);
  const palette = ramp || (tone === "dark"
    ? MAP_PALETTE.sequentialMaroonDark
    : MAP_PALETTE.sequentialMaroon);

  function bucket(v) {
    return Math.min(palette.length - 1, Math.floor(v * palette.length));
  }

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ display: "block" }}>
        {/* Texas state outline (subtle) */}
        <path d={TEXAS_OUTLINE_PATH} fill="none" stroke={t.border} strokeWidth="1.5" />

        {/* Hex tiles */}
        {TEXAS_HEXES.hexes.map((h, i) => {
          const v = valueOf ? valueOf(h) : h.val;
          return (
            <path
              key={i}
              d={hexPath(h.x, h.y, 11)}
              fill={palette[bucket(v)]}
              stroke={t.bg}
              strokeWidth="0.6"
            />
          );
        })}

        {/* Title overlay */}
        {title && (
          <text x={width - 12} y="28" textAnchor="end" fontSize="10" fill={t.textMuted} fontFamily="var(--font-body-bold)" letterSpacing="0.1em" fontWeight="700">{title.toUpperCase()}</text>
        )}

        {/* Legend (bottom-left) */}
        {showLegend && (
          <g transform={`translate(110, ${height - 56})`}>
            <text x="0" y="-8" fontSize="9" fill={t.textMuted} fontFamily="var(--font-body-bold)" letterSpacing="0.1em" fontWeight="700">{legendLabel.toUpperCase()}</text>
            {palette.map((c, i) => (
              <rect key={i} x={i * 28} y="0" width="28" height="12" fill={c} stroke={t.bg} strokeWidth="0.6" />
            ))}
            {legendStops.map((s, i) => (
              <text key={i} x={i * 28 + 14} y="26" textAnchor="middle" fontSize="8" fill={t.textMuted} fontFamily="var(--font-mono)">{s}</text>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TxDOT districts (25 regions) — stylized polygon set
// ═══════════════════════════════════════════════════════════════════════

const TXDOT_DISTRICTS = [
  { id: 1, name: "Paris", value: 0.45, path: "M 380 70 L 470 70 L 470 110 L 410 115 L 380 95 Z" },
  { id: 2, name: "Fort Worth", value: 0.78, path: "M 320 100 L 380 95 L 410 115 L 410 145 L 360 160 L 320 145 Z" },
  { id: 3, name: "Wichita Falls", value: 0.34, path: "M 250 80 L 320 100 L 320 145 L 280 145 L 250 130 Z" },
  { id: 4, name: "Amarillo", value: 0.42, path: "M 220 60 L 290 60 L 290 100 L 250 100 L 220 90 Z" },
  { id: 5, name: "Lubbock", value: 0.39, path: "M 200 100 L 270 100 L 270 145 L 230 150 L 200 135 Z" },
  { id: 6, name: "Odessa", value: 0.36, path: "M 150 145 L 230 150 L 230 200 L 180 210 L 150 185 Z" },
  { id: 7, name: "San Angelo", value: 0.44, path: "M 200 200 L 280 195 L 285 245 L 240 250 L 200 230 Z" },
  { id: 8, name: "Abilene", value: 0.48, path: "M 250 145 L 320 145 L 320 195 L 285 200 L 250 195 Z" },
  { id: 9, name: "Waco", value: 0.66, path: "M 320 145 L 380 150 L 385 200 L 340 200 L 320 195 Z" },
  { id: 10, name: "Tyler", value: 0.72, path: "M 410 130 L 470 130 L 480 175 L 430 180 L 410 165 Z" },
  { id: 11, name: "Lufkin", value: 0.55, path: "M 430 180 L 490 175 L 495 225 L 450 230 L 430 220 Z" },
  { id: 12, name: "Houston", value: 0.95, path: "M 410 240 L 480 235 L 495 285 L 450 295 L 410 290 Z" },
  { id: 13, name: "Yoakum", value: 0.51, path: "M 350 270 L 410 270 L 415 315 L 370 320 L 350 305 Z" },
  { id: 14, name: "Austin", value: 0.86, path: "M 320 235 L 385 235 L 390 280 L 350 285 L 320 275 Z" },
  { id: 15, name: "San Antonio", value: 0.79, path: "M 280 280 L 350 285 L 355 330 L 310 335 L 280 320 Z" },
  { id: 16, name: "Corpus Christi", value: 0.62, path: "M 350 320 L 410 320 L 410 365 L 370 370 L 350 355 Z" },
  { id: 17, name: "Bryan", value: 0.58, path: "M 380 195 L 440 200 L 440 240 L 400 245 L 380 235 Z" },
  { id: 18, name: "Dallas", value: 0.92, path: "M 360 110 L 425 115 L 430 155 L 390 160 L 360 150 Z" },
  { id: 19, name: "Atlanta", value: 0.49, path: "M 470 70 L 535 75 L 540 120 L 490 125 L 470 110 Z" },
  { id: 20, name: "Beaumont", value: 0.68, path: "M 490 220 L 555 215 L 560 265 L 510 270 L 490 255 Z" },
  { id: 21, name: "Pharr", value: 0.59, path: "M 290 380 L 360 385 L 360 430 L 310 435 L 290 415 Z" },
  { id: 22, name: "Laredo", value: 0.41, path: "M 220 320 L 280 320 L 285 370 L 240 375 L 220 360 Z" },
  { id: 23, name: "Brownwood", value: 0.46, path: "M 285 200 L 350 195 L 355 235 L 320 245 L 285 235 Z" },
  { id: 24, name: "El Paso", value: 0.71, path: "M 110 110 L 180 105 L 185 165 L 150 170 L 110 150 Z" },
  { id: 25, name: "Childress", value: 0.31, path: "M 290 60 L 360 65 L 360 105 L 320 110 L 290 100 Z" },
];

function TxDOTDistrictMap({ width = 720, height = 480, tone = "default", ramp, title, legendLabel = "Density", legendStops = ["Low", "", "", "", "High"] }) {
  const t = window.useToneTokens(tone);
  const palette = ramp || (tone === "dark" ? MAP_PALETTE.sequentialSlateDark : MAP_PALETTE.sequentialSlate);

  function bucket(v) {
    return Math.min(palette.length - 1, Math.floor(v * palette.length));
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ display: "block" }}>
      <path d={TEXAS_OUTLINE_PATH} fill="none" stroke={t.border} strokeWidth="1.5" />
      {TXDOT_DISTRICTS.map((d, i) => (
        <g key={i}>
          <path d={d.path} fill={palette[bucket(d.value)]} stroke={t.bg} strokeWidth="1" />
          {/* District number badge — at centroid (approximate) */}
          {(() => {
            // crude centroid: average of point coords
            const points = d.path.match(/[\d.]+/g).map(Number);
            let cx = 0, cy = 0, n = 0;
            for (let j = 0; j < points.length; j += 2) { cx += points[j]; cy += points[j+1]; n += 1; }
            cx /= n; cy /= n;
            return (
              <g>
                <text x={cx} y={cy + 2} textAnchor="middle" fontSize="9" fill="white" fontFamily="var(--font-mono)" fontWeight="700">{d.id}</text>
              </g>
            );
          })()}
        </g>
      ))}

      {title && (
        <text x={width - 12} y="28" textAnchor="end" fontSize="10" fill={t.textMuted} fontFamily="var(--font-body-bold)" letterSpacing="0.1em" fontWeight="700">{title.toUpperCase()}</text>
      )}

      {/* Legend */}
      <g transform={`translate(110, ${height - 56})`}>
        <text x="0" y="-8" fontSize="9" fill={t.textMuted} fontFamily="var(--font-body-bold)" letterSpacing="0.1em" fontWeight="700">{legendLabel.toUpperCase()}</text>
        {palette.map((c, i) => (
          <rect key={i} x={i * 28} y="0" width="28" height="12" fill={c} stroke={t.bg} strokeWidth="0.6" />
        ))}
        {legendStops.map((s, i) => (
          <text key={i} x={i * 28 + 14} y="26" textAnchor="middle" fontSize="8" fill={t.textMuted} fontFamily="var(--font-mono)">{s}</text>
        ))}
      </g>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// US states context map (stylized — Texas highlighted)
// ═══════════════════════════════════════════════════════════════════════

const US_STATE_GRID = [
  // Stylized hex-grid layout where each state is one hex.
  // Format: { code, name, col, row, value }
  { code: "AK", col: 0, row: 0, value: 0.1 },
  { code: "WA", col: 6, row: 0, value: 0.4 }, { code: "MT", col: 7, row: 0, value: 0.2 }, { code: "ND", col: 8, row: 0, value: 0.3 }, { code: "MN", col: 9, row: 0, value: 0.5 }, { code: "WI", col: 10, row: 0, value: 0.5 }, { code: "MI", col: 11, row: 0, value: 0.5 }, { code: "ME", col: 13, row: 0, value: 0.3 },
  { code: "OR", col: 6, row: 1, value: 0.4 }, { code: "ID", col: 7, row: 1, value: 0.2 }, { code: "SD", col: 8, row: 1, value: 0.2 }, { code: "IA", col: 9, row: 1, value: 0.5 }, { code: "IL", col: 10, row: 1, value: 0.6 }, { code: "IN", col: 11, row: 1, value: 0.6 }, { code: "OH", col: 12, row: 1, value: 0.6 }, { code: "PA", col: 13, row: 1, value: 0.7 }, { code: "NJ", col: 14, row: 1, value: 0.7 }, { code: "NY", col: 13, row: 0, value: 0.7 }, { code: "VT", col: 12, row: 0, value: 0.3 }, { code: "NH", col: 14, row: 0, value: 0.3 }, { code: "MA", col: 14, row: 0, value: 0.6 },
  { code: "CA", col: 5, row: 2, value: 0.7 }, { code: "NV", col: 6, row: 2, value: 0.4 }, { code: "UT", col: 7, row: 2, value: 0.4 }, { code: "WY", col: 8, row: 2, value: 0.2 }, { code: "NE", col: 9, row: 2, value: 0.3 }, { code: "MO", col: 10, row: 2, value: 0.5 }, { code: "KY", col: 11, row: 2, value: 0.5 }, { code: "WV", col: 12, row: 2, value: 0.4 }, { code: "VA", col: 13, row: 2, value: 0.6 }, { code: "MD", col: 14, row: 2, value: 0.5 }, { code: "DE", col: 15, row: 2, value: 0.4 }, { code: "RI", col: 15, row: 1, value: 0.4 }, { code: "CT", col: 14, row: 1, value: 0.6 },
  { code: "AZ", col: 5, row: 3, value: 0.5 }, { code: "NM", col: 6, row: 3, value: 0.4 }, { code: "CO", col: 7, row: 3, value: 0.5 }, { code: "KS", col: 8, row: 3, value: 0.4 }, { code: "AR", col: 9, row: 3, value: 0.5 }, { code: "TN", col: 10, row: 3, value: 0.6 }, { code: "NC", col: 12, row: 3, value: 0.6 }, { code: "SC", col: 12, row: 4, value: 0.5 }, { code: "MS", col: 9, row: 4, value: 0.4 }, { code: "AL", col: 10, row: 4, value: 0.5 }, { code: "GA", col: 11, row: 4, value: 0.6 }, { code: "OK", col: 7, row: 4, value: 0.6 },
  { code: "TX", col: 6, row: 5, value: 1.0 }, { code: "LA", col: 8, row: 5, value: 0.5 }, { code: "FL", col: 11, row: 5, value: 0.7 },
  { code: "HI", col: 1, row: 6, value: 0.2 },
];

function USStatesContextMap({ width = 720, height = 280, tone = "default", highlight = "TX", ramp }) {
  const t = window.useToneTokens(tone);
  const palette = ramp || (tone === "dark" ? MAP_PALETTE.sequentialMaroonDark : MAP_PALETTE.sequentialMaroon);
  const hexW = 32;
  const hexH = 36;
  const xOff = 50;
  const yOff = 30;

  function bucket(v) {
    return Math.min(palette.length - 1, Math.floor(v * palette.length));
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ display: "block" }}>
      {US_STATE_GRID.map((s, i) => {
        const cx = xOff + s.col * hexW + (s.row % 2) * (hexW / 2);
        const cy = yOff + s.row * (hexH * 0.78);
        const isHi = s.code === highlight;
        return (
          <g key={i}>
            <path
              d={hexPath(cx, cy, 16)}
              fill={isHi ? "var(--brand-primary)" : palette[bucket(s.value)]}
              stroke={isHi ? "var(--brand-primary)" : t.bg}
              strokeWidth={isHi ? 2.5 : 1}
              opacity={isHi ? 1 : 0.85}
            />
            <text x={cx} y={cy + 3} textAnchor="middle" fontSize="9" fill={isHi ? "white" : (s.value > 0.5 ? "white" : t.text)} fontFamily="var(--font-mono)" fontWeight="700">{s.code}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Metro inset — stylized neighborhood grid with one or two highlighted
// ═══════════════════════════════════════════════════════════════════════

function MetroInset({ name, label, height = 240, tone = "default" }) {
  const t = window.useToneTokens(tone);
  const palette = tone === "dark" ? MAP_PALETTE.sequentialMaroonDark : MAP_PALETTE.sequentialMaroon;

  // 8x6 grid representing neighborhoods; values seeded by metro
  const seed = name.charCodeAt(0);
  const rows = 6;
  const cols = 8;
  const cellW = 36;
  const cellH = 28;
  const W = cols * cellW + 40;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = (Math.sin((r * 7 + c * 11 + seed) * 1.3) * 0.5 + 0.5);
      cells.push({ r, c, v });
    }
  }

  return (
    <div>
      <div style={{ fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.12em", color: t.textMuted, fontFamily: "var(--font-body-bold)", fontWeight: 700, marginBottom: 8 }}>{name}</div>
      <svg viewBox={`0 0 ${W} ${height}`} width="100%" height={height} style={{ display: "block" }}>
        {cells.map((cell, i) => {
          const x = 20 + cell.c * cellW;
          const y = 20 + cell.r * cellH;
          const idx = Math.min(palette.length - 1, Math.floor(cell.v * palette.length));
          return <rect key={i} x={x} y={y} width={cellW - 1} height={cellH - 1} fill={palette[idx]} stroke={t.bg} strokeWidth="0.5" />;
        })}
        {/* Highway overlay — diagonal */}
        <line x1={30} y1={40} x2={W - 20} y2={height - 30} stroke={tone === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)"} strokeWidth="2.5" />
        <line x1={30} y1={40} x2={W - 20} y2={height - 30} stroke={tone === "dark" ? "#0E1216" : "white"} strokeWidth="0.8" strokeDasharray="6 4" />
        {/* Highway label */}
        <rect x={W / 2 - 16} y={height / 2 - 8} width="32" height="14" fill={tone === "dark" ? "#E89B7E" : "var(--brand-primary)"} />
        <text x={W / 2} y={height / 2 + 2} textAnchor="middle" fontSize="8" fill="white" fontFamily="var(--font-mono)" fontWeight="700">{label}</text>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Dot density map
// ═══════════════════════════════════════════════════════════════════════

function DotDensityTexas({ width = 720, height = 460, tone = "default", dotsPerHex = 6 }) {
  const t = window.useToneTokens(tone);
  const dotColor = tone === "dark" ? "#E89B7E" : "var(--brand-primary)";

  // For each hex, generate `dotsPerHex × value` dots, scattered inside
  const dots = [];
  TEXAS_HEXES.hexes.forEach(h => {
    const count = Math.round(h.val * dotsPerHex * 4);
    for (let i = 0; i < count; i++) {
      const ang = ((i * 137) % 360) * Math.PI / 180;
      const r = (Math.sin(i * 1.3 + h.r * 0.7) * 0.5 + 0.5) * 9;
      dots.push({ x: h.x + r * Math.cos(ang), y: h.y + r * Math.sin(ang) });
    }
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ display: "block" }}>
      <path d={TEXAS_OUTLINE_PATH} fill={tone === "dark" ? "#1A2129" : "var(--surface-sunken)"} stroke={t.border} strokeWidth="1.5" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="1.4" fill={dotColor} fillOpacity="0.65" />
      ))}
      {/* Legend */}
      <g transform={`translate(120, ${height - 50})`}>
        <text x="0" y="-6" fontSize="9" fill={t.textMuted} fontFamily="var(--font-body-bold)" letterSpacing="0.1em" fontWeight="700">1 DOT = 100 INCIDENTS</text>
        <circle cx="0" cy="8" r="1.4" fill={dotColor} fillOpacity="0.65" />
      </g>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Origin-Destination flow map
// ═══════════════════════════════════════════════════════════════════════

const TX_METROS = [
  { code: "DFW", name: "Dallas–Fort Worth", x: 380, y: 145 },
  { code: "HOU", name: "Houston", x: 460, y: 290 },
  { code: "SAT", name: "San Antonio", x: 320, y: 320 },
  { code: "AUS", name: "Austin", x: 360, y: 270 },
  { code: "ELP", name: "El Paso", x: 145, y: 145 },
  { code: "MCA", name: "McAllen", x: 320, y: 410 },
  { code: "LBB", name: "Lubbock", x: 230, y: 130 },
];

function ODFlowMap({ width = 720, height = 460, tone = "default", flows }) {
  const t = window.useToneTokens(tone);
  const flowColor = tone === "dark" ? "#E89B7E" : "var(--brand-primary)";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ display: "block" }}>
      <path d={TEXAS_OUTLINE_PATH} fill={tone === "dark" ? "#1A2129" : "var(--surface-sunken)"} stroke={t.border} strokeWidth="1.5" />

      {/* Flow arcs */}
      {flows.map((f, i) => {
        const o = TX_METROS.find(m => m.code === f.from);
        const d = TX_METROS.find(m => m.code === f.to);
        if (!o || !d) return null;
        const dx = d.x - o.x;
        const dy = d.y - o.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mx = (o.x + d.x) / 2 + (-dy / dist) * dist * 0.18;
        const my = (o.y + d.y) / 2 + (dx / dist) * dist * 0.18;
        const w = 1 + (f.value / 100) * 6;
        return (
          <g key={i}>
            <path d={`M ${o.x} ${o.y} Q ${mx} ${my} ${d.x} ${d.y}`} fill="none" stroke={flowColor} strokeWidth={w} strokeOpacity="0.6" markerEnd={`url(#odArrow-${tone})`} />
          </g>
        );
      })}

      {/* Metros */}
      {TX_METROS.map((m, i) => (
        <g key={i}>
          <circle cx={m.x} cy={m.y} r="6" fill={t.bg} stroke={tone === "dark" ? "white" : "#000"} strokeWidth="1.5" />
          <text x={m.x} y={m.y - 12} textAnchor="middle" fontSize="9" fill={t.text} fontFamily="var(--font-body-bold)" fontWeight="700" letterSpacing="0.06em">{m.code}</text>
        </g>
      ))}

      <defs>
        <marker id={`odArrow-${tone}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={flowColor} fillOpacity="0.7" />
        </marker>
      </defs>

      {/* Legend */}
      <g transform={`translate(${width - 180}, ${height - 60})`}>
        <text x="0" y="-6" fontSize="9" fill={t.textMuted} fontFamily="var(--font-body-bold)" letterSpacing="0.1em" fontWeight="700">DAILY TRIPS (THOUSANDS)</text>
        {[20, 50, 100].map((v, i) => (
          <g key={i} transform={`translate(${i * 50}, 10)`}>
            <line x1="0" y1="0" x2="36" y2="0" stroke={flowColor} strokeWidth={1 + (v / 100) * 6} strokeOpacity="0.6" />
            <text x="18" y="15" textAnchor="middle" fontSize="8" fill={t.textMuted} fontFamily="var(--font-mono)">{v}K</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PAGE — chart-maps
// ═══════════════════════════════════════════════════════════════════════

function ChartMapsPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "chart-maps");

  const odFlows = [
    { from: "DFW", to: "HOU", value: 95 },
    { from: "AUS", to: "SAT", value: 60 },
    { from: "AUS", to: "DFW", value: 55 },
    { from: "AUS", to: "HOU", value: 45 },
    { from: "HOU", to: "SAT", value: 38 },
    { from: "DFW", to: "SAT", value: 30 },
    { from: "ELP", to: "DFW", value: 12 },
    { from: "LBB", to: "DFW", value: 18 },
    { from: "MCA", to: "SAT", value: 28 },
  ];

  return (
    <PageShell item={item}>
      <MPIntro>
        Maps are the centerpiece of any TTI report. The choices that matter: <strong>what geography</strong> (county, district, metro, state), <strong>what encoding</strong> (color ramp, dots, bars, flows), <strong>what scale</strong> (sequential, diverging, categorical). Every map below shares the same legend system, label hierarchy, and signature treatment so a multi-figure report reads as one document.
      </MPIntro>

      {/* ─── 1. County choropleth ──────────────────────── */}
      <MPSectionLabel>1 · Texas county choropleth — sequential maroon</MPSectionLabel>
      <MPBox label="Standard 5-step sequential ramp on stylized hex-grid (254 hexes, one per county)">
        <Exhibit
          number="Exhibit 11.01"
          title="Vehicle miles traveled per capita, by Texas county · 2024"
          source="TTI Travel Behavior Survey · 2024; Texas Demographic Center population estimates"
          notes="Annual VMT divided by ACS-estimated resident population. Five quantile bins. Hex-grid is a stylized proxy for the actual county geometry; for production reports, replace with the GeoJSON layer."
          tone="default"
        >
          <TexasChoropleth
            width={720} height={460} tone="default"
            title="VMT per capita"
            legendLabel="VMT per capita"
            legendStops={["≤ 6K", "6–9K", "9–12K", "12–15K", "≥ 15K"]}
          />
        </Exhibit>
      </MPBox>

      <MPBox label="On dark — same data, slide-deck treatment" dark>
        <Exhibit
          number="Slide 9"
          title="Where Texans drive most"
          tone="dark"
          source="TTI Travel Behavior Survey · 2024"
        >
          <TexasChoropleth
            width={720} height={420} tone="dark"
            title="VMT per capita"
            legendLabel="VMT per capita"
            legendStops={["LOW", "", "", "", "HIGH"]}
          />
        </Exhibit>
      </MPBox>

      {/* ─── 2. TxDOT districts ───────────────────────── */}
      <MPSectionLabel>2 · TxDOT districts (25 regions)</MPSectionLabel>
      <MPBox label="Coarser geography — easier to label, faster to read">
        <Exhibit
          number="Exhibit 11.02"
          title="Project-priority score by TxDOT district · MIP 2025 cycle"
          source="TTI Mobility Investment Priorities · 2025"
          notes="Composite score from 25 district-submitted project portfolios. Districts numbered per TxDOT engineering directive."
          tone="default"
        >
          <TxDOTDistrictMap width={720} height={480} tone="default" title="Project-priority score" legendLabel="Score" legendStops={["LOW", "", "", "", "HIGH"]} />
        </Exhibit>
      </MPBox>

      {/* ─── 3. US states context ─────────────────────── */}
      <MPSectionLabel>3 · US states context — Texas highlighted</MPSectionLabel>
      <MPBox label="National-context inset for proposals that compare Texas to peer states">
        <Exhibit
          number="Exhibit 11.03"
          title="Federal transportation R&D dollars per capita, FY24"
          source="USDOT FHWA grant database · 2024"
          notes="Hex-grid layout (Tilegrams) used so Rhode Island, Delaware, etc. remain visible. Texas highlighted for proposal context."
          tone="default"
        >
          <USStatesContextMap width={720} height={280} tone="default" highlight="TX" />
        </Exhibit>
      </MPBox>

      {/* ─── 4. Metro insets ──────────────────────────── */}
      <MPSectionLabel>4 · Metro insets — 4-up</MPSectionLabel>
      <MPBox label="Side-by-side neighborhood-level views for Houston, Austin, DFW, San Antonio">
        <Exhibit
          number="Exhibit 11.04"
          title="Tract-level commute-time variability across four Texas metros"
          source="ACS 5-year tract estimates · 2020–2024"
          notes="Each grid cell is one census tract. Highway overlay shows the primary corridor through each metro."
          tone="default"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
            <MetroInset name="Houston" label="I-45" tone="default" height={200} />
            <MetroInset name="Dallas–Fort Worth" label="I-35E" tone="default" height={200} />
            <MetroInset name="Austin" label="I-35" tone="default" height={200} />
            <MetroInset name="San Antonio" label="I-10" tone="default" height={200} />
          </div>
        </Exhibit>
      </MPBox>

      {/* ─── 5. Dot density ──────────────────────────── */}
      <MPSectionLabel>5 · Dot density — incident locations</MPSectionLabel>
      <MPBox label="Each dot represents an event. Use when the geographic distribution itself is the message.">
        <Exhibit
          number="Exhibit 11.05"
          title="Reported pedestrian-involved crashes, Texas · 2024"
          source="TxDOT Crash Records Information System · 2024"
          notes="Each dot represents 100 reported incidents, distributed within county boundaries. n = 8,432 incidents statewide."
          tone="default"
        >
          <DotDensityTexas width={720} height={460} tone="default" dotsPerHex={5} />
        </Exhibit>
      </MPBox>

      {/* ─── 6. OD flows ─────────────────────────────── */}
      <MPSectionLabel>6 · Origin–Destination flows</MPSectionLabel>
      <MPBox label="Curved arcs between metro pairs; line width encodes daily trip volume">
        <Exhibit
          number="Exhibit 11.06"
          title="Inter-metro daily trip flows, Texas · 2024"
          source="TTI Inter-City Travel Survey · 2024"
          notes="Trip volumes in thousands of daily one-way person-trips. Arc width scales linearly with volume; only flows ≥ 10K shown."
          tone="default"
        >
          <ODFlowMap width={720} height={460} tone="default" flows={odFlows} />
        </Exhibit>
      </MPBox>

      <MPBox dark label="On dark — for slide decks">
        <Exhibit number="Slide 14" title="Texas inter-metro trip flows" tone="dark" source="TTI · 2024">
          <ODFlowMap width={720} height={420} tone="dark" flows={odFlows} />
        </Exhibit>
      </MPBox>

      {/* ─── Don't do this ───────────────────────────── */}
      <MPSectionLabel>Don't do this</MPSectionLabel>
      <CompareGoodBad
        goodTitle="Sequential ramp for ordered data"
        goodWhy="Maroon goes from light to saturated in one direction. The reader's eye reads the chart in seconds, with no ambiguity about which end is 'high.'"
        badTitle="Rainbow ramp for ordered data"
        badWhy="Rainbow has no perceptual order — yellow doesn't read as 'higher than green.' Worse, ~8% of male readers can't distinguish red from green; the chart fails entirely for them."
        good={<TexasChoropleth width={400} height={260} tone="default" showLegend={false} title="Sequential" />}
        bad={
          <svg viewBox="0 0 400 260" width="100%" height="260">
            <path d={TEXAS_OUTLINE_PATH} fill="none" stroke="var(--surface-border)" strokeWidth="1" transform="scale(0.55) translate(0, 20)" />
            {TEXAS_HEXES.hexes.slice(0, 90).map((h, i) => {
              const rainbow = ["#FF0000", "#FF8800", "#FFFF00", "#00FF00", "#00CCFF", "#0000FF", "#8800FF"];
              const color = rainbow[Math.floor(h.val * rainbow.length)];
              return <path key={i} d={hexPath(h.x * 0.55, h.y * 0.55 + 11, 6)} fill={color} stroke="white" strokeWidth="0.4" />;
            })}
          </svg>
        }
      />

      <div style={{ marginTop: 22 }}>
        <CompareGoodBad
          goodTitle="One color per encoding dimension"
          goodWhy="Choropleth uses maroon for the data; outline is a neutral hairline. Reader is never confused about which color carries information."
          badTitle="Decorative state-flag colors layered on data"
          badWhy="Adding flag colors on top of a data-encoding ramp creates a chart with two competing color systems. The reader can't tell which color is informational."
          good={<TexasChoropleth width={380} height={240} tone="default" showLegend={false} title="One encoding" />}
          bad={
            <div style={{ position: "relative" }}>
              <TexasChoropleth width={380} height={240} tone="default" showLegend={false} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #002868 0 33%, #ffffff 33% 66%, #BF0A30 66%)", opacity: 0.45, mixBlendMode: "multiply", pointerEvents: "none" }} />
            </div>
          }
        />
      </div>

      <MPSectionLabel>Spec</MPSectionLabel>
      <MPSpecRow>
        <MPSpec label="County ramp" value="5-step sequential" note="quantile bins; never linear-scale (one outlier washes out everything else)" />
        <MPSpec label="District ramp" value="5-step sequential slate" note="for non-traffic data; 5-step maroon for traffic-direct metrics" />
        <MPSpec label="Outline weight" value="1.5px hairline" note="state outline is a structural reference, not a data element" />
        <MPSpec label="Legend position" value="bottom-left" note="ramp + numeric labels + units. Always include units in the legend label." />
      </MPSpecRow>
    </PageShell>
  );
}

window.ChartMapsPage = ChartMapsPage;
window.TexasChoropleth = TexasChoropleth;
window.TxDOTDistrictMap = TxDOTDistrictMap;
window.USStatesContextMap = USStatesContextMap;
window.MetroInset = MetroInset;
window.DotDensityTexas = DotDensityTexas;
window.ODFlowMap = ODFlowMap;
