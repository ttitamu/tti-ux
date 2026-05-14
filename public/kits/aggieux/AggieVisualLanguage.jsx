/* global React, PageShell, AGGIE_CATALOG */
/*
 * AggieVisualLanguage.jsx — Foundations / Visual language page.
 *
 * Showcases the Batch E-prelude token refresh:
 *   - Two-ring focus
 *   - Transportation-tempo easings
 *   - Four-tier elevation
 *   - Warm-neutral ramp extension
 *   - Survey-rhythm density baseline
 *   - Identity primitives (Texas star, TAMUS chevron, compass, ROW grid)
 *
 * Helper prefix: VL.
 */

const { useState: _vlUseState, useRef: _vlUseRef, useEffect: _vlUseEffect } = React;

function VLBox({ dark = false, label, children, padded = true }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{
        padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
        color: dark ? "rgba(255,255,255,0.85)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)",
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

function VLSectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 36 }}>{children}</div>
  );
}

function VLIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

function VLSpecRow({ children }) {
  return (
    <div style={{ marginTop: 24, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>
  );
}

function VLSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 1. Two-ring focus
// ════════════════════════════════════════════════════════════════════════

function VLFocusDemo() {
  return (
    <div>
      <VLBox label="Two-ring focus — buttons & inputs (live: tab to focus)">
        <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
          <button style={{ padding: "10px 18px", border: "1px solid var(--brand-primary)", background: "var(--brand-primary)", color: "white", fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer", borderRadius: "var(--radius-sm)" }}>
            Primary action
          </button>
          <button style={{ padding: "10px 18px", border: "1px solid var(--brand-primary)", background: "transparent", color: "var(--brand-primary)", fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer", borderRadius: "var(--radius-sm)" }}>
            Secondary
          </button>
          <input placeholder="Focus me" style={{ padding: "9px 12px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", fontSize: "0.88rem", fontFamily: "inherit", background: "var(--surface-raised)", color: "var(--text-primary)" }} />
          <a href="#" onClick={(e)=>e.preventDefault()} style={{ color: "var(--brand-secondary)", fontWeight: 500 }}>Inline link</a>
        </div>
      </VLBox>

      <VLBox dark label="Two-ring focus — on dark / maroon surface">
        <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
          <button style={{ padding: "10px 18px", border: "1px solid white", background: "white", color: "var(--brand-primary)", fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer", borderRadius: "var(--radius-sm)" }}>
            Reverse primary
          </button>
          <button style={{ padding: "10px 18px", border: "1px solid white", background: "transparent", color: "white", fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer", borderRadius: "var(--radius-sm)" }}>
            Reverse secondary
          </button>
          <input placeholder="Focus me" style={{ padding: "9px 12px", border: "1px solid rgba(255,255,255,0.4)", borderRadius: "var(--radius-sm)", fontSize: "0.88rem", fontFamily: "inherit", background: "rgba(255,255,255,0.08)", color: "white" }} />
        </div>
      </VLBox>

      <VLSpecRow>
        <VLSpec label="outer ring" value="2px maroon" note="Full opacity for legibility on dense surfaces" />
        <VLSpec label="inner halo" value="2px sand" note="#F2E6C9 — tux-specific signature" />
        <VLSpec label="dark theme" value="gold inner" note="Warm-gold inner ring at 55%" />
        <VLSpec label="HC theme" value="black + white" note="5px combined width for AAA" />
      </VLSpecRow>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 2. Easing tokens
// ════════════════════════════════════════════════════════════════════════

function VLEasingDemo() {
  const [tick, setTick] = _vlUseState(0);
  return (
    <div>
      <VLBox label="Transportation-tempo — measured / smooth / decelerate-only" padded={true}>
        <button onClick={() => setTick(t => t + 1)} style={{ padding: "8px 14px", border: "1px solid var(--brand-primary)", background: "transparent", color: "var(--brand-primary)", fontFamily: "var(--font-bold)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer", borderRadius: "var(--radius-sm)", marginBottom: 24 }}>
          Replay animations
        </button>
        {[
          { name: "survey",   curve: "cubic-bezier(0.4, 0, 0.2, 1)",   note: "Tables, forms, disclosures" },
          { name: "corridor", curve: "cubic-bezier(0.2, 0, 0, 1)",     note: "Page-level, sheets, modals" },
          { name: "arrival",  curve: "cubic-bezier(0, 0, 0.2, 1)",     note: "Toasts, banners, snapshots" },
        ].map(c => (
          <div key={c.name} style={{ display: "grid", gridTemplateColumns: "120px 1fr 200px", gap: 18, alignItems: "center", padding: "14px 0", borderTop: "1px solid var(--surface-border)" }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--brand-primary)" }}>--ease-{c.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 3 }}>{c.curve.replace("cubic-bezier", "cb")}</div>
            </div>
            <div style={{ position: "relative", height: 24, background: "var(--surface-sunken)", borderRadius: 12 }}>
              <div key={tick} style={{
                position: "absolute", top: 4, left: 4, width: 16, height: 16,
                background: "var(--brand-primary)", borderRadius: "50%",
                animation: `vlEase-${c.name} 1400ms ${c.curve} forwards`,
              }} />
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>{c.note}</div>
          </div>
        ))}
        <style>{`
          @keyframes vlEase-survey   { from { left: 4px; } to { left: calc(100% - 20px); } }
          @keyframes vlEase-corridor { from { left: 4px; } to { left: calc(100% - 20px); } }
          @keyframes vlEase-arrival  { from { left: 4px; } to { left: calc(100% - 20px); } }
        `}</style>
      </VLBox>

      <VLSpecRow>
        <VLSpec label="--ease-survey" value="0.4, 0, 0.2, 1" note="Default for data-dense components" />
        <VLSpec label="--ease-corridor" value="0.2, 0, 0, 1" note="Page-scale transitions" />
        <VLSpec label="--ease-arrival" value="0, 0, 0.2, 1" note="Decelerate-only — locks in" />
        <VLSpec label="lineage" value="m3-emphasized" note="Anatomy from Material 3; tux naming" />
      </VLSpecRow>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 3. Elevation tiers
// ════════════════════════════════════════════════════════════════════════

function VLElevationDemo() {
  const tiers = [
    { name: "flat",     token: "--elevation-flat",     desc: "Border-only. Inline cards, list rows in a frame." },
    { name: "rest",     token: "--elevation-rest",     desc: "Quietly lifted. Data tables, news cards in a grid." },
    { name: "hover",    token: "--elevation-hover",    desc: "Temporarily lifted. Pair with translateY(-1px)." },
    { name: "overlay",  token: "--elevation-overlay",  desc: "Popovers, sheets, modals — clearly above the page." },
    { name: "pinned",   token: "--elevation-pinned",   desc: "Sticky chrome — bottom-only shadow." },
  ];
  return (
    <div>
      <VLBox label="Four-tier elevation" padded={true}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
          {tiers.map(t => (
            <div key={t.name} style={{ background: "var(--surface-raised)", boxShadow: `var(${t.token})`, padding: 16, borderRadius: "var(--radius-sm)", border: t.name === "flat" ? "1px solid var(--surface-border)" : "none" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--brand-primary)" }}>{t.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", margin: "6px 0 8px", wordBreak: "break-all" }}>{t.token}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </VLBox>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 4. Warm-neutral ramp
// ════════════════════════════════════════════════════════════════════════

function VLNeutralRamp() {
  const stops = [
    { stop: 0,    hex: "#FFFFFF" },
    { stop: 50,   hex: "#FAFAFA" },
    { stop: 100,  hex: "#F5F5F5" },
    { stop: 150,  hex: "#EFEEED", isNew: true },
    { stop: 200,  hex: "#E7E6E6" },
    { stop: 250,  hex: "#DCDBD8", isNew: true },
    { stop: 300,  hex: "#D1D2D4" },
    { stop: 400,  hex: "#A5A5A5" },
    { stop: 450,  hex: "#9B9A96", isNew: true },
    { stop: 500,  hex: "#939597" },
    { stop: 550,  hex: "#86847F", isNew: true },
    { stop: 600,  hex: "#7E7E7E" },
    { stop: 650,  hex: "#6B6964", isNew: true },
    { stop: 700,  hex: "#5D5D5D" },
    { stop: 750,  hex: "#535048", isNew: true },
    { stop: 800,  hex: "#4C4C4E" },
    { stop: 850,  hex: "#3A3833", isNew: true },
    { stop: 900,  hex: "#221F1F" },
  ];
  return (
    <VLBox label="Warm-neutral ramp — 18 stops (new intermediates marked)" padded={true}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: 0, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
        {stops.map(s => (
          <div key={s.stop} style={{ background: s.hex, padding: "20px 8px 10px", borderRight: "1px solid rgba(0,0,0,0.05)", position: "relative" }}>
            {s.isNew && <span style={{ position: "absolute", top: 4, right: 4, fontSize: "0.55rem", fontWeight: 700, padding: "1px 4px", borderRadius: 2, background: "var(--brand-primary)", color: "white", letterSpacing: "0.05em" }}>NEW</span>}
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 600, color: s.stop >= 500 ? "white" : "var(--text-primary)" }}>{s.stop}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: s.stop >= 500 ? "rgba(255,255,255,0.7)" : "var(--text-muted)", marginTop: 2 }}>{s.hex}</div>
          </div>
        ))}
      </div>
    </VLBox>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 5. Survey rhythm
// ════════════════════════════════════════════════════════════════════════

function VLRhythm() {
  const tokens = [
    { name: "tight",   px: 4,  use: "between input rows in tables; chip-to-chip" },
    { name: "snug",    px: 8,  use: "cell padding, chip padding, icon gap" },
    { name: "normal",  px: 12, use: "button padding, list-item gap, label-to-input" },
    { name: "loose",   px: 16, use: "form field gap, card section padding" },
    { name: "roomy",   px: 24, use: "section breaks, descriptions row gap" },
  ];
  return (
    <VLBox label="Survey rhythm — density baseline (Ant 4/8/12/16/24)" padded={true}>
      {tokens.map(t => (
        <div key={t.name} style={{ display: "grid", gridTemplateColumns: "180px 1fr 280px", gap: 18, alignItems: "center", padding: "12px 0", borderTop: "1px solid var(--surface-border)" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--brand-primary)" }}>--rhythm-{t.name}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 3 }}>{t.px}px</div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: t.px, height: 18, background: "var(--brand-primary)" }} />
            <div style={{ width: 1, height: 28, background: "var(--surface-border)", marginLeft: 0 }} />
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>{t.use}</div>
        </div>
      ))}
    </VLBox>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 6. Identity primitives
// ════════════════════════════════════════════════════════════════════════

function VLIdentityPrimitives() {
  const sprite = "../../assets/identity-primitives.svg";
  const items = [
    { id: "tux-star",     name: "Texas star",   note: "Lone-star reference; corner accents, badge marks", w: 40, h: 40 },
    { id: "tux-chevron",  name: "TAMUS chevron", note: "Section bracket, downward angle accent",          w: 64, h: 32 },
    { id: "tux-compass",  name: "Compass rose", note: "Map-related families, geo embeds",                 w: 56, h: 56 },
    { id: "tux-row-grid", name: "ROW grid",     note: "Pavement-stripe pattern; data-density gradient",   w: 128, h: 32 },
  ];
  return (
    <div>
      <VLBox label="Identity primitives — currentColor on light">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {items.map(it => (
            <div key={it.id} style={{ padding: 18, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", background: "var(--surface-raised)", color: "var(--brand-primary)" }}>
              <div style={{ height: 70, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <svg width={it.w} height={it.h} aria-hidden="true">
                  <use href={`${sprite}#${it.id}`} />
                </svg>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-primary)" }}>{it.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", margin: "3px 0 6px" }}>#{it.id}</div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>{it.note}</div>
            </div>
          ))}
        </div>
      </VLBox>

      <VLBox dark label="Identity primitives — currentColor on dark">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, color: "white" }}>
          {items.map(it => (
            <div key={it.id} style={{ padding: 18, border: "1px solid rgba(255,255,255,0.2)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ height: 70, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                <svg width={it.w} height={it.h} aria-hidden="true">
                  <use href={`${sprite}#${it.id}`} />
                </svg>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", opacity: 0.8 }}>#{it.id}</div>
            </div>
          ))}
        </div>
      </VLBox>

      <VLSpecRow>
        <VLSpec label="format" value="<symbol> sprite" note="Inline-include or <use href>" />
        <VLSpec label="color" value="currentColor" note="Tints to host text-color" />
        <VLSpec label="path" value="assets/identity-primitives.svg" note="Project-root sibling" />
        <VLSpec label="lineage" value="tux-original" note="Not lifted from any library" />
      </VLSpecRow>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Page
// ════════════════════════════════════════════════════════════════════════

function VisualLanguagePage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "visual-language");
  return (
    <PageShell item={item}>
      <VLIntro>
        <strong>Batch E-prelude</strong> — a token-only refresh shipped before the data-density refit. Every component family inherits these changes automatically. Lineage notes for each are in <code>design/visual-language-evolution.md</code>.
      </VLIntro>

      <VLSectionLabel>1 · Two-ring focus</VLSectionLabel>
      <VLFocusDemo />

      <VLSectionLabel>2 · Transportation-tempo easings</VLSectionLabel>
      <VLEasingDemo />

      <VLSectionLabel>3 · Four-tier elevation</VLSectionLabel>
      <VLElevationDemo />

      <VLSectionLabel>4 · Warm-neutral ramp (12 → 18 stops)</VLSectionLabel>
      <VLNeutralRamp />

      <VLSectionLabel>5 · Survey rhythm — density baseline</VLSectionLabel>
      <VLRhythm />

      <VLSectionLabel>6 · Identity primitives</VLSectionLabel>
      <VLIdentityPrimitives />
    </PageShell>
  );
}

Object.assign(window, { VisualLanguagePage });
