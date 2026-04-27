/* global React, PageShell, AGGIE_CATALOG, MediaBox */
/*
 * AggieMedia2.jsx — Batch 7b: Video embed + Embed + Photo grid + Logo grid.
 *
 *   Video embed  — Native player chrome over a poster frame; play-button overlay,
 *                  duration, optional title strip below.
 *   Embed        — Generic third-party iframe wrapper (Tableau, Mapbox, Sketchfab):
 *                  border + chrome strip + provider attribution.
 *   Photo grid   — Editorial photo collection: masonry/uniform, 2-up to 4-up.
 *   Logo grid    — Partner / sponsor lockup grid; uniform, mono-tinted.
 *
 * Helper prefix: ME (Media-Embed).
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (ME prefix)
// ════════════════════════════════════════════════════════════════════════

function MEBox({ dark = false, label, padded = true, children }) {
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
      <div style={{ padding: padded ? 32 : 0, background: dark ? "var(--brand-primary)" : "var(--surface-page)" }}>{children}</div>
    </div>
  );
}

function MESectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16 }}>{children}</div>
  );
}

function MESpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>
  );
}

function MESpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function MEIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// VIDEO EMBED
// ════════════════════════════════════════════════════════════════════════

function VideoEmbed({ style = "default", dark = false, withCaption = true, hasPlayed = false }) {
  const accent = dark ? "var(--brand-accent)" : "var(--brand-primary)";

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ position: "relative", width: "100%", borderRadius: "var(--radius-md)", overflow: "hidden", background: "#0a0a0a" }}>
        <MediaBox style={style} ratio="16/9" w={1280} h={720} label="poster frame · 16:9" onDark />

        {/* dark vignette overlay so the play button reads */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 100%)" }} />

        {/* duration chip top-right */}
        <div style={{
          position: "absolute", top: 16, right: 16,
          background: "rgba(0,0,0,0.7)", color: "#fff",
          padding: "4px 10px", fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 500,
          borderRadius: 3, letterSpacing: "0.04em",
        }}>
          12:48
        </div>

        {/* CC + HD chips */}
        <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 6 }}>
          <span style={{ background: "rgba(0,0,0,0.7)", color: "#fff", padding: "3px 8px", fontFamily: "var(--font-body-bold)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", borderRadius: 2 }}>CC</span>
          <span style={{ background: "rgba(0,0,0,0.7)", color: "#fff", padding: "3px 8px", fontFamily: "var(--font-body-bold)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", borderRadius: 2 }}>HD</span>
        </div>

        {/* play button */}
        <button style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 84, height: 84, borderRadius: "50%",
          background: accent, border: "3px solid rgba(255,255,255,0.9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 6px 24px rgba(0,0,0,0.4)",
        }}>
          <svg width="28" height="32" viewBox="0 0 28 32" style={{ marginLeft: 4 }}>
            <polygon points="0,0 28,16 0,32" fill="#fff" />
          </svg>
        </button>

        {/* progress bar (only if hasPlayed) */}
        {hasPlayed && (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 4, background: "rgba(255,255,255,0.2)" }}>
            <div style={{ width: "23%", height: "100%", background: accent }} />
            <div style={{ position: "absolute", left: "23%", top: -4, width: 12, height: 12, borderRadius: "50%", background: accent, transform: "translateX(-50%)" }} />
          </div>
        )}
      </div>

      {withCaption && (
        <div style={{
          marginTop: 12, paddingLeft: 12,
          borderLeft: `2px solid ${accent}`,
          fontFamily: style === "elegant" ? "var(--font-elegant, Georgia, serif)" : "var(--font-body)",
          fontSize: "0.84rem", lineHeight: 1.55,
          fontStyle: style === "elegant" ? "italic" : "normal",
          color: dark ? "rgba(255,255,255,0.78)" : "var(--text-muted)",
        }}>
          <strong style={{ fontFamily: "var(--font-body-bold)", color: dark ? "#fff" : "var(--text-primary)" }}>VIDEO · </strong>
          Drone footage from the FM-1942 corridor study, with TTI's Daniella Ortiz walking through the shoulder-geometry findings.
          <span style={{ display: "block", marginTop: 4, fontFamily: "var(--font-mono)", fontSize: "0.74rem", opacity: 0.75 }}>
            12 min 48 sec · captioned · transcript available
          </span>
        </div>
      )}
    </div>
  );
}

function VideoEmbedPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "video-embed");
  return (
    <PageShell item={item}>
      <MEIntro>
        Native HTML5 player skin sitting over a poster frame. Centered play button uses the brand color (maroon on light; gold on dark). Duration chip top-right; CC/HD badges top-left. Optional caption strip below uses the same FIG-style leading rule as Captioned media. Players use 16:9 by default; vertical/portrait videos opt into 9:16 explicitly.
      </MEIntro>

      <MESectionLabel>Default · idle</MESectionLabel>
      <MEBox label="default · before play"><VideoEmbed style="default" /></MEBox>

      <MESectionLabel>Default · with progress</MESectionLabel>
      <MEBox label="default · 23% played"><VideoEmbed style="default" hasPlayed /></MEBox>

      <MESectionLabel>Bold</MESectionLabel>
      <MEBox label="bold · idle"><VideoEmbed style="bold" /></MEBox>

      <MESectionLabel>Elegant</MESectionLabel>
      <MEBox label="elegant · idle"><VideoEmbed style="elegant" /></MEBox>

      <MESectionLabel>On dark</MESectionLabel>
      <MEBox dark label="default · on dark"><VideoEmbed style="default" dark /></MEBox>

      <MESpecRow>
        <MESpec label="Player ratio" value="16 / 9" note="9:16 only when source is portrait" />
        <MESpec label="Play button" value="84px circle" note="Brand accent · 3px ring" />
        <MESpec label="Chips" value="rgba(0,0,0,.7)" note="Top-left CC/HD · top-right duration" />
        <MESpec label="A11y" value="captions on" note="Transcript link required in caption strip" />
      </MESpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// EMBED — generic third-party iframe wrapper
// ════════════════════════════════════════════════════════════════════════

function EmbedFrame({ style = "default", dark = false, provider = "Tableau", title = "Texas crash trends, 2014–2024", height = 460 }) {
  const providerColors = {
    Tableau: "#1f3653",
    Mapbox: "#3b82f6",
    Sketchfab: "#f7541b",
    Datawrapper: "#1d3a5c",
    Vimeo: "#1ab7ea",
  };
  const providerColor = providerColors[provider] || "#444";

  return (
    <div style={{
      border: dark ? "1px solid rgba(255,255,255,0.18)" : "1px solid var(--surface-border)",
      borderRadius: "var(--radius-md)", overflow: "hidden",
      background: dark ? "var(--brand-primary)" : "#fff",
    }}>
      {/* chrome strip */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px",
        background: dark ? "rgba(0,0,0,0.25)" : "var(--surface-sunken)",
        borderBottom: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid var(--surface-border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: providerColor, boxShadow: `0 0 0 2px ${providerColor}26` }} />
          <span style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: dark ? "#fff" : "var(--text-primary)" }}>
            {provider} embed
          </span>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: dark ? "rgba(255,255,255,0.65)" : "var(--text-muted)" }}>
          iframe · sandboxed
        </div>
      </div>

      {/* viewport — provider-specific surrogate */}
      <div style={{ height, position: "relative", overflow: "hidden", background: dark ? "rgba(0,0,0,0.2)" : "#fafafa" }}>
        {provider === "Tableau" && <TableauSurrogate dark={dark} />}
        {provider === "Mapbox" && <MapboxSurrogate dark={dark} />}
        {provider === "Sketchfab" && <SketchfabSurrogate dark={dark} />}

        {/* provider watermark bottom-right */}
        <div style={{
          position: "absolute", bottom: 12, right: 14,
          fontFamily: "var(--font-mono)", fontSize: "0.7rem", opacity: 0.55,
          color: dark ? "#fff" : "var(--text-muted)",
        }}>
          via {provider.toLowerCase()}.com
        </div>
      </div>

      {/* attribution row below */}
      <div style={{
        padding: "10px 16px", borderTop: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid var(--surface-border)",
        background: dark ? "rgba(0,0,0,0.18)" : "#fff",
        fontFamily: style === "elegant" ? "var(--font-elegant, Georgia, serif)" : "var(--font-body)",
        fontStyle: style === "elegant" ? "italic" : "normal",
        fontSize: "0.82rem", color: dark ? "rgba(255,255,255,0.78)" : "var(--text-secondary)",
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
      }}>
        <div>
          <strong style={{ fontFamily: "var(--font-body-bold)", color: dark ? "#fff" : "var(--text-primary)", fontStyle: "normal" }}>{title}</strong>
          <span style={{ marginLeft: 10, opacity: 0.7 }}>· interactive</span>
        </div>
        <a style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: dark ? "var(--brand-accent)" : "var(--brand-primary)", textDecoration: "none" }}>
          Open in new tab ↗
        </a>
      </div>
    </div>
  );
}

