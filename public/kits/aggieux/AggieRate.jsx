/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieRate.jsx — INF-4.5b: star rating component.
 *
 *   Rate — N-icon rating component (default: stars). Display-only and
 *          interactive variants. Half-step precision. Custom-icon variant
 *          for non-star vocabularies (hearts, flags). For research-app
 *          surveys ("how confident are you in this estimate?"),
 *          publication ratings, and reviewer scoring panels. Distinct
 *          from `slider` (continuous range) and `stat-comparison`
 *          (display-only stat): rate is a discrete N-of-M visual choice.
 *
 * Lineage (INF-4.5b):
 *   • Bootstrap 5 Design System Rate (3 frames: default star + custom-icon
 *     star + assembly across triple / quadruple / quintuple item counts and
 *     0 / 0.5 / 1.0 / 1.5 … 5.0 ratings). Bootstrap ships 20×31px star
 *     cells with 8px gap. TUX adopts the geometry and swaps in: Lucide
 *     star icons, brand maroon for filled state, gold accent on dark,
 *     2px focus ring on the entire rate cluster.
 *
 * Identity stays TUX: maroon brand for filled stars; gold on dark; never
 * the Bootstrap purple-pink (#7B61FF) star accent.
 *
 * Helper prefix: RT (Rate). Local helpers only.
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (RT prefix)
// ════════════════════════════════════════════════════════════════════════

function RTBox({ dark = false, label, padded = true, children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{
        padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
        color: dark ? "rgba(255,255,255,0.8)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)",
        background: dark ? "var(--brand-primary)" : "var(--surface-sunken)",
        borderBottom: "1px solid var(--surface-border)", display: "flex", justifyContent: "space-between",
      }}>
        <span>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, opacity: 0.7 }}>on {dark ? "dark" : "light"}</span>
      </div>
      <div style={{ padding: padded ? 28 : 0, background: dark ? "var(--brand-primary)" : "var(--surface-page)" }}>{children}</div>
    </div>
  );
}

function RTSectionLabel({ children }) {
  return (
    <h3 style={{
      fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 600, textTransform: "lowercase",
      letterSpacing: "0.10em", color: "var(--text-muted)", margin: "32px 0 12px",
    }}>{children}</h3>
  );
}

function RTSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 18 }}>
      {children}
    </div>
  );
}

function RTSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "0.82rem", color: "var(--text-primary)", marginBottom: 4 }}>{value}</div>
      {note ? <div style={{ fontFamily: "var(--font-body)", fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{note}</div> : null}
    </div>
  );
}

function RTIntro({ children }) {
  return (
    <div style={{ borderLeft: "3px solid var(--brand-primary)", padding: "8px 16px", margin: "0 0 28px", background: "var(--surface-raised)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0" }}>
      <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "0.9rem", lineHeight: 1.55, color: "var(--text-primary)", maxWidth: 760 }}>{children}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// RATE primitive
// ════════════════════════════════════════════════════════════════════════

// Renders a single rate cell that handles 0 / 0.5 / 1 fill via clip-path on
// an inner filled icon layered over an outline base.
function RTCell({ fill, size = 20, color, outlineColor, icon, onHover, onClick, onLeave, ariaLabel }) {
  // fill: 0 | 0.5 | 1
  const showInnerFilled = fill > 0;
  const clipPath = fill === 0.5 ? "inset(0 50% 0 0)" : (fill === 1 ? "none" : "inset(0 100% 0 0)");
  return (
    <span
      role="button"
      aria-label={ariaLabel}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        position: "relative",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: size, height: size,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {/* outline (always present) */}
      <LucideIcon name={icon} size={size} color={outlineColor} strokeWidth={1.8} />
      {/* filled overlay, clipped */}
      {showInnerFilled ? (
        <span style={{
          position: "absolute", inset: 0,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          clipPath, WebkitClipPath: clipPath,
          pointerEvents: "none",
        }}>
          {/* Lucide doesn't ship a guaranteed filled star — overlay the same icon with fill prop */}
          <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            {icon === "heart" ? (
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            ) : icon === "flag" ? (
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22V15"/>
            ) : (
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            )}
          </svg>
        </span>
      ) : null}
    </span>
  );
}