function TableauSurrogate({ dark }) {
  // mock dashboard: a few "tiles" with bars & a sparkline
  const fg = dark ? "#fff" : "#1f3653";
  return (
    <div style={{ position: "absolute", inset: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto 1fr", gap: 12 }}>
      <div style={{ gridColumn: "1 / -1", padding: "10px 14px", background: dark ? "rgba(255,255,255,0.08)" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "#e8e8e8"}`, borderRadius: 4 }}>
        <div style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.72rem", fontWeight: 700, color: fg, marginBottom: 6, letterSpacing: "0.05em" }}>FATAL CRASHES · STATEWIDE</div>
        <svg width="100%" height="40" viewBox="0 0 240 40" preserveAspectRatio="none">
          <polyline points="0,30 20,28 40,25 60,28 80,22 100,18 120,20 140,15 160,18 180,12 200,14 220,8 240,6" stroke={fg} strokeWidth="2" fill="none" />
          <polyline points="0,30 20,28 40,25 60,28 80,22 100,18 120,20 140,15 160,18 180,12 200,14 220,8 240,6 240,40 0,40" fill={dark ? "rgba(221,172,55,0.2)" : "rgba(31,54,83,0.1)"} stroke="none" />
        </svg>
      </div>
      <div style={{ background: dark ? "rgba(255,255,255,0.08)" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "#e8e8e8"}`, borderRadius: 4, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.7rem", fontWeight: 700, color: fg, marginBottom: 6, letterSpacing: "0.05em" }}>BY ROAD CLASS</div>
        {["Interstate","US Highway","State Hwy","Farm-to-Market","Local"].map((r, i) => (
          <div key={r} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.7rem", color: dark ? "rgba(255,255,255,0.78)" : "#444" }}>
            <span style={{ width: 90 }}>{r}</span>
            <span style={{ flex: 1, height: 8, background: dark ? "rgba(255,255,255,0.08)" : "#eef1f5", borderRadius: 1 }}>
              <span style={{ display: "block", width: `${[80,62,55,38,18][i]}%`, height: "100%", background: dark ? "var(--brand-accent)" : "#1f3653" }} />
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", width: 38, textAlign: "right" }}>{[80,62,55,38,18][i]}%</span>
          </div>
        ))}
      </div>
      <div style={{ background: dark ? "rgba(255,255,255,0.08)" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "#e8e8e8"}`, borderRadius: 4, padding: "10px 14px" }}>
        <div style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.7rem", fontWeight: 700, color: fg, marginBottom: 6, letterSpacing: "0.05em" }}>BY TIME OF DAY</div>
        <svg width="100%" height="100" viewBox="0 0 200 100" preserveAspectRatio="none">
          {[40,55,68,52,38,46,72,82,90,76,84,62].map((h, i) => (
            <rect key={i} x={i * 16 + 4} y={100 - h} width={12} height={h} fill={dark ? "var(--brand-accent)" : "#1f3653"} opacity={0.85} />
          ))}
        </svg>
      </div>
    </div>
  );
}

function MapboxSurrogate({ dark }) {
  const land = dark ? "#1a2230" : "#f1ede4";
  const water = dark ? "#0c1421" : "#cfe5f0";
  const road = dark ? "rgba(221,172,55,0.6)" : "#d8c899";
  return (
    <div style={{ position: "absolute", inset: 0, background: land }}>
      <svg width="100%" height="100%" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
        {/* water bodies */}
        <path d="M0,360 Q120,330 240,355 T520,340 T780,365 L800,460 L0,460 Z" fill={water} opacity="0.85" />
        {/* roads */}
        <path d="M-20,200 L820,260" stroke={road} strokeWidth="3" fill="none" />
        <path d="M-20,140 L820,310" stroke={road} strokeWidth="2.5" fill="none" />
        <path d="M120,-20 L260,480" stroke={road} strokeWidth="2.5" fill="none" />
        <path d="M540,-20 L420,480" stroke={road} strokeWidth="2.5" fill="none" />
        <path d="M-20,80 L820,90" stroke={road} strokeWidth="1.5" fill="none" opacity="0.5" />
        {/* pins */}
        {[
          [180, 220], [320, 280], [460, 250], [600, 200], [240, 360], [520, 320], [380, 180], [560, 380]
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <circle r="14" fill={dark ? "var(--brand-accent)" : "#5C0025"} opacity="0.25" />
            <circle r="6" fill={dark ? "var(--brand-accent)" : "#5C0025"} stroke="#fff" strokeWidth="2" />
          </g>
        ))}
      </svg>
      {/* zoom controls */}
      <div style={{ position: "absolute", top: 14, right: 14, display: "flex", flexDirection: "column", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
        <button style={{ width: 30, height: 30, background: "#fff", border: "1px solid #ccc", borderBottom: "none", fontSize: 16, color: "#333", cursor: "default" }}>+</button>
        <button style={{ width: 30, height: 30, background: "#fff", border: "1px solid #ccc", fontSize: 16, color: "#333", cursor: "default" }}>−</button>
      </div>
      {/* attribution micro */}
      <div style={{ position: "absolute", bottom: 6, left: 8, fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
        © Mapbox · © OpenStreetMap
      </div>
    </div>
  );
}

function SketchfabSurrogate({ dark }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: dark ? "#0e0e0e" : "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* a faux 3D wireframe */}
      <svg width="320" height="200" viewBox="0 0 320 200">
        <g stroke="#f7541b" strokeWidth="1" fill="none" opacity="0.85">
          <polygon points="160,20 280,90 160,160 40,90" />
          <polygon points="160,20 280,90 160,140 40,90" opacity="0.5" />
          <line x1="160" y1="20" x2="160" y2="160" />
          <line x1="40" y1="90" x2="280" y2="90" />
          <ellipse cx="160" cy="170" rx="100" ry="14" stroke="rgba(247,84,27,0.3)" />
        </g>
      </svg>
      <div style={{ position: "absolute", bottom: 14, left: 14, fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>3D · drag to rotate</div>
    </div>
  );
}

function EmbedPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "embed");
  return (
    <PageShell item={item}>
      <MEIntro>
        Generic third-party iframe wrapper. The component normalizes any embed (Tableau, Mapbox, Sketchfab, Datawrapper, Vimeo) inside a consistent chrome — provider chip top-left, sandbox indicator top-right, attribution row below. The viewport is sized by aspect ratio or explicit pixel height. Use this <em>instead of</em> raw iframe drops; it handles a11y, attribution, and the provider-watermark contract.
      </MEIntro>

      <MESectionLabel>Tableau</MESectionLabel>
      <MEBox label="default · tableau dashboard"><EmbedFrame style="default" provider="Tableau" title="Texas crash trends, 2014–2024" /></MEBox>

      <MESectionLabel>Mapbox</MESectionLabel>
      <MEBox label="default · mapbox study sites"><EmbedFrame style="default" provider="Mapbox" title="FM-1942 study corridor · 8 sensor sites" height={400} /></MEBox>

      <MESectionLabel>Sketchfab (3D model)</MESectionLabel>
      <MEBox label="default · sketchfab model"><EmbedFrame style="default" provider="Sketchfab" title="Roadway shoulder geometry · LiDAR survey" height={360} /></MEBox>

      <MESectionLabel>On dark</MESectionLabel>
      <MEBox dark label="bold · tableau · on dark"><EmbedFrame style="bold" provider="Tableau" dark title="Statewide crash trends" /></MEBox>

      <MESpecRow>
        <MESpec label="Chrome" value="40 / 36px" note="Header / footer strip heights" />
        <MESpec label="Provider chip" value="dot + caps" note="Color matches provider brand" />
        <MESpec label="Sandbox" value="iframe[sandbox]" note="allow-scripts allow-same-origin only" />
        <MESpec label="Attribution" value="required" note="Title + 'Open in new tab ↗' link" />
      </MESpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PHOTO GRID
// ════════════════════════════════════════════════════════════════════════

function PhotoGrid({ style = "default", dark = false, layout = "uniform-3" }) {
  // layouts:
  //   uniform-3 → 3 equal squares
  //   uniform-4 → 4 equal squares
  //   masonry   → asymmetric: 1 hero + 4 small
  //   feature   → 1 wide hero + 2 stacked sidekicks

  if (layout === "uniform-3") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[1,2,3].map(i => (
          <MediaBox key={i} style={style} ratio="1/1" w={400} h={400} label={`photo ${i}`} onDark={dark} />
        ))}
      </div>
    );
  }
  if (layout === "uniform-4") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {[1,2,3,4].map(i => (
          <MediaBox key={i} style={style} ratio="1/1" w={300} h={300} label={`${i}`} onDark={dark} />
        ))}
      </div>
    );
  }
  if (layout === "masonry") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "repeat(2, 1fr)", gap: 12, aspectRatio: "16/9" }}>
        <div style={{ gridColumn: "1", gridRow: "1 / 3" }}>
          <MediaBox style={style} ratio="1/1" w={600} h={600} label="hero · 1:1" onDark={dark} />
        </div>
        <div style={{ gridColumn: "2", gridRow: "1" }}><MediaBox style={style} ratio="1/1" w={300} h={300} label="2" onDark={dark} /></div>
        <div style={{ gridColumn: "3", gridRow: "1" }}><MediaBox style={style} ratio="1/1" w={300} h={300} label="3" onDark={dark} /></div>
        <div style={{ gridColumn: "2", gridRow: "2" }}><MediaBox style={style} ratio="1/1" w={300} h={300} label="4" onDark={dark} /></div>
        <div style={{ gridColumn: "3", gridRow: "2" }}><MediaBox style={style} ratio="1/1" w={300} h={300} label="5" onDark={dark} /></div>
      </div>
    );
  }
  // feature
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, aspectRatio: "2/1" }}>
      <MediaBox style={style} ratio="2/1" w={800} h={400} label="hero · wide" onDark={dark} />
      <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 12 }}>
        <MediaBox style={style} ratio="2/1" w={400} h={200} label="2" onDark={dark} />
        <MediaBox style={style} ratio="2/1" w={400} h={200} label="3" onDark={dark} />
      </div>
    </div>
  );
}

function PhotoGridPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "photo-grid");
  return (
    <PageShell item={item}>
      <MEIntro>
        Editorial photo collection. Four layouts: <strong>uniform-3</strong> (most common; matches the homepage marquee), <strong>uniform-4</strong> (denser; works for thumbnails), <strong>masonry</strong> (1 hero + 4 sidekicks; the campus-life pattern), and <strong>feature</strong> (1 wide + 2 stacked; a single dominant photo with two beats). The grid itself never exposes captions — for caption-bearing images use Captioned media instead.
      </MEIntro>

      <MESectionLabel>Uniform-3 (default)</MESectionLabel>
      <MEBox label="default · 3-up uniform"><PhotoGrid style="default" layout="uniform-3" /></MEBox>

      <MESectionLabel>Uniform-4</MESectionLabel>
      <MEBox label="default · 4-up uniform"><PhotoGrid style="default" layout="uniform-4" /></MEBox>

      <MESectionLabel>Masonry · 1 hero + 4</MESectionLabel>
      <MEBox label="default · masonry"><PhotoGrid style="default" layout="masonry" /></MEBox>

      <MESectionLabel>Feature · wide + 2</MESectionLabel>
      <MEBox label="default · feature"><PhotoGrid style="default" layout="feature" /></MEBox>

      <MESectionLabel>Bold</MESectionLabel>
      <MEBox label="bold · masonry"><PhotoGrid style="bold" layout="masonry" /></MEBox>

      <MESectionLabel>Elegant</MESectionLabel>
      <MEBox label="elegant · uniform-3"><PhotoGrid style="elegant" layout="uniform-3" /></MEBox>

      <MESectionLabel>On dark</MESectionLabel>
      <MEBox dark label="default · masonry · on dark"><PhotoGrid style="default" layout="masonry" dark /></MEBox>

      <MESpecRow>
        <MESpec label="Gap" value="10–12px" note="Tighter for 4-up; standard 12px otherwise" />
        <MESpec label="Default ratio" value="1 / 1" note="Square-first; masonry hero stays square" />
        <MESpec label="Layouts" value="4 variants" note="uniform-3 · uniform-4 · masonry · feature" />
        <MESpec label="Captions" value="not in grid" note="Use Captioned media for figure callouts" />
      </MESpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// LOGO GRID — partner / sponsor
// ════════════════════════════════════════════════════════════════════════

function FauxLogo({ name, dark, mono = true }) {
  // generate a fake "logo" — a glyph + wordmark, mono-tinted
  const tint = dark ? "rgba(255,255,255,0.78)" : "rgba(0,0,0,0.65)";
  const initial = name.charAt(0);

  // a few visual variants so the grid doesn't look mechanically repetitive
  const variant = name.length % 5;

  let glyph;
  if (variant === 0) {
    glyph = (
      <svg width="34" height="34" viewBox="0 0 34 34">
        <circle cx="17" cy="17" r="14" stroke={tint} strokeWidth="2" fill="none" />
        <path d="M9 17 L17 9 L25 17 L17 25 Z" fill={tint} />
      </svg>
    );
  } else if (variant === 1) {
    glyph = (
      <svg width="38" height="34" viewBox="0 0 38 34">
        <rect x="2" y="6" width="14" height="22" fill={tint} />
        <rect x="22" y="2" width="14" height="30" stroke={tint} strokeWidth="2" fill="none" />
      </svg>
    );
  } else if (variant === 2) {
    glyph = (
      <svg width="40" height="34" viewBox="0 0 40 34">
        <polygon points="2,30 20,4 38,30" stroke={tint} strokeWidth="2" fill="none" />
        <circle cx="20" cy="22" r="4" fill={tint} />
      </svg>
    );
  } else if (variant === 3) {
    glyph = (
      <svg width="40" height="34" viewBox="0 0 40 34">
        <text x="20" y="26" textAnchor="middle" fontFamily="Georgia, serif" fontSize="28" fontStyle="italic" fill={tint}>{initial}</text>
      </svg>
    );
  } else {
    glyph = (
      <svg width="40" height="34" viewBox="0 0 40 34">
        <line x1="4" y1="17" x2="36" y2="17" stroke={tint} strokeWidth="2" />
        <line x1="20" y1="4" x2="20" y2="30" stroke={tint} strokeWidth="2" />
        <circle cx="20" cy="17" r="6" stroke={tint} strokeWidth="2" fill="none" />
      </svg>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: mono ? 0.78 : 1 }}>
      {glyph}
      <div style={{
        fontFamily: "var(--font-body-bold)", fontSize: "0.85rem", fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.06em", color: tint,
      }}>{name}</div>
    </div>
  );
}

function LogoGrid({ style = "default", dark = false, columns = 5, divided = false }) {
  const partners = [
    "TXDOT", "FHWA", "USDOT", "AASHTO", "TRB",
    "NCHRP", "NHTSA", "NACTO", "ITS America", "ITE",
  ];
  const slice = partners.slice(0, columns * 2);

  const cellStyle = {
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "26px 18px", minHeight: 72,
  };

  if (divided) {
    return (
      <div style={{
        display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`,
        border: dark ? "1px solid rgba(255,255,255,0.18)" : "1px solid var(--surface-border)",
        borderRadius: "var(--radius-md)", overflow: "hidden",
      }}>
        {slice.map((p, i) => {
          const col = i % columns;
          const row = Math.floor(i / columns);
          const isLastRow = row === Math.ceil(slice.length / columns) - 1;
          return (
            <div key={p} style={{
              ...cellStyle,
              borderRight: col < columns - 1 ? (dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid var(--surface-border)") : "none",
              borderBottom: !isLastRow ? (dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid var(--surface-border)") : "none",
            }}>
              <FauxLogo name={p} dark={dark} />
            </div>
          );
        })}
      </div>
    );
  }

  // ungridded: just a flex-wrap row with breathing space
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: "32px 24px" }}>
      {slice.map(p => (
        <div key={p} style={cellStyle}>
          <FauxLogo name={p} dark={dark} />
        </div>
      ))}
    </div>
  );
}

function LogoGridPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "logo-grid");
  return (
    <PageShell item={item}>
      <MEIntro>
        Partner / sponsor lockup grid. Two presentations: <strong>divided</strong> (cells separated by hairlines — the federal-funder convention; reads as a register of equals) and <strong>open</strong> (no rules, just whitespace — feels editorial). All logos render mono-tinted by default to enforce visual parity; opt back into full color only when the content explicitly demands it (e.g. a sponsor honoring page).
      </MEIntro>

      <MESectionLabel>Divided · 5-up</MESectionLabel>
      <MEBox label="default · divided"><LogoGrid style="default" columns={5} divided /></MEBox>

      <MESectionLabel>Open · 5-up</MESectionLabel>
      <MEBox label="default · open"><LogoGrid style="default" columns={5} /></MEBox>

      <MESectionLabel>4-up</MESectionLabel>
      <MEBox label="default · 4-up divided"><LogoGrid style="default" columns={4} divided /></MEBox>

      <MESectionLabel>Bold</MESectionLabel>
      <MEBox label="bold · divided"><LogoGrid style="bold" columns={5} divided /></MEBox>

      <MESectionLabel>Elegant</MESectionLabel>
      <MEBox label="elegant · open"><LogoGrid style="elegant" columns={5} /></MEBox>

      <MESectionLabel>On dark</MESectionLabel>
      <MEBox dark label="default · divided · on dark"><LogoGrid style="default" columns={5} divided dark /></MEBox>

      <MESpecRow>
        <MESpec label="Columns" value="3 / 4 / 5" note="Responsive: 5→3→2 by breakpoint" />
        <MESpec label="Cell" value="72px min" note="Vertical padding 26px · centered" />
        <MESpec label="Tinting" value="mono · 78%" note="Black on light · white on dark" />
        <MESpec label="Divider" value="1px hairline" note="Use surface-border on light; rgba on dark" />
      </MESpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Export
// ════════════════════════════════════════════════════════════════════════

Object.assign(window, {
  VideoEmbedPage,
  EmbedPage,
  PhotoGridPage,
  LogoGridPage,
});