function RTRate({
  value = 0,
  count = 5,
  size = 22,
  gap = 8,
  precision = 0.5,           // 0.5 | 1
  icon = "star",             // 'star' | 'heart' | 'flag'
  readOnly = false,
  dark = false,
  onChange,
  ariaLabel = "Rating",
}) {
  const [hover, setHover] = React.useState(null);  // null | float
  const displayValue = hover != null ? hover : value;
  const color = dark ? "var(--brand-accent)" : "var(--brand-primary)";
  const outlineColor = dark ? "rgba(255,255,255,0.55)" : "var(--text-muted)";

  const handleHover = (i, half) => {
    if (readOnly) return;
    setHover(precision === 0.5 && half ? i - 0.5 : i);
  };
  const handleClick = (i, half) => {
    if (readOnly || !onChange) return;
    const next = precision === 0.5 && half ? i - 0.5 : i;
    onChange(next === value ? 0 : next);
  };

  const cells = [];
  for (let i = 1; i <= count; i++) {
    const fill = displayValue >= i ? 1 : (displayValue >= i - 0.5 ? 0.5 : 0);
    if (readOnly) {
      cells.push(
        <RTCell key={i}
          icon={icon} size={size} color={color} outlineColor={outlineColor}
          fill={fill}
          ariaLabel={`${i} ${i === 1 ? "star" : "stars"}`}
        />
      );
    } else {
      // Render a clickable wrapper that splits horizontally into a half-area and full-area
      // for half-step precision.
      cells.push(
        <span key={i} style={{ position: "relative", width: size, height: size, display: "inline-block" }}>
          <RTCell
            icon={icon} size={size} color={color} outlineColor={outlineColor}
            fill={fill}
            ariaLabel={`${i} ${i === 1 ? "star" : "stars"}`}
          />
          {/* left half hit-area */}
          {precision === 0.5 ? (
            <span
              onMouseEnter={() => handleHover(i, true)}
              onClick={() => handleClick(i, true)}
              style={{ position: "absolute", left: 0, top: 0, width: size / 2, height: size, cursor: "pointer" }}
            />
          ) : null}
          {/* right (full) hit-area */}
          <span
            onMouseEnter={() => handleHover(i, false)}
            onClick={() => handleClick(i, false)}
            style={{
              position: "absolute",
              left: precision === 0.5 ? size / 2 : 0,
              top: 0,
              width: precision === 0.5 ? size / 2 : size,
              height: size,
              cursor: "pointer",
            }}
          />
        </span>
      );
    }
  }

  return (
    <span
      role="img"
      aria-label={`${ariaLabel}: ${value} of ${count}`}
      onMouseLeave={() => setHover(null)}
      style={{
        display: "inline-flex", alignItems: "center", gap,
        fontFamily: "var(--font-body)",
        lineHeight: 0,
      }}
    >
      {cells}
    </span>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════════════════════

function RatePage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "rate");

  // Interactive demos
  const [v1, setV1] = React.useState(3.5);
  const [v2, setV2] = React.useState(0);
  const [v3, setV3] = React.useState(4);
  const [v4, setV4] = React.useState(2.5);

  return (
    <PageShell item={item}>
      <RTIntro>
        N-icon rating for surveys, publication scoring, and reviewer panels.
        Half-step precision (the default — click the left half of a star
        for 0.5) and full-step. Display-only and interactive modes. Custom-icon
        variants (heart, flag) for non-star vocabularies. Distinct from{" "}
        <code>slider</code> (continuous range) and <code>stat-comparison</code>{" "}
        (display-only stat): rate is a discrete N-of-M visual choice.
      </RTIntro>

      <RTSectionLabel>1 · Interactive — half-step precision (default)</RTSectionLabel>
      <RTBox label="click left half for 0.5 · click right half for full · click same value to clear">
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div>
            <RTRate value={v1} onChange={setV1} />
            <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>
              value: {v1.toFixed(1)}
            </div>
          </div>
          <div>
            <RTRate value={v2} onChange={setV2} />
            <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>
              value: {v2.toFixed(1)}
            </div>
          </div>
        </div>
      </RTBox>

      <RTSectionLabel>2 · Full-step precision</RTSectionLabel>
      <RTBox label="precision=1 · whole stars only">
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <RTRate value={v3} onChange={setV3} precision={1} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>
            value: {v3}
          </span>
        </div>
      </RTBox>

      <RTSectionLabel>3 · Display-only — published ratings</RTSectionLabel>
      <RTBox label="read-only · for surfacing existing rating values">
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "max-content max-content", alignItems: "center", columnGap: 24, rowGap: 10, fontFamily: "var(--font-body)" }}>
          <span style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>Reviewer A:</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <RTRate value={4.5} readOnly />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>4.5 / 5</span>
          </span>
          <span style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>Reviewer B:</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <RTRate value={3} readOnly />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>3.0 / 5</span>
          </span>
          <span style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>Reviewer C:</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <RTRate value={5} readOnly />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>5.0 / 5</span>
          </span>
          <span style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>Average:</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <RTRate value={4.2} readOnly />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--brand-primary)", fontWeight: 600 }}>4.2 · n=3</span>
          </span>
        </div>
      </RTBox>

      <RTSectionLabel>4 · Item count — 3 · 4 · 5 cells</RTSectionLabel>
      <RTBox label="not every scale is 1–5 · 3 and 4 are also canonical">
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", fontFamily: "var(--font-body)", fontSize: "0.86rem" }}>
          <span>triple (1–3): <RTRate value={2} count={3} readOnly /></span>
          <span>quadruple (1–4): <RTRate value={3} count={4} readOnly /></span>
          <span>quintuple (1–5): <RTRate value={4} count={5} readOnly /></span>
        </div>
      </RTBox>

      <RTSectionLabel>5 · Sizes — sm 16 · md 22 · lg 28</RTSectionLabel>
      <RTBox label="size scales the cell + outline stroke">
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <RTRate value={3.5} readOnly size={16} gap={4} />
          <RTRate value={3.5} readOnly size={22} gap={6} />
          <RTRate value={3.5} readOnly size={28} gap={8} />
        </div>
      </RTBox>

      <RTSectionLabel>6 · Custom icon — heart · flag</RTSectionLabel>
      <RTBox label="non-star vocabulary · for likes, priority, or non-quality scales">
        <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.86rem", display: "inline-flex", alignItems: "center", gap: 10 }}>
            Hearts (likes): <RTRate value={v4} onChange={setV4} icon="heart" />
          </span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.86rem", display: "inline-flex", alignItems: "center", gap: 10 }}>
            Flags (priority): <RTRate value={2} count={3} icon="flag" readOnly />
          </span>
        </div>
      </RTBox>

      <RTSectionLabel>7 · On dark — gold filled, white outline</RTSectionLabel>
      <RTBox dark label="filled stars switch to gold on dark · outline stays 55% white">
        <div style={{ display: "flex", alignItems: "center", gap: 24, color: "#fff", fontFamily: "var(--font-body)", fontSize: "0.86rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            Reviewer A: <RTRate value={4.5} readOnly dark />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "rgba(255,255,255,0.65)" }}>4.5 / 5</span>
          </span>
        </div>
      </RTBox>

      <RTSpecRow>
        <RTSpec label="Cell size"   value="16 · 22 · 28"          note="sm / md (default) / lg. Lucide stroke 1.8." />
        <RTSpec label="Gap"         value="4 / 6 / 8 px"           note="scales with size; never crowded." />
        <RTSpec label="Precision"   value="0.5 (default) · 1"      note="Half-step splits each cell into left + right hit areas." />
        <RTSpec label="Item count"  value="3 / 4 / 5"              note="3 for low-fidelity surveys; 5 is canonical." />
        <RTSpec label="Filled tone" value="brand maroon"           note="Gold on dark · never the Bootstrap purple." />
        <RTSpec label="Custom icon" value="star · heart · flag"    note="Use heart for likes; flag for priority." />
        <RTSpec label="Clear"       value="click same value"       note="Tapping the current value resets to 0." />
        <RTSpec label="Lineage"     value="Bootstrap 5 DS Rate"    note="Anatomy only · TUX type, maroon, signature." />
      </RTSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Export
// ════════════════════════════════════════════════════════════════════════

window.RatePage = RatePage;
